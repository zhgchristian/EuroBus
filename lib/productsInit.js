const { Product, Category, User } = require("../models/index");
const userData = require("../data/users.json");
const categoryData = require("../data/categories.json");
const productsData = require("../data/dummyProducts.json");
const { errorHandler } = require("../middleware/errorHandler");

const createProducts = async () => {
  try {
    await Category.bulkCreate(categoryData);
    await User.bulkCreate(userData);
    await Product.bulkCreate(productsData);
  } catch (err) {
    errorHandler(err);
  }
};

const deleteProducts = async () => {
  try {
    await Product.destroy({
      restartIdentity: true,
      truncate: true,
      cascade: true,
    });
    await Category.destroy({
      restartIdentity: true,
      truncate: true,
      cascade: true,
    });
    await User.destroy({
      restartIdentity: true,
      truncate: true,
      cascade: true,
    });
  } catch (err) {
    errorHandler(err);
  }
};

module.exports = { createProducts, deleteProducts };
