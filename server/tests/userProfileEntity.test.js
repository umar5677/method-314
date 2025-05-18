import { expect, test, describe } from "vitest";
import { userProfileEntity } from "../entities/userProfileEntity.js";
import { setup } from "./setup.js";

describe("profile test", async () => {
  await setup();
  test("get all Profiles", async () => {
    const profiles = await userProfileEntity.getAllProfiles();
    expect(profiles.length).toBe(4);
  });

  test("create Profile", async () => {
    const profile = await userProfileEntity.addProfile("newProfile", false);
    expect(profile).toStrictEqual({
      profileID: 5,
      profile: "newProfile",
      suspended: false,
    });
  });

  test("update Profile", async () => {
    const profile = await userProfileEntity.updateProfileByID(1, {
      profile: "test",
      suspended: 0,
    });
    expect(profile).toStrictEqual({
      profileID: 1,
      profile: "test",
      suspended: 0,
    });
  });
});
