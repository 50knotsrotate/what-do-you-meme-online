const { Player } = require("./gameObjects/Player");
const allGames = [];

module.exports = {
  createGame: ({ username, avatar }, socket) => {
    var pin = Math.floor(Math.random() * 100000);

    const player = new Player(username, avatar, true);
    socket.join(pin.toString());

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
    const index = allGames.findIndex(game => game.pin == pin);

    const game = allGames[index];

      io.to(game.pin.toString()).emit("got lobby", game);
      socket.emit('got lobby', game)
  },
  addPlayer: ({ username, avatar, pin }, socket, io) => {
    const game = allGames.filter(g => g.pin == pin)[0];

    const player = new Player(username, avatar, false);

    socket.join(pin.toString());

    game.users.push({
      username,
      avatar
    });
  }
};
