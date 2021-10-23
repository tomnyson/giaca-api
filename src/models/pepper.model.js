import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PepperSchema = new Schema({
  dateTrack: Date,
  prices: [
    {
      name: String,
      price: Number,
      change: Number,
    },
  ],
  createDate: Date,
});

module.exports = mongoose.model("Pepper", PepperSchema);
