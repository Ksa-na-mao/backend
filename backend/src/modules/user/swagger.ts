export const userSwagger = {
  "/users": {
    get: {
      summary: "Busca usuários por username com paginação",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      parameters: [
        {
          in: "query",
          name: "username",
          required: true,
          description: "Parte ou nome completo do username que será buscado",
          schema: {
            type: "string",
            example: "joaolegal",
          },
        },
        {
          in: "query",
          name: "offset",
          required: false,
          description: "Quantidade de usuários a serem ignorados",
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
          description: "Quantidade máxima de usuários retornados",
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 29,
            default: 10,
            example: 10,
          },
        },
      ],
      responses: {
        200: {
          description: "Usuários encontrados com sucesso",
        },
        400: {
          description: "Username não informado",
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
                  format: "password",
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
      summary: "Faz login do usuário",
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
                  format: "password",
                  example: "12345678!",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login realizado com sucesso",
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
            example: 1,
          },
        },
      ],
      responses: {
        200: {
          description: "Usuário encontrado",
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

  "/users/send-email": {
    get: {
      summary: "Envia e-mail para confirmação de alteração de e-mail",
      description:
        "Gera um token temporário e envia um e-mail de confirmação para o usuário autenticado.",
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

  "/forgot/send-email": {
    get: {
      summary: "Envia e-mail para recuperação de senha",
      description:
        "Gera um token temporário e envia um e-mail para recuperação da senha do usuário autenticado.",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      responses: {
        200: {
          description: "E-mail de recuperação enviado com sucesso",
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

  "/users/password/reset": {
    put: {
      summary: "Redefine a senha usando o token de recuperação",
      description:
        "Atualiza a senha do usuário utilizando o token enviado por e-mail.",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      parameters: [
        {
          in: "query",
          name: "token",
          required: true,
          description: "Token de recuperação enviado por e-mail",
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["password"],
              properties: {
                password: {
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
        201: {
          description: "Senha redefinida com sucesso",
        },
        400: {
          description: "Token inválido, expirado ou dados inválidos",
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
          description: "Token de confirmação enviado por e-mail",
          schema: {
            type: "string",
          },
        },
      ],
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
                  description: "Novo e-mail do usuário",
                  example: "novoe-mail@email.com",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "E-mail atualizado com sucesso",
        },
        400: {
          description: "Token inválido, expirado ou dados inválidos",
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
      description:
        "Altera a senha do usuário autenticado informando a senha atual e a nova senha.",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["password", "newPassword"],
              properties: {
                password: {
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
        201: {
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

  "/user/update": {
    put: {
      summary: "Atualiza as informações da conta do usuário",
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
                  description:
                    "E-mail atual utilizado para confirmar a alteração da conta",
                  example: "usuario@email.com",
                },
                username: {
                  type: "string",
                  example: "novo_username",
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
                  format: "password",
                  example: "NovaSenha123!",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Conta atualizada com sucesso",
        },
        400: {
          description: "Dados inválidos",
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

  "/user/deactivate": {
    delete: {
      summary: "Desativa a própria conta",
      description:
        "Desativa a conta do usuário autenticado após confirmação por e-mail.",
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
                  description:
                    "E-mail utilizado para confirmar a desativação da conta",
                  example: "usuario@email.com",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Conta desativada com sucesso",
        },
        401: {
          description: "Usuário não autenticado",
        },
        403: {
          description: "Usuário não pode desativar a conta informada",
        },
        404: {
          description: "Usuário não encontrado",
        },
      },
    },
  },

  "/user/deactivate/{id}": {
    delete: {
      summary: "Desativa uma conta como administrador",
      description:
        "Permite que um administrador desative a conta de outro usuário.",
      security: [{ bearerAuth: [] }],
      tags: ["Users"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          description: "ID do usuário que será desativado",
          schema: {
            type: "integer",
            example: 1,
          },
        },
      ],
      responses: {
        201: {
          description: "Conta desativada com sucesso",
        },
        401: {
          description: "Usuário não autenticado",
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
};
