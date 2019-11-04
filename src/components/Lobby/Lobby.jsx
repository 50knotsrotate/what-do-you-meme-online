import React, { Component } from "react";
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

    socket.emit('get lobby', this.pin);

    socket.on('message sent', () => { 
      alert('I got your message. If I can get on to play a round, I will :] If I am not in the lobby in 5, try again later. I\'ll happily join if I am not busy.')
    })

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

  sendMessage = () => { 
    const { username } = this.state.current_user
    socket.emit('send message', {username, pin: this.pin})
  }

  startGame = () => {
    const { pin } = this.state;

    socket.emit("start", { pin });
  };

  render() {
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
            <button className="start-button" onClick={this.startGame}>
              Start
            </button>
          )}

          <h5 className = 'message-text'>
            Click <span style={{ cursor: 'pointer', textDecoration: 'underline', textAlign: 'center'}} onClick = {this.sendMessage}>here</span> to let me know you wanna play a round.
            I'll get on if I can!
          </h5>
        </div>
      )
    );
  }
}
