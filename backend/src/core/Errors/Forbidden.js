const BaseError = require("./baseError");

//check
class Forbidden extends BaseError {
  constructor(message, status) {
    super(message || "Proibido, parça.", 403);
  }
}
module.exports = Forbidden;
