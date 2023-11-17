require("dotenv").config();
import mongoose from "mongoose";
import config from "../config";

const dbUrl: string = config.database_url || "";

const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(`database connected ${data.connection.host}`);
    });
  } catch (error: any) {
    console.log("ee", error.message);
    setTimeout(() => {
      connectDb();
    }, 5000);
  }
};

export default connectDb;
