import mongoose from "mongoose";
import request from "supertest";
import config from "../src/config";
import app from "../src/app.js";
import bcrypt from "../src/helpers/bcrypt"
import User from "../src/models/User";


const userData = {
    email: "testest@gmail.com",
    password: "123456789"
}

beforeAll(async () => {
    await User.findOneAndDelete({ email: userData.email })
    await User.findOneAndDelete({ email: "osama11@mail.com" })
})

describe("authentication routes", () => {
    describe("GET test api", () => {
        it("should return hello", async () => {
            const res = await request(app).get("/");
            console.log("sample test ||  " + res.text)
            expect(res.statusCode).toBe(200);
            // expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe("POST /signup", () => {
        it("should create the user and send email to verify ", async () => {
            const res = await request(app).post("/signup")
                .send(userData);
            expect(res.statusCode).toBe(201);

            // await expect(res.statusCode).toBe(200);
            // expect(1 + 1).toBe(2)

        });

        it("should give 401 error as the user already exists", async () => {
            const res = await request(app).post("/signup")
                .send(userData);
            expect(res.statusCode).toBe(401);
            // await expect(res.statusCode).toBe(200);
            // expect(1 + 1).toBe(2)

        });

        it("should give 400 error as as there is no password", async () => {
            const res = await request(app).post("/signup")
                .send({ email: "mohamed@mail.com" });
            expect(res.statusCode).toBe(400);
            // await expect(res.statusCode).toBe(200);
            // expect(1 + 1).toBe(2)
        });

        it("should give 400 error as as there is no email", async () => {
            const res = await request(app).post("/signup")
                .send({ password: "21323123" });
            expect(res.statusCode).toBe(400);
            // await expect(res.statusCode).toBe(200);
            // expect(1 + 1).toBe(2)
        });
    })

    describe("GET /verification", () => {
        it("should verify my email ", async () => {
            const user = await User.findOne({ email: userData.email });

            const res = await request(app).get(`/verification/${user.verId}`);
            expect(res.statusCode).toBe(200);
        })

        it("should return 404 because there is not user found  ", async () => {
            const user = await User.findOne({ email: userData.email });
            const res = await request(app).get(`/verification/9999999`);
            expect(res.statusCode).toBe(404);
        })

        it("should return 400 as the email is already verified ", async () => {
            const user = await User.findOne({ email: userData.email });
            const res = await request(app).get(`/verification/${user.verId}`);
            expect(res.statusCode).toBe(400);
        })

    })

    describe("POST /signin", () => {
        it("should return 200 and sign the user in by sending token", async () => {
            const res = await request(app).post("/signin").send(userData);
            // console.log(res.body);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.objectContaining({ accessToken: expect.any(String) }));
        });

        it("should return 400 if the email is missing ", async () => {
            const res = await request(app).post("/signin").send({ password: "1213213123" });
            // console.log(res.body);
            expect(res.statusCode).toBe(400);
        });

        it("should return 400 if the password is missing ", async () => {
            const res = await request(app).post("/signin").send({ email: "testtest@mail.com" });
            // console.log(res.body);
            expect(res.statusCode).toBe(400);
        });

        it("should return 400 if the password is incorrect ", async () => {
            const res = await request(app).post("/signin").send({ email: "testest@gmail.com", password: "90909990909" });
            // console.log(res.body);
            expect(res.statusCode).toBe(400);
        });

        it("should return 401 when the email is not verified ", async () => {
            const user = await new User({ email: "osama11@mail.com", password: bcrypt.encryptPassword("123456789") }).save();
            const res = await request(app).post("/signin").send({ email: "osama11@mail.com", password: "123456789" });
            // console.log(res.body);
            expect(res.statusCode).toBe(401);
        });

    })
})