const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TrendModule = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    tweetCount: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trends", TrendModule);
