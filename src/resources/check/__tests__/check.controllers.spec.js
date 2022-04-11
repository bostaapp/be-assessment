import controllers from "../check.controllers";
import { isFunction } from "lodash";

describe("item controllers", () => {
  test("has crud controllers", () => {
    const crudMethods = [
      "getOne",
      "getMany",
      "createOne",
      "removeOne",
      "updateOne",
    ];
    crudMethods.forEach((name) =>
      expect(isFunction(controllers[name])).toBe(true)
    );
  });
});
