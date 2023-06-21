import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import config from "../src/config.js";
import bcrypt from "../src/helpers/bcrypt"
import User from "../src/models/User";
import UrlCheck from "../src/models/UrlCheck.js";
import Report from "../src/models/Report.js";
import jwt from "jsonwebtoken";
import jest from "jest";

let checkUrlUserData = {
    email: "ahmedmohamed@gmail.com",
    password: bcrypt.encryptPassword("123456789"),
    verficationState: true,
};

let checkUrlPayload = {
    name: "linkedIn",
    url: "https://www.linkedin.com",
    protocol: "http",
    interval: "5",
    tag: ["social"]
}
let checkId;
let token;
let user

beforeAll(async () => {
    user = await new User(checkUrlUserData).save();
    token = jwt.sign({ userid: user._id }, config.tokenSecret, { expiresIn: 60 * 60 * 60 * 60 });

})

afterAll(async () => {
    const deleteUser = await User.findOneAndDelete({ email: checkUrlUserData.email });
    await UrlCheck.findOneAndDelete({ userId: deleteUser._id });
    await Report.findOneAndDelete({ userId: deleteUser._id });
    await User.findOneAndDelete({ email: "testingNotFoundd@gmail.com" })
})

describe("checkUrl routes", () => {
    describe("sample test", () => {
        it("should be true ", async () => {
            expect(true).toBe(true);
        })
    })

    describe("POST /urlCheck", () => {
        it("should return 201 and create a url check in DB", async () => {
            const res = await request(app)
                .post("/urlCheck")
                .set("accesstoken", `Bearer ${token}`)
                .send(checkUrlPayload);
            checkId = res.body.urlCheck._id;
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toEqual("url check created");
        });

        it("should return 400 when the url name is not inserted", async () => {
            const res = await request(app)
                .post("/urlCheck")
                .set("accesstoken", `Bearer ${token}`)
                .send({
                    url: "https://www.linkedin.com",
                    protocol: "http",
                    interval: "5",
                    tag: ["social"]
                }
                );
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toEqual("name is required");
        });

        it("should return 400 when the url is not inserted", async () => {
            const res = await request(app)
                .post("/urlCheck")
                .set("accesstoken", `Bearer ${token}`)
                .send({
                    name: "linkedin",
                    protocol: "http",
                    interval: "5",
                    tag: ["social"]
                }
                );
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toEqual("url is required");
        });

        it("should return 400 when the protocol is not inserted", async () => {
            const res = await request(app)
                .post("/urlCheck")
                .set("accesstoken", `Bearer ${token}`)
                .send({
                    name: "linkedin",
                    url: "https://www.linkedin.com",
                    interval: "5",
                    tag: ["social"]
                }
                );
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toEqual("protocol is required");
        });

        it("should return 400 when the url check already exists", async () => {
            const res = await request(app)
                .post("/urlCheck")
                .set("accesstoken", `Bearer ${token}`)
                .send({
                    name: "linkedin",
                    url: "https://www.linkedin.com",
                    protocol: "http",
                    interval: "5",
                    tag: ["social"]
                }
                );
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toEqual("this url already exists");
        });
    });

    describe("GET /urlCheck", () => {
        it("should return 200 and a list of the urlChecks for the user", async () => {
            const res = await request(app)
                .get("/urlCheck")
                .set("accesstoken", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            res.body.forEach((item) => {
                expect(item).toHaveProperty("url")
            })

        });

        it("should return 404 when there no url checks create by user", async () => {
            const newUser = await new User({
                email: "testingNotFoundd@gmail.com",
                password: bcrypt.encryptPassword("123456789"),
                verficationState: true
            }).save();
            let accesstoken = await jwt.sign({ userid: newUser._id }, config.tokenSecret, { expiresIn: 60 * 60 * 60 * 60 });
            const res = await request(app)
                .get("/urlCheck")
                .set("accesstoken", `Bearer ${accesstoken}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toEqual("no url checks found")

            await User.findOneAndDelete({ email: "testingNotFoundd@gmail.com" })
        })
    })

    describe("GET /urlCheck?tag=", () => {
        it("should return 200 and a list of the urlChecks for the user by tag", async () => {
            const res = await request(app)
                .get("/urlCheck?tags=social")
                .set("accesstoken", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            res.body.forEach((item) => {
                expect(item).toHaveProperty("url")
            })

        });

        it("should return 404 when there no url checks create by user", async () => {
            const newUser = await new User({
                email: "testingNotFoundd@gmail.com",
                password: bcrypt.encryptPassword("123456789"),
                verficationState: true
            }).save();
            let accesstoken = await jwt.sign({ userid: newUser._id }, config.tokenSecret, { expiresIn: 60 * 60 * 60 * 60 });
            const res = await request(app)
                .get("/urlCheck?tags=social")
                .set("accesstoken", `Bearer ${accesstoken}`);
            expect(res.statusCode).toBe(404);
            expect(res.body.message).toEqual("no url checks found")

            await User.findOneAndDelete({ email: "testingNotFoundd@gmail.com" })
        })
    })

    describe("PUT /urlCheck/:id", () => {
        it("should return 200 and update the url check in DB", async () => {
            const res = await request(app).put(`/urlCheck/${checkId}`).set("accesstoken", `Bearer ${token}`).send(checkUrlPayload);
            console.log(res.body.message)
            expect(res.statusCode).toBe(200);
        })

        it("should return 400 and fail to update the url check ", async () => {
            const res = await request(app).put(`/urlCheck/999999`).set("accesstoken", `Bearer ${token}`).send(checkUrlPayload);
            console.log(res.body.message)
            expect(res.statusCode).toBe(400);
        })
    })

    describe("DELETE /urlCheck/:id", () => {
        it("should return 200 and delete the check from DB", async () => {
            const res = await request(app).delete(`/urlCheck/${checkId}`).set("accesstoken", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(await res.body.message).toEqual(`url check ${checkId} deleted`)
        })

        it("should return 404 and as not urls are found", async () => {
            const res = await request(app).delete(`/urlCheck/${checkId}`).set("accesstoken", `Bearer ${token}`);
            expect(res.statusCode).toBe(404);
            expect(await res.body.message).toEqual(`no url check found to delete`)
        })
    })

})