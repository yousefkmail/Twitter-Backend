const express = require("express");
const { IsUserAuthenticated } = require("../Controllers/AuthController");
const usermodel = require("../Models/UserModel");
const router = express.Router();

router.use(IsUserAuthenticated);

router.get("/current", async (req, res) => {
  const result = await usermodel.findById(req.user).select("-password");
  result.toObject();
  console.log(result);
  res.status(200).json({ user: { ...result.toObject() } });
});

module.exports = router;
