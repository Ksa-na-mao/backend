const Controller = require("../../core/Controller/Controller");
const UserServices = require("./UserServices");

const userServices = new UserServices();

class UserController extends Controller {
  constructor() {
    super(userServices);
  }

  async getAllUsers(req, res) {
    try {
      const offset = parseInt(req.query.offset) || 0;
      const users = await userServices.getAllUsers(offset);
      res.status(200).json(users);
    } catch (error) {
      console.log(error + AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA);
    }
  }

  async getOneUser(req, res) {
    try {
      const id = parseInt(req.params.id);
      const users = await userServices.getUserById(id);
      res.status(200).json(users);
    } catch (error) {
      console.log(error + AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA);
    }
  }

  //post

  async signUp(req, res) {
    try {
      const user = req.body;
      const token = await userServices.signUp(user);
      res.status(201).json(token);
    } catch (error) {
      console.log(error);
    }
  }

  async login(req, res) {
    try {
      const userData = req.body;
      const token = await userServices.login(userData);
      res.status(200).json(token);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = UserController;
