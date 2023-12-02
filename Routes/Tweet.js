const express = require("express");
const jwt = require("jsonwebtoken");
const user = require("../Models/UserModel");
const {
  LikeTweet,
  PostNewTweet,
  DeleteTweet,
  UpdateTweet,
  getTweets,
  UnlikeTweet,
  getTweet,
  getComments,
} = require("../Controllers/TweetColtroller");
const { IsUserAuthenticated } = require("../Controllers/AuthController");

const router = express.Router();
router.use(IsUserAuthenticated);
router.post("/post", PostNewTweet);

router.delete("/delete/:id", DeleteTweet);

router.patch("/edit/:id", UpdateTweet);

router.get("/get/:page/:size", getTweets);
router.get("/get/:id", getTweet);
router.post("/like/:id", LikeTweet);
router.post("/unlike/:id", UnlikeTweet);
router.get("/comment/get/:id", getComments);

module.exports = router;
