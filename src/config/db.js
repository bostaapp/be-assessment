import mongoose from "mongoose";

const connectToDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
  
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (e) {
      console.log(e.message);
    }
  };
  
export default connectToDB;