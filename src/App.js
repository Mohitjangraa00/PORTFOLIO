import React from "react";
import Header from "./components/Header";
import About from "./components/About";
import Skills from "./components/Skills";
import project from "./components/project";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import footer from "./components/footer";

function App() {
  return (
    <div>
      <Header />
      <About />
      <Skills />
      <project />
      <Resume />
      <Contact />
      <footer />
    </div>
  );
}

export default App;