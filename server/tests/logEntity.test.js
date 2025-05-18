import { expect, test, describe } from "vitest";
import { logEntity } from "../entities/logEntity.js";
import { setup } from "./setup.js";

describe("log test", async () => {
  await setup();
  test("get daily logs", async () => {
    const dailylog = await logEntity.getDailyLogs("2025-04-02", "2025-04-03");
    expect(dailylog.length).toBe(2);
  });

  test("get weekly logs", async () => {
    const weeklylog = await logEntity.getWeeklyLogs("2025-04-02", "2025-04-08");
    expect(weeklylog.length).toBe(2);
  });

  test("get monthly logs", async () => {
    const monthlylog = await logEntity.getMonthlyLogs(
      "2025-03-02",
      "2025-04-02"
    );
    expect(monthlylog.length).toBe(2);
  });
});
