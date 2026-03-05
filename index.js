const express = require("express");
const mongoose = require("mongoose");
require("./db");

const Product = require("./models/product");

const app = express();
const PORT = process.env.PORT || 3000;

// insert sample product
async function runDatabaseLogic() {
  try {
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

  } catch (err) {
    console.log(err);
  }
}

runDatabaseLogic();


// Homepage
app.get("/", async (req, res) => {
  const products = await Product.find();

  let html = "<h1>Ecommerce Catalog</h1>";

  products.forEach(p => {
    html += `
      <div style="border:1px solid #ccc;padding:10px;margin:10px">
        <h2>${p.name}</h2>
        <p>Category: ${p.category}</p>
        <p>Avg Rating: ${p.avgRating}</p>
      </div>
    `;
  });

  res.send(html);
});


// API route
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});


app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
