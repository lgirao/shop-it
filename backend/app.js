import express from 'express';
const app = express();
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import { connectDatabase } from './config/dbConnect.js';
import errorMiddleware from './middleware/errors.js';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err}`);
    console.log("Shutting down due to uncaught exception.");
    process.exit();
})

dotenv.config({ path: 'backend/config/config.env' });

// Connect database
connectDatabase();

app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    } 
}));
app.use(cookieParser());

// Import all routes
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
import { fileURLToPath } from 'url';

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

if(process.env.NODE_ENV === "PRODUCTION") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"))
    })
}

// Use error middleware
app.use(errorMiddleware);

const port = process.env.PORT;
const env = process.env.NODE_ENV;
const server = app.listen(port, () => {
    console.log(`Server is listening on port: ${port} in ${env} mode`);
});

//Handle unhandled promise rejection
process.on('unhandledRejection', (err) => {
    console.log(`ERROR: ${err}`);
    console.log("Shutting down server due to Unhandled Promise Rejection.");
    server.close(() => {
        process.exit(1);
    });
});