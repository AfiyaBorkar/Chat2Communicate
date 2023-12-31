import React from "react";
import "./MyStyle.css";

export default function SelfMessages({ props }) {
  return (
    <div
      className="self-message-container"
      style={{ color: "rgba(0, 0, 0, 0.54)" }}
    >
      <div className="self-text-content">
        <p className="con-lastmessage">{props.content}</p>
        <p className="self-timestamp">{props.timestamp}</p>
      </div>
    </div>
  );
}
