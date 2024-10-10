// src/components/Sidebar.js
import React from "react";
import { FaBars } from "react-icons/fa";

const Topbar = ({ isOpen, toggleSidebar }) => {
  return (
    <>
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
      <div className="burger-menu">
        <FaBars  onClick={toggleSidebar} />
      </div>
    </>
  );
};

export default Topbar;
