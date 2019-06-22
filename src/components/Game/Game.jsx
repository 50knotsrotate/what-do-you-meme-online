import React, { Component } from "react";
import store, { UPDATE_GAME } from "../../store";
import socketIOClient from "socket.io-client";
import axios from "axios";
const socket = socketIOClient("http://localhost:4000");

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      cards: null,
      chosenCards: null,
      game_finished: false,
      pin: null,
      users: null,
      current_user: null,
      gif: null
    };
  }

  is_judge = username => { 

     const isJudge = this.state.users.filter(user => user.username == username)[0].is_judge
     return isJudge
  }

  getGif = () => { 
    socket.emit("set gif", { pin: this.state.pin });
  }

  componentDidMount = () => {

    socket.on('got gif', data => { 
      this.setState({
        gif: data.url
      })
    })
    
    axios.get("/game").then(res => {
      const redux = store.getState();
      const { pin } = redux.payload;
      socket.emit("create game", { pin });
      socket.on("game created", data => {
        const { cards, chosenCards, game_finished, pin, users, gif } = data.game;
        this.setState({
          cards,
          chosenCards,
          game_finished,
          pin,
          users,
          current_user: res.data
        });
     
        if (this.is_judge(this.state.current_user)) {
          socket.emit('set gif', { pin: this.state.pin })
        }
      });
    });
  };

  render() {
    return (
      this.state.cards && (
        <div>
          {console.log(this.state)}
          <img
            src={this.state.gif}
            alt="gif"
          />
          <button onClick={this.getGif}>Click me!</button>
          <h1>{this.state.current_user}</h1>
        </div>
      )
    );
  }
}
