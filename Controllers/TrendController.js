const TrendModel = require("../Models/TrendModel");

const GetTrends = async (req, res) => {
  try {
    const trends = await TrendModel.find({}).limit(10);
    res.status(200).json({ Trends: trends });
  } catch (Error) {}
};

module.exports = {
  GetTrends,
};
