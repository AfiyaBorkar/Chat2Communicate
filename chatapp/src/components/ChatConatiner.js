import { IconButton } from "@mui/material";
import React, { useContext, useEffect, useState,useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import "./MyStyle.css";
import OthersMessages from "./OthersMessages";
import SelfMessages from "./SelfMessages";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { myContext } from "./MainContainer";
import Skeleton from "@mui/material/Skeleton";
// import { useRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { io } from "socket.io-client";
import axios from "axios";

export default function ChatConatiner() {
  const LightTheme = useSelector((state) => state.themeKey);
  const dyParams = useParams();
  const nav = useNavigate();
  const [chat_id, chat_user] = dyParams._id.split("&");
  const { refresh, setRefresh } = useContext(myContext);
  const [messageContent, setMessageContent] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [copyallMessages, setCopyAllMessages] = useState([]);
  const [load, setLoad] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [SocketConnectionStatus, setSocketConnectionStatus] = useState(false);
  const chatContainerRef = useRef(null);

  let userData = JSON.parse(localStorage.getItem("userData"));
  const ENDPOINT = "http://localhost:8080";
  // var socket = io(ENDPOINT);
 var socket = useRef(io(ENDPOINT));

  if (!userData) {
    console.log("User not authorized");
    nav("/");
  }

  useEffect(() => {
    
    socket.current.emit("set-up", userData);
  
    socket.current.on("connected", () => {
      setSocketConnectionStatus(true);
    });
  
    socket.current.on("disconnect", () => {
      setSocketConnectionStatus(false);
    });
  
    return () => {
      socket.current.disconnect(); // Disconnect the socket when the component unmounts
    };
  }, [userData,socket]);
  

  //new message received event

  // useEffect(() => {
  //   socket.on("message received", (newMessage) => {
  //     if (!copyallMessages || copyallMessages._id !== newMessage._id) {
  //     } else {
  //       setAllMessages([...allMessages], newMessage);
  //     }
  //   });
  // }, [allMessages,copyallMessages,socket]);
  useEffect(() => {
    socket.current.on("message received", (newMessage) => {
      setAllMessages((prevMessages) => [...prevMessages, newMessage]);
    });
  }, []);


  const sendMessage = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    axios
      .post(
        "http://localhost:8080/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then(({ data }) => {
        // console.log("Message is fired");
      });
  };

  const scrollDown = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      setShowScrollButton(scrollHeight - scrollTop > clientHeight * 2);
    }
  }, [allMessages]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [allMessages]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    axios
      .get(`http://localhost:8080/message/${chat_id}`, config)
      .then(({ data }) => {
        setAllMessages(data);
        setLoad(true);
        socket.current.emit("join-chat", chat_id);
        // scrollDown()
      });
    setCopyAllMessages(allMessages);
  }, [refresh, chat_id, userData.data.token, allMessages,socket]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [allMessages]);

  if (!load) {
    return (
      <div
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className="chat-container">
        <div className={`chat-header ${LightTheme ? " " : "dark"} `}>
          <p className="con-icon">{chat_user[0]}</p>
          <div className="header-text">
            <p className="con-title">{chat_user}</p>
            {/* <p className="con-timestamp">today</p> */}
          </div>
        </div>
        <div
          className={`chat-message ${LightTheme ? " " : "dark"} `}
          ref={chatContainerRef}
        >
          {allMessages.length === 0 ? (
            <>
              <center>
                <img
                  src="https://i.pinimg.com/originals/8a/a4/59/8aa4595fb24b6ed585dddac4622b2445.gif"
                  alt="Loading"
                  style={{
                    animation: "spin 2s linear infinite", // Apply the animation here
                  }}
                />
              </center>
              <p
                style={{
                  textAlign: "center",
                  marginTop: "10px",
                  color: "grey",
                }}
              >
                Start a conversation by sending a message!
              </p>
            </>
          ) : (
            allMessages.slice(0).map((message, index) => {
              const sender = message.sender;
              const self_id = userData.data._id;
              if (sender._id === self_id) {
                return <SelfMessages key={index} props={message} />;
              } else {
                return <OthersMessages key={index} props={message} />;
              }
            })
          )}
        </div>
        <div className={`chat-input ${LightTheme ? " " : "dark"} `}>
          <input
            className="search-box"
            placeholder="Type Message here"
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.code === "Enter") {
                sendMessage();
                setMessageContent("");
                setRefresh(!refresh);
              }
            }}
          ></input>

          <IconButton
            onClick={scrollDown}
            className={`scroll-down-button ${showScrollButton ? "show" : ""}`}
          >
            <KeyboardArrowDownIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              sendMessage();
              setRefresh(!refresh);
            }}
          >
            <SendIcon
              className={`icon${LightTheme ? " " : "dark"}`}
              style={{ color: `${LightTheme ? " " : "whitesmoke"}` }}
            />
          </IconButton>
        </div>
      </div>
    );
  }
}
