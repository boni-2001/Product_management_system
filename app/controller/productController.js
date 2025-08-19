const mongoose = require("mongoose");
const Product = require("../model/Product");

class ProductController {
  // Homepage 
  static async index(req, res) {
    try {
      const q = req.query.q;
      const category = req.query.category;
      let filter = { isDeleted: false };

      // Search filter
      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
        ];
      }

      // Category filter
      if (category && category !== "all") {
        filter.category = category;
      }

      // Fetch all products based on filter
      const products = await Product.find(filter);

      // Fetch unique categories for dropdown
      const categories = await Product.distinct("category", { isDeleted: false });

      res.render("customer/index", { 
        products, 
        searchQuery: q || "", 
        selectedCategory: category || "all", 
        categories 
      });

    } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).send("Internal Server Error");
    }
  }

  // Product details 
  static async productDetails(req, res) {
    try {
      const slugOrId = req.params.slug;
      let product;

      if (mongoose.Types.ObjectId.isValid(slugOrId)) {
        product = await Product.findOne({
          $or: [
            { slug: slugOrId },
            { _id: slugOrId }
          ],
          isDeleted: false,
        });
      } else {
        product = await Product.findOne({
          slug: slugOrId,
          isDeleted: false,
        });
      }

      if (!product) {
        return res.status(404).send("Product not found");
      }

      res.render("customer/productDetails", { product });

    } catch (err) {
      console.error("Error fetching product detail:", err);
      res.status(500).send("Internal Server Error");
    }
  }
}

module.exports = ProductController;
