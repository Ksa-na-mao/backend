'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      Recipe.belongsTo(models.User, {foreignKey: "userId", as:"userRecipe"})
      Recipe.hasMany(models.Notifications, {foreignKey: "recipeId", as: "recipe"})
    }
  }
  Recipe.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Recipe',
  });
  return Recipe;
};