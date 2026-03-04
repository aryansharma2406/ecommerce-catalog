const express = require("express");
const mongoose = require("mongoose");
require("./db");

const Product = require("./models/product");

const app = express();
const PORT = process.env.PORT || 3000;

async function runDatabaseLogic() {
try {

```
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

const lowStock = await Product.aggregate([
  { $unwind: "$variants" },
  { $match: { "variants.stock": { $lt: 10 } } }
]);

console.log("Low Stock:", lowStock);
```

} catch (err) {
console.log(err);
}
}

runDatabaseLogic();

app.get("/", (req, res) => {
res.send("Ecommerce Catalog API is running 🚀");
});

app.listen(PORT, () => {
console.log("Server running on port", PORT);
});
