import express from "express";
import { Request, Response, NextFunction } from "express";

import UserController from "./User.Controller.js";

import verifyAccount from "@verifyAccount";
import verifyAdmin from "@verifyAdmin";

const userController = new UserController();

const Router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista os usuários com paginação
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
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
 *           default: 10
 *           example: 10
 *       - in: query
 *         name: name
 *         required: false
 *         description: Parte do nome do usuário que vai ser buscado
 *         schema:
 *           type: string
 *           example: joao
 *       - in: query
 *         name: username
 *         required: false
 *         description: Parte do usernome do usuário que vai ser buscado
 *         schema:
 *           type: string
 *           example: joaolegal
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       401:
 *         description: Usuário não autenticado
 */

Router.get(
  "/users",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUsersBy(req, res, next),
);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Cria uma nova conta de usuário
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: nome_legal
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: 12345678!
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *       400:
 *         description: Dados inválidos ou conta já existe
 */
Router.post("/register", (req: Request, res: Response, next: NextFunction) =>
  userController.signUp(req, res, next),
);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Faz o login do usuário usando email e senha
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: 12345678!
 *     responses:
 *       200:
 *         description: Usuário logado com sucesso
 *       404:
 *         description: Email não encontrado
 *       409:
 *         description: Já existe um estoque seu com esse nome
 */
Router.post("/login", (req: Request, res: Response, next: NextFunction) =>
  userController.login(req, res, next),
);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
Router.get(
  "/user/:id",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getOneUser(req, res, next),
);

/**
 * @swagger
 * /user/deactivate:
 *   delete:
 *     summary: Desativa a conta de um usuário
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Conta desativada com sucesso
 *       403:
 *         description: O usuário não pode desativar contas alheias
 *       404:
 *         description: Usuário não encontrado
 */
Router.delete(
  "/user/deactivate",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.deactivateAccount(req, res, next),
);

/**
 * @swagger
 * /user/deactivate:
 *   delete:
 *     summary: Desativa a conta de um usuário
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Conta desativada com sucesso
 *       403:
 *         description: O usuário não pode desativar contas alheias
 *       404:
 *         description: Usuário não encontrado
 */
Router.delete(
  "/user/deactivate/:id",
  verifyAccount,
  verifyAdmin,
  (req: Request, res: Response, next: NextFunction) =>
    userController.deactivateAccountAsAdmin(req, res, next),
);

/**
 * @swagger
 * /user/update:
 *   put:
 *     summary: Atualiza as informações do perfil do usuário
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email atual usado para confirmar a alteração
 *                 example: usuario@email.com
 *               username:
 *                 type: string
 *                 example: nome_novo
 *               name:
 *                 type: string
 *                 example: Joao Silva
 *               bio:
 *                 type: string
 *                 example: Gosto de jogar e cozinhar
 *               pfp:
 *                 type: string
 *                 example: foto.png
 *               password:
 *                 type: string
 *                 example: 12345678!
 *     responses:
 *       200:
 *         description: Usuário atualizou a conta com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Email de confirmação incorreto
 *       404:
 *         description: Usuário não encontrado
 */
Router.put(
  "/user/update",
  verifyAccount,
  (req: Request, res: Response, next: NextFunction) =>
    userController.updateAccount(req, res, next),
);

export default Router;
