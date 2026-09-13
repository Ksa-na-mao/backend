import jwt from "jsonwebtoken";
import { AuthUser } from "../types/user/authUser.ts";

function jwtSign(user: { id: number; role: string }) {
  const userObj: AuthUser = {
    userId: user.id,
    role: user.role,
  };

  return jwt.sign(userObj, process.env.privateKeyJson as string, {
    expiresIn: "1w",
  });
}

export default jwtSign;
