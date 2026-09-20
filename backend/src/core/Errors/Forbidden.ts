import BaseError from "./BaseError.ts";

class Forbidden extends BaseError {
  constructor(message?: string) {
    super(message || "Proibido, parça.", 403);
  }
}
export default Forbidden;
