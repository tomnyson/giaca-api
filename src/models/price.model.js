import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PriceSchema = new Schema({
  dateTrack: Date,
  coffeeDaklak: Number,
  coffeeDaklakChange: Number,
  coffeeLamDong: Number,
  coffeecoffeeLamDongChange: Number,
  coffeeGiaLai: Number,
  coffeeGiaLaiChange: Number,
  coffeeDakNong: Number,
  coffeeDakNongChange: Number,
  hotieu: Number,
  hotieuChange: Number,
  usdVnd: Number,
  usdVndChange: Number,
  createDate: Date,
});

module.exports = mongoose.model("Price", PriceSchema);
