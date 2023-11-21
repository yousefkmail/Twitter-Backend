const { json } = require("express");
const mongoose = require("mongoose");

connectToDb = async function () {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to database");
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Connected to MongoDB" }),
      };
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
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Internal Server Error" }),
      };
    });
};
module.exports.handler = connectToDb;
