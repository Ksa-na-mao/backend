import { Response } from "express";

class BaseError extends Error {
  status: number;

  constructor(message?: string, status?: number) {
    super(message || "Erro no servidor! :(");

    this.status = status || 500;
  }

  response(res: Response) {
    res.status(this.status).json({ message: this.message });
  }
}

export default BaseError;
