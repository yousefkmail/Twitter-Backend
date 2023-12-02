const express = require("express");
const { IsUserAuthenticated } = require("../Controllers/AuthController");
const usermodel = require("../Models/UserModel");
const router = express.Router();
const { UploadImageTofirebase } = require("../Firebase/storageManipulation");

router.use(IsUserAuthenticated);

router.get("/current", async (req, res) => {
  const user = req.user;
  const result = await usermodel.findById(req.user).select("-password");
  result.toObject();
  console.log(result);
  res.status(200).json({ user: { ...result.toObject() } });
});

router.post("/edit", async (req, res) => {
  try {
    const data = {};
    const { name } = req.body;
    if (name) {
      data.name = name;
    }
    if (req.files) {
      const image = await UploadImageTofirebase(
        `image${0}`,
        "ProfilePic",
        req.user._id,
        req.files.icon.data
      );
      data.icon = image;
    }

    await usermodel.findOneAndUpdate({ _id: req.user._id }, { ...data });
    res.status(200).json({ ...data });
  } catch (e) {}
});

module.exports = router;
