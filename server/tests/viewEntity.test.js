import { expect, test, describe } from "vitest";
import { viewEntity } from "../entities/viewEntity.js";
import { setup } from "./setup.js";

describe("view test", async () => {
  await setup();

  test("insert View", async () => {
    const view = await viewEntity.addView(2, 1);
    expect(view).toStrictEqual({ serviceID: 2, accountID: 1 });
  });

  test("update View Count", async () => {
    const viewCount = await viewEntity.updateViewCount();
    expect(viewCount.affectedRows).toBe(2);
  });
});
