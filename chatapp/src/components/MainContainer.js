import React, { useState, createContext } from "react";
import "./MyStyle.css";
import Sidebar from "./Sidebar";

import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const myContext = createContext();

export default function MainContainer() {
  const [refresh, setRefresh] = useState(true);
  const LightTheme = useSelector((state) => state.themeKey);

  return (
    <div className={`main-container ${LightTheme ? " " : "dark"} `}>
      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>
        <Sidebar />

        <Outlet />
      </myContext.Provider>
      {/* <CreateGroup/> */}
      {/* <WelcomePage/> */}
      {/* <ChatConatiner /> */}
      {/* <Users_Groups/> */}
      {/* <Users/> */}
      {/* <Groups/> */}
    </div>
  );
}
