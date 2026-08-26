import jwt from "./jsonwebtoken";

function verifyToken(token) {
  return jwt.verify(token, process.env.privateKeyJson);
}

export default verifyToken;
