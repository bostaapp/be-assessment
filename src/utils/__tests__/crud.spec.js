import { getOne, getMany, createOne, updateOne, removeOne } from "../crud";
import { Check } from "../../resources/check/check.model";
import mongoose from "mongoose";

describe("crud controllers", () => {
  describe("getOne", async () => {
    test("finds by id", async () => {
      expect.assertions(2);
      const check = await Check.create({
        name: "check1",
        url: "https://www.google.com/webhp?hl=en&sa=X&ved=0ahUKEwjc4a2Kq4f3AhVKXhoKHeqpC7sQPAgI",
        protocol: "HTTPS",
      });

      const req = {
        params: {
          id: check._id,
        },
      };
      const res = {
        status(status) {
          expect(status).toBe(200);
          return this;
        },
        json(result) {
          expect(result.data._id.toString()).toBe(check._id.toString());
        },
      };
      await getOne(Check)(req, res);
    });
  });
});
