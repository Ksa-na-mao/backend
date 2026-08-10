const Controller = require("../../core/Controller/Controller");
const UserServices = require("./UserServices");

const userServices = new UserServices();

class UserController extends Controller {
  constructor() {
    super(userServices);
  }
}

module.exports = UserController;
