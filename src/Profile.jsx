import { useState, useEffect, useRef } from "react";

const GOLD = "#c9a84c";
const GOLD_DIM = "#8a6e2f";
const GOLD_GLOW = "rgba(201,168,76,0.12)";
const BLACK = "#0a0a0a";
const GRAY = "#1a1a1a";
const WHITE = "#f5f2ec";
const MUTED = "#555";
const MUTED_LIGHT = "#8890a0";

import AVATAR from './assets/profile_pic.jpeg';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background: ${BLACK};
    color: ${WHITE};
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    cursor: none;
  }

  a, button { cursor: none; }

  .cursor {
    width: 10px; height: 10px;
    background: ${GOLD};
    border-radius: 50%;
    position: fixed;
    top: 0; left: 0;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
  }
  .cursor-ring {
    width: 36px; height: 36px;
    border: 1px solid ${GOLD};
    border-radius: 50%;
    position: fixed;
    top: 0; left: 0;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    opacity: 0.5;
  }

  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    padding: 24px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 100;
    transition: border-color 0.3s, background 0.3s;
  }
  nav.scrolled {
    border-bottom: 1px solid rgba(201,168,76,0.2);
    background: rgba(10,10,10,0.92);
    backdrop-filter: blur(12px);
  }

  .hero-bg-text {
    position: absolute;
    top: 50%;
    left: -20px;
    transform: translateY(-50%);
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(180px, 28vw, 380px);
    color: transparent;
    -webkit-text-stroke: 1px rgba(201,168,76,0.06);
    white-space: nowrap;
    pointer-events: none;
    user-select: none;
    letter-spacing: -0.02em;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .fade-1 { opacity: 0; animation: fadeUp 0.8s ease 0.2s forwards; }
  .fade-2 { opacity: 0; animation: fadeUp 0.8s ease 0.4s forwards; }
  .fade-3 { opacity: 0; animation: fadeUp 0.8s ease 0.6s forwards; }
  .fade-4 { opacity: 0; animation: fadeUp 0.8s ease 0.8s forwards; }
  .fade-5 { opacity: 0; animation: fadeIn 1s ease 1.2s forwards; }

  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  .stack-item {
    padding: 28px 24px;
    background: ${BLACK};
    border-bottom: 2px solid transparent;
    transition: border-color 0.2s, background 0.2s;
  }
  .stack-item:hover { border-bottom-color: ${GOLD}; background: #111; }

  .service-card {
    background: ${GRAY};
    padding: 40px 32px;
    position: relative;
    overflow: hidden;
    transition: background 0.3s;
  }
  .service-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: ${GOLD};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s;
  }
  .service-card:hover::before { transform: scaleX(1); }
  .service-card:hover { background: #141414; }

  .btn-primary {
    padding: 14px 32px;
    background: ${GOLD};
    color: ${BLACK};
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    display: inline-block;
    transition: background 0.2s, transform 0.2s;
  }
  .btn-primary:hover { background: #e8c96a; transform: translateY(-2px); }

  .btn-ghost {
    padding: 14px 32px;
    background: transparent;
    color: ${WHITE};
    font-size: 13px;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-decoration: none;
    display: inline-block;
    border: 1px solid rgba(255,255,255,0.15);
    transition: border-color 0.2s, transform 0.2s;
  }
  .btn-ghost:hover { border-color: ${GOLD}; transform: translateY(-2px); }

  .exp-row {
    display: grid;
    grid-template-columns: 200px 1fr auto;
    gap: 32px;
    align-items: start;
    padding: 36px 0;
    border-bottom: 1px solid rgba(201,168,76,0.12);
  }
  .exp-row:first-child { border-top: 1px solid rgba(201,168,76,0.12); }

  .consulting-row {
    display: grid;
    grid-template-columns: 200px 1fr auto;
    gap: 32px;
    align-items: start;
    padding: 28px 0;
    border-bottom: 1px solid rgba(201,168,76,0.08);
  }
  .consulting-row:first-child { border-top: 1px solid rgba(201,168,76,0.08); }

  .contact-link {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 14px;
    color: ${BLACK};
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
  }
  .contact-link:hover { opacity: 0.6; }

  @media (max-width: 768px) {
    nav { padding: 20px 24px; }
    .nav-links { display: none; }
    .about-grid, .contact-grid { grid-template-columns: 1fr; }
    .services-grid { grid-template-columns: 1fr 1fr; }
    .stack-grid { grid-template-columns: repeat(2, 1fr); }
    .exp-row, .consulting-row { grid-template-columns: 1fr; gap: 8px; }
    section, .hero-section { padding-left: 24px !important; padding-right: 24px !important; }
  }
`;

function Cursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  useEffect(() => {
    const move = e => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", move);
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;
      if (cursorRef.current) { cursorRef.current.style.left = pos.current.x + "px"; cursorRef.current.style.top = pos.current.y + "px"; }
      if (ringRef.current) { ringRef.current.style.left = ring.current.x + "px"; ringRef.current.style.top = ring.current.y + "px"; }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(raf.current); };
  }, []);
  return (<><div className="cursor" ref={cursorRef} /><div className="cursor-ring" ref={ringRef} /></>);
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => { if (e.isIntersecting) setTimeout(() => e.target.classList.add("visible"), i * 100); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={scrolled ? "scrolled" : ""}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.08em", color: GOLD }}>SJ</div>
      <div className="nav-links" style={{ display: "flex", gap: 32 }}>
        {["About", "Stack", "Experience", "Services", "Contact"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`}
            style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = WHITE}
            onMouseLeave={e => e.target.style.color = MUTED}>{l}</a>
        ))}
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero-section" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 48px 80px", position: "relative", overflow: "hidden" }}>
      <div className="hero-bg-text">JOZI</div>
      <div className="fade-1" style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 24 }}>
        // Available for engagements — South Africa & Remote
      </div>
      <h1 className="fade-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(72px, 12vw, 160px)", lineHeight: 0.9, letterSpacing: "-0.02em", marginBottom: 32 }}>
        SIVE<br /><span style={{ color: GOLD }}>JOZI</span>
      </h1>
      <p className="fade-3" style={{ maxWidth: 540, fontSize: 16, lineHeight: 1.7, color: "#888", marginBottom: 48 }}>
        Software engineer with 10+ years in financial sector systems — from trading desks at Standard Bank to cloud-native architecture and data-driven solutions. I build systems that scale and solve problems that matter.
      </p>
      <div className="fade-4" style={{ display: "flex", gap: 16 }}>
        <a href="#contact" className="btn-primary">Let's work together</a>
        <a href="#experience" className="btn-ghost">View experience</a>
      </div>
      <div className="fade-5" style={{ position: "absolute", right: 48, bottom: 80, writingMode: "vertical-rl", fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: GOLD_DIM, textTransform: "uppercase" }}>
        Scroll to explore
      </div>
    </section>
  );
}

