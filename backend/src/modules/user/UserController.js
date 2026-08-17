const Controller = require("../../core/Controller/Controller");
const UserServices = require("./UserServices");

const userServices = new UserServices();

class UserController extends Controller {
  constructor() {
    super(userServices);
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
