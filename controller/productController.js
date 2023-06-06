const { Product, Category, User, History } = require("../models/index");

class ProductController {
  static async getProducts(req, res, next) {
    try {
      const products = await Product.findAll({
        include: {
          model: User,
          attributes: ["email"],
        },
        order: ["id"],
      });

      res.status(200).json({
        statusCode: 200,
        data: products,
      });

      next();
    } catch (err) {
      next(err);
    }
  }

  static async getProductsById(req, res, next) {
    try {
      const { id } = req.params;

      const products = await Product.findOne({
        where: {
          id: +id,
        },
      });

      if (!products) {
        throw new Error("NOT_FOUND");
      }
      res.status(200).json({
        statusCode: 200,
        data: products,
      });
      next();
    } catch (err) {
      next(err);
    }
  }

  static async createProduct(req, res, next) {
    try {
      const { name, description, price, stock, imgUrl, categoryId, authorId } =
        req.body;

      const newProduct = await Product.create({
        name: name,
        description: description,
        price: price,
        stock: stock,
        imgUrl: imgUrl,
        categoryId: categoryId,
        authorId: authorId,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const authorEmail = await User.findOne({
        where: {
          id: newProduct.authorId,
        },
      });

      const logAddProduct = await History.create({
        name: newProduct.name,
        description: `New product with id ${newProduct.id} created`,
        createdAt: newProduct.createdAt,
        updatedBy: authorEmail.email,
      });

      res.status(201).json({
        statusCode: 201,
        message: "New Product added succesfully",
        data: newProduct,
      });

      next();
    } catch (err) {
      next(err);
    }
  }

  static async editProductById(req, res, next) {
    try {
      const { id } = req.params;

      const { name, description, price, stock, imgUrl, categoryId, authorId } =
        req.body;

      const updatedProduct = await Product.update(
        {
          name: name,
          description: description,
          price: price,
          stock: stock,
          imgUrl: imgUrl,
          categoryId: categoryId,
          authorId: authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          where: {
            id: id,
          },
        }
      );

      if (!updatedProduct[0]) {
        throw new Error("NOT_FOUND");
      }

      const updatedProductInfo = await Product.findOne({
        include: {
          model: User,
          attributes: ["email"],
        },
        where: {
          id: id,
        },
      });

      const logEditProduct = await History.create({
        name: updatedProductInfo.name,
        description: `Product with id ${id} updated`,
        createdAt: updatedProduct.createdAt,
        updatedBy: updatedProductInfo.User.email,
      });

      res.status(201).json({
        statusCode: 201,
        message: `${updatedProductInfo.name} product information updated succesfully`,
        data: {
          name: name,
          description: description,
          price: price,
          stock: stock,
          imgUrl: imgUrl,
          categoryId: categoryId,
          authorId: authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      next();
    } catch (err) {
      next(err);
    }
  }

  static async editProductStatusById(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedProduct = await Product.findOne({
        include: {
          model: User,
          attributes: ["email"],
        },
        where: {
          id: id,
        },
      });

      const updatedStatus = await Product.update(
        {
          status: status,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          where: {
            id: id,
          },
        }
      );

      if (!updatedStatus[0]) {
        throw new Error("NOT_FOUND");
      }

      const logEditProduct = await History.create({
        name: updatedProduct.name,
        description: `Product status with id ${id} has been updated from ${updatedProduct.status} to ${status} `,
        createdAt: updatedProduct.createdAt,
        updatedBy: updatedProduct.User.email,
      });

      res.status(201).json({
        statusCode: 201,
        message: `${updatedProduct.name} product status updated succesfully`,
      });
      next();
    } catch (err) {
      next(err);
    }
  }

  static async deleteProductById(req, res, next) {
    try {
      const { id } = req.params;

      const findDeletedItem = await Product.findOne({
        where: {
          id: +id,
        },
      });

      const productDeletedCount = await Product.destroy({
        where: {
          id: +id,
        },
      });

      if (productDeletedCount <= 0) {
        throw new Error("PRODUCT_NOT_FOUND");
      }
      res.status(200).json({
        statusCode: 200,
        message: `${findDeletedItem.name} success to delete`,
      });

      next();
    } catch (err) {
      next(err);
    }
  }

  static async getLogs(req, res, next) {
    try {
      const logs = await History.findAll({
        order: [["id", "DESC"]],
      });

      res.status(200).json({
        statusCode: 200,
        data: logs,
      });

      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;
