import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-wrapper">
      <div className="home-main">
        <h1>Memes against humanity</h1>
        <div className="buttons">
          <Link to="/create">
            <button className = 'button'>Create Game</button>
          </Link>
          <Link to="/join">
            <button>Join Game</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
