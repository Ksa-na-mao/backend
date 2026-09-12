import { DataTypes, Model, Sequelize } from "sequelize";
import { DatabaseModels } from "./index.ts";

class UserChangeToken extends Model {
  declare id: number;
  declare userId: number;
  declare token: string;
  declare newEmail: string;
  declare used: boolean;
  declare expiresAt: Date;

  static associate(models: DatabaseModels) {
    UserChangeToken.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  }
}
export default (sequelize: Sequelize) => {
  UserChangeToken.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "Users", key: "id" },
        allowNull: false,
        validate: {
          notNull: {
            msg: "O usuário precisa pedir pra trocar o email...",
          },
        },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "O usuário precisa ter um token.",
          },
        },
      },
      newEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "O usuário precisa ter um email.",
          },
        },
      },
      used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserChangeToken",
      paranoid: true,
    },
  );
  return UserChangeToken;
};
