import mongoose, { Schema, model } from "mongoose";

export enum URL_STATUS {
  UP = "UP",
  DOWN = "DOWN",
}
export interface IReport {
  status: string;
  availability: number;
  outages: number;
  downtime: number;
  uptime: number;
  responseTime: number;
  history: IHistory[];
  check: mongoose.Types.ObjectId;
}
export interface IHistory {
  timestamp: string;
  status: string;
}

const historySchema = new Schema<IHistory>({
  timestamp: {
    type: String,
  },
  status: {
    type: String,
  },
});
const reportSchema = new Schema<IReport>({
  check: {
    type: Schema.Types.ObjectId,
    ref: "Check",
    required: true,
  },
  status: { type: String },
  availability: { type: Number, default: 0 },
  outages: {
    type: Number,
    default: 0,
  },
  downtime: { type: Number, default: 0 },
  uptime: { type: Number, default: 0 },
  responseTime: { type: Number, default: 0 },
  history: { type: [historySchema], required: true, default: [] },
});

const Report = model<IReport>("Report", reportSchema);

export { Report };
