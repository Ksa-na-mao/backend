export const userSwagger = {
  "/users": {
    get: {
      summary: "Lista os usuários com paginação",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      parameters: [
        {
          in: "query",
          name: "offset",
          required: false,
          description: "Número da página",
          schema: {
            type: "integer",
            minimum: 0,
            default: 0,
            example: 1,
          },
        },
        {
          in: "query",
          name: "limit",
          required: false,
          description: "Quantidade de usuários por página",
          schema: {
            type: "integer",
            minimum: 1,
            default: 10,
            example: 10,
          },
        },
        {
          in: "query",
          name: "name",
          required: false,
          description: "Parte do nome do usuário que vai ser buscado",
          schema: {
            type: "string",
            example: "joao",
          },
        },
        {
          in: "query",
          name: "username",
          required: false,
          description: "Parte do username do usuário que vai ser buscado",
          schema: {
            type: "string",
            example: "joaolegal",
          },
        },
      ],
      responses: {
        200: {
          description: "Lista de usuários retornada com sucesso",
        },
        401: {
          description: "Usuário não autenticado",
        },
      },
    },
  },

  "/register": {
    post: {
      summary: "Cria uma nova conta de usuário",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "email", "password"],
              properties: {
                username: {
                  type: "string",
                  example: "nome_legal",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "usuario@email.com",
                },
                password: {
                  type: "string",
                  example: "12345678!",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Conta criada com sucesso",
        },
        400: {
          description: "Dados inválidos ou conta já existe",
        },
      },
    },
  },

  "/login": {
    post: {
      summary: "Faz o login do usuário usando email e senha",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "usuario@email.com",
                },
                password: {
                  type: "string",
                  example: "12345678!",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Usuário logado com sucesso",
        },
        404: {
          description: "Email não encontrado",
        },
        401: {
          description: "Senha incorreta",
        },
      },
    },
  },

  "/user/{id}": {
    get: {
      summary: "Busca um usuário pelo ID",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID do usuário",
          schema: {
            type: "integer",
          },
        },
      ],
      responses: {
        200: {
          description: "Usuário encontrado",
        },
        404: {
          description: "Usuário não encontrado",
        },
      },
    },
  },

  "/user/deactivate": {
    delete: {
      summary: "Desativa a conta de um usuário",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      responses: {
        200: {
          description: "Conta desativada com sucesso",
        },
        403: {
          description: "O usuário não pode desativar contas alheias",
        },
        404: {
          description: "Usuário não encontrado",
        },
      },
    },
  },

  "/user/deactivate/{id}": {
    delete: {
      summary: "Desativa a conta de um usuário como administrador",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID do usuário",
          schema: {
            type: "integer",
          },
        },
      ],
      responses: {
        200: {
          description: "Conta desativada com sucesso",
        },
        403: {
          description: "Usuário não possui permissão de administrador",
        },
        404: {
          description: "Usuário não encontrado",
        },
      },
    },
  },

  "/user/update": {
    put: {
      summary: "Atualiza as informações do perfil do usuário",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  description: "Email atual usado para confirmar a alteração",
                  example: "usuario@email.com",
                },
                username: {
                  type: "string",
                  example: "nome_novo",
                },
                name: {
                  type: "string",
                  example: "Joao Silva",
                },
                bio: {
                  type: "string",
                  example: "Gosto de jogar e cozinhar",
                },
                pfp: {
                  type: "string",
                  example: "foto.png",
                },
                password: {
                  type: "string",
                  example: "12345678!",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Usuário atualizou a conta com sucesso",
        },
        400: {
          description: "Dados inválidos",
        },
        401: {
          description: "Email de confirmação incorreto",
        },
        404: {
          description: "Usuário não encontrado",
        },
      },
    },
  },
  "/users/send-email": {
    put: {
      summary: "Envia o e-mail para confirmação da alteração de e-mail",
      description:
        "Gera um token temporário e envia um e-mail com um link de confirmação para o usuário.",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      responses: {
        200: {
          description: "E-mail de confirmação enviado com sucesso",
        },
        401: {
          description: "Usuário não autenticado",
        },
        404: {
          description: "Usuário não encontrado",
        },
      },
    },
  },

  "/users/update/email/confirm": {
    put: {
      summary: "Confirma a alteração de e-mail",
      description:
        "Valida o token enviado por e-mail e realiza a alteração do e-mail do usuário.",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      parameters: [
        {
          in: "query",
          name: "token",
          required: true,
          description: "Token de confirmação enviado no e-mail",
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "E-mail atualizado com sucesso",
        },
        400: {
          description: "Token inválido, expirado ou já utilizado",
        },
        401: {
          description: "Usuário não autenticado",
        },
        404: {
          description: "Usuário não encontrado",
        },
      },
    },
  },

  "/users/update/password": {
    put: {
      summary: "Altera a senha do usuário",
      description: "Altera a senha da conta do usuário autenticado.",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["currentPassword", "newPassword"],
              properties: {
                currentPassword: {
                  type: "string",
                  format: "password",
                  description: "Senha atual do usuário",
                  example: "SenhaAtual123!",
                },
                newPassword: {
                  type: "string",
                  format: "password",
                  description: "Nova senha do usuário",
                  example: "NovaSenha123!",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Senha atualizada com sucesso",
        },
        400: {
          description: "Dados inválidos ou senha atual incorreta",
        },
        401: {
          description: "Usuário não autenticado",
        },
        404: {
          description: "Usuário não encontrado",
        },
      },
    },
  },
};
