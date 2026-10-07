import test, { beforeEach, after, describe } from "node:test";
import request from "supertest";
import assert from "node:assert";

import app from "../../../app.ts";
import db from "@models/index.ts";

import { clearDatabase } from "../../helper/clearDatabase.ts";
import createUser from "@/test/helper/createUser.ts";
import createRecipe from "../helper/create-recipe.ts";

let token: string;
let ingredientId: number;

describe("PATCH /recipeingredients", () => {
  beforeEach(async () => {
    await clearDatabase();

    const response = await createUser(request(app), {});
    token = response.body;

    const ingredient = await request(app)
      .post("/ingredients/post")
      .send({ name: "Macarrão" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    ingredientId = ingredient.body.id;
  });

  test("atualiza um ingrediente da receita", async () => {
    const { recipeIngredientId } = await createRecipe({
      title: "Macarrão atualizado",
      token,
      ingredientId,
    });

    const response = await request(app)
      .patch(`/recipeingredients/update/${recipeIngredientId}`)
      .send({
        quantity: 5,
        unit: "ml",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(response.body.message, "atualizado com sucesso");
  });

  test("recusa atualização sem mudança", async () => {
    const { recipeIngredientId } = await createRecipe({
      title: "Macarrão sem mudança",
      token,
      ingredientId,
    });

    const response = await request(app)
      .patch(`/recipeingredients/update/${recipeIngredientId}`)
      .send({
        quantity: 2,
        unit: "g",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message,
      "Você precisa alterar pelo menos um dado para atualizar!",
    );
  });

  test("atualiza somente a quantidade", async () => {
    const { recipeIngredientId } = await createRecipe({
      title: "Macarrão",
      token,
      ingredientId,
    });

    const response = await request(app)
      .patch(`/recipeingredients/update/${recipeIngredientId}`)
      .send({
        quantity: 10,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(response.body.message, "atualizado com sucesso");

    const recipeIngredient =
      await db.RecipeIngredient.findByPk(recipeIngredientId);

    assert.strictEqual(recipeIngredient?.quantity, 10);
    assert.strictEqual(recipeIngredient?.unit, "g");
  });

  test("atualiza somente a unidade", async () => {
    const { recipeIngredientId } = await createRecipe({
      title: "Macarrão",
      token,
      ingredientId,
    });

    const response = await request(app)
      .patch(`/recipeingredients/update/${recipeIngredientId}`)
      .send({
        unit: "kg",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(response.body.message, "atualizado com sucesso");

    const recipeIngredient =
      await db.RecipeIngredient.findByPk(recipeIngredientId);

    assert.strictEqual(recipeIngredient?.quantity, 2);
    assert.strictEqual(recipeIngredient?.unit, "kg");
  });

  test("recusa quantidade menor ou igual a zero", async () => {
    const { recipeIngredientId } = await createRecipe({
      title: "Macarrão",
      token,
      ingredientId,
    });

    await request(app)
      .patch(`/recipeingredients/update/${recipeIngredientId}`)
      .send({
        quantity: 0,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });

  test("mantém os dados quando nenhum campo é enviado", async () => {
    const { recipeIngredientId } = await createRecipe({
      title: "Macarrão",
      token,
      ingredientId,
    });

    const response = await request(app)
      .patch(`/recipeingredients/update/${recipeIngredientId}`)
      .send({})
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message,
      "Você precisa alterar pelo menos um dado para atualizar!",
    );
  });

  test("não cadastrado", async () => {
    await request(app)
      .patch("/recipeingredients/update/1")
      .send({
        quantity: 5,
        unit: "kg",
      })
      .expect(401);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
