import React, { useRef, useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ab-section {
    min-height: 100vh;
    background: #060b14;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 24px;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* ── Blobs ── */
  .ab-blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(100px);
    z-index: 0;
  }
  .ab-blob-1 {
    width: 560px; height: 560px;
    background: radial-gradient(circle, rgba(201,168,76,0.07), transparent 65%);
    top: -160px; left: -120px;
    animation: abDrift 12s ease-in-out infinite alternate;
  }
  .ab-blob-2 {
    width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(59,130,246,0.06), transparent 65%);
    bottom: -100px; right: -80px;
    animation: abDrift 15s 3s ease-in-out infinite alternate-reverse;
  }
  @keyframes abDrift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(35px,28px) scale(1.13); }
  }

  /* Decorative grid lines */
  .ab-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.025) 1px, transparent 1px);
    background-size: 60px 60px;
    z-index: 0;
    pointer-events: none;
  }

  /* ── Wrapper ── */
  .ab-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1020px;
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 72px;
    align-items: center;
  }

  /* ── Left: Image column ── */
  .ab-img-col {
    opacity: 0;
    transform: translateX(-36px);
    transition: opacity 0.9s ease, transform 0.9s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }
  .ab-img-col.visible {
    opacity: 1;
    transform: translateX(0);
  }

  /* Spinning ring */
  .ab-ring-wrap {
    position: relative;
    width: 220px;
    height: 220px;
    flex-shrink: 0;
  }

  .ab-ring {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      #c9a84c 0%, transparent 25%,
      #f0d080 50%, transparent 75%,
      #c9a84c 100%
    );
    animation: spinRing 6s linear infinite;
  }
  @keyframes spinRing { to { transform: rotate(360deg); } }

  .ab-ring-mask {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: #060b14;
  }

  .ab-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    z-index: 2;
    transition: transform 0.5s ease, filter 0.5s ease;
    filter: brightness(0.9) saturate(0.95);
  }
  .ab-ring-wrap:hover .ab-img {
    transform: scale(1.04);
    filter: brightness(1.05) saturate(1.1);
  }

  /* Status badge */
  .ab-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(34,197,94,0.08);
    border: 1px solid rgba(34,197,94,0.25);
    border-radius: 50px;
    font-size: 12px;
    font-weight: 500;
    color: #86efac;
    white-space: nowrap;
  }
  .ab-badge-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #22c55e;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
    50%       { box-shadow: 0 0 0 6px rgba(34,197,94,0); }
  }

  /* ── Right: Content column ── */
  .ab-content {
    opacity: 0;
    transform: translateX(36px);
    transition: opacity 0.9s 0.15s ease, transform 0.9s 0.15s ease;
  }
  .ab-content.visible {
    opacity: 1;
    transform: translateX(0);
  }

  .ab-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #c9a84c;
    display: block;
    margin-bottom: 14px;
  }

  .ab-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(34px, 4.5vw, 52px);
    font-weight: 900;
    line-height: 1.1;
    margin: 0 0 6px;
    background: linear-gradient(135deg, #f1f5f9 0%, #c9a84c 55%, #f0d080 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ab-role {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: clamp(16px, 2vw, 20px);
    color: #64748b;
    margin: 0 0 20px;
  }

  .ab-rule {
    width: 52px; height: 2px;
    background: linear-gradient(to right, #c9a84c, transparent);
    border-radius: 2px;
    margin-bottom: 24px;
  }

  .ab-bio {
    color: #94a3b8;
    font-size: 15.5px;
    font-weight: 300;
    line-height: 1.85;
    margin-bottom: 36px;
    max-width: 520px;
  }

  /* Stats row */
  .ab-stats {
    display: flex;
    gap: 0;
    margin-bottom: 36px;
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: 16px;
    overflow: hidden;
    max-width: 460px;
  }

  .ab-stat {
    flex: 1;
    padding: 20px 16px;
    text-align: center;
    position: relative;
    transition: background 0.3s;
  }
  .ab-stat:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0; top: 20%; bottom: 20%;
    width: 1px;
    background: rgba(201,168,76,0.12);
  }
  .ab-stat:hover { background: rgba(201,168,76,0.04); }

  .ab-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 900;
    color: #c9a84c;
    display: block;
    line-height: 1;
    margin-bottom: 4px;
  }
  .ab-stat-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #475569;
  }

  /* Tags */
  .ab-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 36px;
  }
  .ab-tag {
    padding: 7px 16px;
    border-radius: 50px;
    border: 1px solid rgba(201,168,76,0.18);
    background: rgba(201,168,76,0.04);
    color: #94a3b8;
    font-size: 12.5px;
    font-weight: 500;
    transition: all 0.3s;
    cursor: default;
  }
  .ab-tag:hover {
    border-color: rgba(201,168,76,0.45);
    color: #c9a84c;
    background: rgba(201,168,76,0.08);
    transform: translateY(-2px);
  }

  /* CTA buttons */
  .ab-ctas {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
  }

  .ab-btn-primary {
    padding: 14px 32px;
    background: linear-gradient(135deg, #c9a84c, #a8783a);
    color: #060b14;
    border: none;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
    box-shadow: 0 6px 28px rgba(201,168,76,0.25);
    position: relative;
    overflow: hidden;
  }
  .ab-btn-primary::after {
    content: '';
    position: absolute;
    top: -50%; left: -60%;
    width: 50%; height: 200%;
    background: rgba(255,255,255,0.2);
    transform: skewX(-20deg);
    transition: left 0.5s;
  }
  .ab-btn-primary:hover {
    background: linear-gradient(135deg, #f0d080, #c9a84c);
    transform: translateY(-3px);
    box-shadow: 0 12px 38px rgba(201,168,76,0.4);
  }
  .ab-btn-primary:hover::after { left: 130%; }

  .ab-btn-ghost {
    padding: 13px 28px;
    background: transparent;
    color: #94a3b8;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    transition: all 0.35s;
  }
  .ab-btn-ghost:hover {
    border-color: #c9a84c;
    color: #c9a84c;
    transform: translateY(-3px);
  }

  /* ── Responsive ── */
  @media (max-width: 820px) {
    .ab-wrapper {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 48px;
    }
    .ab-img-col { align-items: center; }
    .ab-content { transform: none !important; }
    .ab-rule { margin-left: auto; margin-right: auto; }
    .ab-bio { margin-left: auto; margin-right: auto; }
    .ab-stats { max-width: 100%; }
    .ab-tags  { justify-content: center; }
    .ab-ctas  { justify-content: center; }
  }
  @media (max-width: 480px) {
    .ab-section { padding: 70px 16px; }
    .ab-ring-wrap { width: 180px; height: 180px; }
    .ab-stats { flex-direction: column; border-radius: 16px; }
    .ab-stat::after { display: none; }
  }
`;

const TAGS = ["React", "JavaScript", "Python", "CSS", "HTML", "Problem Solver", "UI/UX", "Open Source"];
const STATS = [
  { num: "2+",  label: "Years Exp." },
  { num: "15+", label: "Projects" },
  { num: "5",   label: "Tech Stack" },
];

const About = () => {
  const imgRef     = useRef(null);
  const contentRef = useRef(null);
  const [imgVis,     setImgVis]     = useState(false);
  const [contentVis, setContentVis] = useState(false);

  useEffect(() => {
    const observe = (ref, setter) => {
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) { setter(true); obs.disconnect(); } },
        { threshold: 0.2 }
      );
      if (ref.current) obs.observe(ref.current);
      return obs;
    };
    const o1 = observe(imgRef,     setImgVis);
    const o2 = observe(contentRef, setContentVis);
    return () => { o1.disconnect(); o2.disconnect(); };
  }, []);

  return (
    <>
      <style>{css}</style>
      <section className="ab-section" id="about">
        <div className="ab-blob ab-blob-1" />
        <div className="ab-blob ab-blob-2" />
        <div className="ab-grid" />

        <div className="ab-wrapper">

          {/* ── Left: Image ── */}
          <div ref={imgRef} className={`ab-img-col${imgVis ? " visible" : ""}`}>
            <div className="ab-ring-wrap">
              <div className="ab-ring" />
              <div className="ab-ring-mask" />
              <img
                src="https://via.placeholder.com/220"
                alt="Mohit Jangra"
                className="ab-img"
              />
            </div>

            {/* Available badge */}
            <div className="ab-badge">
              <span className="ab-badge-dot" />
              Available for work
            </div>
          </div>

          {/* ── Right: Content ── */}
          <div ref={contentRef} className={`ab-content${contentVis ? " visible" : ""}`}>
            <span className="ab-eyebrow">Who I am</span>
            <h2 className="ab-title">Mohit Jangra</h2>
            <p className="ab-role">Full-Stack Web Developer</p>
            <div className="ab-rule" />

            <p className="ab-bio">
              I'm a passionate web developer skilled in HTML, CSS, JavaScript,
              React, and Python. I love crafting modern, user-friendly
              applications — turning ideas into polished digital experiences
              while continuously sharpening my problem-solving skills.
            </p>

            {/* Stats */}
            <div className="ab-stats">
              {STATS.map(s => (
                <div className="ab-stat" key={s.label}>
                  <span className="ab-stat-num">{s.num}</span>
                  <span className="ab-stat-label">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Tech tags */}
            <div className="ab-tags">
              {TAGS.map(t => (
                <span className="ab-tag" key={t}>{t}</span>
              ))}
            </div>

            {/* CTA */}
            <div className="ab-ctas">
              <a href="#contact" className="ab-btn-primary">Hire Me →</a>
              <a href="#projects" className="ab-btn-ghost">View Work</a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default About;
