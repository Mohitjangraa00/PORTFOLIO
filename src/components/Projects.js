import React, { useRef, useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pj-section {
    min-height: 100vh;
    background: #060b14;
    padding: 100px 24px;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* ── Blobs ── */
  .pj-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(110px);
    pointer-events: none;
    z-index: 0;
  }
  .pj-blob-1 {
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(201,168,76,0.06), transparent 65%);
    top: -100px; right: -150px;
    animation: pjDrift 13s ease-in-out infinite alternate;
  }
  .pj-blob-2 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(59,130,246,0.05), transparent 65%);
    bottom: -80px; left: -100px;
    animation: pjDrift 17s 3s ease-in-out infinite alternate-reverse;
  }
  @keyframes pjDrift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(35px,25px) scale(1.12); }
  }

  /* ── Header ── */
  .pj-header {
    text-align: center;
    margin-bottom: 70px;
    position: relative;
    z-index: 1;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .pj-header.visible { opacity: 1; transform: translateY(0); }

  .pj-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #c9a84c;
    display: block;
    margin-bottom: 14px;
  }

  .pj-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(34px, 5vw, 52px);
    font-weight: 900;
    background: linear-gradient(135deg, #f1f5f9 0%, #c9a84c 55%, #f0d080 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 16px;
  }

  .pj-rule {
    width: 52px; height: 2px;
    background: linear-gradient(to right, #c9a84c, transparent);
    border-radius: 2px;
    margin: 0 auto;
  }

  /* ── Filter tabs ── */
  .pj-filters {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 52px;
    position: relative;
    z-index: 1;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.7s 0.15s ease, transform 0.7s 0.15s ease;
  }
  .pj-filters.visible { opacity: 1; transform: translateY(0); }

  .pj-filter {
    padding: 8px 20px;
    border-radius: 50px;
    border: 1px solid rgba(201,168,76,0.18);
    background: transparent;
    color: #64748b;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.3s;
  }
  .pj-filter:hover,
  .pj-filter.active {
    border-color: #c9a84c;
    color: #c9a84c;
    background: rgba(201,168,76,0.07);
  }

  /* ── Grid ── */
  .pj-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 28px;
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  /* ── Card ── */
  .pj-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(201,168,76,0.1);
    border-radius: 22px;
    overflow: hidden;
    transition: all 0.45s cubic-bezier(0.23,1,0.32,1);
    opacity: 0;
    transform: translateY(30px);
    position: relative;
  }
  .pj-card.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .pj-card:hover {
    border-color: rgba(201,168,76,0.38);
    transform: translateY(-10px) scale(1.01);
    box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 36px rgba(201,168,76,0.08);
  }

  /* Gold shimmer overlay on hover */
  .pj-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.05), transparent 55%);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
    z-index: 1;
    border-radius: 22px;
  }
  .pj-card:hover::before { opacity: 1; }

  /* ── Image area ── */
  .pj-img-wrap {
    position: relative;
    height: 200px;
    overflow: hidden;
    background: #0d1526;
  }

  /* Emoji icon fallback */
  .pj-icon-bg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 64px;
    position: relative;
  }

  .pj-icon-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--card-color-a, #0d1526), var(--card-color-b, #060b14));
  }

  .pj-icon-emoji {
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 4px 24px rgba(0,0,0,0.5));
    transition: transform 0.45s cubic-bezier(0.23,1,0.32,1);
  }
  .pj-card:hover .pj-icon-emoji { transform: scale(1.15) rotate(-5deg); }

  /* Tag badge on image */
  .pj-img-tag {
    position: absolute;
    top: 14px; right: 14px;
    padding: 5px 12px;
    background: rgba(6,11,20,0.75);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 50px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #c9a84c;
    z-index: 2;
  }

  /* Number badge */
  .pj-num {
    position: absolute;
    bottom: 14px; left: 14px;
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 900;
    color: rgba(255,255,255,0.04);
    line-height: 1;
    z-index: 2;
    user-select: none;
  }

  /* ── Body ── */
  .pj-body {
    padding: 22px 24px 24px;
    position: relative;
    z-index: 2;
  }

  .pj-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 10px;
    transition: color 0.3s;
  }
  .pj-card:hover .pj-card-title { color: #f0d080; }

  .pj-desc {
    color: #64748b;
    font-size: 14px;
    font-weight: 300;
    line-height: 1.75;
    margin: 0 0 18px;
  }

  /* Tech chips */
  .pj-techs {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 20px;
  }
  .pj-tech {
    padding: 4px 11px;
    border-radius: 50px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    font-size: 11px;
    color: #94a3b8;
    font-weight: 500;
    transition: all 0.25s;
  }
  .pj-card:hover .pj-tech {
    border-color: rgba(201,168,76,0.2);
    color: #c9a84c;
  }

  /* Buttons */
  .pj-btns {
    display: flex;
    gap: 10px;
  }

  .pj-btn-live {
    flex: 1;
    padding: 10px 0;
    background: linear-gradient(135deg, #c9a84c, #a8783a);
    color: #060b14;
    border: none;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
    box-shadow: 0 4px 18px rgba(201,168,76,0.2);
    position: relative;
    overflow: hidden;
  }
  .pj-btn-live::after {
    content: '';
    position: absolute;
    top: -50%; left: -60%;
    width: 50%; height: 200%;
    background: rgba(255,255,255,0.2);
    transform: skewX(-20deg);
    transition: left 0.45s;
  }
  .pj-btn-live:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(201,168,76,0.38);
  }
  .pj-btn-live:hover::after { left: 130%; }

  .pj-btn-gh {
    flex: 1;
    padding: 10px 0;
    background: transparent;
    color: #64748b;
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s;
  }
  .pj-btn-gh:hover {
    border-color: rgba(201,168,76,0.4);
    color: #c9a84c;
    transform: translateY(-3px);
  }

  /* ── Responsive ── */
  @media (max-width: 720px) {
    .pj-grid { grid-template-columns: 1fr; max-width: 480px; }
    .pj-section { padding: 70px 16px; }
  }
`;

const PROJECTS = [
  {
    title: "Ticket Counter",
    description:
      "An interactive counter app to manage and track ticket numbers in real time. Features increment, decrement, and reset controls with smooth state management.",
    icon: "🎟️",
    tag: "React App",
    techs: ["React", "useState", "CSS"],
    colorA: "#0a1628", colorB: "#060b14",
    live: "#", github: "#",
  },
  {
    title: "Text Analyser",
    description:
      "A powerful text analysis tool that counts words, characters, sentences, and estimates reading time. Supports uppercase/lowercase conversion and text clearing.",
    icon: "📝",
    tag: "Utility Tool",
    techs: ["React", "JavaScript", "String Methods"],
    colorA: "#0d1a10", colorB: "#060b14",
    live: "#", github: "#",
  },
  {
    title: "Portfolio Website",
    description:
      "A personal portfolio built with React featuring smooth animations, dark luxury theme, and fully responsive design showcasing projects and skills.",
    icon: "🌐",
    tag: "Portfolio",
    techs: ["React", "CSS3", "Animations"],
    colorA: "#100d1a", colorB: "#060b14",
    live: "#", github: "#",
  },
  {
    title: "Todo App",
    description:
      "A full-featured task manager with add, edit, delete, and completion toggle. Tasks persist across sessions with clean minimal UI.",
    icon: "✅",
    tag: "Productivity",
    techs: ["React", "localStorage", "CSS"],
    colorA: "#0a1420", colorB: "#060b14",
    live: "#", github: "#",
  },
  {
    title: "Weather App",
    description:
      "Real-time weather dashboard fetching live data by city name. Displays temperature, humidity, wind speed, and weather condition with dynamic icons.",
    icon: "⛅",
    tag: "API Project",
    techs: ["React", "OpenWeather API", "Axios"],
    colorA: "#0a1628", colorB: "#060b14",
    live: "#", github: "#",
  },
];

const FILTERS = ["All", "React App", "Utility Tool", "Portfolio", "Productivity", "API Project"];

/* ── Card ── */
function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setTimeout(() => setVis(true), index * 110); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div ref={ref} className={`pj-card${vis ? " visible" : ""}`}>
      {/* Image / Icon area */}
      <div className="pj-img-wrap">
        <div
          className="pj-icon-bg"
          style={{ "--card-color-a": project.colorA, "--card-color-b": project.colorB }}
        >
          <span className="pj-icon-emoji">{project.icon}</span>
        </div>
        <span className="pj-img-tag">{project.tag}</span>
        <span className="pj-num">0{index + 1}</span>
      </div>

      {/* Body */}
      <div className="pj-body">
        <h3 className="pj-card-title">{project.title}</h3>
        <p className="pj-desc">{project.description}</p>

        <div className="pj-techs">
          {project.techs.map(t => <span className="pj-tech" key={t}>{t}</span>)}
        </div>

        <div className="pj-btns">
          <a href={project.live}   className="pj-btn-live" target="_blank" rel="noreferrer">Live Demo</a>
          <a href={project.github} className="pj-btn-gh"   target="_blank" rel="noreferrer">GitHub ↗</a>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
const Projects = () => {
  const headerRef  = useRef(null);
  const filterRef  = useRef(null);
  const [headerVis,  setHeaderVis]  = useState(false);
  const [filterVis,  setFilterVis]  = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const obs = (ref, setter) =>
      new IntersectionObserver(([e]) => { if (e.isIntersecting) setter(true); }, { threshold: 0.2 });
    const o1 = obs(headerRef, setHeaderVis);
    const o2 = obs(filterRef, setFilterVis);
    if (headerRef.current) o1.observe(headerRef.current);
    if (filterRef.current) o2.observe(filterRef.current);
    return () => { o1.disconnect(); o2.disconnect(); };
  }, []);

  const filtered = activeFilter === "All"
    ? PROJECTS
    : PROJECTS.filter(p => p.tag === activeFilter);

  return (
    <>
      <style>{css}</style>
      <section className="pj-section" id="projects">
        <div className="pj-blob pj-blob-1" />
        <div className="pj-blob pj-blob-2" />

        {/* Header */}
        <div ref={headerRef} className={`pj-header${headerVis ? " visible" : ""}`}>
          <span className="pj-eyebrow">What I've built</span>
          <h2 className="pj-title">My Projects</h2>
          <div className="pj-rule" />
        </div>

        {/* Filters */}
        <div ref={filterRef} className={`pj-filters${filterVis ? " visible" : ""}`}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`pj-filter${activeFilter === f ? " active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >{f}</button>
          ))}
        </div>

        {/* Grid */}
        <div className="pj-grid">
          {filtered.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Projects;
