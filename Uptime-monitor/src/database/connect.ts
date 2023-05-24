import mongoose from "mongoose";

const connectDB = async (url: string): Promise<void> => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(url);
  console.log("DB connection established");
};
export default connectDB;
