import BaseError from "./BaseError";

class Error404 extends BaseError {
  constructor(message: string) {
    super(message || "Recurso não encontrado.", 404);
  }
}
export default Error404;
