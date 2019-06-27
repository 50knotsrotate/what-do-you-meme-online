const { Player } = require("./gameObjects/Player");
const { cards } = require("./gameObjects/cards");
const { player_cards } = require("./gameObjects/player_cards");
const {
  shuffle,
  distributeCards,
  getGif,
  remove_card_from_user,
  add_to_chosen_cards,
  replace_card,
  getCurrentGame,
  updateJudges
} = require("./helpers");
const allGames = [];

module.exports = {
  createGame: ({ username, avatar }, socket) => {
    var pin = Math.floor(Math.random() * 100000);

    const player = new Player(username, avatar, true);

    player.socket_id = socket.id.split("#")[1];

    while (allGames.indexOf(game => game.pin === pin) !== -1) {
      pin = Math.floor(Math.random() * 100000);
    }

    const game = {
      users: [player],
      cards: null,
      chosenCards: [],
      game_finished: false,
      pin,
      current_player: player,
      gif: null,
      game_created: false
    };

    allGames.push(game);

    socket.emit("game created", game);

    return;
  },

  getLobby: (pin, socket, io) => {
    const game = getCurrentGame(allGames, pin);

    socket.emit("got lobby", game); //Only want to emit this to the client, not everyone in room.
  },
  addPlayer: ({ username, avatar, pin }, socket, io) => {
    const game = getCurrentGame(allGames, pin);

    const player = new Player(username, avatar, false);

    player.socket_id = socket.id.split("#")[1];

    game.users.push(player);

    io.of("/lobby").emit("new player", player);
  },
  getGame: (pin, socket, io) => {
    const game = getCurrentGame(allGames, pin);
    if (!game.game_created) {
      game.game_created = true;

      //Shuffle the gifs. Need to make copy so multiple games can happen at once
      const game_cards = cards.slice();

      game.cards = shuffle(game_cards);

      const playerCards = player_cards.slice();

      //Putting into variable because const
      game.player_cards = shuffle(playerCards);

      //distribute cards
      distributeCards(game, game.player_cards);

      //Need to send socket id up to client so I can find out who the current user is.
      //Each player object has a socket_id which corresponds to its socket
      //Sure, I could have done this with sessions, but I wanted to make this without
      //as a challenge >:)
      socket.emit("game created", {
        game,
        socket_id: socket.id.split("#")[1]
      });
    } else {
      socket.emit("game created", {
        game,
        socket_id: socket.id.split("#")[1]
      });
    }
  },

  setGif: (pin, socket, io) => {
    const game = getCurrentGame(allGames, pin.pin); //TODO: Find out why pin is coming in as object instead of string

    game.gif = getGif(game, game.cards);

    io.of("/game").emit("got gif", game.gif);
  },

  playerChoseCard: (data, socket, io) => {
    const { card, username, pin } = data;

    const game = getCurrentGame(allGames, pin);

    const user = game.users.filter(u => u.username == username)[0];

    //Take the card out of players deck
    // remove_card_from_user(user, card);

    const card_to_remove = user.cards.findIndex(
      player_card => player_card.card === card
    );

    user.cards.splice(card_to_remove, 1);

    // replace_card(game, game.player_cards);

    //Add it to chosen cards
    game.chosenCards.push({ card, user: user.username });

    io.of("/game").emit("update chosen cards", {
      cards: game.chosenCards,
      user
    });
  },
  getNextJudge: (data, socket, io) => {
    const { user, pin } = data;

    const game = getCurrentGame(allGames, pin);

    updateJudges(user, game);

    // const current_judge = game.users.filter(game_user => game_user.is_judge)[0];

    // const winner = game.users.filter(
    //   game_user => game_user.username === user
    // )[0];

    // winner.is_judge = true;

    // current_judge.is_judge = false;

    // let random = Math.floor(Math.random() * game.player_cards.length);

    // let newCard = game.player_cards.splice(random, 1)[0];

    // for (let i = 0; i < game.users.length; i++) {
    //   if (game.users[i].cards.length != 5) {
    //     game.users[i].cards.push({ card: newCard, user });
    //   }
    // }

    // if (game.current_player.username == winner.username) {
    //   game.current_player.is_judge = true;
    // } else {
    //   game.current_player.is_judge = false;
    // }
    game.chosenCards = [];

    io.of("/game").emit("change judges", game);
  }
};
