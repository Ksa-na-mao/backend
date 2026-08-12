const Unauthorized = require("../../../core/Errors/Unauthorized.js");
const verifyToken = require("../jwt/verifyToken.js");

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
    console.log(error);
    next(new Unauthorized());
  }
}

module.exports = verifyAccount;
