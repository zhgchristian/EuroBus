const express = require("express");
const router = express.Router();
const CustomerAuth = require("../controller/customerAuth");
const CustomerController = require("../controller/customerProducts");
const { authenticate } = require("../middleware/authCustomerHandler");

router.post("/register", CustomerAuth.openAccount);
router.post("/login", CustomerAuth.customerLogin);
router.post("/google", CustomerAuth.gLogin);

router.get("/products", CustomerController.displayProducts);
router.get("/products/:id", CustomerController.displayProductsById);

router.use(authenticate);

router.get("/wishlist", CustomerController.showWishlist);
router.post("/wishlist/:id", CustomerController.addWishlist);

module.exports = router;
