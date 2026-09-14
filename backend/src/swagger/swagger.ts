import swaggerJSDoc from "swagger-jsdoc";

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
  },

  apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
