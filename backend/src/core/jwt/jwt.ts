import jwt from "jsonwebtoken";
import { AuthUser } from "../types/user/authUser.ts";

function jwtSign(user: { id: number; role: string; email: string }) {
  const userObj: AuthUser = {
    userId: user.id,
    role: user.role,
    userEmail: user.email,
  };

  return jwt.sign(userObj, process.env.privateKeyJson as string, {
    expiresIn: "1w",
  });
}

export default jwtSign;
