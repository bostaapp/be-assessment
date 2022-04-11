import mongoose from "mongoose";
import options from "../config";

export const connect = (url = options.dburl, opts = {}) => {
  return mongoose.connect(url, { ...opts, useNewUrlParser: true });
};
