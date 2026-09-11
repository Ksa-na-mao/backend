import BaseError from "./BaseError";

class Conflict extends BaseError {
  constructor(message: string) {
    super(
      message ||
        "Algum elemento seu já tem esse nome ou causou algum outro conflito. :(",
      409,
    );
  }
}

export default Conflict;
