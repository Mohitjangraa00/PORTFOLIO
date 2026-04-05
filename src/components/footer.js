import React from "react";
import "../styles/styles.css";   // ✅ connect CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <h2 className="footer-logo">Your Name</h2>

        <p className="footer-text">
          © 2026 Your Name. All rights reserved.
        </p>

        <div className="footer-social">
          <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="#" target="_blank" rel="noreferrer">GitHub</a>
          <a href="#" target="_blank" rel="noreferrer">Twitter</a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;