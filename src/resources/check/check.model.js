import mongoose from "mongoose";

const checkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    protocol: {
      type: String,
      enum: ["HTTP", "HTTPS", "TCP"],
    },
    path: {
      type: String,
    },
    port: {
      type: Number,
    },
    webhook: {
      type: String,
    },
    timeout: {
      type: Number,
    },
    interval: {
      type: Number,
    },
    threshold: {
      type: Number,
    },
    authentication: {
      type: Object,
    },
    httpHeaders: {
      type: [{ key: String, value: String }],
    },
    assert: {
      type: Object,
    },
    tags: {
      type: [],
    },
    ignoreSSL: {
      type: Boolean,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const Check = mongoose.model("check", checkSchema);
