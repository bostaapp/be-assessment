import { Check } from "../check.model";
import mongoose from "mongoose";

describe("Check model", () => {
  describe("schema", () => {
    test("name", () => {
      const name = Check.schema.obj.name;
      expect(name).toEqual({
        type: String,
        required: true,
      });
    });

    test("url", () => {
      const url = Check.schema.obj.url;
      expect(url).toEqual({
        type: String,
        required: true,
      });
    });

    test("protocol", () => {
      const protocol = Check.schema.obj.protocol;
      expect(protocol).toEqual({
        type: String,
        enum: ["HTTP", "HTTPS", "TCP"],
      });
    });

    test("path", () => {
      const path = Check.schema.obj.path;
      expect(path).toEqual({
        type: String,
      });
    });

    test("port", () => {
      const port = Check.schema.obj.port;
      expect(port).toEqual({
        type: Number,
      });
    });

    test("webhook", () => {
      const webhook = Check.schema.obj.webhook;
      expect(webhook).toEqual({
        type: String,
      });
    });

    test("timeout", () => {
      const timeout = Check.schema.obj.timeout;
      expect(timeout).toEqual({
        type: Number,
      });
    });

    test("interval", () => {
      const interval = Check.schema.obj.interval;
      expect(interval).toEqual({
        type: Number,
      });
    });

    test("threshold", () => {
      const threshold = Check.schema.obj.threshold;
      expect(threshold).toEqual({
        type: Number,
      });
    });

    test("authentication", () => {
      const authentication = Check.schema.obj.authentication;
      expect(authentication).toEqual({
        type: Object,
      });
    });

    test("httpHeaders", () => {
      const httpHeaders = Check.schema.obj.httpHeaders;
      expect(httpHeaders).toEqual({
        type: [{ key: String, value: String }],
      });
    });

    test("assert", () => {
      const assert = Check.schema.obj.assert;
      expect(assert).toEqual({
        type: Object,
      });
    });

    test("tags", () => {
      const tags = Check.schema.obj.tags;
      expect(tags).toEqual({
        type: [],
      });
    });

    test("ignoreSSL", () => {
      const ignoreSSL = Check.schema.obj.ignoreSSL;
      expect(ignoreSSL).toEqual({
        type: Boolean,
      });
    });
  });
});
