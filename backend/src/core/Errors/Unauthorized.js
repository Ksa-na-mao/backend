const BaseError = require("./baseError");

class Unauthorized extends BaseError {
  constructor(message, status) {
    super(message || "Você não está autenticado. Faça-o, por favor.", 401);
  }
}
module.exports = Unauthorized;
