import React from "react";

export default function Card(props) {

    return (
    <div
          style={{
              height: "300px",
              width: "270px",
              backgroundColor: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              border: "2px solid white"
          }}
          onClick={() => props.clicked(props.judge ? props.user : props.text)}
      >
      <h3>{props.text}</h3>
    </div>
  );
}
