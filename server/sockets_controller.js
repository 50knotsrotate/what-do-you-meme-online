const { Player } = require("./gameObjects/Player");
const { cards } = require("./gameObjects/cards");
const { player_cards } = require("./gameObjects/player_cards");
const {
  shuffle,
  distributeCards,
  getGif,
  remove_card_from_user,
  add_to_chosen_cards,
  replace_cards,
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

      const game_cards = cards.slice();

      game.cards = shuffle(game_cards);

      const playerCards = player_cards.slice();

      game.player_cards = shuffle(playerCards);

      distributeCards(game, game.player_cards);
    }

    socket.emit("game created", {
      game,
      socket_id: socket.id.split("#")[1]
    });
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

    remove_card_from_user(user, card);

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

    game.chosenCards = [];

    updateJudges(user, game);

    replace_cards(game, cards);

    io.of("/game").emit("change judges", game);
  }
};
