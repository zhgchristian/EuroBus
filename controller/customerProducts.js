const {
  Product,
  Category,
  User,
  History,
  Wishlist,
  Customer,
} = require("../models/index");

const axios = require("axios");

class CustomerController {
  static async displayProducts(req, res, next) {
    try {
      const { showCount, sort } = req.body;
      const { page, filter } = req.query;

      let pagination = showCount;

      if (!pagination) {
        pagination = 12;
      }

      let sortBy = sort;

      if (!sortBy) {
        sortBy = ["id", "ASC"];
      }

      let options = {};
      let optionsCount = {};

      // if filter is not a number or undefined

      if (filter && !isNaN(filter)) {
        options.categoryId = +filter;
        optionsCount.id = +filter;
      }

      // check if such category ID exist
      const validCategory = await Category.findOne({
        where: optionsCount,
      });

      if (!validCategory) {
        options = {};
      }

      // check if page number could be out of range
      const productsCount = await Product.count({
        include: [Category],
        where: options,
      });

      let newPage = 1;
      if (page > productsCount / pagination || page < 1) {
        newPage = 1;
      } else {
        newPage = page;
      }

      const products = await Product.findAndCountAll({
        include: [Category],
        where: options,
        order: [sortBy],
        offset: (+newPage - 1) * pagination || 0,
        limit: pagination,
      });

      res.status(200).json({
        statusCode: 200,
        currentPage: newPage,
        totalPages: Math.ceil(products.count / pagination),
        data: products.rows,
      });
    } catch (err) {
      next(err);
    }
  }

  static async displayProductsById(req, res, next) {
    try {
      const { id } = req.params;

      const products = await Product.findOne({
        include: [Category],
        where: { id: id },
      });

      if (!products) {
        throw new Error("NOT_FOUND");
      }

      const QRbody = {
        frame_name: "no-frame",
        qr_code_text: `${process.env.WEBSITE_URL}/product?id=${id}`,
        image_format: "SVG",
        qr_code_logo: "scan-me-square",
      };

      const QR = await axios.post(
        `https://api.qr-code-generator.com/v1/create?access-token=${process.env.API_QR}`,
        {
          frame_name: "no-frame",
          qr_code_text: `${process.env.WEBSITE_URL}/product?id=${id}`,
          image_format: "SVG",
          qr_code_logo: "scan-me-square",
        }
      );

      res.status(200).json({
        statusCode: 200,
        data: products,
        QRcode: QR.data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async addWishlist(req, res, next) {
    try {
      const { givenId } = req.privileges;
      const { id } = req.params;

      const isWishlistExist = await Wishlist.findOne({
        where: {
          CustomerId: givenId,
          ProductId: id,
        },
      });

      if (!isWishlistExist) {
        const newWishlist = await Wishlist.create({
          ProductId: id,
          CustomerId: givenId,
        });

        if (!newWishlist) {
          throw new Error("NOT_FOUND");
        }

        res.status(201).json({
          statusCode: 201,
          message: "Wishlist created",
          data: {
            customerId: newWishlist.CustomerId,
            productId: newWishlist.ProductId,
          },
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async showWishlist(req, res, next) {
    try {
      const { givenId } = req.privileges;

      const userWishlist = await Wishlist.findAll({
        include: { model: Product },
        where: {
          CustomerId: givenId,
        },
      });

      res.status(200).json({
        statusCode: 200,
        data: userWishlist,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CustomerController;
