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
const mongoose = require("mongoose");
const socket = require("socket.io");
app.use(fileupload({ createParentPath: true }), (req, res, next) => {
  next();
});
ConnectToFirebase();
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== mongoose.ConnectionStates.connected) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to dB");
  }
  next();
});

// TODO:: Websocket
// const io = socket(3000, {
//   cors: {
//     origin: ["http://localhost:5173"],
//   },
// });
// io.on("connection", (sockett) => {
//   console.log(sockett.handshake.auth.token);

//   sockett.on("custom-event", (string) => {
//     console.log(sockett.handshake.auth.token);
//   });
// });

app.use(cors());
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/user", currentUserRouter);
app.use("/api/tweet", TweetRouter);
app.use("/api/trend", TrendRouter);
app.use("/api/relationship", RelationshipRouter);
app.use("/api/people", PeopleRouter);

module.exports.handler = serverless(app);
