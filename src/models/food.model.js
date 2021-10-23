import mongoose from "mongoose";

const Schema = mongoose.Schema;

const FoodSchema = new Schema({
  dateTrack: Date,
  type: String,
  prices: [
    {
      name: String,
      provide: String,
      price: Number,
      unit: String,
    },
  ],
  createDate: Date,
});

module.exports = mongoose.model("Food", FoodSchema);
