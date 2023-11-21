const mongoose = require("mongoose");

connectToDb = async () => {
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
};
module.exports.handler = connectToDb;
