export const ingredientSwagger = {
  "/ingredients": {
    get: {
      summary: "Lista ingredientes",
      security: [{ bearerAuth: [] }],
      tags: ["Ingredients"],
      parameters: [
        {
          in: "query",
          name: "offset",
          required: false,
          description: "Quantidade de ingredientes a ignorar",
          schema: { type: "integer", minimum: 0, default: 0, example: 0 },
        },
        {
          in: "query",
          name: "limit",
          required: false,
          description: "Quantidade maxima de ingredientes retornados",
          schema: { type: "integer", minimum: 1, default: 5, example: 5 },
        },
        {
          in: "query",
          name: "name",
          required: false,
          description: "Nome ou filtro do ingrediente",
          schema: { type: "string", example: "Tomate" },
        },
      ],
      responses: {
        200: { description: "Ingredientes retornados com sucesso" },
        401: { description: "Usuario nao autenticado" },
      },
    },
  },

  "/ingredients/post": {
    post: {
      summary: "Cria um ingrediente",
      security: [{ bearerAuth: [] }],
      tags: ["Ingredients"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "Tomate" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Ingrediente criado com sucesso" },
        400: { description: "Nome ausente ou ingrediente ja existente" },
        401: { description: "Usuario nao autenticado" },
      },
    },
  },

  "/ingredients/update/{id}": {
    patch: {
      summary: "Atualiza um ingrediente",
      security: [{ bearerAuth: [] }],
      tags: ["Ingredients"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID do ingrediente",
          schema: { type: "integer", example: 1 },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: { type: "string", example: "Tomate cereja" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Ingrediente atualizado com sucesso" },
        400: { description: "Nome vazio ou sem alteracoes" },
        401: { description: "Usuario nao autenticado" },
        404: { description: "Ingrediente nao encontrado ou sem permissao" },
      },
    },
  },

  "/ingredients/delete/{id}": {
    delete: {
      summary: "Exclui um ingrediente",
      security: [{ bearerAuth: [] }],
      tags: ["Ingredients"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID do ingrediente",
          schema: { type: "integer", example: 1 },
        },
      ],
      responses: {
        201: { description: "Ingrediente excluido com sucesso" },
        401: { description: "Usuario nao autenticado" },
        403: {
          description: "Usuario sem permissao para excluir o ingrediente",
        },
        404: { description: "Ingrediente nao encontrado" },
      },
    },
  },
};
