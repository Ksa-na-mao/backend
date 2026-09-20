import Services from "@Services";
import dataSource from "@models/index.ts";
import { Transaction } from "sequelize";
const sequelize = dataSource.sequelize;
const ShoppingList = dataSource["ShoppingList"];

class ShoppingServices extends Services {
  constructor() {
    super("ShoppingList");
  }
  async createShoppingList(pantryId: number, t?: Transaction) {
    const execute = async (transaction: Transaction) => {
      return ShoppingList.create(
        {
          pantryId,
        },
        { transaction },
      );
    };

    if (t) {
      return execute(t);
    }

    return sequelize.transaction(execute);
  }
}

export default ShoppingServices;
