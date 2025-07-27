import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://admin:admin1234@cluster0.bm6y9cu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected from config/db.js");
  } catch (error) {
    console.error("❌ MongoDB connection error from config/db.js:\n", error);
  }
};
