const mongoose = require("mongoose");
const User = require("../Models/UserModel");
const Schema = mongoose.Schema;

const tweetSchema = new Schema(
  {
    publisherId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    contentText: {
      type: String,
    },
    Videos: {
      type: [String],
    },
    Images: {
      type: [String],
    },

    TrendsTitles: {
      type: [String],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

tweetSchema.virtual("publisher", {
  ref: "User",
  localField: "publisherId",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("Tweet", tweetSchema);
