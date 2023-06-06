const express = require("express");
const router = express.Router();
const productRouter = require("./productRouter");
const categoryRouter = require("./categoryRouter");
const customerRouter = require("./customerRouter");
const AuthController = require("../controller/authController");
const { authenticate } = require("../middleware/authHandler");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/google", AuthController.gLogin);

router.use("/pub", customerRouter);
router.use("/categories", categoryRouter);

router.use(authenticate);

router.use("/products", productRouter);

module.exports = router;
