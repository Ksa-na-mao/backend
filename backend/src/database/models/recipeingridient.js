'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RecipeIngridient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RecipeIngridient.init({
    quantity: DataTypes.FLOAT,
    unit: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'RecipeIngridient',
  });
  return RecipeIngridient;
};