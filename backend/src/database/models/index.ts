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

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./src/database/database.sqlite",
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

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

export type ModelName = keyof typeof db;

export type DatabaseModels = Omit<typeof db, "sequelize" | "Sequelize">;

export default {
  ...db,
  sequelize,
  Sequelize,
};
