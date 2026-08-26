const Controller = require("../../../core/Controller/Controller.js");
const BaseError = require("../../../core/Errors/BaseError.js");
const PantryServices = require("./PantryServices.js");
const pantryServices = new PantryServices();

class PantryController extends Controller {
  constructor() {
    super(pantryServices);
  }

  //Get
  async getMyPantries(req, res, next) {
    try {
      const userId = req.user.userId;
      const response = await pantryServices.getMyPantries(userId);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getOnePantry(req, res, next) {
    try {
      const { id } = req.query;
      const userId = req.user.userId;
      if (id && userId) {
        const response = await pantryServices.getPantryInfos(id, userId);
        return res.status(200).json(response);
      }
      throw new BaseError("Precisamos do id do estoque...");
    } catch (error) {
      next(error);
    }
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
