import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from './components/Home/Home'
// import CreateGame from "../Components/CreateGame/CreateGame";
// import Lobby from "../Components/Lobby/Lobby";
// import JoinGame from "../Components/JoinGame/JoinGame";

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    {/* <Route path="/create" component={CreateGame} />
    <Route path="/:pin/lobby" component={Lobby} />
    <Route path="/join" component={JoinGame} /> */}
  </Switch>
);
