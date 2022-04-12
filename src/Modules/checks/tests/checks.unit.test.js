require("dotenv").config();
const mongoose = require("mongoose");
const { getCheckByIdService, getCheckByTagService, putCheck } = require("../controllers/checkServices");

describe("Connection", () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_CONNECTION, {
            useNewUrlParser: true,
        })
    });
    test("get check by id", async () => {
        const id = "6253ef7196edff05aad041d1";
        const userId = "6253ec94ca50c264d8a685b9";
        const check = await getCheckByIdService(id, userId);
        expect(check.name).toBe("check2");
    });
    test("get check by tag", async () => {
        const userId = "6253ed04ca50c264d8a685c0";
        const check = await getCheckByTagService("important", userId);
        expect(check[0].name).toBe("check1");
    });
    test("Put check", async () => {
        let userId = "6253ec94ca50c264d8a685b9";
        const newCheck = {
            "name": "check3",
            "href": "https://fast.com/",
            "timeout": 5,
            "interval": 5,
            "threshold": 5,
            "ignoreSSL": false,
            "tags": [
                "important"
            ]
        }
        const result = await putCheck(newCheck, userId);
        expect(result.check.href).toBe(newCheck.href);

    });


    afterAll(done => {
        mongoose.disconnect();
        done();
    });

});

