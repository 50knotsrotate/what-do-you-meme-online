const express = require("express");
const app = express();
const server = require("http").Server(app);
var io = require("socket.io")(server);
const path = require("path");

io.on("connection", socket => {
  console.log("a user has connected");

  io.on("disconnect", socket => {
    console.log("A user has left");
  });
});


// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../build/index.html"));
// });  For production

server.listen(4000, () => console.log(`server running on port ${4000}`));
