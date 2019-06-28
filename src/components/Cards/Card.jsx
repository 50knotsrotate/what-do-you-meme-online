import React from "react";
import './Cards.css';

export default function Card(props) {

    return (
      <div
        className = 'card'
          onClick={() => props.clicked(props.judge ? props.user : props.text)}
      >
      <h3>{props.text}</h3>
    </div>
  );
}
