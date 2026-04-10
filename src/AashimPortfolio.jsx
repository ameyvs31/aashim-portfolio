import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["About", "Skills", "Experience", "Projects", "Education", "Contact"];

const SKILLS = [
  { title: "AutoCAD & Drafting",    color: "#2a9d8f", items: ["Planning & Design", "Submission Drawings", "Working Drawings", "Floor Plans", "Elevations & Sections"] },
  { title: "Estimation & Costing",  color: "#c8a96e", items: ["Quantity Survey (QS)", "Rate Analysis", "BOQ Preparation", "Material Estimation", "CPWD / SOR Norms"] },
  { title: "Bar Bending Schedule",  color: "#e76f51", items: ["Slabs & Beams", "Columns & Footings", "MS Steel Section Qty", "Cutting Length Calc", "IS Code Compliance"] },
  { title: "Billing",               color: "#457b9d", items: ["Slab Rate Bills", "Item-wise Bills", "RA / Reconciliation", "Price Escalation", "CPWD Format Billing"] },
  { title: "Highway Engineering",   color: "#a8c5da", items: ["Flexible Pavement", "Rigid Pavement (PQC)", "TCS Cross Sections", "Road Estimation", "GSB / DBM / BC"] },
  { title: "Tools",                 color: "#b5838d", items: ["AutoCAD", "MS Excel", "PWD Measurement Book", "Site Supervision", "IS Code Practice"] },
];

const PROJECTS = [
  {
    tag: "Residential · Structural",
    name: "2BHK Full Structural Package",
    desc: "Complete BBS, ground beam layout, footing schedule, area-filling plan, slab beam layout, staircase design, and quantity survey for a G+1 residential building. RCC M-25, Fe 415/500.",
    accent: "#2a9d8f",
    abbr: "2BHK",
  },
  {
    tag: "Government · Billing",
    name: "School Building — 12-Stage RA Billing",
    desc: "Progressive billing from plinth level to stair tower completion for a 32,387 sqft government school at Civil Guruji, Bhilai. Total project value over ₹10.28 crores across 12 cycles.",
    accent: "#c8a96e",
    abbr: "SCH",
  },
  {
    tag: "Infrastructure · Road",
    name: "Highway TCS-1 & TCS-3 Estimation",
    desc: "Quantity estimation for flexible (BC, DBM, WMM, GSB) and rigid (PQC, DLC) pavement sections for a 650m + 550m road corridor with site clearance, embankment, and earthen shoulder.",
    accent: "#e76f51",
    abbr: "HWY",
  },
  {
    tag: "Design · AutoCAD",
    name: "Residential Submission Drawing — Rajnandgaon",
    desc: "Full AutoCAD submission drawing for a 1,509 sqm plot — floor plans (G+F), front elevation, section X-X, septic tank plan, rain water harvesting detail, and opening schedule.",
    accent: "#457b9d",
    abbr: "CAD",
  },
];

const EXPERIENCE = [
  {
    period: "2024 — Present",
    company: "KRV Structural Consultants",
    role: "Civil Engineer",
    color: "#2a9d8f",
    bullets: [
      "Prepared AutoCAD drafting and working drawings for residential and commercial construction projects.",
      "Performed quantity estimation and MS steel section quantities for residential structures.",
      "Prepared Bar Bending Schedules (BBS) for slabs, beams, and columns per structural drawings.",
      "Assisted in site supervision to ensure work execution as per drawings and specifications.",
      "Highway estimation and costing for rigid & flexible pavements — material analysis and cost breakdowns.",
      "Billing proficiency: Slab Rate Bills, Item-wise Bills, Reconciliation Billing, Price Escalation Bills.",
    ],
  },
  {
    period: "Earlier",
    company: "Civil Guruji Pvt. Ltd.",
    role: "Civil Engineer · Site & Billing",
    color: "#c8a96e",
    bullets: [
      "Prepared detailed BBS and quantity estimation for 2BHK at Civil Guruji Technotownship, Sector 23.",
      "Managed 12-stage progressive RA billing for a Government School Building — total value over ₹10.28 crores.",
      "Executed item-wise billing for painting, putty, and whitewash works at Civil Guruji, Bhilai.",
      "Prepared PWD Measurement Books (XVIIE-35) following IS Code practices.",
      "Assisted in constructing Government Buildings at PWD, Durg with site inspection and material management.",
    ],
  },
];

