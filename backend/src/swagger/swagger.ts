import swaggerJSDoc from "swagger-jsdoc";

import { userSwagger } from "../modules/user/swagger.js";
import { recipeSwagger } from "../modules/RECIPES/recipe/swagger.js";
import { ingredientSwagger } from "../modules/RECIPES/ingredient/swagger.js";
import { recipeIngredientSwagger } from "../modules/RECIPES/recipeIngredient/swagger.js";
import { pantrySwagger } from "../modules/PANTRY/pantry/swagger.js";
import { pantryIngredientSwagger } from "../modules/PANTRY/pantryIngridient/swagger.js";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Ksa na Mão API",
      version: "1.0.0",
      description: "Documentação da API do Ksa na Mão",
    },

    servers: [
      {
        url: "http://localhost:3000",
      },
    ],

    paths: {
      ...userSwagger,
      ...recipeSwagger,
      ...ingredientSwagger,
      ...recipeIngredientSwagger,
      ...pantrySwagger,
      ...pantryIngredientSwagger,
    },
  },

  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
