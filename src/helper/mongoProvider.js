//Import the mongoose module
import mongoose from "mongoose";

//Set up default mongoose connection
const mongoDB =
  "mongodb+srv://admin:EYto2GeLx5v10Kb8@cluster0.god2i.mongodb.net/coffee?retryWrites=true&w=majority";
mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
  })
  .catch((err) => console.log(err.reason));