const CONTACT_ITEMS = [
  { icon: "📞", type: "Phone",    val: "+91 74708 65241",              href: "tel:+917470865241" },
  { icon: "✉️", type: "Email",    val: "aashimpradeep03@gmail.com",     href: "mailto:aashimpradeep03@gmail.com" },
  { icon: "📍", type: "Location", val: "Tulsipur, Rajnandgaon, C.G.", href: null },
  { icon: "💼", type: "LinkedIn", val: "Aashim Pradeep",               href: "https://linkedin.com/in/aashimpradeep" },
];

// ─── Styles (CSS-in-JS object map) ───────────────────────────────────────────

const S = {
  // global
  body: {
    fontFamily: "'Outfit', 'DM Sans', sans-serif",
    background: "#0a0f1a",
    color: "#e8e4d9",
    lineHeight: 1.7,
    margin: 0,
    overflowX: "hidden",
  },
  container: { maxWidth: 1100, margin: "0 auto", width: "100%" },
  section: { padding: "5rem 2rem" },
  sectionDark: { padding: "5rem 2rem", background: "#0d1220" },

  // nav
  nav: (scrolled) => ({
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    background: scrolled ? "rgba(10,15,26,.97)" : "transparent",
    borderBottom: scrolled ? "1px solid rgba(200,169,110,.15)" : "none",
    padding: ".9rem 2rem",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    transition: "background .3s, border .3s",
    backdropFilter: scrolled ? "blur(10px)" : "none",
  }),
  navBrand: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "1.2rem", color: "#e8e4d9", letterSpacing: 1,
  },
  navLink: (active) => ({
    color: active ? "#c8a96e" : "rgba(232,228,217,.5)",
    fontSize: ".78rem", letterSpacing: "1.5px", textTransform: "uppercase",
    textDecoration: "none", transition: "color .2s", fontWeight: 500,
  }),

  // section header
  sectionLabel: {
    fontSize: ".7rem", letterSpacing: "3px", textTransform: "uppercase",
    color: "#2a9d8f", fontWeight: 600, marginBottom: ".5rem",
  },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "clamp(2rem,4vw,2.8rem)", color: "#e8e4d9", lineHeight: 1.2,
  },
};

// ─── Hook ────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
  const obs = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
      }
    },
    { threshold }
  );

  const currentRef = ref.current;

  if (currentRef) {
    obs.observe(currentRef);
  }

  return () => {
    if (currentRef) {
      obs.unobserve(currentRef);
    }
    obs.disconnect();
  };
}, [threshold]); // ✅ THIS IS THE FIX

  return [ref, visible];
}

// ─── Shared Components ───────────────────────────────────────────────────────

