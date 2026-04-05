import React, { useRef, useState, useEffect } from "react";

/* ─── Inline styles ─────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ct-section {
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

  /* ── Ambient blobs ── */
  .ct-blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(90px);
    z-index: 0;
  }
  .ct-blob-1 {
    width: 520px; height: 520px;
    background: radial-gradient(circle, rgba(201,168,76,0.07), transparent 70%);
    top: -140px; right: -100px;
    animation: ctDrift 11s ease-in-out infinite alternate;
  }
  .ct-blob-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(59,130,246,0.06), transparent 70%);
    bottom: -80px; left: -80px;
    animation: ctDrift 14s 3s ease-in-out infinite alternate-reverse;
  }
  @keyframes ctDrift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px,25px) scale(1.12); }
  }

  /* ── Grid layout ── */
  .ct-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 980px;
    display: grid;
    grid-template-columns: 1fr 1.35fr;
    gap: 32px;
    align-items: start;
  }

  /* ── Left panel ── */
  .ct-left {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: 24px;
    padding: 44px 36px;
    backdrop-filter: blur(12px);
    opacity: 0;
    transform: translateX(-30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .ct-left.visible {
    opacity: 1;
    transform: translateX(0);
  }

  .ct-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #c9a84c;
    display: block;
    margin-bottom: 14px;
  }

  .ct-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(30px, 4vw, 44px);
    font-weight: 900;
    line-height: 1.15;
    background: linear-gradient(135deg, #f1f5f9 0%, #c9a84c 55%, #f0d080 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 10px;
  }

  .ct-rule {
    width: 48px; height: 2px;
    background: linear-gradient(to right, #c9a84c, transparent);
    border-radius: 2px;
    margin-bottom: 22px;
  }

  .ct-tagline {
    color: #94a3b8;
    font-size: 14.5px;
    font-weight: 300;
    line-height: 1.75;
    margin-bottom: 36px;
  }

  /* Info rows */
  .ct-info-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    margin-bottom: 22px;
  }

  .ct-info-icon {
    width: 42px; height: 42px;
    border-radius: 12px;
    background: rgba(201,168,76,0.08);
    border: 1px solid rgba(201,168,76,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 17px;
    flex-shrink: 0;
    transition: transform 0.3s, background 0.3s;
  }
  .ct-info-row:hover .ct-info-icon {
    transform: rotate(-6deg) scale(1.1);
    background: rgba(201,168,76,0.14);
  }

  .ct-info-text {
    display: flex; flex-direction: column;
    gap: 2px;
  }
  .ct-info-label {
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    color: #475569;
  }
  .ct-info-value {
    font-size: 14px;
    color: #e2e8f0;
    font-weight: 400;
    text-decoration: none;
    transition: color 0.3s;
    word-break: break-all;
  }
  .ct-info-value:hover { color: #c9a84c; }

  /* Social links */
  .ct-social {
    display: flex;
    gap: 10px;
    margin-top: 32px;
    padding-top: 28px;
    border-top: 1px solid rgba(255,255,255,0.06);
    flex-wrap: wrap;
  }

  .ct-social-btn {
    padding: 8px 16px;
    border-radius: 50px;
    border: 1px solid rgba(201,168,76,0.2);
    background: transparent;
    color: #94a3b8;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.5px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.3s;
    font-family: 'DM Sans', sans-serif;
  }
  .ct-social-btn:hover {
    border-color: #c9a84c;
    color: #c9a84c;
    background: rgba(201,168,76,0.06);
    transform: translateY(-2px);
  }

  /* ── Right panel — Form ── */
  .ct-right {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: 24px;
    padding: 44px 40px;
    backdrop-filter: blur(12px);
    opacity: 0;
    transform: translateX(30px);
    transition: opacity 0.8s 0.15s ease, transform 0.8s 0.15s ease;
  }
  .ct-right.visible {
    opacity: 1;
    transform: translateX(0);
  }

  .ct-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 28px;
    display: flex; align-items: center; gap: 10px;
  }
  .ct-form-title::after {
    content: '';
    flex: 1; height: 1px;
    background: linear-gradient(to right, rgba(201,168,76,0.3), transparent);
  }

  /* Field wrapper */
  .ct-field {
    margin-bottom: 18px;
    position: relative;
  }

  .ct-field label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #475569;
    margin-bottom: 7px;
    transition: color 0.3s;
  }
  .ct-field:focus-within label {
    color: #c9a84c;
  }

  .ct-field input,
  .ct-field textarea {
    width: 100%;
    padding: 14px 18px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    color: #f1f5f9;
    outline: none;
    transition: border-color 0.35s, background 0.35s, box-shadow 0.35s;
    resize: vertical;
    box-sizing: border-box;
  }
  .ct-field input::placeholder,
  .ct-field textarea::placeholder {
    color: #334155;
  }
  .ct-field input:focus,
  .ct-field textarea:focus {
    border-color: rgba(201,168,76,0.5);
    background: rgba(201,168,76,0.04);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.1);
  }

  /* Two-col row */
  .ct-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  /* Subject chips */
  .ct-chips {
    display: flex; flex-wrap: wrap; gap: 8px;
    margin-bottom: 18px;
  }
  .ct-chip {
    padding: 6px 14px;
    border-radius: 50px;
    border: 1px solid rgba(255,255,255,0.08);
    background: transparent;
    color: #475569;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.25s;
  }
  .ct-chip:hover,
  .ct-chip.active {
    border-color: #c9a84c;
    color: #c9a84c;
    background: rgba(201,168,76,0.07);
  }
  .ct-chip-label {
    font-size: 11px; font-weight: 600; letter-spacing: 2px;
    text-transform: uppercase; color: #475569;
    display: block; margin-bottom: 9px;
  }

  /* Submit button */
  .ct-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #c9a84c, #a8783a);
    color: #060b14;
    border: none;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.8px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.23,1,0.32,1);
    box-shadow: 0 6px 28px rgba(201,168,76,0.25);
    position: relative;
    overflow: hidden;
    margin-top: 8px;
  }
  .ct-btn::after {
    content: '';
    position: absolute;
    top: -50%; left: -60%;
    width: 50%; height: 200%;
    background: rgba(255,255,255,0.2);
    transform: skewX(-20deg);
    transition: left 0.5s ease;
  }
  .ct-btn:hover {
    background: linear-gradient(135deg, #f0d080, #c9a84c);
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(201,168,76,0.4);
  }
  .ct-btn:hover::after { left: 130%; }
  .ct-btn:active { transform: translateY(0); }
  .ct-btn:disabled {
    opacity: 0.6; cursor: not-allowed; transform: none;
  }

  /* Success state */
  .ct-success {
    text-align: center;
    padding: 40px 20px;
    animation: fadeUp 0.6s ease both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ct-success-icon {
    font-size: 48px;
    display: block;
    margin-bottom: 16px;
  }
  .ct-success h3 {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    color: #f1f5f9;
    margin: 0 0 10px;
  }
  .ct-success p {
    color: #94a3b8;
    font-size: 14px;
    font-weight: 300;
  }

  /* Responsive */
  @media (max-width: 820px) {
    .ct-wrapper {
      grid-template-columns: 1fr;
      max-width: 560px;
    }
    .ct-left, .ct-right { transform: none !important; }
  }
  @media (max-width: 480px) {
    .ct-section { padding: 60px 16px; }
    .ct-left, .ct-right { padding: 32px 24px; }
    .ct-row { grid-template-columns: 1fr; }
  }
`;

const SUBJECTS = ["Collaboration", "Freelance", "Just Saying Hi 👋", "Job Opportunity"];

/* ─── Component ─────────────────────────────────────────── */
const Contact = () => {
  const leftRef  = useRef(null);
  const rightRef = useRef(null);
  const [leftVis,  setLeftVis]  = useState(false);
  const [rightVis, setRightVis] = useState(false);

  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [subject, setSubject] = useState("");
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);

  /* Intersection observers */
  useEffect(() => {
    const obs = (ref, setter) =>
      new IntersectionObserver(([e]) => { if (e.isIntersecting) setter(true); }, { threshold: 0.15 });
    const o1 = obs(leftRef,  setLeftVis);
    const o2 = obs(rightRef, setRightVis);
    if (leftRef.current)  o1.observe(leftRef.current);
    if (rightRef.current) o2.observe(rightRef.current);
    return () => { o1.disconnect(); o2.disconnect(); };
  }, []);

  const handleChange = e =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1600);
  };

  return (
    <>
      <style>{css}</style>
      <section className="ct-section" id="contact">
        <div className="ct-blob ct-blob-1" />
        <div className="ct-blob ct-blob-2" />

        <div className="ct-wrapper">
          {/* ── Left ── */}
          <div ref={leftRef} className={`ct-left${leftVis ? " visible" : ""}`}>
            <span className="ct-eyebrow">Get in touch</span>
            <h2 className="ct-title">Let's Work<br />Together</h2>
            <div className="ct-rule" />
            <p className="ct-tagline">
              Open to collaborations, freelance work, or just a friendly hello.
              I'll get back to you within 24 hours.
            </p>

            {/* Info rows */}
            {[
              { icon: "✉️", label: "Email",  value: "mohitjangra582@gmail.com",  href: "mailto:mohitjangra582@gmail.com" },
              { icon: "📞", label: "Phone",  value: "+91 8708327044",             href: "tel:+918708327044" },
              { icon: "📍", label: "Based",  value: "India",                      href: null },
            ].map(item => (
              <div className="ct-info-row" key={item.label}>
                <div className="ct-info-icon">{item.icon}</div>
                <div className="ct-info-text">
                  <span className="ct-info-label">{item.label}</span>
                  {item.href
                    ? <a href={item.href} className="ct-info-value">{item.value}</a>
                    : <span className="ct-info-value">{item.value}</span>
                  }
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="ct-social">
              {[
                { label: "GitHub",   href: "#" },
                { label: "LinkedIn", href: "#" },
                { label: "Twitter",  href: "#" },
              ].map(s => (
                <a key={s.label} href={s.href} className="ct-social-btn">{s.label}</a>
              ))}
            </div>
          </div>

          {/* ── Right — Form ── */}
          <div ref={rightRef} className={`ct-right${rightVis ? " visible" : ""}`}>
            {sent ? (
              <div className="ct-success">
                <span className="ct-success-icon">✨</span>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. I'll get back to you soon.</p>
              </div>
            ) : (
              <>
                <div className="ct-form-title">Send a Message</div>

                {/* Subject chips */}
                <span className="ct-chip-label">Topic</span>
                <div className="ct-chips">
                  {SUBJECTS.map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`ct-chip${subject === s ? " active" : ""}`}
                      onClick={() => setSubject(s === subject ? "" : s)}
                    >{s}</button>
                  ))}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="ct-row">
                    <div className="ct-field">
                      <label>Name</label>
                      <input
                        name="name" type="text"
                        placeholder="Mohit jangra"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="ct-field">
                      <label>Email</label>
                      <input
                        name="email" type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="ct-field">
                    <label>Message</label>
                    <textarea
                      name="message"
                      placeholder="Tell me what you have in mind…"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="ct-btn" disabled={sending}>
                    {sending ? "Sending…" : "Send Message →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
