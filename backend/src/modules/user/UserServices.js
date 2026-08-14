const Services = require("../../core/Services/Services");
const dataSource = require("../../database/models");
const auth = require("./jwt/jwt.js");
const bcrypt = require("bcrypt");

const BadRequest = require("../../core/Errors/BadRequest.js");
const Forbidden = require("../../core/Errors/Forbidden.js");
const Error404 = require("../../core/Errors/Error404.js");

const userModel = dataSource["User"];

class UserServices extends Services {
  constructor() {
    super("User");
  }
  //Get

  async getAll(offset) {
    const users = await userModel.findAll({
      attributes: {
        exclude: ["password", "updatedAt"],
      },
      offset: offset,
      limit: offset + 10,
    });
    return users;
  }

  async getById(id) {
    const users = await userModel.findByPk(id, {
      attributes: {
        exclude: ["password", "updatedAt"],
      },
    });
    return users;
  }

  //Post

  async signUp(userData) {
    const [user, created] = await userModel.findOrCreate({
      where: { email: userData.email },
      defaults: userData,
    });
    if (created) {
      const token = auth(user);
      return token;
    } else {
      throw new BadRequest("Esse usuário já existe!");
    }
  }

  async login(userData) {
    const user = await userModel.findOne({ where: { email: userData.email } });
    if (!user) throw new Error404("Usuário não encontrado!");
    const match = await bcrypt.compare(userData.password, user.password);
    if (!match) throw new BadRequest("Senha incorreta!");

    const token = auth(user);
    return token;
  }

  //Update
  async updateAccount(data, userEmail) {
    const response = await userModel.update(data, {
      where: { email: userEmail },
    });
    return response;
  }

  //Delete
  async deactivateAccount(email, userEmail) {
    if (userEmail === email) {
      const response = await userModel.destroy({
        where: { email: userEmail },
      });
      return response;
    } else {
      throw new Forbidden("Você só pode desativar a sua conta!");
    }
  }
}

module.exports = UserServices;
