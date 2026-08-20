const Controller = require("../../../core/Controller/Controller.js");
const IngridientServices = require("./IngridientServices.js");
const ingridientServices = new IngridientServices();

class IngridientController extends Controller {
  constructor() {
    super(ingridientServices);
  }
}

module.exports = IngridientController;
