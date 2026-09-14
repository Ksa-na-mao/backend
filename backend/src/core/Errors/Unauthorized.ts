import BaseError from "./BaseError";

class Unauthorized extends BaseError {
  constructor(message?: string) {
    super(message || "Você não está autenticado. Faça-o, por favor.", 401);
  }
}
export default Unauthorized;
