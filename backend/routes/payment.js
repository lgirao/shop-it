import express from "express";
const router = express.Router();
import { isAuthenticatedUser } from "../middleware/auth.js";
import { stripeCheckoutSession } from "../controllers/paymentControllers.js";

router.route("/payment/checkout_session").post(isAuthenticatedUser, stripeCheckoutSession);


export default router;