import mongoose from "mongoose";
import { User } from "../user.model";

describe("User model", () => {
  describe("schema", () => {
    test("name", () => {
      const name = User.schema.obj.name;
      expect(name).toEqual({
        type: String,
        min: 3,
        max: 255,
        required: true,
      });
    });

    test("email", () => {
      const email = User.schema.obj.email;
      expect(email).toEqual({
        type: String,
        required: true,
        unique: true,
      });
    });
    test("password", () => {
      const password = User.schema.obj.password;
      expect(password).toEqual({
        type: String,
        required: true,
      });
    });

    test("verified", () => {
      const verified = User.schema.obj.verified;
      expect(verified).toEqual({
        type: Boolean,
        default: false,
      });
    });
  });
});
