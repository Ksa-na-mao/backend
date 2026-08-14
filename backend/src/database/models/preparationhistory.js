'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PreparationHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PreparationHistory.init({
    date: DataTypes.DATE,
    servings: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PreparationHistory',
  });
  return PreparationHistory;
};