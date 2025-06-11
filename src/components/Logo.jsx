import React from "react";
import pillsLogo from "../assets/2-pills.svg"; // adjust path if needed

const Logo = () => (
  <div className="logo-container">
    <img
      src={pillsLogo}
      alt="DrugFinder Logo"
      className="logo-img"
    />
    <span className="logo-title">DrugFinder</span>
  </div>
);

export default Logo; 