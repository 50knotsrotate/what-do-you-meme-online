import React, { Component } from "react";
import Axios from "axios";
import store, { SET_CURRENT_USER } from "../../store";
import "./Lobby.css";
import socketIOClient from "socket.io-client";
const socket = socketIOClient();

export default class Lobby extends Component {
  constructor() {
    super();
    this.state = {
      pin: null,
      users: [],
      current_user: null
    };
  }

  componentDidMount = () => {
    store.subscribe(() => {
      const reduxState = store.getState();
      const game = reduxState.payload;
      this.setState({
        pin: game.pin,
        users: game.users
      });

      this.setState({
        current_user: this.state.users[this.state.users.length - 1]
      });

      socket.emit("socket join", {
        pin: game.pin,
        current_user: this.state.users[this.state.users.length - 1]
      });

    });

    socket.on("new user", data => {
      this.setState({
        users: data
      });
    });

    socket.on("start game", () => {
      this.props.history.push("/play");
    });
  };

  startGame = () => {
    const { pin } = this.state;
  
    socket.emit("start", { pin });
  };

  render() {
    const game_pin = this.state.pin || "Setting up lobby...";
    const users = this.state.users.map(user => {
      return (
        <div className="user">
          <h1>{user.username}</h1>
          <img
            src={user.avatar.url}
            className="user-avatar"
            alt="user avatar"
          />
        </div>
      );
    });
    return (
      this.state.current_user && (
        <div className="lobby-main">
          <h1>GAME PIN: {game_pin}</h1>
          <h3>Waiting for users...</h3>
          <div className="users">{users}</div>
          {this.state.current_user.is_judge && (
            <button onClick={this.startGame}>Start</button>
          )}
        </div>
      )
    );
  }
}
