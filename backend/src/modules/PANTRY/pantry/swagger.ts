export const pantrySwagger = {
  "/pantries": {
    get: {
      summary: "Lista os estoques do usuário",
      security: [{ bearerAuth: [] }],
      tags: ["Pantries"],
      parameters: [
        {
          in: "query",
          name: "offset",
          required: false,
          description: "Quantidade de estoques a serem ignorados",
          schema: {
            type: "integer",
            minimum: 0,
            default: 0,
            example: 0,
          },
        },
        {
          in: "query",
          name: "limit",
          required: false,
          description: "Quantidade máxima de estoques retornados",
          schema: {
            type: "integer",
            minimum: 1,
            default: 5,
            example: 5,
          },
        },
      ],
      responses: {
        200: {
          description: "Lista de estoques do usuário retornada com sucesso",
        },
        401: {
          description: "Usuário não autenticado",
        },
      },
    },
  },

  "/pantry/info/{id}": {
    get: {
      summary: "Pega as informações de um estoque específico",
      security: [{ bearerAuth: [] }],
      tags: ["Pantries"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID do estoque",
          schema: {
            type: "integer",
            example: 1,
          },
        },
      ],
      responses: {
        200: {
          description: "Informações do estoque retornadas com sucesso",
        },
        401: {
          description: "Usuário não autenticado",
        },
        403: {
          description: "Tu está tentando entrar em um estoque alternativo",
        },
        404: {
          description: "Estoque não encontrado",
        },
      },
    },
  },

  "/pantry/post": {
    post: {
      summary: "Cria um novo estoque para o usuário",
      security: [{ bearerAuth: [] }],
      tags: ["Pantries"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name"],
              properties: {
                name: {
                  type: "string",
                  description: "Nome do novo estoque",
                  example: "Meu segundo estoque",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Estoque criado com sucesso",
        },
        400: {
          description: "O nome está vazio ou o estoque já existe",
        },
        401: {
          description: "Usuário não autenticado",
        },
      },
    },
  },

  "/pantry/update/{id}": {
    patch: {
      summary: "Atualiza as informações do estoque",
      security: [{ bearerAuth: [] }],
      tags: ["Pantries"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID do estoque",
          schema: {
            type: "integer",
            example: 1,
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  description: "Novo nome do estoque",
                  example: "Meu estoque novo",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Estoque atualizado com sucesso",
        },
        400: {
          description: "Dados vazios ou o nome já existe nos seus estoques",
        },
        401: {
          description: "Usuário não autenticado",
        },
        403: {
          description: "Você não é o dono do estoque",
        },
        404: {
          description: "Estoque não encontrado",
        },
      },
    },
  },

  "/pantry/delete/{id}": {
    delete: {
      summary: "Desativa o estoque de um usuário",
      security: [{ bearerAuth: [] }],
      tags: ["Pantries"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID do estoque",
          schema: {
            type: "integer",
            example: 1,
          },
        },
      ],
      responses: {
        200: {
          description: "Estoque excluído com sucesso",
        },
        400: {
          description: "Usuário só tem um estoque, sendo impossível de apagar",
        },
        401: {
          description: "Usuário não autenticado",
        },
        403: {
          description: "O usuário não pode desativar estoques alheios",
        },
        404: {
          description: "Estoque não encontrado",
        },
      },
    },
  },
};
