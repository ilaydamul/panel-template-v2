// src/components/Sidebar.js
import React, { useState } from "react";
import {
  FaHome,
  FaBook,
  FaUser,
  FaAngleRight,
  FaProductHunt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const DropdownLink = ({ title, pages }) => {
  const [productListShow, setProductListShow] = useState(false);

  return (
    <li
      className={`navigation_item navigation_collapse${
        productListShow ? " open" : ""
      }`}
    >
      <div onClick={() => setProductListShow(!productListShow)}>
        <div>
          <FaProductHunt /> {title}
        </div>
        <div>
          <FaAngleRight />
        </div>
      </div>
      <ul
        className={`${productListShow ? "open " : ""}navigation_collapse_list`}
      >
        {pages.map((item, key) => (
          <li>
            <NavLink to={item.link} key={key}>
              <FaAngleRight /> {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </li>
  );
};

const Sidebar = ({ isOpen }) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* <img src={require("")} alt="LOGO" /> */}
        <ul className="navigation_flex">
          <li className="navigation_item">
            <NavLink to={"/"}>
              <FaHome /> Dashboard
            </NavLink>
          </li>
          <li className="navigation_item">
            <NavLink to={"/discover"}>
              <FaBook /> Bloglar
            </NavLink>
          </li>
          
          {/* <DropdownLink
            title={"Ürünler"}
            pages={[
              { title: "Panel Sayfa 1", link: "/" },
              { title: "Panel Sayfa 2", link: "/" },
              { title: "Panel Sayfa 3", link: "/" },
            ]}
          /> */}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
