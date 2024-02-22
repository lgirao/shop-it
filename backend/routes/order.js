import express from "express";
const router = express.Router();
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
import { deleteOrder, getAllOrders, getOrderDetails, getSales, getUserOrder, newOrder, updateOrder } from "../controllers/orderControllers.js";


router.route("/orders/new").post(isAuthenticatedUser, newOrder);
router.route("/orders/:id").get(isAuthenticatedUser, getOrderDetails);
router.route("/user/order").get(isAuthenticatedUser, getUserOrder);

router.route("/admin/orders").get(
    isAuthenticatedUser, 
    authorizeRoles("admin"),
    getAllOrders
);
router.route("/admin/orders/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder)
;
router.route("/admin/get_sales").get(
    isAuthenticatedUser, 
    authorizeRoles("admin"),
    getSales
);

export default router;