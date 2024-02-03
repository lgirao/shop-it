import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../models/user.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import crypto from "crypto";
import user from "../models/user.js";

// Register User => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name, email, password
    });

    sendToken(user, 201, res);
});

// Login User => /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return next(new ErrorHandler("Please enter email and password.", 400));
    }

    // Find user in database
    const user = await User.findOne({ email }).select("+password");

    if(!user) {
        return next(new ErrorHandler("Email not found.", 401));
    }

    // Validate password
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid password.", 401));
    }

    sendToken(user, 200, res);
});

// Logout User => /api/v1/logout
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        message: "Logged out"
    });
});

// Forgot Password => /api/v1/password/forgot
export const userForgotPassword = catchAsyncErrors(async (req, res, next) => {
    // Find user in database
    const user = await User.findOne({ email: req.body.email });

    if(!user) {
        return next(new ErrorHandler("User not found with this email.", 404));
    }

    // Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save();

    // Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/api/v1/password/reset/${resetToken}`;

    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
        await sendEmail({
            email: user.email,
            subject: "ShopIt Password Recovery",
            message
        });

        res.status(200).json({
            message: `Email sent to: ${user.email}`
        })
    } catch {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save();
        return next(new ErrorHandler(error?.message, 500));
    }
});

// Reset Password => /api/v1/password/reset/:token
export const userPasswordReset = catchAsyncErrors(async (req, res, next) => {
    // Hash the URL token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user) {
        return next(new ErrorHandler("Password reset token is invalid or has expired.", 400));
    }

    if(req.body.password != req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match.", 400))
    }

    // Set the new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// Get current user profile => /api/v1/profile
export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id);

    res.status(200).json({
        user
    });
});

// Update password => /api/v1/password/update
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req?.user?._id).select("+password");

    // Check previous password
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    user.password = req.body.password;

    user.save();

    res.status(200).json({
        success: true
    });
});