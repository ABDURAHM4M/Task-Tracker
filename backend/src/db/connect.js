import mongoose from "mongoose";

/**
 * Connect to MongoDB using the MONGO_URI environment variable.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI is not defined in environment.");
    process.exit(1);
  }

  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅ Successfully connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
