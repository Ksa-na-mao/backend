const Controller = require("../../../core/Controller/Controller.js");
const PantryServices = require("./PantrytServices.js");
const pantryServices = new PantryServices();

class PantryController extends Controller {
  constructor() {
    super(pantryServices);
  }

  //Delete
  async delete(req, res, next) {
    try {
      const { pantryId, creatorId } = req.query;
      const userId = req.user.userId;
      await pantryServices.delete(pantryId, creatorId, userId);
      res.status(200).json("Estoque apagado com sucesso!");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PantryController;
