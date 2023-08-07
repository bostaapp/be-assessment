const mongoose = require("mongoose");
const  User  = require("../user.model");
const db = require("../../db/setupTestDB");

const userData = {
  email: "bosta@gmail.com",
  password: "bosta123",
};

beforeAll(async () => {
  await db.setUp();
}, 50000);

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});

describe("User model", () => {
  it("create & save user successfully", async () => {
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined();
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBeDefined();
  });

  // You shouldn't be able to add in any field that isn't defined in the schema
  it("insert user successfully, but the field not defined in schema should be undefined", async () => {
    const userWithInvalidField = new User({
      ...userData,
      nickname: "Handsome TekLoon",
    });
    
    const savedUserWithInvalidField = await userWithInvalidField.save();
    expect(savedUserWithInvalidField._id).toBeDefined();
    expect(savedUserWithInvalidField.nickname).toBeUndefined();
  });

  // It should us tell us the errors in on email field.
  it("create user without required field should failed", async () => {
    const userWithoutRequiredField = new User({ name: "TekLoon" });
    let err;
    try {
      const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });
});

