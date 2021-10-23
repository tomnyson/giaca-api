import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  dateTrack: Date,
  title: String,
  image: String,
  slug: String,
  shortDescription: String,
  type: String,
  createDate: Date,
});

module.exports = mongoose.model("Post", PostSchema);
