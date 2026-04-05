import React, { useEffect, useRef, useState } from "react";

/* ─── Skill data ─────────────────────────────────────────── */
const SKILLS = [
  { name: "HTML",       level: 90, icon: "🌐", color: "#e34f26" },
  { name: "CSS",        level: 85, icon: "🎨", color: "#264de4" },
  { name: "JavaScript", level: 80, icon: "⚡", color: "#f7df1e" },
  { name: "React",      level: 75, icon: "⚛️",  color: "#61dafb" },
  { name: "Python",     level: 70, icon: "🐍", color: "#3776ab" },
];

/* ─── Inline styles (self-contained, no external CSS needed) ─ */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .sk-section {
    min-height: 100vh;
    background: #060b14;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 90px 24px;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* Ambient glow blobs */
  .sk-blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
  }
  .sk-blob-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(201,168,76,0.07), transparent 70%);
    top: -120px; left: -120px;
    animation: blobDrift 10s ease-in-out infinite alternate;
  }
  .sk-blob-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(59,130,246,0.06), transparent 70%);
    bottom: -100px; right: -100px;
    animation: blobDrift 13s 2s ease-in-out infinite alternate-reverse;
  }
  @keyframes blobDrift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(40px, 30px) scale(1.15); }
  }

  /* Container */
  .sk-container {
    width: 100%;
    max-width: 740px;
    position: relative;
    z-index: 2;
  }

  /* Header */
  .sk-header {
    text-align: center;
    margin-bottom: 60px;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .sk-header.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .sk-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #c9a84c;
    margin-bottom: 12px;
    display: block;
  }

  .sk-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(34px, 6vw, 52px);
    font-weight: 900;
    line-height: 1.1;
    background: linear-gradient(135deg, #f1f5f9 0%, #c9a84c 50%, #f0d080 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 16px;
  }

  .sk-rule {
    width: 56px;
    height: 2px;
    background: linear-gradient(to right, #c9a84c, transparent);
    margin: 0 auto;
    border-radius: 2px;
  }

  /* Skill card */
  .sk-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: 20px;
    padding: 24px 28px;
    margin-bottom: 18px;
    opacity: 0;
    transform: translateX(-28px);
    transition: opacity 0.6s ease, transform 0.6s ease,
                border-color 0.35s, background 0.35s, box-shadow 0.35s;
    backdrop-filter: blur(10px);
    cursor: default;
    position: relative;
    overflow: hidden;
  }
  .sk-card.visible {
    opacity: 1;
    transform: translateX(0);
  }
  .sk-card:hover {
    border-color: rgba(201,168,76,0.4);
    background: rgba(201,168,76,0.04);
    box-shadow: 0 12px 50px rgba(0,0,0,0.45), 0 0 30px rgba(201,168,76,0.08);
    transform: translateY(-3px) !important;
  }

  /* Accent left edge */
  .sk-card::before {
    content: '';
    position: absolute;
    left: 0; top: 20%; bottom: 20%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(to bottom, transparent, var(--skill-color, #c9a84c), transparent);
    opacity: 0;
    transition: opacity 0.4s;
  }
  .sk-card:hover::before { opacity: 1; }

  /* Card header row */
  .sk-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .sk-name-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sk-icon {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
    transition: transform 0.3s, background 0.3s;
  }
  .sk-card:hover .sk-icon {
    transform: rotate(-8deg) scale(1.1);
    background: rgba(201,168,76,0.08);
  }

  .sk-name {
    font-size: 17px;
    font-weight: 600;
    color: #f1f5f9;
    letter-spacing: 0.3px;
  }

  .sk-percent {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: #c9a84c;
    min-width: 52px;
    text-align: right;
    transition: color 0.3s;
  }
  .sk-card:hover .sk-percent {
    color: #f0d080;
  }

  /* Bar track */
  .sk-track {
    width: 100%;
    height: 6px;
    background: rgba(255,255,255,0.07);
    border-radius: 10px;
    overflow: visible;
    position: relative;
  }

  /* Filled bar */
  .sk-fill {
    height: 100%;
    border-radius: 10px;
    width: 0%;
    transition: width 1.4s cubic-bezier(0.23,1,0.32,1);
    position: relative;
    overflow: hidden;
  }

  /* Sheen sweep */
  .sk-fill::after {
    content: '';
    position: absolute;
    top: 0; left: -60%;
    width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
    animation: barSheen 2.8s ease-in-out infinite;
  }
  @keyframes barSheen {
    0%   { left: -60%; }
    100% { left: 130%; }
  }

  /* Glowing dot at tip */
  .sk-dot {
    position: absolute;
    right: -5px; top: 50%;
    transform: translateY(-50%);
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 8px 3px var(--skill-color, #c9a84c);
    opacity: 0;
    transition: opacity 0.4s 1s;
  }
  .sk-fill.animated .sk-dot {
    opacity: 1;
  }

  /* Sub-label row */
  .sk-sub {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 11px;
    color: #475569;
    letter-spacing: 0.3px;
  }

  /* Responsive */
  @media (max-width: 600px) {
    .sk-section { padding: 60px 16px; }
    .sk-card { padding: 18px 20px; }
    .sk-name { font-size: 15px; }
    .sk-percent { font-size: 19px; }
  }
`;

/* ─── Label helper ─── */
function levelLabel(n) {
  if (n >= 88) return "Expert";
  if (n >= 78) return "Advanced";
  if (n >= 65) return "Proficient";
  return "Intermediate";
}

/* ─── SkillCard ─── */
function SkillCard({ skill, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setVisible(true);
            setTimeout(() => setAnimated(true), 200);
          }, index * 130);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const grad = `linear-gradient(90deg, ${skill.color}99, ${skill.color})`;

  return (
    <div
      ref={ref}
      className={`sk-card${visible ? " visible" : ""}`}
      style={{ "--skill-color": skill.color }}
    >
      <div className="sk-card-header">
        <div className="sk-name-group">
          <div className="sk-icon">{skill.icon}</div>
          <span className="sk-name">{skill.name}</span>
        </div>
        <span className="sk-percent">{skill.level}%</span>
      </div>

      <div className="sk-track">
        <div
          className={`sk-fill${animated ? " animated" : ""}`}
          style={{
            width: animated ? `${skill.level}%` : "0%",
            background: grad,
            boxShadow: `0 0 14px ${skill.color}55`,
          }}
        >
          <div
            className="sk-dot"
            style={{ background: skill.color, boxShadow: `0 0 10px 4px ${skill.color}99` }}
          />
        </div>
      </div>

      <div className="sk-sub">
        <span>{levelLabel(skill.level)}</span>
        <span>{skill.level} / 100</span>
      </div>
    </div>
  );
}

/* ─── Main Skills component ─── */
const Skills = () => {
  const headerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHeaderVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (headerRef.current) obs.observe(headerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{css}</style>
      <section className="sk-section">
        {/* Ambient blobs */}
        <div className="sk-blob sk-blob-1" />
        <div className="sk-blob sk-blob-2" />

        <div className="sk-container">
          {/* Heading */}
          <div ref={headerRef} className={`sk-header${headerVisible ? " visible" : ""}`}>
            <span className="sk-eyebrow">What I work with</span>
            <h2 className="sk-title">My Skills</h2>
            <div className="sk-rule" />
          </div>

          {/* Skill cards */}
          {SKILLS.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Skills;
