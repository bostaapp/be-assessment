import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    status: {
      type: Number,
      required: true,
      default: "404",
    },
    availability: {
      type: Number,
      required: true,
      default: 0,
    },
    outages: {
      type: Number,
      required: true,
      default: 0,
    },
    downtime: {
      type: Number,
      required: true,
      default: 0,
    },
    uptime: {
      type: Number,
      required: true,
      default: 0,
    },
    responseTime: {
      type: Number,
      required: true,
      default: 0,
    },
    history: {
      type: [{}],
      required: true,
      default: [],
    },
    relatedCheck: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "check",
      required: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model("report", reportSchema);
