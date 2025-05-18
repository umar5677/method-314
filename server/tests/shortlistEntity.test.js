import { expect, test, describe } from "vitest";
import { shortlistEntity } from "../entities/shortlistEntity.js";
import { setup } from "./setup.js";

describe("shortlist test", async () => {
  await setup();

  test("add shortlist", async () => {
    const shortlist = await shortlistEntity.addShortlist(1, 1);
    expect(shortlist).toStrictEqual({ serviceID: 1, hownerID: 1 });
  });

  test("remove shortlist", async () => {
    const shortlist = await shortlistEntity.removeShortlist(1, 1);
    expect(shortlist).toStrictEqual({ serviceID: 1, hownerID: 1 });
  });

  test("get by homeowner by service", async () => {
    const shortlist = await shortlistEntity.getHomeownersByService(3);
    expect(shortlist.length).toBe(1);
  });
});
