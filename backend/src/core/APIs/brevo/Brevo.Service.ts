import EmailChangeTokenService from "@/modules/user/Email/EmailChangeToken.service.ts";
const emailChangeTokenService = new EmailChangeTokenService();
import updateEmail from "./brevo.config.ts";

class BrevoService {
  async changeEmail(userEmail: string, userName: string, userId: number) {
    const token = await emailChangeTokenService.uniqueToken(userId, userEmail);
    try {
      await updateEmail(userEmail, userName, token);
    } catch (error) {
      throw error;
    }
  }
}

export default BrevoService;
