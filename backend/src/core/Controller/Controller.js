const Services = require("../Services/Services.js");

class Controller {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    const data = await this.service.getAll();
    res.status(200).json(data);
  }
}

module.exports = Controller;
