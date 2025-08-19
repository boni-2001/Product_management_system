const Product = require("../model/Product");
const { generateUniqueSlug, slugify } = require("../../utils/slug");
const fs = require("fs");
const { productSchema } = require("../../validations/productValidation");

class AdminController {
  //  product count
  static async dashboard(req, res) {
    try {
      const count = await Product.countDocuments({ isDeleted: false });
      res.render("admin/dashboard", { count });
    } catch (error) {
      console.error("Error loading dashboard:", error);
      res.status(500).send("Server Error");
    }
  }

  //all products
  static async listProducts(req, res) {
    try {
      const products = await Product.find({ isDeleted: false });
      res.render("admin/products", { products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Server Error");
    }
  }

  // add product form
  static addProductForm(req, res) {
    res.render("admin/addProduct", {
      product: {},
      formAction: "/admin/products/add",
      categories: ["Electronics", "Clothes", "Shoes", "Bags"],
      success: req.flash("success"),
      error: req.flash("error"),
    });
  }

  //  adding product
  static async addProduct(req, res) {
    try {
      const { error } = productSchema.validate(req.body);
      if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect("/admin/products/add");
      }

      const { name, category, description } = req.body;
      const baseSlug = slugify(name);
      const slug = await generateUniqueSlug(baseSlug);
      const image = req.file ? `upload/${req.file.filename}` : "";
        await Product.create({ name, slug, category, description, image });
      req.flash("success", "Product added successfully");
      res.redirect("/admin/products");
    } catch (err) {
      console.error(err);
      req.flash("error", "Error adding product");
      res.redirect("/admin/products/add");
    }
  }

  //  edit form
  static async editProductForm(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      res.render("admin/addProduct", {
        product,
        formAction: `/admin/products/edit/${req.params.id}`,
        categories: ["Electronics", "Clothes", "Shoes", "Bags"],
        success: req.flash("success"),
        error: req.flash("error"),
      });
      
    } catch (err) {
      console.error("Error loading edit form:", err);
      res.status(500).send("Server Error");
    }
  }

  // update
  static async updateProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);

      const { error } = productSchema.validate(req.body);
      if (error) {
        req.flash("error", error.details[0].message);
        return res.redirect(`/admin/products/edit/${req.params.id}`);
      }

      if (req.file) {
        if (product.image && fs.existsSync(product.image)) {
          fs.unlinkSync(product.image);
        }
        product.image = `upload/${req.file.filename}`;
      }

      product.name = req.body.name;
      product.slug = slugify(req.body.name, { lower: true });
      product.category = req.body.category;
      product.description = req.body.description;

      await product.save();
      req.flash("success", "Product updated");
      res.redirect("/admin/products");
    } catch (err) {
      console.error("Error updating product:", err);
      res.status(500).send("Server Error");
    }
  }

  // Soft delete product
  static async deleteProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (product.image && fs.existsSync(product.image)) {
        fs.unlinkSync(product.image);
      }
      product.isDeleted = true;
      await product.save();
      req.flash("success", "Product deleted");
      res.redirect("/admin/products");
    } catch (err) {
      console.error("Error deleting product:", err);
      res.status(500).send("Server Error");
    }
  }
}

module.exports = AdminController;
