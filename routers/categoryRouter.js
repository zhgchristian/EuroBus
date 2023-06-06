const express = require("express");
const router = express.Router();
const CategoryController = require("../controller/categoryController");

router.get("/", CategoryController.getCategories);
router.get("/:id", CategoryController.getCategoryById);

// router.post("/", CategoryController.createCategory);
// router.put("/:id", CategoryController.editCategoryById);
// router.delete("/:id", CategoryController.deleteCategoryById);

module.exports = router;
