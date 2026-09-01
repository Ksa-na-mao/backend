import Error404Class from "./Error404.js";
import { Request, Response, NextFunction } from "express";

function Error404(req: Request, res: Response, next: NextFunction) {
  return next(
    new Error404Class("Recurso não encontrado, o link está certo? :p", 404),
  );
}

export default Error404;
