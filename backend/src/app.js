const express = require("express");
const mainRoutes = require("./core/routes/mainRoutes.js");
const ErrorHandler = require("./core/Errors/1ErrorHandler.js");
const Error404Middleware = require("./core/Errors/Error404Middleware.js");

const app = express();

mainRoutes(app);
app.use(Error404Middleware);
app.use(ErrorHandler);

module.exports = app;
