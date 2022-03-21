import mongoose from "mongoose";
const urlSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    status: { type: Boolean },
    availability: { type: String },
    averageResponseTime: { type: Number },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totaleUpTime: { type: Number, default: 0 },
    totaleDownTime: { type: Number, default: 0 },
    totalUpPulls: { type: Number, default: 0 },
    totalDownPulls: { type: Number, default: 0 },
    history: [
      { _id: false, pullTime: { type: Date }, available: { type: Boolean } },
    ],
  },
  {
    timestamps: true,
  }
);

export { urlSchema };
