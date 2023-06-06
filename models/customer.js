"use strict";
const { Model } = require("sequelize");

const { hashPassword } = require("../helpers/bcrypt");
const { hash } = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.belongsToMany(models.Product, {
        through: models.Wishlist,
        foreignKey: "CustomerId",
        otherKey: "ProductId",
      });
      Customer.hasMany(models.Wishlist, { foreignKey: "CustomerId" });
    }
  }
  Customer.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            msg: "Email format is wrong",
          },
          notNull: {
            msg: "Email cannot be empty",
          },
          notEmpty: {
            msg: "Email cannot be empty",
          },
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password cannot be empty",
          },
          notNull: {
            msg: "Password cannot be empty",
          },
        },
      },

      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Role cannot be empty",
          },
          notNull: {
            msg: "Role cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Customer",
      hooks: {
        beforeCreate: (customer) => {
          customer.password = hashPassword(customer.password);
        },
      },
    }
  );
  return Customer;
};
