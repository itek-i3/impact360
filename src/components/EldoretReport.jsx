import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// ─── Data ────────────────────────────────────────────────────────────────────

const systems = [
  {
    number: "01",
    name: "Trust Economy",
    score: 90,
    tag: "Strongest System",
    tagColor: "#10B981",
    body: "Eldoret's greatest asset is invisible. Community trust networks — built through cultural institutions, faith communities, and longstanding trade relationships — scored 90% and form the true infrastructure of the city's economy. Capital, talent, and information move through these channels faster than any formal system.",
    insight: "Formalizing these trust channels creates immediate leverage. Every other system rides on top of this one.",
    photo: "/eldoret/Eldoret2.jpg",
  },
  {
    number: "02",
    name: "Builders Economy",
    score: 75,
    tag: "Strong",
    tagColor: "#306CEC",
    body: "Entrepreneurial activity is vigorous across agribusiness, logistics, education, and trade. The roadshow surfaced a high density of active builders who have started ventures without institutional support — driven purely by necessity and ambition. These are not aspiring founders. They are already building.",
    insight: "The missing piece is not motivation. It's mentorship, market access, and structured pathways to scale.",
    photo: "/eldoret/Eldoret4.jpg",
  },
  {
    number: "03",
    name: "Access Economy",
    score: 25,
    scoreSub: "formal",
    scoreAlt: 75,
    scoreAltSub: "informal",
    tag: "Critical Gap",
    tagColor: "#EF4444",
    body: "Informal capital — chamas, family networks, peer lending — flows freely at 75%. Formal capital sits at just 25%. No functional angel network or VC presence exists in Eldoret. Most founders have never had a conversation with an institutional investor. The gap is not knowledge. It is access.",
    insight: "Bridging formal capital access is the single highest-leverage intervention for the Eldoret ecosystem.",
    photo: "/eldoret/Eldoret1.jpg",
  },
  {
    number: "04",
    name: "Digital Economy",
    score: 75,
    scoreSub: "aware",
    scoreAlt: 50,
    scoreAltSub: "adopted",
    tag: "Growing",
    tagColor: "#8B5CF6",
    body: "Technology awareness is high — founders understand digital tools and their potential. Adoption lags at 50%, held back by connectivity costs, device access, and absence of localized support. University graduates arrive digitally literate. The adoption gap sits in the small business middle layer where it matters most.",
    insight: "A focused digital-tools cohort tied to real revenue outcomes would close this gap rapidly.",
    photo: "/eldoret/Eldoret3.jpg",
  },
  {
    number: "05",
    name: "Visibility & Storytelling",
    score: 75,
    tag: "Underused",
    tagColor: "#F59E0B",
    body: "Eldoret's ecosystem is poorly documented and underrepresented in national narratives. Despite a 75% market opportunity score, founders lack access to media platforms, content creation skills, and distribution channels. The roadshow itself became a visibility event — the first time many participants saw their ecosystem documented and reflected back at them.",
    insight: "Every city needs its own storytellers. Supporting local media creators multiplies every other investment.",
    photo: "/eldoret/Eldoret5.jpg",
  },
];

const dashboard = [
  { label: "Community Trust Networks", value: "90%", color: "#10B981" },
  { label: "Entrepreneurial Activity", value: "75%", color: "#306CEC" },
  { label: "Informal Capital", value: "75%", color: "#8B5CF6" },
  { label: "Talent Production", value: "75%", color: "#306CEC" },
  { label: "Tech Awareness", value: "75%", color: "#06B6D4" },
  { label: "Market Opportunity", value: "75%", color: "#10B981" },
  { label: "Tech Adoption", value: "50%", color: "#F59E0B" },
  { label: "Support Infrastructure", value: "30%", color: "#EF4444" },
  { label: "Formal Capital", value: "25%", color: "#EF4444" },
];

