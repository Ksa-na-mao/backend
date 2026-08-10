const express = require("express");
const users = require("../../modules/user/userRoutes");

module.exports = (app) => {
  app.use(express.json());
  app.use(users);
};
