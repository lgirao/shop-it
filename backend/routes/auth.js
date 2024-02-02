import express from "express";
import { 
    loginUser,
    registerUser,
    logoutUser,
    userPasswordReset,
    userForgotPassword
} from "../controllers/authControllers.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(userForgotPassword);
router.route("/password/reset/:token").put(userPasswordReset);

export default router;