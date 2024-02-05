import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";

// Create new order => /api/v1/orders/new
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        user: req.user._id
    });

    res.status(200).json({
        order
    });
});

// Get order details => /api/v1/orders/:id 
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order) {
        return next(new ErrorHandler(`No order found with this id: ${req.params.id}`), 404);
    }

    res.status(200).json({
        order
    });
});

// Get current user order => /api/v1/user/order
export const getUserOrder = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    if(!orders) {
        return next(new ErrorHandler("User does not have any orders."), 404);
    }

    res.status(200).json({
        orders
    });
});

// Get all orders - ADMIN => /api/v1/admin/orders
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    res.status(200).json({
        orders
    });
});

// Update order - ADMIN => /api/v1/admin/orders/:id
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order) {
        return next(new ErrorHandler(`No order found with this id: ${req.params.id}`), 404);
    }

    if(order?.orderStatus === "Delivered") {
        next(new ErrorHandler("This order has been delivered", 404))
    }

    // Update product quantity/stock
    order?.orderItems?.forEach(async (item) => {
        const product = await Product.findById(item?.product?.toString());
        if(!product) {
            next(new ErrorHandler("No product found with this ID", 404))
        }
        product.stock = product.stock - item.quantity;
        await product.save({ validateBeforeSave: false });
    })

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success: true
    });
});

// Delete order - ADMIN => /api/v1/admin/orders/:id
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order) {
        return next(new ErrorHandler(`No order found with this id: ${req.params.id}`), 404);
    }

    await order.deleteOne();

    res.status(200).json({
        success: true
    });
});