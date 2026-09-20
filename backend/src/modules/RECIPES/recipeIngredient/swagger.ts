export const recipeIngredientSwagger = {
  "/recipeingredients/{id}": {
    get: {
      summary: "Lista os ingredientes de uma receita",
      security: [{ bearerAuth: [] }],
      tags: ["Recipe ingredients"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID da receita",
          schema: { type: "integer", example: 1 },
        },
      ],
      responses: {
        200: { description: "Ingredientes da receita retornados com sucesso" },
        401: { description: "Usuario nao autenticado" },
      },
    },
  },

  "/recipeingredients/update/{id}": {
    patch: {
      summary: "Atualiza um ingrediente da receita",
      security: [{ bearerAuth: [] }],
      tags: ["Recipe ingredients"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID do ingrediente da receita",
          schema: { type: "integer", example: 1 },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                ingredientId: { type: "integer", example: 2 },
                quantity: { type: "number", minimum: 1, example: 250 },
                unit: { type: "string", example: "g" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Ingrediente da receita atualizado com sucesso" },
        400: { description: "Dados invalidos ou nenhuma alteracao informada" },
        401: { description: "Usuario nao autenticado" },
      },
    },
  },

  "/recipeingredients/delete/ingredient/{id}/recipe/{recipeId}": {
    delete: {
      summary: "Exclui um ingrediente da receita",
      security: [{ bearerAuth: [] }],
      tags: ["Recipe ingredients"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID do registro do ingrediente na receita",
          schema: { type: "integer", example: 1 },
        },
        {
          in: "path",
          name: "recipeId",
          required: true,
          description: "ID da receita",
          schema: { type: "integer", example: 1 },
        },
      ],
      responses: {
        200: { description: "Ingrediente excluido com sucesso" },
        400: { description: "Nao foi possivel excluir o ingrediente" },
        401: { description: "Usuario nao autenticado" },
        403: { description: "Usuario sem permissao para alterar a receita" },
      },
    },
  },
};
