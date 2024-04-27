const express = require("express");
const { IsUserAuthenticated } = require("../Controllers/AuthController");
const usermodel = require("../Models/UserModel");
const router = express.Router();
const { UploadImageTofirebase } = require("../Firebase/storageManipulation");
const TweetModel = require("../Models/TweetModel");
router.use(IsUserAuthenticated);

router.get("/current", async (req, res) => {
  try {
    const user = req.user;
    const result = await usermodel.findById(req.user).select("-password");
    res.status(200).json({ user: { ...result.toObject() } });
  } catch (error) {
    res.status(400).json({ user: "not found " });
  }
});

router.get("/get/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const obj = await usermodel.findById(id).select("-password");
    res.status(200).json({ user: obj.toObject() });
  } catch (error) {
    res.status(400).json({ user: "not found" });
  }
});

router.post("/edit", async (req, res) => {
  try {
    const data = {};
    const { name } = req.body;
    if (name) {
      data.name = name;
    }
    if (req.files) {
      if (req.files.icon) {
        const image = await UploadImageTofirebase(
          `image${0}`,
          "ProfilePic",
          req.user._id,
          req.files.icon.data
        );
        data.icon = image;
      }
      if (req.files.coverImage) {
        const image = await UploadImageTofirebase(
          `image${0}`,
          "CoverPic",
          req.user._id,
          req.files.coverImage.data
        );
        data.coverImage = image;
      }
    }

    await usermodel.findOneAndUpdate({ _id: req.user._id }, { ...data });
    res.status(200).json({ ...data });
  } catch (e) {}
});

router.get("/tweets/:page/:size", async (req, res) => {
  const { page, size } = req.params;
  try {
    const tweets = await TweetModel.find({
      isDeleted: false,
      superTweet: undefined,
      publisherId: req.user._id,
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
});

module.exports = router;
