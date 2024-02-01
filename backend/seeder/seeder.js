import mongoose from "mongoose";
import products from "./data.js";
import Product from "../models/product.js";

const seedProducts = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/shop-it");

        await Product.deleteMany();
        console.log("Products are deleted.")

        await Product.insertMany(products);
        console.log("Products are added.");

        process.exit();

    } catch (err) {
        console.log(err.message);
        process.exit();
    }
};

seedProducts();