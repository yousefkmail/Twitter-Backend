const { default: mongoose } = require("mongoose");
const { UploadImageTofirebase } = require("../Firebase/storageManipulation");
const TweetModel = require("../Models/TweetModel");
const UserModel = require("../Models/UserModel");
const TrendModel = require("../Models/TrendModel");
const { ReadHashtags } = require("../Utils/Hashtags");

const PostNewTweet = async (req, res) => {
  const { contentText, superTweet } = req.body;

  console.log(superTweet);

  try {
    const images = [];

    const data = await TweetModel.create({
      superTweet: superTweet,
      contentText,
      publisherId: req.user._id,
    });

    if (req.files) {
      const keys = Object.keys(req.files);
      for (i = 0; i < keys.length; i++) {
        console.log(req.files[keys[i]].name);
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
    const tweet = await TweetModel.findOne({ _id: data.id }).populate({
      path: "publisher",
      select: "_id name email icon",
    });

    const newTweet = tweet.toObject({ virtuals: true });

    res.status(200).json({ tweet: newTweet });
  } catch (Error) {
    res.status(400).json({ Error: Error.message });
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

  const tweet = await TweetModel.findOneAndUpdate(
    { _id: id, publisherId: req.user._id },
    { isDeleted: true }
  );
  if (tweet) res.status(200).json({ msg: "Deleted", _id: id });
  else res.status(400).json({ msg: "No post" });
};

const getTweets = async (req, res) => {
  const { page, size } = req.params;
  console.log(page, size);
  try {
    const tweets = await TweetModel.find({
      isDeleted: false,
      superTweet: undefined,
    })
      .skip(page * size)
      .limit(size)
      .populate({
        path: "publisher",
        select: "_id name email icon",
      })
      .sort({ createdAt: "desc" });
    const tweetsarray = tweets.map((r) => r.toObject({ virtuals: true }));

    tweetsarray.forEach((tweet) => {
      tweet.isLiked = tweet.Likes.some((item) => item._id.equals(req.user._id));
      tweet.likesCount = tweet.Likes.length;
    });
    res.status(200).json({ tweets: tweetsarray });
  } catch (Error) {
    res.status(400).json({ Error: Error });
  }
};

const getTweet = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const tweet = await TweetModel.findOne({
      _id: id,
    }).populate({
      path: "publisher",
      select: "_id name email icon",
    });
    const tweetObj = tweet.toObject({ virtuals: true });
    tweetObj.isLiked = tweetObj.Likes.some((item) =>
      item._id.equals(req.user._id)
    );
    res.status(200).json({ tweet: tweetObj });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const LikeTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const tweet = await TweetModel.findOne({ _id: id });
    await tweet.like(req.user._id);
    res.status(200).json({});
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};

const UnlikeTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const tweet = await TweetModel.findOne({ _id: id });
    await tweet.unLike(req.user._id);
    res.status(200).json({});
  } catch (e) {
    res.status(400).json({ e: e.message });
  }
};
const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const tweets = await TweetModel.find({
      isDeleted: false,
      superTweet: id,
    })
      .populate({
        path: "publisher",
        select: "_id name email icon",
      })
      .sort({ createdAt: "desc" });
    const tweetsarray = tweets.map((r) => r.toObject({ virtuals: true }));

    tweetsarray.forEach((tweet) => {
      tweet.isLiked = tweet.Likes.some((item) => item._id.equals(req.user._id));
      tweet.likesCount = tweet.Likes.length;
    });
    res.status(200).json({ comments: tweetsarray });
  } catch (Error) {
    res.status(400).json({ Error: Error });
  }
};

module.exports = {
  PostNewTweet,
  UpdateTweet,
  DeleteTweet,
  getTweets,
  LikeTweet,
  UnlikeTweet,
  getTweet,
  getComments,
};
