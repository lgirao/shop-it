import express from "express";
import { 
    loginUser,
    registerUser,
    logoutUser,
    userPasswordReset,
    userForgotPassword,
    getUserProfile,
    updatePassword
} from "../controllers/authControllers.js";
import { isAuthenticatedUser } from "../middleware/auth.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

router.route("/password/forgot").post(userForgotPassword);
router.route("/password/reset/:token").put(userPasswordReset);

router.route("/profile").get(isAuthenticatedUser, getUserProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);


export default router;