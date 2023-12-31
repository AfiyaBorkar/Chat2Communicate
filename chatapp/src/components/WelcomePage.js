import React from "react";
import logo from "../icons/bigchat.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const nav = useNavigate();
  const LightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData);
  if (!userData) {
    console.log("User not Auntenticated");
    nav("/");
  }

  return (
    <div className="welcome-container">
      <img src={logo} alt="logo" />
      <p
        className={`welcome-text `}
        style={{ color: `${LightTheme ? " " : "dark"}` }}
      >
        Welcome to Chat2Communicate
      </p>
      <p>Hi, {userData.data.name} 👋</p>
    </div>
  );
}
