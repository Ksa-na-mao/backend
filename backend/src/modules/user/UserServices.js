const Services = require("../../core/Services/Services");
const dataSource = require("../../database/models");
const auth = require("../../core/jwt/jwt.js");
const bcrypt = require("bcrypt");

const userModel = dataSource["User"];

class UserServices extends Services {
  constructor() {
    super("User");
  }

  //get

  async getAllUsers(offset) {
    const users = await userModel.findAll({
      attributes: {
        exclude: ["password", "updatedAt"],
      },
      offset: offset,
      limit: offset + 10,
    });
    return users;
  }

  async getUserById(id) {
    const users = await userModel.findByPk(id, {
      attributes: {
        exclude: ["password", "updatedAt"],
      },
    });
    return users;
  }

  //post

  async signUp(userData) {
    console.log(userData);
    const user = await userModel.findOrCreate({
      where: { email: userData.email, name: userData.name },
      defaults: userData,
    });
    const token = auth(user[0]);
    return token;
  }

  async login(userData) {
    const user = await userModel.findOne({ where: { email: userData.email } });
    if (!user) {
      throw new Error("Usuário não encontrado!");
    }
    console.log(userData.password);
    console.log(user.password);
    const match = await bcrypt.compare(userData.password, user.password);
    if (!match) {
      throw new Error("Senha incorreta!");
    }
    const token = auth(user);
    return token;
  }
}

module.exports = UserServices;
