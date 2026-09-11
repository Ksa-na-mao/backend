import BaseError from "./BaseError";

class Forbidden extends BaseError {
  constructor(message: string) {
    super(message || "Recurso não encontrado.", 404);
  }
}
export default Forbidden;
