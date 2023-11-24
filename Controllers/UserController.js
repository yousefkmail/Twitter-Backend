const user = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const FieldError = require("../classes/FieldError");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const Login = async (req, res) => {
  console.log("logging in");
  const { email, password } = req.body;

  try {
    const targetuser = await user.findOne({ email });

    if (!targetuser) {
      res.status(400).json({ Error: "No user with this email" });
      return;
    }
    const match = await bcrypt.compare(password, targetuser.password);

    if (!match) {
      res.status(400).json({ Error: "Password is incorrect" });
      return;
    }
    const token = CreateToken(targetuser._id);

    res.status(200).json({ email, token, profilePic: targetuser.icon });
  } catch (error) {
    res.status(400).json({ Error: error.message });
  }
};

const CreateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET);
};

const Signup = async (req, res) => {
  const { email, password, dateOfBirth, name } = req.body;
  try {
    if (!email) {
      throw new FieldError("email", "Field is required");
    }

    if (!password) {
      throw new FieldError("password", "Field is required");
    }

    if (!validator.isEmail(email)) {
      throw new FieldError("email", "Not a valid email");
    }

    if (!validator.isStrongPassword(password)) {
      throw new FieldError("password", "Password isn't strong enough");
    }

    const userTest = await user.findOne({ email });

    if (userTest) {
      throw new FieldError("email", "email already in use");
    }
    if (!dateOfBirth) {
      res.status(400).json({ Error: "Date of brith is required" });
      return;
    }

    const date = new Date(dateOfBirth);
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, salt);
    const createduser = await user.create({
      email: email,
      password: hashpass,
      dateOfBirth: date,
      name: name,
    });
    const token = CreateToken(createduser._id);

    res.status(200).json({ email, token });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ Error: { field: error.field, message: error.message } });
  }
};

module.exports = {
  Login,
  Signup,
};
