import { expect, test, describe } from "vitest";
import { userAccountEntity } from "../entities/userAccountEntity.js";
import { setup } from "./setup.js";

describe("account test", async () => {
  await setup();
  test("login account", async () => {
    const account = await userAccountEntity.loginUser("useradmin", "pwd");
    expect(account).toStrictEqual({
      id: 1,
      username: "useradmin",
      password: "pwd",
      profile: "useradmin",
      suspended: 0,
    });
  });

  test("get all accounts", async () => {
    const accounts = await userAccountEntity.getAllUsers();
    expect(accounts.length).toBe(4);
  });

  test("get account ID", async () => {
    const account = await userAccountEntity.getUserById(1);
    expect(account).toStrictEqual({
      id: 1,
      username: "useradmin",
      password: "pwd",
      profile: "useradmin",
      suspended: 0,
    });
  });

  test("create account", async () => {
    const account = await userAccountEntity.addUser(
      "testUser",
      "pwd",
      "useradmin",
      0
    );
    expect(account).toStrictEqual({
      id: 5,
      username: "testUser",
      password: "pwd",
      profile: "useradmin",
      suspended: 0,
    });
  });

  test("update account", async () => {
    const account = await userAccountEntity.updateUser(5, {
      username: "testUser",
      password: "pwd",
      profile: "cleaner",
      suspended: 0,
    });
    expect(account).toStrictEqual({
      id: 5,
      username: "testUser",
      password: "pwd",
      profile: "cleaner",
      suspended: 0,
    });
  });
});
