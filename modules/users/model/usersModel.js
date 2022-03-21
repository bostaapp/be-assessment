import mongoose from "mongoose";
import { userSchema } from "../schema/usersSchema.js";
const User = mongoose.model("User", userSchema);

export { User };
