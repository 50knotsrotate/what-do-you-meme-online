import React, { Component } from "react";
import Axios from "axios";
import store, { CREATE_GAME } from "../../store";
import Avatars from "../Avatars/Avatars";
import "./CreateGame.css";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("/create");

export default class CreateGame extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      avatar: ""
    };
  }

  componentDidMount = () => {
    socket.on('game created', (game) => this.props.history.push(`/lobby?${game.pin}`));
  }

  handleUsername = username => {
    this.setState({
      username
    });
  };

  handleSubmit = () => {
    const { username, avatar } = this.state;
    socket.emit('create game', { username, avatar })
  };

  selectAvatar = avatar => {
    this.setState({
      avatar
    });
  };

    render() {
    return (
        <div className="create-wrapper">
            <h1>Choose your username</h1>
        <input
          onChange={e => this.handleUsername(e.target.value)}
          value={this.state.username}
          placeholder="Username"
        />
        <h2>Choose your avatar</h2>
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
