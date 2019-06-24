const express = require("express");
const app = express();
const server = require("http").Server(app);
const session = require("express-session");
var io = require("socket.io")(server);
const path = require("path");
const { Player } = require("./gameObjects/Player");
const { cards } = require("./gameObjects/cards");
const { player_cards } = require("./gameObjects/player_cards");

const {
  shuffle,
  distributeCards,
  getGif,
  remove_card_from_user,
  add_to_chosen_cards,
  replace_card
} = require("./helpers");

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
    socket.join(pin);
    if (!game.game_created) {
      game.game_created = true;

      //Shuffle the gifs
      game.cards = shuffle(cards);

      //Putting into variable because const
      var playerCards = shuffle([...player_cards]);

      // distribute cards
      distributeCards(game, playerCards);
      socket.emit("game created", { game });
    } else {
      socket.emit("game created", { game });
    }
  });

  socket.on('judge chose card', data => { 
    const { user, pin } = data;
    const game = allGames.filter(game => game.pin == pin)[0];

    const current_judge = game.users.filter(game_user => game_user.is_judge)[0];  
    
    replace_card(game, cards);
    const winner = game.users.filter(game_user => game_user.username === user)[0];
    winner.is_judge = true;
  
    current_judge.is_judge = false;

    if (game.current_player.username == winner.username) {
      game.current_player.is_judge = true;
    } else { 
       game.current_player.is_judge = false;
    }
  game.chosenCards = [];
    socket.to(pin).emit('change judges', game);
    socket.emit('change judges', game);
  })

  socket.on("player chose card", data => {
    const { card, user, pin } = data;

    const game = allGames.filter(game => game.pin == pin)[0];

    //Take the card out of players deck
    remove_card_from_user(user, card);

    //Add it to chosen cards
    game.chosenCards.push({ card, user: user.username });
    // add_to_chosen_cards(game, card);

    socket
      .to(pin)
      .emit("update chosen cards", { cards: game.chosenCards, user });

    //Replace player with a new card

    //Emit
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
    socket.emit("got gif", game.gif);
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
    gif: null,
    game_created: false
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
