module.exports = {
  shuffle: function shuffle(cards) {
    var currentIndex = cards.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = cards[currentIndex];
      cards[currentIndex] = cards[randomIndex];
      cards[randomIndex] = temporaryValue;
    }

    return cards;
  },
  distributeCards: function(game, cards) {
    for (let i = 0; i < game.users.length; i++) {
      for (let j = 0; j < 5; j++) {
        game.users[i].cards.push({
          card: cards[j],
          user: game.users[i].username
        });

        cards.splice(j, 1);
      }
    }
  },
  getGif(game, cards) {
    const index = Math.floor(Math.random() * cards.length);

    const gif = cards.splice(index, 1)[0];

    return gif;
  },
  remove_card_from_user: function(player, card) {
    const card_to_remove = player.cards.findIndex(
      player_card => player_card.card === card
    );

    player.cards.splice(card_to_remove, 1);
  },

  replace_cards: function(game) {
    for (let i = 0; i < game.users.length; i++) {
      if (game.users[i].cards.length == 4) {
        let random = Math.floor(Math.random() * game.player_cards.length);
        let newCard = game.player_cards.splice(random, 1)[0];

        game.users[i].cards.push({
          card: newCard,
          user: game.users[i].username
        });
      }
    }

    // return [...user.cards, {card: cards.splice( Math.floor(Math.random() * cards.length), 1), user: user.username}]
  },
  getCurrentGame: function(games, pin) {
    return games.filter(g => g.pin == pin)[0];
  },
  updateJudges: function(user, game) {
    const current_judge = game.users.filter(game_user => game_user.is_judge)[0];

    const winner = game.users.filter(
      game_user => game_user.username === user
    )[0];

    winner.is_judge = true;

    current_judge.is_judge = false;

    if (game.current_player.username == winner.username) {
      game.current_player.is_judge = true;
    } else {
      game.current_player.is_judge = false;
    }
  }
};
