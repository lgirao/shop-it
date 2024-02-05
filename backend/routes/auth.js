import express from "express";
import { 
    loginUser,
    registerUser,
    logoutUser,
    userPasswordReset,
    userForgotPassword,
    getUserProfile,
    updatePassword,
    updateUserProfile,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} from "../controllers/authControllers.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);

router.route("/password/forgot").post(userForgotPassword);
router.route("/password/reset/:token").put(userPasswordReset);

router.route("/profile").get(isAuthenticatedUser, getUserProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/profile/update").put(isAuthenticatedUser, updateUserProfile);

router.route("/admin/users").get(
    isAuthenticatedUser,
    authorizeRoles("admin"), 
    getAllUsers
);
router.route("/admin/users/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUser)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)
;


export default router;