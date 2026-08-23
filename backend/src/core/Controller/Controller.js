const BadRequest = require("../../core/Errors/BadRequest.js");

class Controller {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res, next) {
    try {
      const { where, offset, limit } = parseInt(req.query.offset) || 0;
      const response = await this.service.getAll(where, offset, limit);
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

  //Post
  async post(req, res, next) {
    try {
      const userId = req.user.userId;
      const data = req.body;
      if (data) {
        data.userId = userId;
        const [response, created] = await this.service.post(data);
        if (created) res.status(201).json(response);
        else throw new BadRequest("Recurso já tinha sido criado antes!");
      } else throw new BadRequest("Para criar algo precisamos de informação.");
    } catch (error) {
      next(error);
    }
  }

  //Put
  async update(req, res, next) {
    try {
      const { id, creatorId } = req.query;
      const data = req.body;
      await this.service.update(data, id, req.user.userId, creatorId);
      res.status(201).json("Recurso atualizado com sucesso!");
    } catch (error) {
      next(error);
    }
  }

  //Delete
  async delete(req, res, next) {
    try {
      const { id, creatorId } = req.query;
      await this.service.delete(id, req.user.userId, creatorId);
      res.status(201).json("Recurso deletado com sucesso!");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
