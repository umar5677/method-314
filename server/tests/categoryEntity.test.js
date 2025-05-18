import { expect, test, describe } from "vitest";
import { categoryEntity } from "../entities/categoryEntity.js";
import { setup } from "./setup.js";

describe("category test", async () => {
  await setup();

  test("get all Categories", async () => {
    const categories = await categoryEntity.getAllCategories();
    expect(categories.length).toBe(5);
  });

  test("add Category", async () => {
    const category = await categoryEntity.addCategory("Roof Cleaning");
    expect(category).toStrictEqual({
      categoryID: 6,
      category: "Roof Cleaning",
    });
  });

  test("update Category", async () => {
    const category = await categoryEntity.updateCategoryByID(1, {
      category: "Test Cleaning",
    });
    expect(category).toStrictEqual({
      categoryID: 1,
      category: "Test Cleaning",
    });
  });

  test("delete Category", async () => {
    const category = await categoryEntity.deleteCategoryByID(1);
    expect(category).toStrictEqual({
      message: "Category ID 1 deleted successfully",
    });
  });
});
