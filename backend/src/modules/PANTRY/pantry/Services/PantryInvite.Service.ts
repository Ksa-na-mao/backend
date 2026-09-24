import Services from "@/core/Services/Services";

import BadRequest from "@Errors/BadRequest.ts";
import Forbidden from "@Errors/Forbidden.ts";
import BaseError from "@/core/Errors/BaseError";

import dataSource from "@models/index.ts";
const sequelize = dataSource.sequelize;

const Pantry = dataSource["Pantry"];
const PantryUsers = dataSource["PantryUser"];
const User = dataSource["User"];
const PantryInvite = dataSource["PantryInvite"];
const Notification = dataSource["Notification"];

class PantryInviteServices extends Services {
  constructor() {
    super("PantryInvite");
  }

  async inviteSomeone(inviterId: number, invitedId: number, pantryId: number) {
    if (inviterId === invitedId)
      throw new BadRequest("Você não pode se convidar.");

    const isInviterAllowed = await Pantry.findOne({
      where: { userId: inviterId },
    });

    if (isInviterAllowed?.dataValues.userId !== inviterId) {
      throw new Forbidden("Você não é o dono desse estoque");
    }

    const userExists = await User.findOne({
      where: { id: invitedId },
    });

    if (!userExists) throw new BadRequest("Esse usuário não existe");

    const pantryUser = await PantryUsers.findOne({
      where: {
        userId: invitedId,
        pantryId: pantryId,
      },

      include: [
        {
          model: User,
          foreignKey: "userId",
        },
      ],
    });

    if (pantryUser) {
      throw new BadRequest(
        `O usuário ${pantryUser!.user!.username} já está no estoque!`,
      );
    } else {
      const isAlreadyInvited = await PantryInvite.findOne({
        where: {
          inviterId: inviterId,
          invitedId: invitedId,
          pantryId: pantryId,
          status: "pending",
        },

        include: [
          {
            model: User,
            foreignKey: "userId",
          },
        ],
      });

      if (isAlreadyInvited) {
        throw new BadRequest(
          `O usuário ${isAlreadyInvited!.user!.username} já está convidado para o estoque!`,
        );
      } else {
        const okTransaction = await sequelize.transaction(async (t) => {
          await PantryInvite.create(
            {
              inviterId: inviterId,
              invitedId: invitedId,
              pantryId: pantryId,
            },

            { transaction: t },
          );

          const inviter = await User.findOne({
            where: { id: inviterId },
          });

          const createNotification = await Notification.create(
            {
              actorId: inviterId,
              userId: invitedId,
              type: "invite",
              message: `o usuario ${inviter!.username} Te chamou para seu estoque... Vamos dar uma olhada?`,
            },

            { transaction: t },
          );

          return createNotification;
        });

        if (okTransaction)
          return {
            message: "O seu convite foi enviado!",
          };
        else throw new BaseError("Tivemos um erro interno!");
      }
    }
  }
}

export default PantryInviteServices;
