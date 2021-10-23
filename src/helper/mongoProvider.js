//Import the mongoose module
import mongoose from "mongoose";

require("dotenv").config();

//Set up default mongoose connection
const mongoDB = process.env.MONGODB;
console.log("mongoDB", mongoDB);
mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .catch((err) => console.log(err.reason));
