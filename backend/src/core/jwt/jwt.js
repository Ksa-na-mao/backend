const jwt = require("jsonwebtoken");

module.exports = (user) =>
  jwt.sign(user.toJSON(), process.env.privateKeyJson, { expiresIn: "1h" });
