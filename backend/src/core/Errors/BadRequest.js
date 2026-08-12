const BaseError = require("./baseError");

class BadRequest extends BaseError {
  constructor(message, status) {
    super(
      message || "O servidor não sabe o que fazer com isso... desculpa! :(",
      400,
    );
  }
}
module.exports = BadRequest;
