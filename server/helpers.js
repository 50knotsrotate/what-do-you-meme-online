module.exports = {
  shuffle: function shuffle(cards) {
    //Taken from stack overflow cause I am lazy
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
      if (!game.users[i].is_judge) {
        game.users[i].cards = cards.splice(0, 5);
      }
    }
    return game; //Can we get rid of return?
  },
  getGif(game, cards) {
    //Select random card
    const index = Math.floor(Math.random() * cards.length);

    //Take it out
    const gif = cards.splice(index, 1)[0];

    return gif;
  }
};
