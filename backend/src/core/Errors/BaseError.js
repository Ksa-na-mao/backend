class BaseError extends Error {
  constructor(message, status) {
    super(message || "Erro no servidor! :(");
    this.status = status || 500;
  }

  async response(res) {
    res.status(this.status).json({ message: this.message });
  }
}

module.exports = BaseError;
