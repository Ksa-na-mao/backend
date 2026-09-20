import express from "express";

import verifyAccount from "@verifyAccount";
import PantryController from "./Pantry.Controller";
const pantryController = new PantryController();

const Router = express.Router();

/**
 * @swagger
 * /pantries:
 *   get:
 *     summary: Lista os estoques do usuário
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pantries
 *     parameters:
 *       - in: query
 *         name: offset
 *         required: false
 *         description: Número da página
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Quantidade de usuários por página
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 5
 *           example: 5
 *     responses:
 *       200:
 *         description: Lista de estoque do usuário retornada com sucesso
 */

Router.get("/pantries", verifyAccount, (req, res, next) =>
  pantryController.getMyPantries(req, res, next),
);

/**
 * @swagger
 * /pantry/info/:id:
 *   get:
 *     summary: Pega as informações de um estoque específico
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pantries
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do estoque
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de estoque do usuário retornada com sucesso
 *       403:
 *         description: Tu está tentando entrar em um estoque alternativo
 */

Router.get("/pantry/info/:id", verifyAccount, (req, res, next) =>
  pantryController.getOnePantry(req, res, next),
);

/**
 * @swagger
 * /pantry/post:
 *   post:
 *     summary: Cria um novo estoque para voce
 *     tags:
 *       - Pantries
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: meu segundo estoque.
 *     responses:
 *       200:
 *         description: Usuário logado com sucesso
 *       400:
 *         description: O nome está vazio
 *       401:
 *         description: Senha incorreta
 */
Router.post("/pantry/post", verifyAccount, (req, res, next) =>
  pantryController.post(req, res, next),
);
/**
 * @swagger
 * /pantry/update/:id:
 *   patch:
 *     summary: Atualiza as informações do estoque
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pantries
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do estoque
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: nome novo
 *     responses:
 *       200:
 *         description: Usuário atualizou o estoque com sucesso
 *       400:
 *         description: Dados vazios ou o nome já é existente nos seus estoques
 *       403:
 *         description: Você não é o dono do estoque
 */
Router.patch("/pantry/update/:id", verifyAccount, (req, res, next) =>
  pantryController.update(req, res, next),
);

/**
 * @swagger
 * /pantry/delete/:id:
 *   delete:
 *     summary: Desativa o estoque de um usuário
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pantries
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do estoque
 *     responses:
 *       200:
 *         description: Estoque excluido.
 *       400:
 *         description: Usuário só tem um estoque, sendo impossível de apagar.
 *       403:
 *         description: O usuário não pode desativar estoques alheios
 */
Router.delete("/pantry/delete/:id", verifyAccount, (req, res, next) =>
  pantryController.delete(req, res, next),
);

export default Router;
