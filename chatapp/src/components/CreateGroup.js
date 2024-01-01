

import React, { useState } from "react";
import chatgroup from "../icons/chat-group.png";
import "./MyStyle.css";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import {  useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toaster from "./Toaster";

function CreateGroup() {
  const LightTheme = useSelector((state) => state.themeKey);

  var userData = JSON.parse(localStorage.getItem("userData"));
  // console.log("Data from LocalStorage : ", userData);
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }
  const user = userData.data;
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = React.useState(false);
  const [groupstatus, setGroupStatus] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // console.log("User Data from CreateGroups : ", userData);

  const createGroup = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    const userData = JSON.parse(localStorage.getItem("userData"));
  
    const existingGroups = await axios.get("http://localhost:8080/chat/fetchGroups", config);
  
    if (existingGroups.data.some((group) => group.chatName === groupName)) {
      setGroupStatus({ msg: `Group "${groupName}" already exists. Choose a different name.`, key: Math.random() });
    } else {
      axios.post(
        "http://localhost:8080/chat/createGroup",
        {
          name: groupName,
          users: userData.data._id, // Use userData for the creator
        },
        config
      );
  
      setGroupStatus({ msg: `Created a ${groupName} Group`, key: Math.random() });
      nav("/app/groups");
    }
  };
  
  
  return (
    <>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you want to create a Group Named " + groupName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will create a create group in which you will be the admin and
              other will be able to join this group.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={() => {
                createGroup();
                handleClose();
              }}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="creategroup-container">
        <img
          src={chatgroup}
          alt="groupicon"
          style={{ height: "15rem", width: "15rem" }}
        />
        <div className="chat-input">
          <input
            className={`search-box `}
            placeholder="Type Group Name"
            style={{ height: "2rem", width: "100%",color:"black" }}
            onChange={(e) => {
              setGroupName(e.target.value);
            }}
          />
          <IconButton
            onClick={() => {
              handleClickOpen();
              // createGroup();
            }}
          >
            <DoneOutlineRoundedIcon />
          </IconButton>
          {
            groupstatus ? <Toaster key={groupstatus.key} message={groupstatus.msg}/> :null
          }

          
        </div>
      </div>

    </>
  );
}





export default CreateGroup;
