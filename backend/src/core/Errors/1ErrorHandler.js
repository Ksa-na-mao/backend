const exprees = require("express");
const BaseError = require("./baseError");

function ErrorHandler(error, req, res, next) {
  if (error instanceof BaseError) {
    res.status(error.status).json({ message: error.message });
  } else {
    res.status(500).json("erro imprevisto!");
  }
}

module.exports = ErrorHandler;
