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

describe("DELETE /recipeingredients", () => {
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

  test("não exclui o último ingrediente da receita", async () => {
    const { recipeId, recipeIngredientId } = await createRecipe({
      title: "Macarrão protegido",
      token,
      ingredientId,
    });

    const response = await request(app)
      .delete(
        `/recipeingredients/delete/ingredient/${recipeIngredientId}/recipe/${recipeId}`,
      )
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    assert.strictEqual(
      response.body.message,
      "Não é possível excluir o último ingrediente da receita!",
    );
  });

  test("exclui um ingrediente quando a receita tem mais de um", async () => {
    const secondIngredient = await request(app)
      .post("/ingredients/post")
      .send({ name: "Queijo" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const { recipeId, recipeIngredientId } = await createRecipe({
      title: "Macarrão com queijo",
      token,
      ingredientId,
      ingredients: [
        {
          quantity: 2,
          unit: "g",
          ingredientId,
        },
        {
          quantity: 1,
          unit: "unidade",
          ingredientId: secondIngredient.body.id,
        },
      ],
    });

    const response = await request(app)
      .delete(
        `/recipeingredients/delete/ingredient/${recipeIngredientId}/recipe/${recipeId}`,
      )
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    assert.strictEqual(response.body.message, "excluído com sucesso");
  });

  test("ingrediente realmente deixa de existir após exclusão", async () => {
    const secondIngredient = await request(app)
      .post("/ingredients/post")
      .send({ name: "Queijo" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const { recipeId, recipeIngredientId } = await createRecipe({
      title: "Macarrão com queijo",
      token,
      ingredientId,
      ingredients: [
        {
          quantity: 2,
          unit: "g",
          ingredientId,
        },
        {
          quantity: 1,
          unit: "unidade",
          ingredientId: secondIngredient.body.id,
        },
      ],
    });

    await request(app)
      .delete(
        `/recipeingredients/delete/ingredient/${recipeIngredientId}/recipe/${recipeId}`,
      )
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const deleted = await db.RecipeIngredient.findByPk(recipeIngredientId);

    assert.strictEqual(deleted, null);
  });

  test("recusa exclusão de ingrediente inexistente", async () => {
    const { recipeId } = await createRecipe({
      title: "Macarrão",
      token,
      ingredientId,
    });

    const response = await request(app)
      .delete(`/recipeingredients/delete/ingredient/999999/recipe/${recipeId}`)
      .set("Authorization", `Bearer ${token}`);

    assert.ok(response.status >= 400 && response.status < 500);
  });

  test("recusa exclusão de ingrediente pertencente a outra receita", async () => {
    const secondIngredient = await request(app)
      .post("/ingredients/post")
      .send({ name: "Queijo" })
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const recipe1 = await createRecipe({
      title: "Receita 1",
      token,
      ingredientId,
      ingredients: [
        {
          quantity: 2,
          unit: "g",
          ingredientId,
        },
        {
          quantity: 1,
          unit: "unidade",
          ingredientId: secondIngredient.body.id,
        },
      ],
    });

    const recipe2Ingredient = await db.RecipeIngredient.findOne({
      where: {
        recipeId: recipe1.recipeId,
      },
    });

    assert.ok(recipe2Ingredient);

    const otherRecipe = await createRecipe({
      title: "Receita 2",
      token,
      ingredientId,
    });

    const response = await request(app)
      .delete(
        `/recipeingredients/delete/ingredient/${recipe2Ingredient!.id}/recipe/${otherRecipe.recipeId}`,
      )
      .set("Authorization", `Bearer ${token}`);

    assert.ok(response.status >= 400 && response.status < 500);
  });

  test("não cadastrado", async () => {
    await request(app)
      .delete("/recipeingredients/delete/ingredient/1/recipe/1")
      .expect(401);
  });
});

after(async () => {
  await clearDatabase();
  await db.sequelize.close();
});
