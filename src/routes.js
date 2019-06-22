import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from './components/Home/Home'
import CreateGame from "./components/CreateGame/CreateGame";
import Lobby from './components/Lobby/Lobby';
import JoinGame from './components/JoinGame/JoinGame';
import Game from './components/Game/Game'
// import Lobby from "../Components/Lobby/Lobby";
// import JoinGame from "../Components/JoinGame/JoinGame";

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/create" component={CreateGame} />
    <Route path="/lobby" component={Lobby} />
    <Route path="/join" component={JoinGame} />
    <Route path='/play' component={Game} />
  </Switch>
);
