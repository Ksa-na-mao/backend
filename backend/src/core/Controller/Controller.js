class Controller {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res, next) {
    try {
      const offset = parseInt(req.query.offset) || 0;
      const response = await this.service.getAll(offset);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getOneById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const response = await this.service.getById(id);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  //Put
  async update(req, res, next) {
    try {
      const data = req.body;
      const userEmail = req.user.userEmail;
      await this.service.update(data, userEmail);
      res.status(201).json("Recurso atualizado com sucesso!");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
