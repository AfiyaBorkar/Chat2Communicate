import React from "react";
import "./MyStyle.css";

export default function OthersMessages({ props }) {
  return (
    <div
      className="other-message-container"
      style={{ color: "rgba(0, 0, 0, 0.54)" }}
    >
      <p className="con-icon">{props.sender.name[0]}</p>
      <div className="other-text-content">
        <p className="con-title" id="UserName">
          {props.sender.name}
        </p>
        <p className="con-lastmessage">{props.content}</p>
        <p className="self-timestamp">{props.timestamp}</p>
      </div>
    </div>
  );
}
