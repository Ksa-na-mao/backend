export const recipeSwagger = {
  "/recipes": {
    get: {
      summary: "Lista todas as receitas publicas",
      security: [{ bearerAuth: [] }],
      tags: ["Recipes"],
      responses: {
        200: { description: "Receitas publicas retornadas com sucesso" },
        401: { description: "Usuario nao autenticado" },
      },
    },
  },

  "/recipes/mine": {
    get: {
      summary: "Lista todas as receitas do usuario autenticado",
      security: [{ bearerAuth: [] }],
      tags: ["Recipes"],
      responses: {
        200: { description: "Receitas do usuario retornadas com sucesso" },
        401: { description: "Usuario nao autenticado" },
      },
    },
  },

  "/recipes/mine/public": {
    get: {
      summary: "Lista as receitas publicas do usuario autenticado",
      security: [{ bearerAuth: [] }],
      tags: ["Recipes"],
      responses: {
        200: { description: "Receitas publicas retornadas com sucesso" },
        401: { description: "Usuario nao autenticado" },
      },
    },
  },

  "/recipes/mine/private": {
    get: {
      summary: "Lista as receitas privadas do usuario autenticado",
      security: [{ bearerAuth: [] }],
      tags: ["Recipes"],
      responses: {
        200: { description: "Receitas privadas retornadas com sucesso" },
        401: { description: "Usuario nao autenticado" },
      },
    },
  },

  "/recipe/post": {
    post: {
      summary: "Cria uma receita",
      security: [{ bearerAuth: [] }],
      tags: ["Recipes"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "description", "RecipeIngredients"],
              properties: {
                title: { type: "string", example: "Arroz com legumes" },
                description: {
                  type: "string",
                  example: "Arroz preparado com legumes frescos",
                },
                isPublic: { type: "boolean", default: true, example: true },
                category: { type: "string", example: "Almoco" },
                RecipeIngredients: {
                  type: "array",
                  items: {
                    type: "object",
                    required: ["ingredientId", "quantity", "unit"],
                    properties: {
                      ingredientId: { type: "integer", example: 1 },
                      quantity: { type: "number", minimum: 1, example: 500 },
                      unit: { type: "string", example: "g" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Receita criada com sucesso" },
        400: { description: "Dados invalidos ou receita ja existente" },
        401: { description: "Usuario nao autenticado" },
      },
    },
  },

  "/recipe/make/recipeId/{recipeId}/pantry/{pantryId}": {
    post: {
      summary: "Prepara uma receita usando os ingredientes do estoque",
      security: [{ bearerAuth: [] }],
      tags: ["Recipes"],
      parameters: [
        {
          in: "path",
          name: "recipeId",
          required: true,
          description: "ID da receita",
          schema: { type: "integer", example: 1 },
        },
        {
          in: "path",
          name: "pantryId",
          required: true,
          description: "ID do estoque",
          schema: { type: "integer", example: 1 },
        },
      ],
      responses: {
        200: { description: "Receita preparada com sucesso" },
        400: {
          description: "Receita inexistente ou ingredientes insuficientes",
        },
        401: { description: "Usuario nao autenticado" },
      },
    },
  },

  "/recipe/update/{recipeId}": {
    put: {
      summary: "Atualiza uma receita",
      description:
        "O proprietario da receita e obtido pelo token de autenticacao.",
      security: [{ bearerAuth: [] }],
      tags: ["Recipes"],
      parameters: [
        {
          in: "path",
          name: "recipeId",
          required: true,
          description: "ID da receita",
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
                originRecipeId: { type: "integer", example: 2 },
                title: {
                  type: "string",
                  example: "Arroz com legumes especial",
                },
                description: {
                  type: "string",
                  example: "Descricao atualizada",
                },
                isPublic: { type: "boolean", example: false },
                category: { type: "string", example: "Jantar" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Receita atualizada com sucesso" },
        401: { description: "Usuario nao autenticado" },
        403: { description: "Usuario sem permissao para atualizar a receita" },
      },
    },
  },

  "/recipe/delete/{recipeId}": {
    delete: {
      summary: "Exclui uma receita",
      security: [{ bearerAuth: [] }],
      tags: ["Recipes"],
      parameters: [
        {
          in: "path",
          name: "recipeId",
          required: true,
          description: "ID da receita",
          schema: { type: "integer", example: 1 },
        },
      ],
      responses: {
        200: { description: "Receita excluida com sucesso" },
        401: { description: "Usuario nao autenticado" },
        403: { description: "Usuario sem permissao para excluir a receita" },
      },
    },
  },
};
