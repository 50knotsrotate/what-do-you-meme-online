const { Player } = require("./gameObjects/Player");
const allGames = [];

module.exports = {
  createGame: ({ username, avatar }, socket) => {
    var pin = Math.floor(Math.random() * 100000);
    const player = new Player(username, avatar, true);
    socket.join(pin);
    while (allGames.indexOf(game => game.pin === pin) !== -1) {
      pin = Math.floor(Math.random() * 100000);
    }
    const newGame = {
      users: [player],
      cards: null,
      chosenCards: [],
      game_finished: false,
      pin,
      current_player: player,
      gif: null,
      game_created: false
    };

        allGames.push(newGame);
    return;
  }
};
