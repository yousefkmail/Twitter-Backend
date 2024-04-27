const user = require("../Models/UserModel");
const FollowModel = require("../Models/FollowModel");
const GetRecommendedAccounts = async (req, res) => {
  try {
    let followings = await FollowModel.find({ sender: req.user._id }).select(
      "receiver -_id"
    );

    const fieldValues = followings.map((item) => item.receiver);

    console.log(fieldValues);
    const accs = await user
      .find({ _id: { $nin: fieldValues, $ne: req.user._id } })
      .limit(4)
      .select("_id name icon");
    res.status(200).json({ recAccounts: accs });
  } catch (e) {
    res.status(400).json({ Error: e.message });
  }
};

module.exports = { GetRecommendedAccounts };
