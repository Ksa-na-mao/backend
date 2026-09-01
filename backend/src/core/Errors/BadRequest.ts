import BaseError from "./BaseError";

class BadRequest extends BaseError {
  constructor(message: string, status?: Number) {
    super(
      message || "O servidor não sabe o que fazer com isso... desculpa! :(",
      400,
    );
  }
}

export default BadRequest;
