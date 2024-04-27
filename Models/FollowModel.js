const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userModel = require("./UserModel");
const FollowSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    state: {
      type: String,
      enum: ["ingoing", "friend"],
    },
  },
  { timestamps: true }
);

FollowSchema.statics.follow = async function (following, follower) {
  let obj = await this.findOne({
    $or: [
      { sender: following._id, receiver: follower },
      { sender: follower, receiver: following._id, state: "friend" },
    ],
  });
  if (!obj) {
    await this.create({
      sender: following._id,
      receiver: follower,
      state: "ingoing",
    });
    await userModel.findOneAndUpdate(
      { _id: following },
      { $inc: { followingCount: 1 } }
    );
    await userModel.findOneAndUpdate(
      { _id: follower },
      { $inc: { followerCount: 1 } }
    );
  } else {
    throw Error("User already followed");
  }
};

FollowSchema.statics.unFollow = async function (following, follower) {
  let obj = await this.find({ sender: following, receiver: follower });
  if (obj) {
    await this.deleteOne({ _id: obj._id });

    await userModel.findOneAndUpdate(
      { _id: following._id },
      { $inc: { followingCount: -1 } }
    );

    await userModel.findOneAndUpdate(
      { _id: follower },
      { $inc: { followerCount: -1 } }
    );
  } else {
    throw Error("You are not following this user");
  }
};

module.exports = mongoose.model("follow", FollowSchema);
