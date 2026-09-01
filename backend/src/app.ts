import express from "express";
import mainRoutes from "./core/routes/Routes.js";
import ErrorHandler from "./core/Errors/1ErrorHandler.js";
import Error404Middleware from "./core/Errors/Error404Middleware.js";

const app = express();

mainRoutes(app);
app.use(Error404Middleware);
app.use(ErrorHandler);

module.exports = app;
