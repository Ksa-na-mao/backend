const Forbidden = require("../../../core/Errors/Forbidden.js");
const verifyToken = require("../jwt/verifyToken.js");

function verifyAdmin(req, res, next) {
  if (req.user.role == "admin") next();
  else next(new Forbidden());
}

module.exports = verifyAdmin;
