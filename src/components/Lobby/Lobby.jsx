import React, { Component } from "react";
import Axios from "axios";
import store from "../../store";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("http://localhost:4000");

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
      
      socket.on('start game', () => { 
          this.props.history.push('/play');
      })
    };
    
    startGame = () => { 
        socket.emit('start', {pin: this.state.pin})
    }
  render() {
    const game_pin = this.state.pin || "Setting up lobby...";
    const users = this.state.users.map(user => {
      return <h1>{user.username}</h1>;
    });
    return (
      this.state.current_user && (
        <div>
          <h1>GAME PIN: {game_pin}</h1>
          {users}
                {this.state.current_user.is_judge && <button onClick={this.startGame}>Start</button>}
        </div>
      )
    );
  }
}
