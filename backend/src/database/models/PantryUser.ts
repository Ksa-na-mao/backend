import { DataTypes, Model, Sequelize } from "sequelize";
import { DatabaseModels } from ".";
import { userInfos } from "@Types/user/user.ts";

class PantryUser extends Model {
  declare id: number;
  declare userId: number;
  declare pantryId: number;
  declare User?: userInfos;
  static associate(models: DatabaseModels) {
    PantryUser.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
      hooks: true,
    });

    PantryUser.belongsTo(models.Pantry, {
      foreignKey: "pantryId",
      onDelete: "CASCADE",
      hooks: true,
    });
  }
}
export default (sequelize: Sequelize) => {
  PantryUser.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        allowNull: false,
      },
      pantryId: {
        type: DataTypes.INTEGER,
        references: { model: "Pantries", key: "id" },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PantryUser",
      paranoid: true,
    },
  );
  return PantryUser;
};
