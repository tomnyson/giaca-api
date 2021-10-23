//Import the mongoose module
import mongoose from "mongoose";

//Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/coffee-track";
mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .catch((err) => console.log(err.reason));
