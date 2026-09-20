export const pantryIngredientSwagger = {
  "/pantryIngredient/post/pantryId/{pantryId}": {
    post: {
      summary: "Adiciona ingredientes a um estoque",
      security: [{ bearerAuth: [] }],
      tags: ["Pantry ingredients"],
      parameters: [
        {
          in: "path",
          name: "pantryId",
          required: true,
          description: "ID do estoque",
          schema: { type: "integer", example: 1 },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                required: ["ingredientId", "currentQuantity"],
                properties: {
                  ingredientId: { type: "integer", example: 1 },
                  currentQuantity: { type: "number", minimum: 0, example: 2 },
                  minimumQuantity: { type: "number", minimum: 0, example: 1 },
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Ingredientes adicionados ao estoque com sucesso" },
        400: { description: "Nenhum ingrediente foi informado" },
        401: { description: "Usuario nao autenticado" },
        403: { description: "Usuario sem permissao para alterar o estoque" },
      },
    },
  },

  "/pantryIngredient/delete/{pantryId}/{ingredientId}": {
    delete: {
      summary: "Exclui um ingrediente do estoque",
      security: [{ bearerAuth: [] }],
      tags: ["Pantry ingredients"],
      parameters: [
        {
          in: "path",
          name: "pantryId",
          required: true,
          description: "ID do estoque",
          schema: { type: "integer", example: 1 },
        },
        {
          in: "path",
          name: "ingredientId",
          required: true,
          description: "ID do ingrediente",
          schema: { type: "integer", example: 1 },
        },
      ],
      responses: {
        200: { description: "Ingrediente excluido do estoque com sucesso" },
        401: { description: "Usuario nao autenticado" },
        403: { description: "Usuario sem permissao para alterar o estoque" },
        404: { description: "Ingrediente nao encontrado no estoque" },
      },
    },
  },
};
