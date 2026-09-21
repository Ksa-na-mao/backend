import bcrypt from "bcrypt";
import goodPassword from "../../modules/user/helper/goodPassword.ts";
import { DataTypes, Model, Sequelize } from "sequelize";
import { DatabaseModels } from "./index.ts";
import BadRequest from "@/core/Errors/BadRequest.ts";

class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare bio: string;
  declare pfp: string;
  declare role: string;
  declare username: string;

  static associate(models: DatabaseModels) {
    User.hasMany(models.Notification, {
      foreignKey: "userId",
      as: "userNotifications",
    });

    User.hasMany(models.Notification, {
      foreignKey: "actorId",
      as: "actorUserId",
    });

    User.hasMany(models.Recipe, {
      foreignKey: "userId",
      as: "userRecepies",
    });

    User.hasMany(models.Ingredient, {
      foreignKey: "userId",
      as: "ingredients",
    });

    User.belongsToMany(models.Pantry, {
      through: models.PantryUser,
      foreignKey: "userId",
      otherKey: "pantryId",
      as: "pantries",
    });
    User.hasOne(models.PreparationHistory, {
      foreignKey: "userId",
      as: "MyHistory",
    });

    User.hasMany(models.Like, {
      foreignKey: "userId",
      as: "liked",
    });

    User.belongsToMany(User, {
      through: "Follows",
      as: "following",
      foreignKey: "followerId",
      otherKey: "followingId",
    });

    User.belongsToMany(User, {
      through: "Follows",
      as: "followers",
      foreignKey: "followingId",
      otherKey: "followerId",
    });
    User.hasMany(models.PantryInvite, {
      foreignKey: "inviterId",
      as: "sent",
    });
    User.hasMany(models.PantryInvite, {
      foreignKey: "invitedId",
      as: "received",
    });
  }
}
export default (sequelize: Sequelize) => {
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [3, 100],
            msg: "O username deve ter entre 3 e 100 caracteres",
          },
          notEmpty: true,
          noSpaces(value: string) {
            if (/\s/.test(value)) {
              throw new Error("O nome de usuário não pode conter espaços");
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        unique: {
          name: "unique",
          msg: "Este email já está sendo usado.",
        },
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            msg: "O email é obrigatório.",
          },
          isEmail: {
            msg: "Informe um email válido.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,

          len: {
            args: [8, 100],
            msg: "A senha deve ter entre 8 e 100 caracteres",
          },
        },
      },
      bio: DataTypes.STRING,
      pfp: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM,
        values: ["user", "admin"],
        defaultValue: "user",
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeSave: async (user) => {
          if (user.changed("password")) {
            goodPassword(user.password);

            if (user.password.length < 8 || user.password.length > 100) {
              throw new BadRequest("A senha deve ter entre 8 e 100 caracteres");
            }

            user.password = await bcrypt.hash(user.password, 12);
          }

          if (user.changed("username")) {
            if (/\s/.test(user.username)) {
              throw new Error("O nome de usuário não pode conter espaços");
            }

            if (user.username.length <= 2) {
              throw new BadRequest(
                "O username precisa ter pelo menos 3 caracteres",
              );
            }
          }

          if (user.changed("name")) {
            if (user.name.length > 50) {
              throw new BadRequest(
                "O nome precisa ter no maximo 50 caracteres",
              );
            }
          }

          if (user.changed("bio")) {
            if (user.bio.length > 500) {
              throw new BadRequest(
                "A bio precisa ter no maximo 500 caracteres",
              );
            }
          }
        },
      },
      paranoid: true,
    },
  );
  return User;
};
