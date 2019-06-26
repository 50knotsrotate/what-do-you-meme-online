import React, { Component } from "react";
import store, { UPDATE_GAME } from "../../store";
import './Game.css';
import socketIOClient from "socket.io-client";
import axios from "axios";
import Cards from "../Cards/Cards";
import { declareExportAllDeclaration } from "@babel/types";
const socket = socketIOClient();

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
      choseCard: false,
      player_cards: null
    };
  }

  is_judge = user => {
    return user.is_judge;
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
    socket.on("update chosen cards", data => {
      this.setState({
        chosenCards: data.cards
      });
    });

    socket.on("change judges", data => {
      const new_current_user = data.users.filter(
        user => user.username == this.state.current_user.username
      )[0];

      this.setState({
        current_user: new_current_user,
        cards: data.cards,
        choseCard: false,
        chosenCards: []
      });

      if (this.state.current_user.is_judge) {
        this.getGif();
      }
    });

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
        console.log(data);
        const {
          cards,
          chosenCards,
          game_finished,
          pin,
          users,
          gif,
          player_cards
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
          loaded: true,
          player_cards
        });

        if (this.is_judge(this.state.current_user)) {
          socket.emit("set gif", {
            pin: this.state.pin
          });
        }
      });
    });
  };

  submitCard = card => {
    if (!this.state.choseCard) {
      socket.emit("player chose card", {
        card,
        user: this.state.current_user,
        pin: this.state.pin
      });

      //Get the current user
      const player = this.state.current_user;

      //Find the card that was picked
      const index = player.cards.findIndex(
        player_card => player_card.card == card
      );

      //Remove it from that players cards
      const new_cards = player.cards.splice(index, 1);

      //And then replace that card with a new one
      //In order for that to happen, make a copy of all available cards
      const player_cards_copy = [...this.state.player_cards];

      const new_player_card = player_cards_copy.splice(
        Math.floor(Math.random() * this.state.player_cards.length)
      );

      this.setState({
        current_user: player,
        choseCard: true
      })
    }
  };

  judgeCard = user => {
    if (this.state.chosenCards.length === this.state.users.length - 1) {
      socket.emit("judge chose card", { user, pin: this.state.pin });
    } else { 
      alert('Hang on!!! not everyone has chosen a card yet.');
    }
  };

  render() {
    return (
      this.state.loaded && (
        <div className = 'game-wrapper'>
          {this.state.current_user.is_judge && (
            <h1>{this.state.current_user.username}, you are the judge!</h1>
          )}
          <img src={this.state.gif} alt="gif" className='gif'/>
          {!this.is_judge(this.state.current_user) ? (
            <Cards
              cards={this.state.current_user.cards}
              clicked={this.submitCard}
              judge={false}
            />
          ) : (
              <Cards
                cards={this.state.chosenCards}
                clicked={this.judgeCard}
                judge={true}
              />
          )}
        </div>
      )
    );
  }
}
