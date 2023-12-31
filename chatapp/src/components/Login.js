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

export default function Login() {
  const navigate = useNavigate();

  const [Data, setData] = useState({ name: "", password: "" });
  const [LoginStatus, setLoginStatus] = useState("");
  const [loading, setloading] = useState(false);

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const changeHandler = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setloading(true);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        "http://localhost:8080/user/login",
        {
          name: Data.name,
          password: Data.password,
        },
        config
      );

      // console.log(response);

      // Set the Authorization header for future requests
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;

      setLoginStatus({ msg: "Success", key: Math.random() });
      navigate("/app/welcome");
      localStorage.setItem("userData", JSON.stringify(response.data));
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 404) {
        setLoginStatus({
          msg: "Invalid Username or Password",
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

          <p className="logintext">Login </p>
          <TextField
            id="outlined-required"
            label="UserName"
            variant="outlined"
            onChange={changeHandler}
            name="name"
          />
          <TextField
            onChange={changeHandler}
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            name="password"
          />
          <Button variant="outlined" onClick={loginHandler}>
            Login
          </Button>

          <h6 className="logintext">
            Don't have an account?
            <a href="/" onClick={handleLoginClick}>
              Create Account
            </a>
          </h6>
          {LoginStatus ? (
            <Toaster key={LoginStatus.key} message={LoginStatus.msg} />
          ) : null}
        </div>
      </div>
    </>
  );
}
