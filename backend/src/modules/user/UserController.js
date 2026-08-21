const Controller = require("../../core/Controller/Controller");
const UserServices = require("./UserServices");

const userServices = new UserServices();

class UserController extends Controller {
  constructor() {
    super(userServices);
  }

  async getAllUsers(req, res, next) {
    try {
      const offset = parseInt(req.query.offset) || 0;
      const users = await userServices.getAllUsers(offset);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async getOneUser(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const users = await userServices.getUserById(id);
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  //Post

  async signUp(req, res, next) {
    try {
      const user = req.body;
      const token = await userServices.signUp(user);
      res.status(201).json(token);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const userData = req.body;
      const token = await userServices.login(userData);
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  }

  //Put
  async updateAccount(req, res, next) {
    try {
      const data = req.body;
      const userEmail = req.user.userEmail;
      await userServices.update(data, userEmail);
      res.status(201).json("Conta atualizada com sucesso!");
    } catch (error) {
      next(error);
    }
  }

  //Delete
  async deactivateAccount(req, res, next) {
    try {
      const email = req.body;
      await userServices.deactivateAccount(email);
      res.status(201).json("Conta desativada!");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
