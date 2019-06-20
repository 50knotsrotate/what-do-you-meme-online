import React, { Component } from "react";
import Avatars from "../Avatars/Avatars";
import Axios from "axios";
import store, { UPDATE_GAME } from "../../store";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:4000");

export default class JoinGame extends Component {
  constructor() {
    super();

    this.state = {
      pin: "",
      avatar: "",
      username: ""
    };
  }

  componentDidMount = () => {
    socket.on("new player", data => {
      console.log(data);
    });
  };

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
    const { username, avatar, pin } = this.state;

    socket.emit("add player", { username, avatar, pin });
      Axios.get(`/game?pin=${pin}`).then(res => {
          console.log('store from join game below');
        console.log(res.data)
      store.dispatch({
        type: UPDATE_GAME,
        payload: res.data
      });
      });
      this.props.history.push("/lobby");
  };

  handleUsername = username => {
    this.setState({
      username
    });
  };

  render() {
    return (
      <div>
        <h1>Join Game</h1>
        <h2>Enter pin</h2>
        <input
          onChange={e => this.handlePin(e.target.value)}
          value={this.state.pin}
        />
        <input
          onChange={e => this.handleUsername(e.target.value)}
          value={this.state.username}
          placeholder="Username"
        />
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