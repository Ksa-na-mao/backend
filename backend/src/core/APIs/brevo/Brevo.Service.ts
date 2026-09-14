/* eslint-disable indent */
import EmailChangeTokenService from "@/modules/user/Email/EmailChangeToken.service.ts";
const emailChangeTokenService = new EmailChangeTokenService();
import { updateEmail, forgotPassword } from "./brevo.config.ts";

class BrevoService {
  async sendEmail(
    userEmail: string,
    userName: string,
    userId: number,
    type: number,
  ) {
    const token = await emailChangeTokenService.uniqueToken(userId, userEmail);
    try {
      switch (type) {
        case 1:
          await updateEmail(userEmail, userName, token);
          break;
        case 2:
          await forgotPassword(userEmail, userName, token);
          break;
      }
    } catch (error) {
      throw error;
    }
  }
}

export default BrevoService;
