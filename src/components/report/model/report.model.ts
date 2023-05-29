import { StatusCodes } from 'http-status-codes';
import { Schema, model } from 'mongoose';

const ReportSchema = new Schema(
  {
    staus: { type: String, default: StatusCodes.OK },
    availability: { type: Number },
    outages: { type: Number, default: 0 },
    downtime: { type: Number, default: 0 },
    uptime: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 },
    history: { type: [{ status: Number, timestamp: Date }], default: [] },
    checkId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'check',
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
  },
  { collection: 'report' }
);

export const Report = model('Report', ReportSchema);
