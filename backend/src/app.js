const express = require("express");
const mainRoutes = require("./core/routes/mainRoutes.js");

const app = express();

mainRoutes(app);

module.exports = app;
