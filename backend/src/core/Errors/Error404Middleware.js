const exprees = require("express");
const Error404Class = require("./Error404.js");

function Error404(req, res, next) {
  console.log("tamo no 404");
  return next(
    new Error404Class("Recurso não encontrado, o link está certo? :p"),
  );
}

module.exports = Error404;
