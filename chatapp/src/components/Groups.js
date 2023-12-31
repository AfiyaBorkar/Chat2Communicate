import React, { useContext, useEffect, useState } from "react";
import logo from "../icons/smallersmallchat.png";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./MyStyle.css";
import { useNavigate } from "react-router-dom";
import { RefreshSlidebarFun } from "../Features/RefreshSidebar";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import { myContext } from "./MainContainer";
import { useDispatch, useSelector } from "react-redux";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Toaster from "./Toaster";

import axios from "axios";

export default function Groups() {
  const LightTheme = useSelector((state) => state.themeKey);
  const { refresh, setRefresh } = useContext(myContext);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [originalGroups, setOriginalGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [deleteGroupStatus, setDeleteGroupStatus] = useState("");
  const [addGroupStatus, setAddGroupStatus] = useState("");

  let UserData = JSON.parse(localStorage.getItem("userData"));
  if (!UserData) {
    console.log("User not authorized");
    nav("/");
  }

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue.trim() === "") {
      // If search is empty, show all groups
      setFilteredGroups([...originalGroups]);
    } else {
      // Filter groups based on search input
      const filteredGroups = originalGroups.filter((group) =>
        group.chatName.toLowerCase().includes(searchValue)
      );
      setFilteredGroups([...filteredGroups]);
    }
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${UserData.data.token}`,
      },
    };

    axios
      .get("http://localhost:8080/chat/fetchGroups", config)
      .then((response) => {
        // console.log("group data fetch", response.data);
        setOriginalGroups(response.data);
        setFilteredGroups(response.data);
      })
      .catch((error) => {
        console.error("Error fetching group data:", error);
        // Handle the error as needed
      });
  }, [refresh, UserData.data.token]);

  return (
    <div className="list-container">
      <div className={`ug-header ${LightTheme ? " " : "dark"}`}>
        <img
          src={logo}
          alt="logo"
          style={{ height: "2rem", marginLeft: "0.5vw" }}
        />
        <p className="">Available Groups</p>
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
        <div style={{ display: "flex", flexDirection: "row" }}>
          <IconButton>
            <SearchIcon
              className={`icon${LightTheme ? " " : "dark"}`}
              style={{ color: `${LightTheme ? " " : "whitesmoke"}` }}
            />
          </IconButton>
          <input
            className="search-box"
            placeholder="Search"
            onChange={handleSearch}
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
        {filteredGroups.map((group, index) => (
          <div className={`list-items `} key={index} id="group-items">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <p className="con-icon">G</p>
              <p className="con-title">{group.chatName}</p>
            </div>
            <div className="group-icons">
              {!group.users.includes(UserData.data._id) && (
                <IconButton
                  onClick={() => {
                    const config = {
                      headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${UserData.data.token}`,
                      },
                    };
                    axios.put(
                      "http://localhost:8080/chat/addtoGroup",
                      { chatId: group._id, userId: UserData.data._id },
                      config
                    );
                    // console.log("Added to group", group.chatName);
                    setAddGroupStatus({
                      msg: `Added to ${group.chatName} group`,
                      key: Math.random(),
                    });
                    dispatch(RefreshSlidebarFun());
                  }}
                >
                  <AddCircleIcon
                    className={`icon${LightTheme ? " " : "dark"}`}
                    style={{ color: `${LightTheme ? " " : "whitesmoke"}` }}
                  ></AddCircleIcon>
                </IconButton>
              )}

              {group.users.includes(UserData.data._id) && (
                <IconButton
                  onClick={() => {
                    const config = {
                      headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${UserData.data.token}`,
                      },
                    };
                    axios.put(
                      "http://localhost:8080/chat/groupExit",
                      { chatId: group._id, userId: UserData.data._id },
                      config
                    );
                    // console.log("deleted to group", group.chatName);
                    setDeleteGroupStatus({
                      msg: `Existed from the ${group.chatName} group`,
                      key: Math.random(),
                    });
                    dispatch(RefreshSlidebarFun());
                  }}
                >
                  <DeleteIcon
                    className={`icon${LightTheme ? " " : "dark"}`}
                    style={{ color: `${LightTheme ? " " : "whitesmoke"}` }}
                  />
                </IconButton>
              )}
            </div>
          </div>
        ))}
        {deleteGroupStatus ? (
          <Toaster
            key={deleteGroupStatus.key}
            message={deleteGroupStatus.msg}
          />
        ) : null}
        {addGroupStatus ? (
          <Toaster key={addGroupStatus.key} message={addGroupStatus.msg} />
        ) : null}
      </div>
    </div>
  );
}
