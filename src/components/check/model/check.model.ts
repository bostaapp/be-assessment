import { Schema, model } from 'mongoose';
import { Protocols } from '../enums';

const CheckSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
    protocol: {
      type: String,
      required: true,
      enum: Protocols,
    },
    path: {
      type: String,
      required: false,
    },
    port: {
      type: Number,
      required: false,
    },
    webhook: {
      type: String,
      required: false,
    },
    timeout: {
      type: Number,
      required: false,
      default: 5000,
    },
    interval: {
      type: Number,
      required: false,
      default: 6e5,
    },
    threshold: {
      type: Number,
      default: 1,
    },
    authentication: {
      type: Object,
      required: false,
      username: {
        type: String,
      },
      password: {
        type: String,
      },
    },
    httpHeaders: {
      type: Object,
      required: false,
    },
    assert: {
      type: Object,
      required: false,
      statusCode: {
        type: Number,
      },
    },
    tags: {
      type: [String],
      default: [],
      required: false,
    },
    ignoreSSL: {
      type: Boolean,
      required: false,
    },
  },
  { collection: 'check' }
);

export const Check = model('check', CheckSchema);
