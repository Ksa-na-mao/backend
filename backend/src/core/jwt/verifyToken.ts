import jwt from "jsonwebtoken";
import { AuthUser } from "../types/user/authUser.ts";

function verifyToken(token: string): AuthUser {
  return jwt.verify(token, process.env.privateKeyJson as string) as AuthUser;
}

export default verifyToken;
