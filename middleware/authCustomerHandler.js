const { verifyToken } = require("../helpers/jwt");
const { Customer, Product } = require("../models/index");

const authenticate = async (req, res, next) => {
  try {
    const access_token = req.headers.access_token;

    if (!access_token) {
      throw new Error("INVALID_TOKEN");
    }

    const payload = verifyToken(access_token);

    // modify for authentication breaktest
    const isValidCustomer = await Customer.findByPk(+payload.id);
    if (!isValidCustomer) {
      throw new Error("INVALID_TOKEN");
    }

    req.privileges = {
      givenId: isValidCustomer.id,
      givenRole: isValidCustomer.role,
      givenEmail: isValidCustomer.email,
    };

    next();
  } catch (err) {
    next(err);
  }
};

const authorization = async (req, res, next) => {
  try {
    const userId = +req.privileges.givenId;
    const role = req.privileges.givenRole;
    const productId = +req.params.id;

    if (!userId || !role || !productId) {
      throw new Error("CANNOT_ACCESS");
    }

    const productDetail = await Product.findByPk(productId);
    if (!productDetail) {
      throw new Error("NOT_FOUND");
    }

    if (productDetail.authorId !== userId && role !== "admin") {
      throw new Error("CANNOT_ACCESS");
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { authenticate, authorization };
