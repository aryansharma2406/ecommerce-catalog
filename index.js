const mongoose = require("mongoose");
require("./db");

const Product = require("./models/product");

async function main() {
  try {

    // Create product
    const product = new Product({
      name: "Premium Headphones",
      category: "Electronics",
      variants: [
        { sku: "HP-BL-001", color: "Black", price: 199.99, stock: 15 },
        { sku: "HP-WH-001", color: "White", price: 209.99, stock: 8 }
      ],
      reviews: [
        {
          userId: new mongoose.Types.ObjectId(),
          rating: 5,
          comment: "Excellent sound quality"
        }
      ],
      avgRating: 5
    });

    await product.save();
    console.log("Product inserted successfully");


    // Aggregation Query 1: Low stock variants
    const lowStock = await Product.aggregate([
      { $unwind: "$variants" },
      { $match: { "variants.stock": { $lt: 10 } } },
      {
        $project: {
          name: 1,
          color: "$variants.color",
          stock: "$variants.stock"
        }
      }
    ]);

    console.log("Low Stock Products:", lowStock);


    // Aggregation Query 2: Avg rating per category
    const ratings = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          avgCategoryRating: { $avg: "$avgRating" }
        }
      }
    ]);

    console.log("Category Ratings:", ratings);


    // ✅ Stock Update Function
    await Product.updateOne(
      { "variants.sku": "HP-WH-001" },
      { $inc: { "variants.$.stock": -1 } }
    );

    console.log("Stock updated (1 item sold)");

  } catch (error) {
    console.log("Error:", error);
  }
}

main();