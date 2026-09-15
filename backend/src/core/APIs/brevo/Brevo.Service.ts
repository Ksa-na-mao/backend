/* eslint-disable indent */
import EmailChangeTokenService from "@/modules/user/Email/EmailChangeToken.service.ts";
const emailChangeTokenService = new EmailChangeTokenService();
import {
  updateEmail,
  forgotPassword,
  inviteForPantry,
} from "./brevo.config.ts";

class BrevoService {
  async sendEmail(
    userEmail: string,
    userName: string,
    userId: number,
    type: string,
    inviterName?: string,
  ) {
    switch (type) {
      case "updateEmail": {
        const token = await emailChangeTokenService.uniqueToken(
          userId,
          userEmail,
        );

        await updateEmail(userEmail, userName, token);
        break;
      }

      case "forgotPassword": {
        const token = await emailChangeTokenService.uniqueToken(
          userId,
          userEmail,
        );

        await forgotPassword(userEmail, userName, token);
        break;
      }

      case "pantryInvite":
        await inviteForPantry(userEmail, userName, inviterName!);
        break;
    }
  }
}

export default BrevoService;
