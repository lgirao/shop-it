import express from "express";
import { 
    getProductById, 
    getProducts, 
    newProduct,
    updateProductById ,
    deleteProductById
} from "../controllers/productControllers.js";
const router = express.Router();

router.route("/products").get(getProducts);
router.route("/admin/products").post(newProduct);
router.route("/products/:id").get(getProductById);
router.route("/products/:id").put(updateProductById);
router.route("/products/:id").delete(deleteProductById);

export default router;