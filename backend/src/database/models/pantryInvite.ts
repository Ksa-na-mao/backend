import { DataTypes, Model, Sequelize } from "sequelize";
import { DatabaseModels } from ".";
import { userInfos } from "@Types/user/user.ts";

class PantryInvite extends Model {
  declare id: number;
  declare userId: number;
  declare pantryId: number;
  declare user?: userInfos;
  static associate(models: DatabaseModels) {
    PantryInvite.belongsTo(models.User, {
      foreignKey: "inviterId",
      onDelete: "CASCADE",
      hooks: true,
    });

    PantryInvite.belongsTo(models.User, {
      foreignKey: "invitedId",
      onDelete: "CASCADE",
      hooks: true,
    });

    PantryInvite.belongsTo(models.Pantry, {
      foreignKey: "pantryId",
      as: "pantry",
      onDelete: "CASCADE",
      hooks: true,
    });
  }
}
export default (sequelize: Sequelize) => {
  PantryInvite.init(
    {
      inviterId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        allowNull: false,
      },
      invitedId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        allowNull: false,
      },
      pantryId: {
        type: DataTypes.INTEGER,
        references: { model: "Pantries", key: "id" },
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "rejected", "approved"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "PantryInvite",
      paranoid: true,
    },
  );
  return PantryInvite;
};
