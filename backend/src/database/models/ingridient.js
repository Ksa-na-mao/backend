'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingridient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ingridient.init({
    name: DataTypes.STRING,
    currentQuantity: DataTypes.FLOAT,
    minimumQuantity: DataTypes.FLOAT,
    expirationDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Ingridient',
  });
  return Ingridient;
};