const express = require("express");
const app = express();
const server = require("http").Server(app);
var io = require("socket.io")(server);
const path = require("path");
const { Player } = require("./gameObjects/Player");
const { cards } = require('./gameObjects/cards');

app.use(express.json());

const allGames = [];

io.on("connection", socket => {
  console.log("a user has connected");

  socket.on("socket join", data => {
    const { user, pin } = data;
    const game = allGames.filter(game => game.pin == pin)[0];
    socket.join(pin);
    io.in(pin).emit("new user", game.users);
  });

  socket.on("add player", data => {
    const { pin, username, avatar } = data;
    const game = allGames.filter(game => game.pin == pin)[0];
    if (game) {
      const player = new Player(username, avatar, false);
      game.users.push(player);
    } else {
      socket.emit("error"); //TODO: proper error handling
    }
  });

  socket.on("disconnect", socket => {
    console.log("A user has left");
  });

  socket.on("start", ({ pin }) => {
    io.in(pin).emit("start game");
  });
});

app.post("/game", (req, res) => {
  //make a new player object with is_judge set to true because this person created the game
  const { avatar, username } = req.body;
  const player = new Player(username, avatar, true);
  var pin = Math.floor(Math.random() * 100000);

  while (allGames.indexOf(game => game.pin === pin) !== -1) {
    pin = Math.floor(Math.random() * 100000);
  }
  const newGame = {
    users: [player],
    cards: [...cards],
    chosenCards: [],
    game_finished: false,
    pin
  };
  allGames.push(newGame);
  res.status(200).send(newGame);
});

app.get("/game", (req, res) => {
  //All info needed to get a game, add a player, and return it
  const { pin } = req.query;
  const game = allGames.filter(game => game.pin == pin)[0];

  if (game) {
    res.status(200).send(game);
  } else {
    res.status(400).send("No game");
  }
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../build/index.html"));
// });  For production

server.listen(4000, () => console.log(`server running on port ${4000}`));
