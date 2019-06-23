const express = require("express");
const app = express();
const server = require("http").Server(app);
const session = require("express-session");
var io = require("socket.io")(server);
const path = require("path");
const { Player } = require("./gameObjects/Player");
const { cards } = require("./gameObjects/cards");
const { player_cards } = require("./gameObjects/player_cards");
const { shuffle, distributeCards, getGif } = require("./helpers");

app.use(express.json());
app.use(
  session({
    secret: "shhh, its a secret!"
  })
);
const allGames = [];

io.on("connection", socket => {
  console.log("a user has connected");

  socket.on("socket join", data => {
    const { pin } = data;
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
      socket.emit("new player", game);
    } else {
      socket.emit("error"); //TODO: proper error handling
    }
  });

  socket.on("create game", data => {
    const { pin } = data;
    const game = allGames.filter(game => game.pin == pin)[0];
    socket.join(data.pin)

    //Shuffle the cards
    game.cards = [...shuffle(cards)];

    //Putting into variable because const
    var playerCards = [...shuffle(player_cards)];

    // distribute cards
    distributeCards(game, playerCards);
    socket.emit("game created", { game });
  });

  socket.on("get gif", data => {
    const { pin } = data;
    const game = allGames.filter(game => game.pin == pin)[0];
    io.in(pin).emit("got gif", game.gif);
  });

  socket.on("set gif", data => {
    const { pin } = data;
    const game = allGames.filter(game => game.pin == pin)[0];
    game.gif = getGif(game, game.cards);
    socket.emit('got gif', game.gif)
      socket.to(pin).emit("got gif", game.gif);
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
  req.session.user = username;
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
    pin,
    current_player: player,
    gif: null
  };
  allGames.push(newGame);
  res.status(200).send(newGame);
});

app.get("/game", (req, res) => {
  //All info needed to get a game, add a player, and return it
  if (req.query.pin) {
    const { pin, username } = req.query;
    const game = allGames.filter(game => game.pin == pin)[0];
    req.session.user = username;
    if (game) {
      res.status(200).send(game);
    } else {
      res.status(400).send("No game");
    }
  } else {
    res.status(200).send(req.session.user);
  }
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../build/index.html"));
// });  For production

server.listen(4000, () => console.log(`server running on port ${4000}`));
