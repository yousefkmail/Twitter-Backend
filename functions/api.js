const express = require("express");
const cors = require("cors");
require("dotenv").config();
const UserRouter = require("../Routes/User");
const currentUserRouter = require("../Routes/currentUser");
const TweetRouter = require("../Routes/Tweet");
const TrendRouter = require("../Routes/Trend");
const RelationshipRouter = require("../Routes/Relationship");
const PeopleRouter = require("../Routes/People");
const fileupload = require("express-fileupload");
const serverless = require("serverless-http");
const { ConnectToFirebase } = require("../Firebase/storageManipulation");
const app = express();
const socket = require("socket.io");
const connecttodb = require("../database");
app.use(fileupload({ createParentPath: true }), (req, res, next) => {
  next();
});
ConnectToFirebase();
app.use(cors());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/user", currentUserRouter);
app.use("/api/tweet", TweetRouter);
app.use("/api/trend", TrendRouter);
app.use("/api/relationship", RelationshipRouter);
app.use("/api/people", PeopleRouter);

module.exports.handler = serverless(app);
