import React from "react";
import avatars from "../../assets/avatars";
import "./Avatars.css";

export default function Avatars(props) {
  const playerAvatars = [...avatars].map((avatar, i) => {
    return (
      <img
        src={avatar.url}
        alt="player avatar"
        className={props.selected.url === avatar.url ? "selected" : "avatar"}
        onClick={() => props.selectAvatar(avatar)}
      />
    );
  });
  return playerAvatars;
}
