import { Sequelize } from "sequelize";

import Comment from "./Comment";
import Follower from "./Follower";
import Ingredient from "./Ingredient";
import Pantry from "./Pantry";
import PantryIngredient from "./PantryIngredient";
import PantryUser from "./PantryUser";
import Recipe from "./Recipe";
import RecipeIngredient from "./RecipeIngredient";
import ShoppingList from "./Shoppinglist";
import ShoppingListItem from "./Shoppinglistitem";
import User from "./User";
import PreparationHistory from "./preparationhistory";
import Notification from "./Notification";
import Like from "./Like";

const database =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_DATABASE
    : process.env.DB_DATABASE;

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database,
});

const CommentModel = Comment(sequelize);
const FollowerModel = Follower(sequelize);
const IngredientModel = Ingredient(sequelize);
const PantryModel = Pantry(sequelize);
const PantryIngredientModel = PantryIngredient(sequelize);
const PantryUserModel = PantryUser(sequelize);
const RecipeModel = Recipe(sequelize);
const RecipeIngredientModel = RecipeIngredient(sequelize);
const ShoppingListItemModel = ShoppingListItem(sequelize);
const ShoppingListModel = ShoppingList(sequelize);
const PreparationHistoryModel = PreparationHistory(sequelize);
const NotificationModel = Notification(sequelize);
const LikeModel = Like(sequelize);
const UserModel = User(sequelize);

const db = {
  Comment: CommentModel,
  Follower: FollowerModel,
  Ingredient: IngredientModel,
  Pantry: PantryModel,
  PantryIngredient: PantryIngredientModel,
  PantryUser: PantryUserModel,
  Recipe: RecipeModel,
  RecipeIngredient: RecipeIngredientModel,
  ShoppingList: ShoppingListModel,
  ShoppingListItem: ShoppingListItemModel,
  PreparationHistory: PreparationHistoryModel,
  Notification: NotificationModel,
  Like: LikeModel,
  User: UserModel,
};

export type ModelName = keyof typeof db;

export type DatabaseModels = typeof db;

Object.values(db).forEach((model) => {
  if ("associate" in model && typeof model.associate === "function") {
    model.associate(db);
  }
});

export default {
  ...db,
  sequelize,
  Sequelize,
};
