import { generateToken } from "../helper/createToken";
import dataSource from "@/database/models/index.ts";
const UserChangeToken = dataSource.UserChangeToken;

class EmailChangeTokenService {
  async uniqueToken(userId: number, newEmail: string) {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    let token;
    do {
      token = generateToken();
    } while (
      await UserChangeToken.findOne({
        where: { token },
      })
    );

    const wholeToken = await UserChangeToken.create({
      userId,
      token,
      newEmail,
      expiresAt,
      used: false,
    });
    token = wholeToken.token;

    return token;
  }
}

export default EmailChangeTokenService;
