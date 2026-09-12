import { BrevoClient } from "@getbrevo/brevo";

const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY as string,
});

async function updateEmail(userEmail: string, userName: string, token: string) {
  const confirmUrl = `http://localhost:3000/users/update/email/confirm?token=${token}`;

  await client.transactionalEmails.sendTransacEmail({
    sender: {
      email: "ksanamaoapp@gmail.com",
      name: "Ksa na mão",
    },

    to: [
      {
        email: userEmail,
        name: userName,
      },
    ],

    subject: "Confirmação de troca de e-mail",

    htmlContent: `
      <html>
        <body>
          <h2>Olá, ${userName}!</h2>

          <p>
            Recebemos uma solicitação para trocar o e-mail da sua conta.
          </p>

          <p>
            Se foi você quem solicitou essa alteração, clique no botão abaixo
            para continuar:
          </p>

          <a
            href="${confirmUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background-color: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Confirmar troca de e-mail
          </a>

          <p>
            Se você não solicitou essa alteração, ignore este e-mail.
          </p>

          <p>
            Atenciosamente,<br />
            Equipe Ksa na mão
          </p>
        </body>
      </html>
    `,
  });
}

export default updateEmail;
