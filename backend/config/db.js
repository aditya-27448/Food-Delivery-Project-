import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("DATABASE CONNECTED 😎");
  } catch (error) {
    console.log("DATABASE ERROR ❌");
  }
};

export default connectDB;
