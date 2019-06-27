const express = require("express");
const app = express();
const server = require("http").Server(app);
var io = require("socket.io")(server);
const path = require("path");
const { Player } = require("./gameObjects/Player");
const sockets = require("./sockets_controller");

app.use(express.static(`${__dirname}/../build`));

io.of("/create").on("connection", socket => {

  socket.on("create game", user => sockets.createGame(user, socket));

});

io.of("/lobby").on("connection", socket => {

  socket.on("get lobby", pin => sockets.getLobby(pin, socket, io));

  socket.on("start", () => { io.of('/lobby').emit("start game") });
  
});

io.of("/join").on("connection", socket => {

  socket.on("add player", data => sockets.addPlayer(data, socket, io));

});

io.of('/game').on('connection', socket => { 

  socket.on('get game', pin => sockets.getGame(pin, socket, io));

  socket.on('set gif', pin => sockets.setGif(pin, socket, io));

  socket.on('player chose card', data => sockets.playerChoseCard(data, socket, io));
  
  socket.on('judge chose card', data => sockets.getNextJudge(data, socket, io))

})

server.listen(4001, () => console.log(`server running on port ${4001}`));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});
