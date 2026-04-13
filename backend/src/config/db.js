import mongoose from "mongoose";

export const connectDB = async (mongodbUri) => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongodbUri, {
    serverSelectionTimeoutMS: 30_000,
    socketTimeoutMS: 45_000,
    connectTimeoutMS: 30_000,
    maxPoolSize: 10,
    retryWrites: true,
  });
};