const recommendations = [
  {
    n: "01",
    title: "Formalize the Trust Networks",
    body: "Design programs that plug into existing community trust infrastructure — chamas, faith groups, trade associations — to deliver startup support and early-stage capital without pulling founders out of the networks that already sustain them.",
    priority: "High",
  },
  {
    n: "02",
    title: "Launch an Investor-Readiness Track",
    body: "The 25% formal capital score reveals a systemic gap. A dedicated cohort covering financial modelling, due diligence preparation, and pitch practice would unlock access to the national and diaspora investor base.",
    priority: "High",
  },
  {
    n: "03",
    title: "Close the Digital Adoption Gap",
    body: "Partner with tech companies to deliver subsidized, localized digital tools training tied to real revenue outcomes. Pairing adoption with income generation is the fastest path from awareness to sustained use.",
    priority: "Medium",
  },
  {
    n: "04",
    title: "Fund Local Storytellers",
    body: "Eldoret's ecosystem is underdocumented. Supporting local journalists, content creators, and filmmakers to tell the city's innovation story would multiply the reach of every other investment and attract outside attention.",
    priority: "Medium",
  },
];

// ─── Animation ───────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Colors (always dark) ────────────────────────────────────────────────────
const C = {
  bg: "#000000",
  bgAlt: "#0a0a0a",
  bgDash: "#0c0c0c",
  text: "#f1f5f9",
  muted: "#64748b",
  border: "rgba(255,255,255,0.08)",
};

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function EldoretReport() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, color: C.text, minHeight: "100vh" }}>
      <Navbar />

      {/* ── Reports nav ─────────────────────────────────────────────────── */}
      <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, paddingTop: "80px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted }}>Reports</span>
          <span style={{ color: C.muted, margin: "0 4px" }}>·</span>
          <a href="/campaign" style={{ fontSize: 13, fontWeight: 600, color: C.muted, textDecoration: "none", padding: "4px 14px", borderRadius: 100, border: `1px solid ${C.border}`, transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.color = "#306CEC"; e.target.style.borderColor = "#306CEC"; }}
            onMouseLeave={e => { e.target.style.color = C.muted; e.target.style.borderColor = C.border; }}>
            Nakuru
          </a>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "#306CEC", padding: "4px 14px", borderRadius: 100 }}>Eldoret</span>
          <a href="/campaign/kisumu" style={{ fontSize: 13, fontWeight: 600, color: C.muted, textDecoration: "none", padding: "4px 14px", borderRadius: 100, border: `1px solid ${C.border}`, transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.color = "#306CEC"; e.target.style.borderColor = "#306CEC"; }}
            onMouseLeave={e => { e.target.style.color = C.muted; e.target.style.borderColor = C.border; }}>
            Kisumu
          </a>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ position: "relative", height: "100vh", minHeight: 600, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: heroY }}>
          <img src="/eldoret/heroImg.jpg" alt="Eldoret roadshow"
            style={{ width: "100%", height: "110%", objectFit: "cover", objectPosition: "center top" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #000 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)" }} />
        </motion.div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, fontSize: "clamp(80px,18vw,220px)", fontWeight: 900, color: "rgba(255,255,255,0.04)", lineHeight: 0.85, letterSpacing: "-0.04em", userSelect: "none", pointerEvents: "none", paddingLeft: "2vw", overflow: "hidden" }}>
          ELDORET
        </div>

        <motion.div style={{ position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", padding: "0 24px 72px", width: "100%", opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, background: "rgba(48,108,236,0.15)", border: "1px solid rgba(48,108,236,0.35)", borderRadius: 100, padding: "6px 16px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#306CEC" }}>State of Decentralization Report</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(2.8rem,6vw,5.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 20px", maxWidth: 720 }}>
            The city that never stopped building.
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)" }}>
              <MapPin size={14} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>Eldoret, Uasin Gishu County, Kenya</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Mariama Waiganjo &amp; Samuel Obukosia · Impact360 &amp; TOIG</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }} style={{ marginTop: 32 }}>
            <a href="#report" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#306CEC", color: "#fff", fontWeight: 700, fontSize: 14, padding: "12px 28px", borderRadius: 100, textDecoration: "none", boxShadow: "0 8px 32px rgba(48,108,236,0.4)" }}>
              Read the report <ArrowRight size={16} />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section style={{ background: "#000", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          {[{ v: "45", l: "Attendees" }, { v: "5", l: "Systems Mapped" }, { v: "90%", l: "Community Trust" }, { v: "25%", l: "Formal Capital" }].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ textAlign: "center", padding: "16px 12px", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <p style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, color: "#306CEC", lineHeight: 1, margin: 0 }}>{s.v}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 6 }}>{s.l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section id="report" style={{ background: C.bg, padding: "100px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#306CEC", marginBottom: 24 }}>Overview</motion.p>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 400, lineHeight: 1.7, color: C.text, margin: 0 }}>
            On the day of the Eldoret Impact360 Roadshow, 45 founders, community builders, and ecosystem stakeholders gathered to do something rarely done in Kenyan innovation: look honestly at where a city actually stands. The result is this report — a five-system analysis of Eldoret's innovation economy, scored live in the room, documented as a baseline for the National Decentralization Index.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ marginTop: 40, paddingLeft: 24, borderLeft: "3px solid #306CEC" }}>
            <p style={{ fontSize: "clamp(1.1rem,2vw,1.35rem)", fontWeight: 600, fontStyle: "italic", lineHeight: 1.6, color: C.text, margin: 0 }}>
              "Eldoret has always had the talent. What it hasn't had is a mirror."
            </p>
          </motion.div>
        </div>
      </section>


      {/* ── Five Systems header ──────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: "80px 24px 40px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#306CEC", marginBottom: 12 }}>Framework</p>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: C.text, margin: "0 0 16px" }}>Five Economic Systems</h2>
            <p style={{ fontSize: 15, color: C.muted, maxWidth: 520, lineHeight: 1.6, margin: 0 }}>Eldoret's ecosystem mapped and scored across five interconnected systems that determine how innovation thrives — or stalls.</p>
          </motion.div>
        </div>
      </section>

      {/* ── Systems chapters ─────────────────────────────────────────────── */}
      {systems.map((sys, i) => (
        <motion.section key={sys.number}
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}
          style={{ background: C.bg, padding: "80px 24px", borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}
            className="sys-grid">
            {/* text */}
            <div style={{ order: i % 2 === 0 ? 0 : 1 }} className="sys-text">
              <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
                <span style={{ fontSize: "clamp(5rem,9vw,8rem)", fontWeight: 900, lineHeight: 0.9, color: sys.tagColor, opacity: 0.12, letterSpacing: "-0.04em", userSelect: "none", flexShrink: 0 }}>{sys.number}</span>
                <div style={{ paddingTop: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: sys.tagColor, background: `${sys.tagColor}18`, padding: "3px 10px", borderRadius: 100, display: "inline-block", marginBottom: 8 }}>{sys.tag}</span>
                  <h3 style={{ fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: C.text, margin: 0 }}>{sys.name}</h3>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} style={{ display: "flex", gap: 28, marginBottom: 24 }}>
                <div>
                  <p style={{ fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 900, color: sys.tagColor, lineHeight: 1, margin: 0 }}>{sys.score}%</p>
                  {sys.scoreSub && <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{sys.scoreSub}</p>}
                </div>
                {sys.scoreAlt !== undefined && (
                  <>
                    <div style={{ width: 1, background: C.border }} />
                    <div>
                      <p style={{ fontSize: "clamp(2.5rem,5vw,4rem)", fontWeight: 900, color: "#306CEC", lineHeight: 1, margin: 0 }}>{sys.scoreAlt}%</p>
                      {sys.scoreAltSub && <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{sys.scoreAltSub}</p>}
                    </div>
                  </>
                )}
              </motion.div>

              <motion.p variants={fadeUp} style={{ fontSize: 15, lineHeight: 1.8, color: "#94a3b8", margin: "0 0 24px" }}>{sys.body}</motion.p>

              <motion.div variants={fadeUp} style={{ background: `${sys.tagColor}0f`, borderLeft: `3px solid ${sys.tagColor}`, padding: "14px 18px", borderRadius: "0 8px 8px 0" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>{sys.insight}</p>
              </motion.div>
            </div>

            {/* photo */}
            <motion.div variants={fadeUp} className="sys-photo"
              style={{ order: i % 2 === 0 ? 1 : 0, borderRadius: 16, overflow: "hidden", aspectRatio: "4/3", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
              <img src={sys.photo} alt={sys.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </motion.div>
          </div>
        </motion.section>
      ))}

      {/* ── Ecosystem Dashboard ──────────────────────────────────────────── */}
      <section style={{ background: C.bgDash, padding: "100px 24px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ marginBottom: 64 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#306CEC", marginBottom: 12 }}>Dashboard</p>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, margin: "0 0 16px" }}>Eldoret Ecosystem Dashboard</h2>
            <p style={{ fontSize: 14, color: C.muted, maxWidth: 480, lineHeight: 1.6 }}>Live scores generated by 45 participants. Baseline for the National Decentralization Index.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 2 }}>
            {dashboard.map((d, i) => (
              <motion.div key={i} variants={fadeUp}
                style={{ padding: "32px 28px", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, transition: "background 0.2s", cursor: "default" }}
                whileHover={{ background: "rgba(255,255,255,0.05)" }}>
                <p style={{ fontSize: "clamp(2.2rem,4vw,3rem)", fontWeight: 900, color: d.color, lineHeight: 1, margin: "0 0 10px" }}>{d.value}</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 16px" }}>{d.label}</p>
                <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                  <motion.div style={{ height: "100%", background: d.color, borderRadius: 2 }}
                    initial={{ width: 0 }} whileInView={{ width: d.value }} viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ── Recommendations ──────────────────────────────────────────────── */}
      <section style={{ background: C.bgAlt, padding: "100px 24px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ marginBottom: 64 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#306CEC", marginBottom: 12 }}>Next Steps</p>
            <h2 style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, margin: 0 }}>Recommendations</h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ display: "flex", flexDirection: "column" }}>
            {recommendations.map((r, i) => (
              <motion.div key={i} variants={fadeUp}
                style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 32, padding: "40px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 900, color: "#306CEC", opacity: 0.18, lineHeight: 1 }}>{r.n}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <h3 style={{ fontSize: "clamp(1.1rem,2vw,1.4rem)", fontWeight: 800, color: C.text, margin: 0 }}>{r.title}</h3>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: r.priority === "High" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)", color: r.priority === "High" ? "#EF4444" : "#F59E0B", whiteSpace: "nowrap" }}>{r.priority}</span>
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.8, color: "#94a3b8", margin: 0 }}>{r.body}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section style={{ background: C.bg, padding: "100px 24px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#306CEC", marginBottom: 24 }}>Be Part of It</motion.p>
            <motion.h2 variants={fadeUp} style={{ fontSize: "clamp(2rem,4.5vw,3.8rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.1, color: C.text, margin: "0 0 24px" }}>Decentralization starts with you.</motion.h2>
            <motion.p variants={fadeUp} style={{ fontSize: 16, lineHeight: 1.75, color: C.muted, marginBottom: 40 }}>
              Whether you're a founder, mentor, investor, or community leader — join Impact360 in building thriving innovation ecosystems across every county in Kenya.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              <a href="/events/roadshow" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#306CEC", color: "#fff", fontWeight: 700, fontSize: 14, padding: "14px 32px", borderRadius: 100, textDecoration: "none", boxShadow: "0 8px 32px rgba(48,108,236,0.35)" }}>
                Register for Mombasa <ArrowRight size={16} />
              </a>
              <a href="/events" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, padding: "14px 32px", borderRadius: 100, textDecoration: "none", color: C.text, border: `1.5px solid ${C.border}` }}>
                View all events <ArrowUpRight size={16} />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Other reports ────────────────────────────────────────────────── */}
      <section style={{ background: "#000", padding: "60px 24px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>Read More Reports</p>
            <h3 style={{ fontSize: "clamp(1.2rem,2.5vw,1.8rem)", fontWeight: 800, color: C.text, margin: 0 }}>The decentralization story continues.</h3>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="/campaign" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.text, fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 100, textDecoration: "none" }}>
              Nakuru Report <ArrowUpRight size={14} />
            </a>
            <a href="/campaign/kisumu" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.text, fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 100, textDecoration: "none" }}>
              Kisumu Report <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          .sys-grid { grid-template-columns: 1fr !important; }
          .sys-photo { order: -1 !important; }
          .sys-text { order: 0 !important; }
        }
      `}</style>

      <Footer />
    </div>
  );
}
