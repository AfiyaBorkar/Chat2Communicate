import React, { useState } from "react";
import "./MyStyle.css";
import logo from "../icons/bigchat.png";
import pic from "../icons/user.png";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Toaster from "./Toaster";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [Data, setData] = useState({ name: "", email: "", password: "" });
  const [SignUpStatus, setSignUpStatus] = useState("");
  const [loading, setloading] = useState(false);

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const changeHandler = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };

  const SignUpHandler = async (e) => {
    e.preventDefault();
    setloading(true);

    // console.log(Data);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        "http://localhost:8080/user/register",
        {
          name: Data.name,
          email: Data.email,
          password: Data.password,
        },
        config
      );
      // console.log(response);
      setSignUpStatus({ msg: "Success", key: Math.random() });
      navigate("/app/welcome");
      localStorage.setItem("userData", JSON.stringify(response.data));
      setloading(false);
    } catch (error) {
      console.log(error);

      if (error.response && error.response.status === 401) {
        setSignUpStatus({
          msg: "Username already exists",
          key: Math.random(),
        });
      } else if (error.response && error.response.status === 402) {
        setSignUpStatus({
          msg: "User with email already exists",
          key: Math.random(),
        });
      } else if (error.response && error.response.status === 400) {
        setSignUpStatus({
          msg: "Try registering again",
          key: Math.random(),
        });
      } else if (error.response && error.response.status === 405) {
        setSignUpStatus({
          msg: "All fields should be filled",
          key: Math.random(),
        });
      } else {
        console.error("Unexpected error:", error);
        setSignUpStatus({
          msg: "Unexpected error occurred",
          key: Math.random(),
        });
      }

      setloading(false);
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="login-container">
        <div className="image-conatiner">
          <img src={logo} alt="logo" className="login-img" />
          <p>Chat2Communicate</p>
        </div>

        <div className="login-box">
          <img src={pic} alt="pic" />
          <p className="logintext">SignUp </p>
          <TextField
            id="outlined-required"
            label="UserName"
            variant="outlined"
            onChange={changeHandler}
            name="name"
          />
          <TextField
            id="outlined-required"
            label="Email"
            variant="outlined"
            onChange={changeHandler}
            name="email"
          />
          <TextField
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            onChange={changeHandler}
            name="password"
          />
          <Button variant="outlined" onClick={SignUpHandler}>
            SignUp
          </Button>
          <h6 className="logintext">
            Already Have Account?{" "}
            <a href="/" onClick={handleLoginClick}>
              Login
            </a>
          </h6>
          {SignUpStatus ? (
            <Toaster key={SignUpStatus.key} message={SignUpStatus.msg} />
          ) : null}
        </div>
      </div>
    </>
  );
}
