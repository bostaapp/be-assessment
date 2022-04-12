require("dotenv").config();
const mongoose = require("mongoose");
const { getReportByIdService, getReportByTagService } = require("../controllers/reportServices");

describe("Connection", () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_CONNECTION, {
            useNewUrlParser: true,
        })
    });
    test("get report by id", async () => {
        const id = "6253ef7296edff05aad041d3";
        const userId = "6253ec94ca50c264d8a685b9";
        const report = await getReportByIdService(id, userId);
        expect(report.checkId.toString()).toBe("6253ef7196edff05aad041d1");
    });
    test("get report by tag", async () => {
        const userId = "6253ec94ca50c264d8a685b9";
        const report = await getReportByTagService("not important", userId);
        expect(report[0].checkId.toString()).toBe("6253ef7196edff05aad041d1");
  
    });

    afterAll(done => {
        mongoose.disconnect();
        done();
    });

});

