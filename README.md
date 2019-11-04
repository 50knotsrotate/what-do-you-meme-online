# www.devdispatch.com,  An online multiplayer card game similar to "What do you meme", with GIFS instead of pictures. 

## I'll attempt to give you a walkthrough of what this game is, and how it works. But first, a few things.

### Why is it called devDispatch... What does that have to do with a card game?
#### Well... I had originally purchased the domain to host a code bootcamp team project, but we never actually got around to hosting it. Since it was sitting dormant, I decided to use it for this, my first post-bootcamp project.


### How does the game work?
#### After a game is started(I'll talk more about how that works in a bit), each user is presented with the same GIF. In addition to a GIF, each user(except the "judge") is given 5 cards with different text (Some examples: When your crush becomes single, When you didnt raise your hand but the teacher called on you anyway, When you realize the song you always skip is actually fire'), and each user that is not the judge picks which card they think goes best with the provided GIF. As players pick their card, the "judge" sees the cards the players picked (In real time with the help of sockets), and picks which card fits best with the GIF. Once the judge chooses the best card, the player who picked that card then becomes the judge, and this repeats until there are no cards left. 
