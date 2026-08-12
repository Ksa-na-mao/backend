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

  //post

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
      console.log(error);
      next(error);
    }
  }

  //put
  async updateAccount(req, res, next) {
    try {
      const data = req.body;
      const userEmail = req.user.userEmail;
      const response = await userServices.updateAccount(data, userEmail);
      res.status(201).json("Conta atualizada com sucesso!");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //delete
  async deactivateAccount(req, res, next) {
    try {
      const email = req.body;
      const response = await userServices.deactivateAccount(email);
      res.status(201).json("Conta desativada!");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
