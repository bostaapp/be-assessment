import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    const result = await mongoose.connect(process.env.DB_HOST);
    console.log("DB connected");
  } catch (err) {
    console.log("error", err);
  }
};

export { dbConnection };

