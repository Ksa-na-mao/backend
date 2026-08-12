("use strict");
const bcrypt = require("bcrypt");
const goodPassword = require("../../modules/user/helper/goodPassword.js");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 100],
            msg: "O nome deve ter entre 3 e 100 caracteres",
          },
          notEmpty: true,
        },
      },
      email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,

          len: {
            args: [8, 100],
            msg: "A senha deve ter entre 8 e 100 caracteres",
          },
          goodPassword: (password) => goodPassword(password),
        },
      },
      bio: DataTypes.STRING,
      pfp: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM,
        values: ["user", "admin"],
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: async (user) => {
          user.password = await bcrypt.hash(user.password, 12);
        },
      },
      paranoid: true,
    },
  );
  return User;
};
