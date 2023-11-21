const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const UserRouter = require("../Routes/User");
const currentUserRouter = require("../Routes/currentUser");
const TweetRouter = require("../Routes/Tweet");
const TrendRouter = require("../Routes/Trend");
const RelationshipRouter = require("../Routes/Relationship");
const PeopleRouter = require("../Routes/People");
const fileupload = require("express-fileupload");
const { ConnectToFirebase } = require("../Firebase/storageManipulation");
const app = express();
const socket = require("socket.io");
const serverless = require("serverless-http");
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

const handler = async () => {};

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database");
    return serverless(app);
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
  })
  .catch((error) => {
    console.log(error);
    return null;
  });

module.exports.handler = serverless(app);
