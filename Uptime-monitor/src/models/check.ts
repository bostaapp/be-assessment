import mongoose, { Schema, model } from "mongoose";

export enum PROTOCOL {
  HTTP = "http",
  HTTPS = "https",
  TCP = "tcp",
}

export interface ICheck {
  user: mongoose.Types.ObjectId;
  name: string;
  url: string;
  protocol: PROTOCOL;
  path?: string;
  port?: number;
  webhook?: string;
  timeout?: number;
  interval?: number;
  threshold?: number;
  authentication?: {
    username: string;
    password: string;
  };
  httpHeaders?: any;
  assert?: {
    statusCode: number;
  };
  tags: string[];
  ignoreSSL?: boolean;
  lastCreatedTime?: Date;
}

const checkSchema = new Schema<ICheck>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  url: { type: String, required: true },
  protocol: {
    type: String,
    required: true,
    enum: PROTOCOL,
  },
  path: { type: String, required: false },
  port: { type: Number, required: false },
  webhook: { type: String, required: false },
  timeout: { type: Number, required: false, default: 5000 },
  interval: { type: Number, required: false, default: 10 * 60 * 1000 },
  threshold: { type: Number, default: 1 },
  authentication: {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  httpHeaders: {
    type: Object,
  },
  assert: {
    statusCode: {
      type: Number,
    },
  },
  tags: {
    type: [String],
    default: [],
  },
  ignoreSSL: {
    type: Boolean,
    default: false,
  },
  lastCreatedTime: {
    type: Date,
    default: new Date(0),
  },
});

const Check = model<ICheck>("Check", checkSchema);

export { Check };
