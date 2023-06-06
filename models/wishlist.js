"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wishlist.belongsTo(models.Customer, { foreignKey: "CustomerId" });
      Wishlist.belongsTo(models.Product, { foreignKey: "ProductId" });
    }
  }
  Wishlist.init(
    {
      CustomerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "CustomerId cannot be empty",
          },
          notEmpty: {
            msg: "CustomerId cannot be empty",
          },
        },
      },
      ProductId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "ProductId cannot be empty",
          },
          notEmpty: {
            msg: "ProductId cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Wishlist",
    }
  );
  return Wishlist;
};
