import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
    let error = {
        statusCode: err?.statusCode || 500,
        message: err?.message || "Internal server error"
    };

    // Handle invalid Mongoose ID Error
    if(err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err?.path}`
        error = new ErrorHandler(message, 404);
    }

    // Handle Validation Error
    if(err.name === "ValidationError") {
        const message = Object.values(err.errors).map((value) => value.message);
        error = new ErrorHandler(message, 400);
    }

    // Handle duplicate email error
    if(err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered.`
        error = new ErrorHandler(message, 400);
    }

    // Handle wrong JWT error
    if(err.code === "JsonWebTokenError") {
        const message = `JSON web token is invalid. Please try again.`;
        error = new ErrorHandler(message, 400);
    }

    // Handle expired JWT error
    if(err.code === "TokenExpiredError") {
        const message = `JSON web token has expired. Please try again.`;
        error = new ErrorHandler(message, 400);
    }

    if(process.env.NODE_ENV === "DEVELOPMENT") {
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err?.stack
        });
    }

    if(process.env.NODE_ENV === "PRODUCTION") {
        res.status(error.statusCode).json({
            message: error.message
        });
    }
}