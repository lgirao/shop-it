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

async function getSalesData(startDate, endDate) {
    const salesData = await Order.aggregate([
        {
            // Stage 1: Filter data
            $match: {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        },
        {
            // Stage 2 - Group Data
            $group: {
                _id: {
                    date: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    }
                },
                totalSales: { $sum: "$totalAmount" },
                numOrders: { $sum: 1 } // count the number of orders
            }
        }
    ]);

    // Create a map to store sales data and num of orders by date
    const salesMap = new Map();
    let totalSales = 0;
    let totalNumOrders = 0;

    salesData.forEach((entry) => {
        const date = entry?._id.date;
        const sales = entry?.totalSales;
        const numOrders = entry?.numOrders;

        salesMap.set(date, { sales, numOrders });
        totalSales += sales;
        totalNumOrders += numOrders;
    });

    // Generate an array of dates between start and end date
    const datesBetween = getDatesBetween(startDate, endDate);

    // Create final sales data array with 0 for dates without sales
    const finalSalesData = datesBetween.map((date) => ({
        date,
        sales: (salesMap.get(date) || { sales: 0 }).sales,
        numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
    }));

    return { salesData: finalSalesData, totalSales, totalNumOrders }
}

function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate)

    while(currentDate <= new Date(endDate)) {
        const formattedDate = currentDate.toISOString().split("T")[0];
        dates.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

// Get Sales Data - ADMIN => /api/v1/admin/get_sales
export const getSales = catchAsyncErrors(async (req, res, next) => {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const { salesData, totalSales, totalNumOrders } = await getSalesData(startDate, endDate);

    res.status(200).json({
        totalSales,
        totalNumOrders,
        sales: salesData,
    });
});