import mongoose from "mongoose";

const Schema = mongoose.Schema;

const GoldSchema = new Schema({
  dateTrack: Date,
  prices: [
    {
      name: String,
      price: Number,
      buy: Number,
      buyChange: Number,
      sell: Number,
      sellChange: Number,
    },
  ],
  createDate: Date,
});

module.exports = mongoose.model("Gold", GoldSchema);
