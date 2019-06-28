import React, { Component } from "react";
import Axios from "axios";
import store, { SET_CURRENT_USER } from "../../store";
import "./Lobby.css";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("/lobby");

export default class Lobby extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      current_user: null
    };
  }

  componentDidMount = () => {
    this.pin = this.props.location.search.split("?")[1];

    socket.emit('get lobby', this.pin)

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

    socket.on('start game', () => this.props.history.push(`/play?${this.pin}`));

    socket.on("new player", user => {
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
          <h4>Click start when everyone has joined</h4>
          <div className="users">{users}</div>
          {this.state.current_user.is_judge && (
            <button className = 'start-button' onClick={this.startGame}>Start</button>
          )}
          <h5 style={{
            textAlign: 'center',
            width: '40vw',
            margin: '0 auto'
          }}>Are you a potential employer, friend, or just someone out there who wants to play a round?</h5>
          <h5>Click here to let me know you wanna play a round. I'll get on if I can!</h5>
          
        </div>
      )
    );
  }
}
