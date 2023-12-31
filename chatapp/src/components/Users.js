import React, { useContext, useEffect, useState } from "react";
import "./MyStyle.css";
import logo from "../icons/smallersmallchat.png";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { myContext } from "./MainContainer";
import { RefreshSlidebarFun } from "../Features/RefreshSidebar";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import Toaster from "./Toaster";
import AddCircleIcon from "@mui/icons-material/AddCircle";
// import DeleteIcon from "@mui/icons-material/Delete";

export default function Users() {
  const LightTheme = useSelector((state) => state.themeKey);
  let UserData = JSON.parse(localStorage.getItem("userData"));
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { refresh, setRefresh } = useContext(myContext);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [usersStatus, setUsersStatus] = useState("");

  if (!UserData) {
    console.log("User not authorized");
    nav("/");
  }

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchIcon = () => {
    // Perform any specific action when the search icon is clicked
    // For example, you can clear the search value
    setSearchValue("");
  };

  useEffect(() => {
    console.log("user refresh");
    const config = {
      headers: {
        Authorization: `Bearer ${UserData.data.token}`,
      },
    };

    axios
      .get(
        `http://localhost:8080/user/fetchUsers/?search=${searchValue}`,
        config
      )
      .then((response) => {
        // console.log("user data fetch", response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        // Handle the error as needed
      });
  }, [refresh, UserData.data.token, searchValue]);

  return (
    <div className="list-container">
      <div className={`ug-header ${LightTheme ? " " : "dark"}`}>
        <img
          src={logo}
          alt="logo"
          style={{ height: "2rem", marginLeft: "0.5vw" }}
        />
        <p className="">Online Users</p>
      </div>
      <div
        className={`sb-search ${LightTheme ? " " : "dark"}`}
        id="displayBlock"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <IconButton onClick={handleSearchIcon}>
            <SearchIcon
              className={`icon${LightTheme ? " " : "dark"}`}
              style={{ color: `${LightTheme ? " " : "whitesmoke"}` }}
            />
          </IconButton>
          <input
            className="search-box"
            placeholder="Search"
            onChange={handleSearch}
            value={searchValue}
            // style={{width:"9em"}}
          />
        </div>
        <div>
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
      </div>

      <div className={`ug-list ${LightTheme ? " " : "dark"}`}>
        {users.map((user, index) => {
          // const chatId = user.chatId;
          return (
            <div
              className={`list-items `}
              key={index}
              style={{justifyContent:"space-between"}}
          
            >
              <div style={{display:"flex",flexDirection:"row",gap:"10px"}}>
              <p className="con-icon">{user.name[0]}</p>
              <p className="con-title">{user.name}</p>
              </div>
              <div className="group-icons">
              
                <IconButton
                      onClick={() => {
                        // console.log("creating the chat with", user.name);
                        setUsersStatus({
                          msg: `Chat created with ${user.name} `,
                          key: Math.random(),
                        });
                        const config = {
                          headers: {
                            Authorization: `Bearer ${UserData.data.token}`,
                          },
                        };
                        axios.post(
                          "http://localhost:8080/chat/",
                          { userId: user._id },
                          config
                        );
                        dispatch(RefreshSlidebarFun());
                      }}
                >
                  <AddCircleIcon
                    className={`icon${LightTheme ? " " : "dark"}`}
                    style={{ color: `${LightTheme ? " " : "whitesmoke"}` }}
                  ></AddCircleIcon>
                </IconButton>
           

             
                {/* <IconButton
                onClick={() => {
                  const config = {
                    headers: {
                      "Content-type": "application/json",
                      Authorization: `Bearer ${UserData.data.token}`,
                    },
                  };
                  axios.put(`http://localhost:8080/chat/existChat/${chatId}`, config);
                  setUsersStatus({
                    msg: `User removed from the chat with ${user.name}`,
                    key: Math.random(),
                  });
                  dispatch(RefreshSlidebarFun());
                }}
                >
                  <DeleteIcon
                    className={`icon${LightTheme ? " " : "dark"}`}
                    style={{ color: `${LightTheme ? " " : "whitesmoke"}` }}
                  />
                </IconButton> */}
            
            </div>

            </div>
          );
        })}

        {usersStatus ? (
          <Toaster key={usersStatus.key} message={usersStatus.msg} />
        ) : null}
      </div>
    </div>
  );
}
