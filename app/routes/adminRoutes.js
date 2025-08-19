const express = require("express");
const router = express.Router();
const AdminController = require("../controller/adminController");
const upload = require("../helper/productImageupload");

router.get("/", AdminController.dashboard);
router.get("/products", AdminController.listProducts);
router.get("/products/add", AdminController.addProductForm);
router.post(
  "/products/add",
  upload.single("image"),
  AdminController.addProduct
);
router.get("/products/edit/:id", AdminController.editProductForm);
router.post(
  "/products/edit/:id",
  upload.single("image"),
  AdminController.updateProduct
);
router.post("/products/delete/:id", AdminController.deleteProduct);

module.exports = router;
