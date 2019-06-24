import React, { Component } from "react";
import store, { UPDATE_GAME } from "../../store";
import socketIOClient from "socket.io-client";
import axios from "axios";
import Cards from "../Cards/Cards";
import { declareExportAllDeclaration } from "@babel/types";
const socket = socketIOClient("http://localhost:4000");

export default class Game extends Component {
  constructor() {
    super();
    this.state = {
      cards: null,
      chosenCards: [],
      game_finished: false,
      pin: null,
      users: null,
      current_user: null,
      gif: null,
      loaded: false,
      choseCard: false
    };
  }

  is_judge =  user  => {
    return user.is_judge
  };

  set_current_player = username => {
    return this.state.users.filter(user => user.username === username)[0];
  };

  getGif = () => {
    socket.emit("set gif", {
      pin: this.state.pin
    });
  };

  componentDidMount = () => {
    socket.on('update chosen cards', data => { 
  
      this.setState({
        chosenCards: data.cards
      })
    })

    socket.on('change judges', data => { 
      const new_current_user = data.users.filter(user => user.username == this.state.current_user.username)[0]


        this.setState({
          current_user: new_current_user,
          cards: data.cards,
          choseCard: false,
          chosenCards: []
        })

      if (this.state.current_user.is_judge) { 
        this.getGif()
      }
    })

    socket.on("got gif", data => {
      this.setState({
        gif: data.url
      });
    });

    axios.get("/game").then(res => {
      const redux = store.getState();
      const { pin } = redux.payload;
      socket.emit("create game", { pin });
      socket.on("game created", data => {
        const {
          cards,
          chosenCards,
          game_finished,
          pin,
          users,
          gif
        } = data.game;

        const username = res.data;
        const current_player = users.filter(
          user => user.username == username
        )[0];

        this.setState({
          cards,
          chosenCards,
          game_finished,
          pin,
          users,
          current_user: current_player,
          loaded: true
        });

        if (this.is_judge(this.state.current_user)) {
          socket.emit("set gif", {
            pin: this.state.pin
          });
        }
      });
    });
  };

  submitCard = (card) => {
    if (!this.state.choseCard) {
      socket.emit('player chose card', { card, user: this.state.current_user, pin: this.state.pin })
      const player = this.state.current_user;

      const index = player.cards.findIndex(player_card => player_card.card == card);
      const new_cards = player.cards.splice(index, 1);

      this.setState({
        current_user: player,
        choseCard: true
      })
    }
  };

judgeCard = user => { 
  socket.emit('judge chose card', { user, pin: this.state.pin });
  }

  render() {
    return (
      this.state.loaded && (
        <div>
          <img src={this.state.gif} alt="gif" />
          {!this.is_judge(this.state.current_user) ? (
            <Cards
              cards={this.state.current_user.cards}
              clicked={this.submitCard}
              judge={false}
              />
          ) :
            <div>
              <h1>You are the judge!</h1>
            <Cards
                cards={this.state.chosenCards}
                clicked={this.judgeCard}
                judge={true}
              />
              </div>
          }

        </div>
      )
    );
  }
}
