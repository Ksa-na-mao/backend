import express from "express";
import mainRoutes from "./core/routes/Routes.js";
import ErrorHandler from "./core/Errors/1ErrorHandler.js";
import Error404Middleware from "./core/Errors/Error404Middleware.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger.js";

const app = express();
mainRoutes(app);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(Error404Middleware);
app.use(ErrorHandler);

export default app;
