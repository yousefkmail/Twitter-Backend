const { default: mongoose } = require("mongoose");
const { UploadImageTofirebase } = require("../Firebase/storageManipulation");
const TweetModel = require("../Models/TweetModel");
const UserModel = require("../Models/UserModel");
const TrendModel = require("../Models/TrendModel");
const { ReadHashtags } = require("../Utils/Hashtags");

const PostNewTweet = async (req, res) => {
  const { contentText } = req.body;

  try {
    const images = [];

    const data = await TweetModel.create({
      contentText,
      publisherId: req.user._id,
    });

    if (req.files) {
      const keys = Object.keys(req.files);
      for (i = 0; i < keys.length; i++) {
        const image = await UploadImageTofirebase(
          `image${i}`,
          data.id,
          req.user._id,
          req.files[keys[i]].data
        );
        images.push(image);
      }
      const id = data.id;

      await TweetModel.findOneAndUpdate({ _id: id }, { Images: images });
    }

    // await UpdateTweet(req, res, data.id);
    const array = ReadHashtags(contentText);
    for (let i = 0; i < array.length; i++) {
      const hashtag = await TrendModel.findOne({ title: array[i] }).exec();
      if (hashtag) {
        hashtag.tweetCount += 1;
        hashtag.save();
      } else {
        const hashtagnew = await TrendModel.create({ title: array[i] });
      }
    }

    res.status(200).json({ tweetId: data._id });
  } catch (Error) {
    res.status(400).json({ Error });
  }
};
const UpdateTweet = async (req, res, id) => {
  //  const { contentText } = req.body;
  const images = [];
  if (req.files) {
    const keys = Object.keys(req.files);
    for (i = 0; i < keys.length; i++) {
      const image = await UploadImageTofirebase(
        "asdasd",
        "qweq",
        123123,
        req.files[keys[i]].data
      );
      images.push(image);
    }
  }

  try {
    await TweetModel.findOneAndUpdate({ _id: id }, { Images: images });
    // // if (contentText) {
    // //   await TweetModel.findOneAndUpdate({ _id: id }, { contentText });
    // // }

    res.status(200).json({ msg: "Uploaded" });
  } catch (err) {
    res.status(400).json({ err });
  }
};

const DeleteTweet = async (req, res) => {
  const { id } = req.params;

  await TweetModel.findOneAndUpdate({ _id: id }, { isDeleted: true });

  res.status(200).json({ msg: "Deleted" });
};

const getTweets = async (req, res) => {
  try {
    const tweets = await TweetModel.find().populate({
      path: "publisher",
      select: "_id name email icon",
    });
    const tweetsarray = tweets.map((r) => r.toObject({ virtuals: true }));

    res.status(200).json({ tweets: tweetsarray });
  } catch (Error) {
    res.status(400).json({ Error: Error });
  }
};

module.exports = {
  PostNewTweet,
  UpdateTweet,
  DeleteTweet,
  getTweets,
};
