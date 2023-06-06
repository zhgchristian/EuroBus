const { Product, Category, User, History } = require("../models/index");

class CategoryController {
  static async getCategories(req, res, next) {
    try {
      const categories = await Category.findAll();

      res.status(200).json({
        statusCode: 200,
        data: categories,
      });

      next();
    } catch (err) {
      next(err);
    }
  }

  static async createCategory(req, res, next) {
    try {
      const { name } = req.body;

      const newCategory = await Category.create({
        name: name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.status(201).json({
        statusCode: 201,
        message: "New Category added succesfully",
        data: newCategory,
      });

      next();
    } catch (err) {
      next(err);
    }
  }

  static async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;

      const categories = await Category.findOne({
        where: {
          id: +id,
        },
      });

      if (!categories) {
        throw new Error("NOT_FOUND");
      }
      res.status(200).json({
        statusCode: 200,
        data: categories,
      });
      next();
    } catch (err) {
      next(err);
    }
  }

  static async editCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updatedCategory = await Category.update(
        {
          name: name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          where: {
            id: id,
          },
        }
      );

      if (!updatedCategory[0]) {
        throw new Error("NOT_FOUND");
      }

      res.status(201).json({
        statusCode: 201,
        message: `Category id ${id} updated succesfully`,
      });

      next();
    } catch (err) {
      next(err);
    }
  }

  static async deleteCategoryById(req, res, next) {
    try {
      const { id } = req.params;

      const findDeletedItem = await Category.findOne({
        where: {
          id: +id,
        },
      });

      const categoryDeletedCount = await Category.destroy({
        where: {
          id: +id,
        },
      });

      if (categoryDeletedCount <= 0) {
        throw new Error("NOT_FOUND");
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
}

module.exports = CategoryController;
