import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGOURI || "";

const connectDB = async (): Promise<void> => {
  try {
    if (!mongoURI) {
      throw new Error("database URI undefined");
    }
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error connecting to MongoDB:", error.message);
    } else {
      console.error("Unknown error: ", error);
    }
    process.exit(1);
  }
};

export default connectDB;
