import express from "express";
import { 
    getProductById, 
    getProducts, 
    newProduct,
    updateProductById,
    deleteProductById,
    createProductReview,
    getProductReview,
    deleteProductReview
} from "../controllers/productControllers.js";
import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth.js";
const router = express.Router();

// Public routes
router.route("/products").get(getProducts);
router.route("/products/:id").get(getProductById);

// Admin routes
router.route("/admin/products").post(
    isAuthenticatedUser, 
    authorizeRoles("admin"), 
    newProduct
);
router.route("/admin/products/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateProductById)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProductById)
;
router.route("/admin/reviews")
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProductReview)
;

// Product reviews
router.route("/reviews")
    .put(isAuthenticatedUser, createProductReview)
    .get(isAuthenticatedUser, getProductReview)

export default router;