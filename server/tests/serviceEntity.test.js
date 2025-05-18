import { expect, test, describe } from "vitest";
import { serviceEntity } from "../entities/serviceEntity.js";
import { setup } from "./setup.js";

describe("service test", async () => {
  await setup();

  test("get all Services", async () => {
    const services = await serviceEntity.getAllServices();
    expect(services.length).toBe(3);
  });

  test("get serviceID", async () => {
    const service = await serviceEntity.getServiceById(1);
    expect(service).toStrictEqual({
      category: "Commercial Cleaning",
      cleanerID: 2,
      price: "75.00",
      serviceID: 1,
      shortlistCount: 0,
      view: 0,
    });
  });

  test("get serviceID by cleanerID", async () => {
    const service = await serviceEntity.getServicesByCleanerId(1);
    expect(service).toStrictEqual([
      {
        category: "Window Cleaning",
        cleanerID: 1,
        price: "30.00",
        serviceID: 3,
        shortlistCount: 1,
        view: 3,
      },
    ]);
  });

  test("add service", async () => {
    const service = await serviceEntity.addService(
      "Residential Cleaning",
      2,
      30.0
    );
    expect(service).toStrictEqual({
      serviceID: 4,
      category: "Residential Cleaning",
      cleanerID: 2,
      price: 30.0,
    });
  });

  test("update service", async () => {
    const service = await serviceEntity.updateService(1, {
      category: "Carpet Cleaning",
      cleanerID: 2,
      price: 75.0,
    });
    expect(service).toStrictEqual({
      category: "Carpet Cleaning",
      cleanerID: 2,
      price: 75.0,
      serviceID: 1,
    });
  });

  test("delete service", async () => {
    const service = await serviceEntity.deleteService(1);
    expect(service).toStrictEqual({ message: "Service deleted successfully" });
  });

  test("get service by homeownerId", async () => {
    const service = await serviceEntity.getServicesByHownerId(1);
    expect(service).toStrictEqual([
      {
        category: "Window Cleaning",
        cleanerID: 1,
        price: "30.00",
        serviceID: 3,
        shortlistCount: 1,
        username: "useradmin",
        view: 3,
      },
    ]);
  });
});
