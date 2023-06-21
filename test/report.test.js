import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import config from "../src/config.js";
import bcrypt from "../src/helpers/bcrypt"
import User from "../src/models/User";
import Report from "../src/models/Report.js";
import jwt from "jsonwebtoken";
import UrlCheck from "../src/models/UrlCheck.js";

let checkUrlUserData = {
    email: "ahmedddddd@gmail.com",
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

let reportId;
let token;
let user

beforeEach(async () => {
    user = await new User(checkUrlUserData).save();
    checkUrlPayload.userId = user._id;
    let check = await new UrlCheck(checkUrlPayload).save();
    token = jwt.sign({ userid: user._id }, config.tokenSecret, { expiresIn: 60 * 60 * 60 * 60 });
    const report = new Report({
        userId: user._id,
        urlCheckId: check._id,
        status: "available",
        availability: `90%`,
        outages: 2,
        downtime: 10000,
        uptime: 30000,
        responseTime: 0.223,
        history: []

    }).save();
    reportId = (await report)._id;

});
afterEach(async () => {
    const deleteUser = await User.findOneAndDelete({ email: checkUrlUserData.email });
    await UrlCheck.findOneAndDelete({ userId: deleteUser._id });
    await Report.findOneAndDelete({ userId: deleteUser._id });
    await User.findOneAndDelete({ email: "testingNotFoundsd@gmail.com" })
})
describe('report routes', () => {
    describe('GET /report/:id', () => {
        it("should return 200 and get the spcified report for that user", async () => {
            const res = await request(app).get(`/report/${reportId}`).set("accesstoken", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
        })

        it("should return 500 for unexpected errors", async () => {
            const res = await request(app).get(`/report/213123`).set("accesstoken", `Bearer ${token}`);
            expect(res.statusCode).toBe(500);
        })

        it("should return 404 if not report was found", async () => {
            const newUser = await new User({
                email: "testingNotFoundsd@gmail.com",
                password: bcrypt.encryptPassword("123456789"),
                verficationState: true
            }).save();
            let accesstoken = await jwt.sign({ userid: newUser._id }, config.tokenSecret, { expiresIn: 60 * 60 * 60 * 60 });
            const res = await request(app).get(`/report/${reportId}`).set("accesstoken", `Bearer ${accesstoken}`);
            expect(res.statusCode).toBe(404);
        })
    })

    describe('GET /report', () => {
        it("should return 200 and get all reports for that user", async () => {
            const res = await request(app).get(`/report`).set("accesstoken", `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
        })

        it("should return 404 if not report was found", async () => {
            const newUser = await new User({
                email: "testingNotFoundsd@gmail.com",
                password: bcrypt.encryptPassword("123456789"),
                verficationState: true
            }).save();
            let accesstoken = await jwt.sign({ userid: newUser._id }, config.tokenSecret, { expiresIn: 60 * 60 * 60 * 60 });
            const res = await request(app).get(`/report`).set("accesstoken", `Bearer ${accesstoken}`);
            expect(res.statusCode).toBe(404);
        })
    })
})