import React from "react";
import "../styles/styles.css";   // ✅ connect CSS

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        
        <h1 className="logo">Mohit</h1>

        <p className="tagline">
          Full Stack Developer | Problem Solver
        </p>

      </div>
    </header>
  );
};

export default Header;