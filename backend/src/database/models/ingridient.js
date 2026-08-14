"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ingridient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ingridient.belongsTo(models.User, {
        foreignKey: "userId",
        as: "userIngridient",
      });
      Ingridient.hasMany(models.Ingridient, {
        foreignKey: "ingridientId",
        as: "ingridient",
      });
    }
  }
  Ingridient.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "User", key: "id" },
        allowNull: false,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      currentQuantity: { type: DataTypes.FLOAT, defaultValue: 0 },
      minimumQuantity: { type: DataTypes.FLOAT, defaultValue: 0 },
      expirationDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Ingridient",
    },
  );
  return Ingridient;
};
