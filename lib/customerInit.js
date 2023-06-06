const { errorHandler } = require("../middleware/errorHandler");
const { Customer } = require("../models/index");

const createCustomers = async () => {
  try {
    await Customer.create({
      email: "customer@test10.com",
      password: "12345",
      role: "customer",
    });
  } catch (err) {
    errorHandler(err);
  }
};

const deleteCustomers = async () => {
  try {
    await Customer.destroy({
      restartIdentity: true,
      truncate: true,
      cascade: true,
    });
  } catch (err) {
    errorHandler(err);
  }
};

module.exports = { createCustomers, deleteCustomers };
