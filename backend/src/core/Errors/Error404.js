const BaseError = require("./baseError");

class Forbidden extends BaseError {
  constructor(message, status) {
    super(message || "Recurso não encontrado.", 404);
  }
}
module.exports = Forbidden;
