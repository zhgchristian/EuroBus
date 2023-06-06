const express = require("express");
const router = express.Router();
const ProductController = require("../controller/productController");
const { authorization, superAdmin } = require("../middleware/authHandler");

router.get("/", ProductController.getProducts);
router.post("/", ProductController.createProduct);
router.get("/logs", ProductController.getLogs);
router.get("/:id", ProductController.getProductsById);
router.put("/:id", authorization, ProductController.editProductById);
router.patch("/:id", superAdmin, ProductController.editProductStatusById);
router.delete("/:id", authorization, ProductController.deleteProductById);

module.exports = router;
