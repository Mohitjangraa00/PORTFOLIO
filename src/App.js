import React from "react";
import Header from "./components/Header";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";   // ✅ Capital
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";      // ✅ Capital

function App() {
  return (
    <div>
      <Header />
      <About />
      <Skills />
      <Projects />   {/* ✅ FIXED */}
      <Resume />
      <Contact />
      <Footer />     {/* ✅ FIXED */}
    </div>
  );
}

export default App;