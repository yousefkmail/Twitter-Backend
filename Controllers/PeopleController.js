const user = require("../Models/UserModel");
const GetRecommendedAccounts = async (req, res) => {
  try {
    const following = await user
      .findOne({ _id: req.user._id })
      .select("following");

    const array = following.following;
    const accs = await user
      .find({ _id: { $nin: array, $ne: req.user._id } })
      .limit(4)
      .select("_id name icon");
    res.status(200).json({ recAccounts: accs });
  } catch (e) {
    res.status(400).json({ Error: e.message });
  }
};

module.exports = { GetRecommendedAccounts };
