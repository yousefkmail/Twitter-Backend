const express = require("express");
const jwt = require("jsonwebtoken");
const user = require("../Models/UserModel");
const {
  PostNewTweet,
  DeleteTweet,
  UpdateTweet,
  getTweets,
} = require("../Controllers/TweetColtroller");
const { IsUserAuthenticated } = require("../Controllers/AuthController");

const router = express.Router();
router.use(IsUserAuthenticated);
router.post("/post", PostNewTweet);

router.delete("/delete/:id", DeleteTweet);

router.patch("/edit/:id", UpdateTweet);

router.get("/get", getTweets);

module.exports = router;
