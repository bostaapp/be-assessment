import mongoose from "mongoose";
import { Report } from "../report.model";

describe("Report model", () => {
  describe("schema", () => {
    test("id", () => {
      const id = Report.schema.obj.id;
      expect(id).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        auto: true,
      });
    });

    test("status", () => {
      const status = Report.schema.obj.status;
      expect(status).toEqual({
        type: String,
        required: true,
      });
    });

    test("availability", () => {
      const availability = Report.schema.obj.availability;
      expect(availability).toEqual({
        type: Number,
        required: true,
      });
    });

    test("outages", () => {
      const outages = Report.schema.obj.outages;
      expect(outages).toEqual({
        type: Number,
        required: true,
      });
    });

    test("downtime", () => {
      const downtime = Report.schema.obj.downtime;
      expect(downtime).toEqual({
        type: Number,
        required: true,
      });
    });

    test("uptime", () => {
      const uptime = Report.schema.obj.uptime;
      expect(uptime).toEqual({
        type: Number,
        required: true,
      });
    });

    test("responseTime", () => {
      const responseTime = Report.schema.obj.responseTime;
      expect(responseTime).toEqual({
        type: Number,
        required: true,
      });
    });

    test("history", () => {
      const history = Report.schema.obj.history;
      expect(history).toEqual({
        type: Array,
        required: true,
      });
    });
  });
});
