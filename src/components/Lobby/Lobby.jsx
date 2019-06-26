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
      users: [],
      current_user: null
    };
  }

  componentDidMount = () => {
    const pin = this.props.location.search.split("?")[1];
    // socket.emit('new player')

    socket.emit("get lobby", pin);

    //Socket listeners
    //When a new player joins the lobby
    socket.on("got lobby", ({ users }) => {
      if (!this.startGame.current_user) {
        const new_user = users[users.length - 1];
        this.setState({
          users,
          current_user: new_user
        });
      }
    });
    socket.on("new player", user => {
      alert("new player");
      this.setState({
        users: [...this.state.users, user]
      });
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
          <h1>GAME PIN: {this.props.location.search.split("?")[1]}</h1>
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
