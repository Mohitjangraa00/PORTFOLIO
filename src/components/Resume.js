import React from "react";
import "../styles/styles.css";   // ✅ connect CSS

const Resume = () => {
  return (
    <section className="resume">
      <div className="resume-container">
        
        <h2>My Resume</h2>

        <p className="resume-text">
          You can download my resume to know more about my skills,
          experience, and projects.
        </p>

        <a
          href="/resume.pdf"
          download
          className="resume-btn"
        >
          Download Resume
        </a>

      </div>
    </section>
  );
};

export default Resume;