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
import axios from "axios";


export default function ChatConatiner({socket}) {

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
  const [data, setData] = useState([]);
  const [SocketConnectionStatus, setSocketConnectionStatus] = useState(false);
  const chatContainerRef = useRef(null);

  let userData = JSON.parse(localStorage.getItem("userData"));
  // var socket = io(ENDPOINT);



  if (!userData) {
    console.log("User not authorized");
    nav("/");
  }

  useEffect(() => {
   
    socket.emit("set-up",userData);
    socket.on("connected",()=>{
      setSocketConnectionStatus(!SocketConnectionStatus)
    })
  
   
  
  }, [])

  



  useEffect(() => {
    // Fetch initial messages and set them to allMessages
    const fetchMessages = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userData.data.token}`,
          },
        };
        const response = await axios.get(`http://localhost:8080/message/${chat_id}`, config);
        setAllMessages(response.data);
        setLoad(true);
        socket.emit("join-chat", chat_id);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);


  useEffect(() => {
    // Listen for new messages and update allMessages
    const handleNewMessage = (newMessage) => {
      setAllMessages((prevMessages) => [...prevMessages, newMessage.newMessage]);
    };

    socket.on("message received", handleNewMessage);

    return () => {
      // Clean up the event listener when component unmounts
      socket.off("message received", handleNewMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`,
      },
    };

    axios.post(
      "http://localhost:8080/message/",
      {
        content: messageContent,
        chatId: chat_id,
      },
      config
    )
    .then(({ data }) => {

      setData(data)

      // Message sent successfully
      socket.emit("new-message", { newMessage: data });
      // console.log("new-message event emitted");
      // console.log("jsonnewmessg", { newMessage: data });
    setAllMessages((prevMessages)=>[...prevMessages,data]);

    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });

    // Clear the input field and trigger a refresh
    setMessageContent("");
    setRefresh(!refresh);
  };

  useEffect(()=>{
    // setAllMessages((prevMessages) => [...prevMessages, newMessage.newMessage]);

  },[refresh])
  

  

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
