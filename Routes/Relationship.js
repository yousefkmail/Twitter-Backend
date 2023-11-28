const express = require("express");
const usermodel = require("../Models/UserModel");
const { IsUserAuthenticated } = require("../Controllers/AuthController");
const router = express.Router();

router.use(IsUserAuthenticated);

router.patch("/follow", async (req, res) => {
  const { user, followstatus } = req.body;
  const userr = await usermodel.findById(req.user);
  try {
    if (followstatus) await userr.follow(user);
    else await userr.unFollow(user);
  } catch (e) {
    res.status(400).json({ Error: e.message });
    return;
  }

  res.status(200).json({ followstatus: followstatus });
});

router.patch("/block", async (req, res) => {
  const { user, blockStatus } = req.body;
  const userr = await usermodel.findById(req.user);

  try {
    if (blockStatus) await userr.block(user);
    else await userr.unBlock(user);
  } catch (e) {
    res.status(400).json({ Error: e.message });
    return;
  }

  res.status(200).json({ blockStatus: blockStatus });
});

router.get("/followings", async (req, res) => {
  try {
    const following = await usermodel
      .findById(req.user)
      .select("following")
      .populate({ path: "following", select: "_id name email" });

    res.status(200).json({ following: following.following });
  } catch (e) {
    res.status(400).json({ Error: e.message });
  }
});

router.get("/followers", async (req, res) => {
  try {
    const followers = await usermodel
      .findById(req.user)
      .select("followers")
      .populate({ path: "followers", select: "_id name email" });

    res.status(200).json({ followers: followers.followers });
  } catch (e) {
    res.status(400).json({ Error: e.message });
  }
});

module.exports = router;
