import React, { Component } from "react";
import Axios from "axios";
import store, { CREATE_GAME } from "../../store";
// import Game from "../../assets/Game";
// import Player from "../../assets/Player";
import Avatars from "../Avatars/Avatars";
// import constants from "../../Constants";
import "./CreateGame.css";
//In COmponent did mount, generate new game, show
//game ID/pin on screen, choose username
//Will also need to get all avatar URLS;

export default class CreateGame extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      avatar: ""
    };
  }

  handleUsername = username => {
    this.setState({
      username
    });
  };

  handleSubmit = () => {
    const { username, avatar } = this.state;
    store.dispatch({
      type: CREATE_GAME,
      payload: {
        username,
        avatar,
        is_judge: true
      }
    });
    Axios.post("/game", {
      username,
      avatar
    }).then(res => {
      store.dispatch({
        type: CREATE_GAME,
        payload: res.data
      });
    });
       this.props.history.push('/lobby');
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
