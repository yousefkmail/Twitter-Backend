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
    Likes: {
      type: [mongoose.Types.ObjectId],
    },
    superTweet: {
      type: mongoose.Types.ObjectId,
      ref: "Tweet",
    },
  },

  {
    timestamps: true,
  }
);

tweetSchema.methods.like = async function (PersonId) {
  const userid = new mongoose.Types.ObjectId(PersonId);
  var bool = false;
  for (let i = 0; i < this.Likes.length; i++) {
    if (this.Likes[i].equals(userid)) {
      bool = true;
    }
  }
  if (!bool) {
    this.Likes.push(userid);
    this.save();
  } else {
    throw Error("Post already liked");
  }
};

tweetSchema.methods.unLike = async function (PersonId) {
  const userid = new mongoose.Types.ObjectId(PersonId);

  var isLiked = false;
  for (let i = 0; i < this.Likes.length; i++) {
    if (this.Likes[i].equals(userid)) {
      isLiked = true;
      this.Likes.splice(i, 1);
      await this.save();
      break;
    }
  }

  if (!isLiked) {
    throw Error("This post is not liked");
  }
};

tweetSchema.virtual("publisher", {
  ref: "User",
  localField: "publisherId",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("Tweet", tweetSchema);
