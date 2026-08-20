const Unauthorized = require("../Errors/Unauthorized.js");
const verifyToken = require("../../modules/user/jwt/verifyToken.js");

function verifyAccount(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new Unauthorized());
  }
  const token = header.split(" ")[1];
  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(new Unauthorized());
  }
}

module.exports = verifyAccount;
