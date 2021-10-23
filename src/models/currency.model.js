import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CurrencySchema = new Schema({
  dateTrack: Date,
  prices: [
    {
      name: String,
      code: String,
      price: Number,
      buyCash: Number,
      buyTransferPayment: Number,
      sell: Number,
    },
  ],
  createDate: Date,
});

module.exports = mongoose.model("Currency", CurrencySchema);
