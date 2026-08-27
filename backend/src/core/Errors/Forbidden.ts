import BaseError from "./BaseError.ts";

//check
class Forbidden extends BaseError {
  constructor(message?: string, status?: number) {
    super(message || "Proibido, parça.", 403);
  }
}
export default Forbidden;