function SectionHeader({ label, title }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{ marginBottom: "3rem" }}>
      <div style={{ ...S.sectionLabel, opacity: vis ? 1 : 0, transition: "opacity .6s" }}>
        {label}
      </div>
      <h2 style={{
        ...S.sectionTitle,
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(20px)",
        transition: "opacity .6s .1s, transform .6s .1s",
      }}>
        {title}
      </h2>
      <div style={{
        width: vis ? 48 : 0, height: 2, background: "#c8a96e",
        marginTop: ".75rem", transition: "width .8s .3s ease",
      }} />
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = NAV_LINKS.map((n) => document.getElementById(n.toLowerCase()));
      const current = sections.findLast((s) => s && s.getBoundingClientRect().top <= 120);
      if (current) setActive(current.id);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={S.nav(scrolled)}>
      <span style={S.navBrand}>Er. Aashim Pradeep</span>
      <div style={{ display: "flex", gap: "2rem" }}>
        {NAV_LINKS.map((n) => (
          <a key={n} href={`#${n.toLowerCase()}`} style={S.navLink(active === n.toLowerCase())}>
            {n}
          </a>
        ))}
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        padding: "5rem 2rem 4rem", position: "relative", overflow: "hidden",
        background: "radial-gradient(ellipse at 70% 40%, rgba(42,157,143,.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(200,169,110,.06) 0%, transparent 50%), #0a0f1a",
      }}
    >
      {/* decorative rings */}
      {[["15%","8%",380,0.07,"#c8a96e"],["25%","12%",220,0.10,"#2a9d8f"],["80%","5%",160,0.06,"#c8a96e"]].map(([t,l,s,o,c],i) => (
        <div key={i} style={{ position:"absolute", top:t, left:l, width:s, height:s, border:`1px solid rgba(${c==="c8a96e"?"200,169,110":"42,157,143"},${o})`, borderRadius:"50%", pointerEvents:"none" }} />
      ))}

      <div style={S.container}>
        {/* badge */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:".5rem", background:"rgba(42,157,143,.12)", border:"1px solid rgba(42,157,143,.25)", borderRadius:2, padding:".3rem .9rem", marginBottom:"1.75rem", animation:"fadeUp .6s ease both" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#2a9d8f" }} />
          <span style={{ fontSize:".72rem", letterSpacing:"2px", color:"#2a9d8f", textTransform:"uppercase", fontWeight:600 }}>
            Open to Opportunities · Rajnandgaon, C.G.
          </span>
        </div>

        <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(3rem,7vw,5.5rem)", lineHeight:1.05, marginBottom:"1.5rem", color:"#e8e4d9", animation:"fadeUp .6s .1s ease both" }}>
          Building<br />
          <span style={{ color:"#c8a96e", fontStyle:"italic" }}>Safer,</span><br />
          Smarter Structures
        </h1>

        <p style={{ color:"rgba(232,228,217,.6)", fontSize:"1.05rem", maxWidth:520, marginBottom:"2.5rem", fontWeight:300, animation:"fadeUp .6s .25s ease both" }}>
          Civil Engineer with 2+ years of experience in AutoCAD drafting, quantity estimation, bar bending schedules, and project billing across residential and government infrastructure.
        </p>

        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginBottom:"4rem", animation:"fadeUp .6s .4s ease both" }}>
          <a href="#contact" style={{ background:"#2a9d8f", color:"#fff", padding:".75rem 1.75rem", borderRadius:2, textDecoration:"none", fontSize:".88rem", fontWeight:500 }}>
            Get in Touch
          </a>
          <a href="#projects" style={{ background:"transparent", color:"#c8a96e", padding:".75rem 1.75rem", borderRadius:2, textDecoration:"none", fontSize:".88rem", fontWeight:500, border:"1px solid rgba(200,169,110,.4)" }}>
            View Projects
          </a>
        </div>

        {/* stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, maxWidth:480, background:"rgba(232,228,217,.08)", borderRadius:4, overflow:"hidden", border:"1px solid rgba(232,228,217,.08)", animation:"fadeUp .6s .55s ease both" }}>
          {[["2+","Years Exp."],["12+","Bills Managed"],["₹10Cr+","Project Value"]].map(([n,l]) => (
            <div key={l} style={{ padding:"1.25rem 1rem", textAlign:"center", background:"rgba(10,15,26,.6)" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", color:"#c8a96e", lineHeight:1, marginBottom:".3rem" }}>{n}</div>
              <div style={{ fontSize:".68rem", color:"rgba(232,228,217,.45)", letterSpacing:"1px", textTransform:"uppercase" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  const [ref, vis] = useInView();
  return (
    <section id="about" style={S.sectionDark}>
      <div style={S.container}>
        <SectionHeader label="Who I Am" title="About Me" />
        <div
          ref={ref}
          style={{
            display:"grid", gridTemplateColumns:"1fr 1.8fr", gap:"4rem", alignItems:"start",
            opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)",
            transition: "all .7s ease",
          }}
        >
          {/* photo placeholder */}
          <div style={{ width:"100%", aspectRatio:"3/4", background:"linear-gradient(160deg,#151d2e,#1e2a3d)", border:"1px solid rgba(200,169,110,.15)", borderRadius:4, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1rem", position:"relative" }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(200,169,110,.25)" strokeWidth="1">
              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            <span style={{ fontSize:".75rem", color:"rgba(232,228,217,.3)", letterSpacing:1 }}>Add your photo here</span>
            <div style={{ position:"absolute", bottom:0, right:0, background:"#c8a96e", color:"#0a0f1a", padding:".4rem .9rem", fontSize:".72rem", fontWeight:700, borderRadius:"4px 0 4px 0", letterSpacing:1 }}>
              ER. AASHIM
            </div>
          </div>

          {/* text */}
          <div>
            <p style={{ color:"rgba(232,228,217,.7)", marginBottom:"1.2rem", fontWeight:300, fontSize:"1rem" }}>
              A dedicated Civil Engineer with practical experience constructing Government Buildings at PWD, Durg — developing strong skills in Quantity Surveying, Site Inspection, Material Management, Billing, Bar Bending Schedules, and Estimation.
            </p>
            <p style={{ color:"rgba(232,228,217,.7)", marginBottom:"1.2rem", fontWeight:300, fontSize:"1rem" }}>
              Currently working at{" "}
              <span style={{ color:"#c8a96e", fontWeight:500 }}>KRV Structural Consultants</span>{" "}
              while pursuing a B.Tech in Civil Engineering, bringing a unique blend of field experience and academic knowledge. Specialising in AutoCAD submission drawings and highway estimation for both rigid and flexible pavements.
            </p>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.2rem", marginTop:"2rem" }}>
              {[
                ["Location","Tulsipur, Rajnandgaon, C.G."],
                ["Phone","+91 74708 65241"],
                ["Email","aashimpradeep03@gmail.com"],
                ["LinkedIn","Aashim Pradeep"],
                ["Experience","2+ Years"],
                ["Status","Open to Work"],
              ].map(([l, v]) => (
                <div key={l} style={{ borderLeft:"2px solid rgba(200,169,110,.3)", paddingLeft:".9rem" }}>
                  <div style={{ fontSize:".68rem", textTransform:"uppercase", letterSpacing:"1.5px", color:"rgba(232,228,217,.35)", fontWeight:600, marginBottom:".2rem" }}>{l}</div>
                  <div style={{ fontSize:".88rem", color:"#e8e4d9" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────

function SkillCard({ skill, index }) {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      style={{
        background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)",
        borderTop:`2px solid ${skill.color}`, borderRadius:4, padding:"1.5rem",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)",
        transition: `all .6s ${index * 0.08}s ease`,
      }}
    >
      <h3 style={{ fontSize:".82rem", fontWeight:600, textTransform:"uppercase", letterSpacing:".5px", color:skill.color, marginBottom:".9rem" }}>
        {skill.title}
      </h3>
      <div style={{ display:"flex", flexWrap:"wrap", gap:".4rem" }}>
        {skill.items.map((t) => (
          <span key={t} style={{ background:"rgba(255,255,255,.05)", color:"rgba(232,228,217,.65)", padding:".25rem .65rem", borderRadius:2, fontSize:".76rem" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Skills() {
  return (
    <section id="skills" style={S.section}>
      <div style={S.container}>
        <SectionHeader label="What I Do" title="Core Skills" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"1.25rem" }}>
          {SKILLS.map((s, i) => <SkillCard key={s.title} skill={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function ExpItem({ exp, index }) {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      style={{
        position:"relative", paddingLeft:"2rem", marginBottom:"3.5rem",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-20px)",
        transition: `all .7s ${index * 0.15}s ease`,
      }}
    >
      <div style={{ position:"absolute", left:"-2rem", top:6, width:14, height:14, borderRadius:"50%", background:"#0a0f1a", border:`3px solid ${exp.color}` }} />
      <span style={{ display:"inline-block", background:exp.color, color:exp.color==="#c8a96e"?"#0a0f1a":"#fff", fontSize:".7rem", padding:".2rem .7rem", borderRadius:2, letterSpacing:"1.5px", textTransform:"uppercase", marginBottom:".6rem", fontWeight:600 }}>
        {exp.period}
      </span>
      <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"1.5rem", color:"#e8e4d9", marginBottom:".2rem" }}>
        {exp.company}
      </h3>
      <div style={{ fontSize:".78rem", color:"rgba(232,228,217,.4)", textTransform:"uppercase", letterSpacing:1, marginBottom:".9rem", fontWeight:500 }}>
        {exp.role}
      </div>
      <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:".55rem" }}>
        {exp.bullets.map((b) => (
          <li key={b} style={{ fontSize:".9rem", color:"rgba(232,228,217,.65)", fontWeight:300, paddingLeft:"1.2rem", position:"relative", lineHeight:1.65 }}>
            <span style={{ position:"absolute", left:0, color:exp.color, fontWeight:500 }}>—</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Experience() {
  return (
    <section id="experience" style={S.sectionDark}>
      <div style={S.container}>
        <SectionHeader label="Career" title="Work Experience" />
        <div style={{ position:"relative", paddingLeft:"2rem" }}>
          <div style={{ position:"absolute", left:7, top:10, bottom:10, width:2, background:"linear-gradient(to bottom,#2a9d8f,#c8a96e)" }} />
          {EXPERIENCE.map((e, i) => <ExpItem key={e.company} exp={e} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectCard({ project, index }) {
  const [ref, vis] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:"rgba(255,255,255,.02)",
        border:`1px solid ${hovered ? project.accent + "55" : "rgba(255,255,255,.07)"}`,
        borderRadius:4, overflow:"hidden",
        transform: hovered ? "translateY(-4px)" : vis ? "none" : "translateY(20px)",
        opacity: vis ? 1 : 0,
        transition: `opacity .6s ${index * 0.1}s ease, transform .25s, border .25s`,
        cursor:"default",
      }}
    >
      <div style={{ height:130, display:"flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(135deg,rgba(10,15,26,1),${project.accent}22)`, borderBottom:`1px solid ${project.accent}22`, position:"relative" }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"2.8rem", color:project.accent, opacity:.35, fontWeight:700, letterSpacing:4 }}>
          {project.abbr}
        </span>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:80, height:80, borderRadius:"50%", border:`1px solid ${project.accent}20` }} />
      </div>
      <div style={{ padding:"1.25rem" }}>
        <div style={{ fontSize:".68rem", textTransform:"uppercase", letterSpacing:"1.5px", color:project.accent, fontWeight:600, marginBottom:".4rem" }}>
          {project.tag}
        </div>
        <div style={{ fontWeight:500, fontSize:".92rem", color:"#e8e4d9", marginBottom:".6rem", lineHeight:1.4 }}>
          {project.name}
        </div>
        <p style={{ fontSize:".8rem", color:"rgba(232,228,217,.5)", fontWeight:300, lineHeight:1.65 }}>
          {project.desc}
        </p>
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" style={S.section}>
      <div style={S.container}>
        <SectionHeader label="Selected Work" title="Key Projects" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.25rem" }}>
          {PROJECTS.map((p, i) => <ProjectCard key={p.name} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Education ────────────────────────────────────────────────────────────────

const DEGREES = [
  { icon:"🎓", degree:"B.Tech in Civil Engineering", status:"(Pursuing)", uni:"Chhatrapati Shivaji Institute of Technology, Durg", board:"CSVTU, Bhilai", year:"2025 — Present", color:"#2a9d8f" },
  { icon:"📐", degree:"Diploma in Civil Engineering", status:"",            uni:"UPU Govt. Polytechnic, Durg",                       board:"CSVTU, Bhilai", year:"2021 — 2024",    color:"#c8a96e" },
];

function EduCard({ e, index }) {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      style={{
        background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)",
        borderRadius:4, padding:"1.75rem",
        opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)",
        transition: `all .6s ${index * 0.15}s ease`,
      }}
    >
      <div style={{ fontSize:"2rem", marginBottom:"1rem" }}>{e.icon}</div>
      <div style={{ fontWeight:600, fontSize:"1rem", color:"#e8e4d9", marginBottom:".2rem" }}>
        {e.degree}{" "}
        <span style={{ color:"rgba(232,228,217,.4)", fontWeight:300, fontSize:".88rem" }}>{e.status}</span>
      </div>
      <div style={{ fontSize:".82rem", color:"rgba(232,228,217,.5)", marginBottom:".15rem" }}>{e.uni}</div>
      <div style={{ fontSize:".78rem", color:"rgba(232,228,217,.35)", marginBottom:".75rem" }}>{e.board}</div>
      <div style={{ fontSize:".72rem", fontWeight:600, textTransform:"uppercase", letterSpacing:1, color:e.color }}>{e.year}</div>
    </div>
  );
}

function Education() {
  return (
    <section id="education" style={S.sectionDark}>
      <div style={S.container}>
        <SectionHeader label="Academic Background" title="Education" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.25rem" }}>
          {DEGREES.map((e, i) => <EduCard key={e.degree} e={e} index={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  const [ref, vis] = useInView();
  return (
    <section id="contact" style={S.section}>
      <div style={S.container}>
        <SectionHeader label="Let's Connect" title="Get In Touch" />
        <p style={{ color:"rgba(232,228,217,.5)", maxWidth:480, fontWeight:300, marginBottom:"3rem", fontSize:"1rem" }}>
          Open to full-time roles in estimation, BBS, billing, and AutoCAD drafting. Let's build something together.
        </p>
        <div
          ref={ref}
          style={{
            display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:1,
            background:"rgba(255,255,255,.06)", borderRadius:4, overflow:"hidden",
            border:"1px solid rgba(255,255,255,.06)",
            opacity:vis?1:0, transform:vis?"none":"translateY(20px)", transition:"all .7s ease",
          }}
        >
          {CONTACT_ITEMS.map((c) => (
            <div key={c.type} style={{ padding:"2rem 1.25rem", textAlign:"center", background:"rgba(10,15,26,.8)" }}>
              <div style={{ fontSize:"1.4rem", marginBottom:".75rem" }}>{c.icon}</div>
              <div style={{ fontSize:".68rem", textTransform:"uppercase", letterSpacing:"1.5px", color:"rgba(232,228,217,.35)", fontWeight:600, marginBottom:".35rem" }}>{c.type}</div>
              {c.href
                ? <a href={c.href} style={{ fontSize:".85rem", color:"#c8a96e", textDecoration:"none", wordBreak:"break-all" }}>{c.val}</a>
                : <div style={{ fontSize:".85rem", color:"rgba(232,228,217,.6)" }}>{c.val}</div>
              }
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ background:"#060a12", padding:"2rem", textAlign:"center", color:"rgba(232,228,217,.3)", fontSize:".78rem", borderTop:"1px solid rgba(255,255,255,.05)" }}>
      <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem", color:"rgba(232,228,217,.4)", marginBottom:".4rem" }}>
        Er. Aashim Pradeep
      </p>
      <p>Civil Engineer · Rajnandgaon, Chhattisgarh · 2025</p>
    </footer>
  );
}

// ─── Global CSS (inject once) ─────────────────────────────────────────────────

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { overflow-x: hidden; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0a0f1a; }
  ::-webkit-scrollbar-thumb { background: #c8a96e; border-radius: 2px; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function AashimPortfolio() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalCSS;
    document.head.appendChild(style);
    document.body.style.cssText = Object.entries(S.body).map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`).join(";");
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div>
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </div>
  );
}