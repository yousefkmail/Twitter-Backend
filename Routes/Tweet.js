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
} = require("../Controllers/TweetColtroller");
const { IsUserAuthenticated } = require("../Controllers/AuthController");

const router = express.Router();
router.use(IsUserAuthenticated);
router.post("/post", PostNewTweet);

router.delete("/delete/:id", DeleteTweet);

router.patch("/edit/:id", UpdateTweet);

router.get("/get", getTweets);
router.post("/like/:id", LikeTweet);
router.post("/unlike/:id", UnlikeTweet);

module.exports = router;
