const user = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

const IsUserAuthenticated = async (req, res, next) => {
  const { token } = req.headers;
  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await user.findById(_id).select("_id").exec();
    next();
  } catch (error) {
    res.status(401).json({ msg: "not authorized" });
  }
};

module.exports = { IsUserAuthenticated };
