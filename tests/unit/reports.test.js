import httpStatus from "http-status";
import Checks from "../../src/models/Check";
import Reports from "../../src/models/Report";
import APIError from "../../src/utils/api-error";
import ReportsService from "../../src/services/reports";

// Mock the dependencies
jest.mock("../../src/models/Report");
jest.mock("../../src/models/Check");

describe("ReportsService", () => {
  describe("getReportByCheckId", () => {
    it("should get a report by its check ID for a given user", async () => {
      const checkId = "check1";
      const userId = "user1";
      const report = { check: "check1", userId: "user1" };

      Reports.findOne.mockResolvedValueOnce(report);

      const result = await ReportsService.getReportByCheckId({ checkId }, { userId });

      expect(Reports.findOne).toHaveBeenCalledWith({ check: checkId });
      expect(result).toEqual(report);
    });

    it("should throw an APIError if the user is not authorized to access the report", async () => {
      const checkId = "check1";
      const userId = "user2";

      Reports.findOne.mockResolvedValueOnce({ userId: "user1" });

      await expect(ReportsService.getReportByCheckId({ checkId }, { userId })).rejects.toThrow(APIError);
      expect(Reports.findOne).toHaveBeenCalledWith({ check: checkId });
    });
  });

  describe("getReportsByTags", () => {
    it("should get reports by tags for a given user", async () => {
      const tags = ["tag1", "tag2"];
      const userId = "user1";
      const checkIds = ["check1", "check2"];
      const reports = [{ check: "check1"}, {check: "check2"}];

      Checks.find.mockResolvedValueOnce([{ _id: "check1" }, { _id: "check2" }]);
      Reports.find.mockResolvedValueOnce(reports);

      const result = await ReportsService.getReportsByTags({ tags }, { userId });

      expect(Checks.find).toHaveBeenCalledWith({ tags: { $in: tags }, userId });
      expect(Reports.find).toHaveBeenCalledWith({ check: { $in: checkIds } });
      expect(result).toEqual(reports);
    });
  });
});
