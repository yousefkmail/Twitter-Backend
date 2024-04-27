const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userStateEnum = {
  OPTION_A: "Disabled",
  OPTION_B: "Banned",
};

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
      // required: true,
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
    },
    coverImage: {
      type: String,
    },

    followingCount: {
      type: Number,
      default: 0,
    },
    followerCount: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

// UserSchema.methods.follow = async function (PersonId) {
//   const userid = new mongoose.Types.ObjectId(PersonId);

//   var bool = false;
//   for (let i = 0; i < this.following.length; i++) {
//     if (this.following[i].equals(userid)) {
//       bool = true;
//     }
//   }
//   if (!bool) {
//     this.following.push(userid);
//     this.save();
//   } else {
//     throw Error("User already followed");
//   }
// };

// UserSchema.methods.unFollow = async function (PersonId) {
//   const userid = new mongoose.Types.ObjectId(PersonId);

//   var isFollowing = false;
//   for (let i = 0; i < this.following.length; i++) {
//     if (this.following[i].equals(userid)) {
//       isFollowing = true;
//       this.following.splice(i, 1);
//       await this.save();
//       break;
//     }
//   }

//   if (!isFollowing) {
//     throw Error("You are not following this user");
//   }
// };

// UserSchema.methods.block = async function (PersonId) {
//   const userid = new mongoose.Types.ObjectId(PersonId);

//   var bool = false;
//   for (let i = 0; i < this.blocks.length; i++) {
//     if (this.blocks[i].equals(userid)) {
//       bool = true;
//     }
//   }
//   if (!bool) {
//     this.blocks.push(userid);
//     this.save();
//   } else {
//     throw Error("User already blocked");
//   }
// };

// UserSchema.methods.unBlock = async function (PersonId) {
//   const userid = new mongoose.Types.ObjectId(PersonId);

//   var isFollowing = false;
//   for (let i = 0; i < this.blocks.length; i++) {
//     if (this.blocks[i].equals(userid)) {
//       isFollowing = true;
//       this.blocks.splice(i, 1);
//       await this.save();
//       break;
//     }
//   }

//   if (!isFollowing) {
//     throw Error("You are not blocking this user");
//   }
// };

module.exports = mongoose.model("User", UserSchema);
