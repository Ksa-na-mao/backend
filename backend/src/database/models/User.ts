import bcrypt from "bcrypt";
import goodPassword from "../../modules/user/helper/goodPassword.ts";
import { DataTypes, Model, Sequelize } from "sequelize";

class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare bio: string;
  declare pfp: string;
  declare role: string;

  static associate(models: any) {
    User.hasMany(models.Notification, {
      foreignKey: "userId",
      as: "userNotifications",
    });

    User.hasMany(models.Notification, {
      foreignKey: "actorUserId",
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
      through: "PantryUser",
      foreignKey: "userId",
      otherKey: "pantryId",
      as: "pantries",
    });

    User.hasOne(models.ShoppingList, {
      foreignKey: "userId",
      as: "MyList",
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
  }
}
export default (sequelize: Sequelize) => {
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 100],
            msg: "O nome deve ter entre 3 e 100 caracteres",
          },
          notEmpty: true,
        },
      },
      email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          isEmail: true,
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
          goodPassword: (password: string) => goodPassword(password),
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
        beforeCreate: async (user) => {
          user.password = await bcrypt.hash(user.password, 12);
        },
      },
      paranoid: true,
    },
  );
  return User;
};
