import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-main">
        <div>
          <h1>Memes against humanity</h1>
          <h3>NOTE: This site is currently in development.</h3>
        </div>
        <div className="buttons">
          <Link to="/create">
            <button className="button">Create Game</button>
          </Link>
          <Link to="/join">
            <button className="button">Join Game</button>
          </Link>
        </div>
        <h4>
          {" "}
          Want to play a round with the developer? Create a game, join the
          lobby, and you can let me know there.
        </h4>
      </div>
    </div>
  );
}
