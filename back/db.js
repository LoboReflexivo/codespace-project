import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://codespaceproject:RFDD1234@cluster0.ec6byos.mongodb.net/codespaceproject"
    );
    console.log(">>> MongoDB is connected");
  } catch (error) {
    console.log(error);
  }
};