function About() {
  const stats = [
    { num: "10+", label: "Years experience" },
    { num: "FS", label: "Financial sector focus" },
    { num: "MEng", label: "Data Science (ongoing)" },
    { num: "JHB", label: "Based in South Africa" },
  ];
  return (
    <section id="about" style={{ padding: "120px 48px" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>// 01 — About</div>
      <div className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 1, marginBottom: 64 }}>Built for<br />complex problems.</div>
      <div className="about-grid reveal" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 64, alignItems: "start" }}>
        <div>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#999", marginBottom: 20 }}>
            I'm a <strong style={{ color: WHITE, fontWeight: 500 }}>software engineer</strong> based in Johannesburg with over a decade of experience in financial sector systems — from trading desks and structured solutions to cloud-native microservices and data engineering.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#999", marginBottom: 20 }}>
            My background spans <strong style={{ color: WHITE, fontWeight: 500 }}>Standard Bank, FNB, and FDM Group</strong>, working on in-house trading systems, market data integration with Bloomberg and Murex, and enterprise-grade Java backends.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#999", marginBottom: 48 }}>
            Currently completing a <strong style={{ color: WHITE, fontWeight: 500 }}>MEng in Data Science</strong> at the Stellenbosch University, researching scalable approaches to automating market data validation and prediction using cloud-native microservices and machine learning.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 2 }}>
            {stats.map(s => (
              <div key={s.label} style={{ background: GRAY, padding: "28px 20px", borderTop: `2px solid ${GOLD}` }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: GOLD, lineHeight: 1, marginBottom: 8 }}>{s.num}</div>
                <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.05em", textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 240, height: 240, borderRadius: "50%", overflow: "hidden", border: `3px solid ${GOLD}`, boxShadow: "0 0 48px rgba(201,168,76,0.25)" }}>
              <img src={AVATAR} alt="Sive Jozi" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
            </div>
            <div style={{ position: "absolute", bottom: 10, right: 10, width: 18, height: 18, borderRadius: "50%", background: "#4CAF50", border: `2px solid ${BLACK}` }} />
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: WHITE, letterSpacing: "0.06em" }}>SIVE JOZI</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: GOLD, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>Software Engineer</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stack() {
  const items = [
    { cat: "Backend", name: "Java Spring Boot" },
    { cat: "Messaging", name: "Apache Kafka" },
    { cat: "ML / Data", name: "Python FastAPI" },
    { cat: "Database", name: "PostgreSQL / SQL Server" },
    { cat: "Cache", name: "Redis" },
    { cat: "Cloud", name: "AWS" },
    { cat: "Containers", name: "Kubernetes" },
    { cat: "Containers", name: "Docker" },
    { cat: "Frontend", name: "React" },
    { cat: "CI/CD", name: "GitHub,GitLab, Jenkins / Argo CD" },
  ];
  return (
    <section id="stack" style={{ padding: "120px 48px", background: GRAY }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>// 02 — Technology Stack</div>
      <div className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 1, marginBottom: 64 }}>What I<br />build with.</div>
      <div className="stack-grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 2 }}>
        {items.map(item => (
          <div key={item.name} className="stack-item">
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.2em", color: GOLD_DIM, textTransform: "uppercase", marginBottom: 8 }}>{item.cat}</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: WHITE }}>{item.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  const jobs = [
    { company: "Standard Bank", role: "Senior Software Engineer — Trading Systems", years: "Mar 2023 — Present", desc: "Software engineer in the Structured Solutions and Credit desks. Building and maintaining an in-house Java-based trading system. Integrating financial products via a C++ quant library, extracting market data from Bloomberg and Murex, and providing technical support to trading desks." },
    { company: "FNB South Africa", role: "Technical Lead | Senior Developer", years: "Oct 2021 — Feb 2023", desc: "Technical lead at FNB Commercial CJP Strategic IT. Translated business IT requirements into implementable solutions, led delivery of customer service systems, and mentored development teams across the function." },
    { company: "Standard Bank", role: "Software Engineer", years: "Sep 2016 — Sep 2021", desc: "Java developer on an in-house trading system serving the Structured Solutions desk across multiple asset classes and CVA, and the Credit desk for CLNs. Five years building and maintaining mission-critical financial infrastructure." },
    { company: "FDM Group", role: "Software Development Consultant", years: "Jan 2014 — Aug 2016", desc: "Software development consultant at Standard Bank London, working on Alchemy — an in-house trading system. Trained in Java, Spring, TDD, OOP design patterns, and enterprise web development." },
  ];
const consulting = [
  {
    company: "Solution Architecture",
    role: "Cloud-Native Systems Design",
    years: "2026",
    desc: "Designed event-driven microservices architectures for automated data ingestion, index computation, and contract adjustment engines. Stack: Java Spring Boot, Apache Kafka, Python FastAPI, PostgreSQL, Redis, React, Docker, Kubernetes."
  },
  {
    company: "Technical Consulting",
    role: "Enterprise Java Modernisation",
    years: "2024 — 2025",
    desc: "Migrated legacy WebLogic-specific Java applications to Spring Boot with Maven, upgrading the Java version and decoupling from vendor-specific APIs to make the codebase scale-ready and portable across environments."
  },
];
  return (
    <section id="experience" style={{ padding: "120px 48px" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>// 03 — Experience</div>
      <div className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 1, marginBottom: 64 }}>Where I've<br />delivered.</div>
      <div className="reveal">
        {jobs.map(j => (
          <div key={j.company + j.years} className="exp-row">
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: WHITE, letterSpacing: "0.04em" }}>{j.company}</div>
              <div style={{ fontSize: 12, color: GOLD, marginTop: 4, fontFamily: "'DM Mono', monospace" }}>{j.role}</div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.75, color: "#666" }}>{j.desc}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: GOLD_DIM, whiteSpace: "nowrap", paddingTop: 3 }}>{j.years}</div>
          </div>
        ))}
      </div>
      <div className="reveal" style={{ marginTop: 80 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 16, opacity: 0.6 }}>// Additional — Advisory</div>
        <div style={{ width: 40, height: 1, background: GOLD, marginBottom: 32, opacity: 0.3 }} />
        {consulting.map(c => (
          <div key={c.company} className="consulting-row">
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: "#888", letterSpacing: "0.04em" }}>{c.company}</div>
              <div style={{ fontSize: 11, color: GOLD_DIM, marginTop: 4, fontFamily: "'DM Mono', monospace" }}>{c.role}</div>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.75, color: "#555" }}>{c.desc}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#444", whiteSpace: "nowrap", paddingTop: 3 }}>{c.years}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Services() {
  const items = [
    { n: "01", title: "Backend Engineering & APIs", desc: "Production-grade Java Spring Boot microservices, RESTful APIs, event-driven systems with Kafka, and enterprise integration. Built to scale." },
    { n: "02", title: "Cloud & DevOps", desc: "AWS architecture, Kubernetes orchestration, Docker containerisation, and CI/CD pipeline automation. Infrastructure that deploys with confidence." },
    { n: "03", title: "ML & Data Engineering", desc: "Python FastAPI ML services, ETL pipelines, and intelligent data validation systems. Bridging the gap between data science and production engineering." },
    { n: "04", title: "Solution Architecture", desc: "End-to-end system design for complex business problems. From requirements to technical proposals, architecture diagrams, and delivery plans." },
    { n: "05", title: "Financial Systems", desc: "Deep experience in trading systems, market data integration, pricing engines, and bank-level security. Bloomberg, Murex, structured products." },
    { n: "06", title: "Technical Consulting", desc: "Strategic technology advisory for organisations navigating complex engineering challenges. Architecture reviews nd delivery planning." },
  ];
  return (
    <section id="services" style={{ padding: "120px 48px", background: GRAY }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: GOLD, marginBottom: 16 }}>// 04 — Services</div>
      <div className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 1, marginBottom: 64 }}>What I<br />offer.</div>
      <div className="services-grid reveal" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
        {items.map(s => (
          <div key={s.n} className="service-card">
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, lineHeight: 1, marginBottom: 24, WebkitTextStroke: "1px rgba(201,168,76,0.15)", color: "transparent" }}>{s.n}</div>
            <div style={{ fontSize: 17, fontWeight: 500, color: WHITE, marginBottom: 12 }}>{s.title}</div>
            <div style={{ fontSize: 13, lineHeight: 1.7, color: MUTED }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const links = [
    { icon: "✉", label: "sivejozi@gmail.com", href: "mailto:sivejozi@gmail.com" },
    { icon: "✆", label: "076 310 3230", href: "tel:0763103230" },
    { icon: "in", label: "linkedin.com/in/sivejozi", href: "https://linkedin.com/in/sivejozi" },
  ];
  return (
    <section id="contact" style={{ padding: "120px 48px", background: GOLD }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 16 }}>// 05 — Contact</div>
      <div className="reveal" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(48px, 7vw, 96px)", lineHeight: 1, color: BLACK, marginBottom: 48 }}>Let's build<br />something.</div>
      <div className="contact-grid reveal" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "rgba(0,0,0,0.6)", marginBottom: 48 }}>
            Available for consulting engagements, technical partnerships, and project-based work across South Africa and remotely. Let's talk about what you're building.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {links.map(l => (
              <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} className="contact-link" rel="noreferrer">
                <div style={{ width: 40, height: 40, background: "rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{l.icon}</div>
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px, 6vw, 80px)", color: BLACK, lineHeight: 1, opacity: 0.1 }}>
          AVAILABLE<br />NOW.
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(201,168,76,0.2)", background: BLACK }}>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: "0.1em" }}>© 2026 Sive Jozi. All rights reserved.</p>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: MUTED, letterSpacing: "0.1em" }}>Johannesburg, South Africa</p>
    </footer>
  );
}

export default function Profile() {
  useReveal();
  return (
    <>
      <style>{styles}</style>
      <Cursor />
      <Nav />
      <Hero />
      <About />
      <Stack />
      <Experience />
      <Services />
      <Contact />
      <Footer />
    </>
  );
}
