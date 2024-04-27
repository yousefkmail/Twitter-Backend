const express = require("express");
const usermodel = require("../Models/UserModel");
const { IsUserAuthenticated } = require("../Controllers/AuthController");
const router = express.Router();
const FollowModel = require("../Models/FollowModel");
router.use(IsUserAuthenticated);

router.patch("/follow", async (req, res) => {
  const { user, followstatus } = req.body;
  try {
    if (followstatus) {
      await FollowModel.follow(req.user, user);
      // await FollowModel.follow(req.user, user);
    } else await FollowModel.unFollow(req.user, user);
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

router.get("/followings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ids = await FollowModel.find({
      $or: [{ sender: id }, { state: "friend", receiver: id }],
    });

    const array = ids.map((item) => {
      if (id !== item.sender) return item.receiver;
      else return item.sender;
    });

    console.log(array);
    const users = await usermodel
      .find({ _id: { $in: array }, isActive: true })
      .select("-password -isActive");
    const array1 = users.map((item) => {
      return {
        ...item.toObject(),
        isFollower: ids.includes((item) => item.state === "friend"),
        isFollowing: true,
      };
    });

    res.status(200).json({ users: array1 });
  } catch (e) {
    res.status(400).json({ Error: e.message });
  }
});

router.get("/followers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const ids = await FollowModel.find({
      $or: [{ receiver: id }, { state: "friend", sender: id }],
    });

    const array = ids.map((item) => {
      if (id === item.sender) return item.receiver;
      else return item.sender;
    });

    const users = await usermodel
      .find({ _id: { $in: array }, isActive: true })
      .select("-password -isActive");
    const array1 = users.map((item) => {
      return {
        ...item.toObject(),
        isFollower: true,
        isFollowing: ids.includes((item) => item.state === "friend"),
      };
    });

    res.status(200).json({ users: array1 });
  } catch (e) {
    res.status(400).json({ Error: e.message });
  }
});

module.exports = router;
