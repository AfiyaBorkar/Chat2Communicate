import React, { useState, useEffect,useContext } from "react";
import "./MyStyle.css";
import { useSelector } from "react-redux";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { myContext } from "./MainContainer";
import RefreshIcon from "@mui/icons-material/Refresh";


// import { useDispatch } from "react-redux";

export default function Conversation() {
  const [conversation, setConversation] = useState([]);
  const [originalConversations, setOriginalConversations] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);

  // const [searchValue, setSearchValue] = useState("");
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const LightTheme = useSelector((state) => state.themeKey);

  let UserData = JSON.parse(localStorage.getItem("userData"));
  if (!UserData) {
    console.log("User not authorized");
    navigate("/");
  }

  const handleSearch = (e) => {
    const inputValue = e.target.value.toLowerCase();
    // setSearchValue(inputValue);

    if (inputValue.trim() === "") {
      setConversation(originalConversations);
    } else {
      const filteredConversations = originalConversations.filter((conv) => {
        const user1 =
          conv.users && conv.users.length > 0 ? conv.users[0] : null;
        const user2 =
          conv.users && conv.users.length > 1 ? conv.users[1] : null;
        const grp = conv.chatName;

        if (
          (user1 && user1.name.toLowerCase().includes(inputValue)) ||
          (user2 && user2.name.toLowerCase().includes(inputValue)) ||
          grp.toLowerCase().includes(inputValue)
        ) {
          return true;
        }
        return false;
      });
      setConversation(filteredConversations);
    }
  };
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${UserData.data.token}`,
      },
    };

    axios
      .get("http://localhost:8080/chat/", config)
      .then((response) => {
        // console.log("conversation data fetch", response.data);
        setOriginalConversations(response.data);
        setConversation(response.data);
      })
      .catch((error) => {
        console.error("Error fetching conversation data:", error);
        // Handle the error as needed
      });
  }, [UserData.data.token,refresh]);

  return (
    <>
      <div
        className={`conversationslist  ${LightTheme ? "" : "dark"}`}
        style={{ overflow: "auto" }}
      >
        <div
          className={`c-search  ${LightTheme ? "" : "dark"}`}
          style={{
            color: `${LightTheme ? "#0000008a" : "whitesmoke !important"}`,
          }}
        >
          <IconButton>
            <SearchIcon
              style={{ color: `${LightTheme ? " " : "whitesmoke"}` }}
            />
          </IconButton>

          <input
            className={`search-box  ${LightTheme ? "" : "dark"}`}
            placeholder="Search"
            onChange={handleSearch}
          ></input>
           <IconButton
            className={"icon" + (LightTheme ? "" : " dark")}
            style={{ color: `${LightTheme ? " " : "whitesmoke"}` }}
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            <RefreshIcon />
          </IconButton>
        </div>

        {Array.isArray(conversation) &&
          conversation.map((conversation, index) => {
            const isGroupChat = conversation.isGroupChat === true;

            let displayName = "";
            if (isGroupChat) {
              displayName = conversation.chatName;
            } else {
              const otherUser = conversation.users.find(
                (u) => u._id !== UserData.data._id
              );
              displayName = otherUser?.name || "";
            }

            if (!displayName) {
              // console.log("Skipping conversation:", conversation);
              return <div key={index}></div>;
            }

            return (
              <div
                key={index}
                className="conversation-container"
                onClick={() => {
                  navigate(`/app/chat/${conversation._id}&${displayName}`);
                }}
              >
                <p className={"con-icon"}>
                  {isGroupChat ? "G" : displayName[0]}
                </p>
                <p className={"con-title"}>{displayName}</p>
                <p className="con-lastmessage">
                  {conversation.latestmessage
                    ? conversation.latestmessage.content
                    : "No previous Messages, click here to start a new chat"}
                </p>
              </div>
            );
          })}
      </div>
    </>
  );
}
