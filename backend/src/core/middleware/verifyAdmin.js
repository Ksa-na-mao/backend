const Forbidden = require("../Errors/Forbidden.js");

function verifyAdmin(req, res, next) {
  if (req.user.role === "admin") next();
  else next(new Forbidden());
}

module.exports = verifyAdmin;
