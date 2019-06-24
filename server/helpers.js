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
        const random = Math.floor(Math.random() * cards.length)
        game.users[i].cards.push({
          card: cards[random],
          user: game.users[i].username
        })
        cards.splice(random, 1);
      }
    }
  },
  getGif(game, cards) {

    const index = Math.floor(Math.random() * cards.length);

    const gif = cards.splice(index, 1)[0];

    return gif;
  },
  remove_card_from_user: function(player, card) { 
    // const { cards } = player;

    const card_to_remove = player.cards.findIndex(player_card => player_card.card === card);

    player.cards.splice(card_to_remove , 1);
  },
  replace_card: function (game, cards) { 

    for (let i = 0; i < game.users.length; i++) { 
      if (game.users[i].cards.length != 5) { 
        game.users[i].cards.push(cards[Math.floor(Math.random() * cards.length)])
      }
    }
  }
};
