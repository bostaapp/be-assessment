import mongoose from "mongoose";
import { urlSchema } from "../schema/urlsSchema.js";

const Url = mongoose.model("Url", urlSchema);

export { Url };
