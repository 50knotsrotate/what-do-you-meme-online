import React, { Component } from "react";
import Avatars from "../Avatars/Avatars";
import "./JoinGame.css";
import store, { UPDATE_GAME } from "../../store";
import socketIOClient from "socket.io-client";
import { Socket } from "dgram";
const socket = socketIOClient("/join");

export default class JoinGame extends Component {
  constructor() {
    super();

    this.state = {
      pin: "",
      avatar: "",
      username: ""
    };
  }

  handlePin = pin => {
    this.setState({
      pin
    });
  };

  selectAvatar = avatar => {
    this.setState({
      avatar
    });
  };

  handleSubmit = () => {
    socket.emit('add player', this.state)
    this.props.history.push( `/lobby?${this.state.pin}`);
  };

  handleUsername = username => {
    this.setState({
      username
    });
  };

  render() {
    return (
      <div className='join-container'>
        <h1>Join Game</h1>
        <h2>Enter pin</h2>
        <div className = 'join-buttons'>
          <input
            onChange={e => this.handlePin(e.target.value)}
            value={this.state.pin}
          />
          <h2>Enter username</h2>
          <input
            onChange={e => this.handleUsername(e.target.value)}
            value={this.state.username}
            placeholder="Username"
          />
        </div>
        <h1>Select avatar</h1>
        <Avatars
          selected={this.state.avatar}
          selectAvatar={this.selectAvatar}
        />

        <button
          disabled={this.state.username.length < 4}
          type="submit"
          onClick={this.handleSubmit}
        >
          Go to lobby
        </button>
      </div>
    );
  }
}
