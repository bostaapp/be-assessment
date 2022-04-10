import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.SchemaTypes.ObjectId,
      auto: true,
    },
    status: {
      type: String,
      required: true,
    },
    availability: {
      type: Number,
      required: true,
    },
    outages: {
      type: Number,
      required: true,
    },
    downtime: {
      type: Number,
      required: true,
    },
    uptime: {
      type: Number,
      required: true,
    },
    responseTime: {
      type: Number,
      required: true,
    },
    history: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model("report", reportSchema);
