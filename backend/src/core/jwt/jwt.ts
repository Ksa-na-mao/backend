const jwt = require("jsonwebtoken");

function jwtSign(user) {
  const userId = user.id;
  const userRole = user.role;
  const userEmail = user.email;
  const userObj = { userId, userRole, userEmail };
  return jwt.sign(userObj, process.env.privateKeyJson, { expiresIn: "1w" });
}

export default jwtSign;
