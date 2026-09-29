import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

// ─── Data ────────────────────────────────────────────────────────────────────

const systems = [
  {
    number: "01",
    name: "The Fragmented Trust Economy",
    score: 85,
    scoreSub: "community trust",
    tag: "Strongest Asset",
    tagColor: "#10B981",
    body: "Where Eldoret's trust scaled into unifying chama infrastructure, Kisumu's trust stays locked at the level of the individual relationship — it never becomes an economic asset the wider community can draw on. Access to opportunity is almost entirely relationship-driven: two entrepreneurs with identical skill and work ethic can face entirely different trajectories based on whether one knows a relative at the County Government procurement office. Capital, contracts, and mentorship circulate in abundance — but only within closed loops.",
    insight: "Trust that cannot travel beyond the two people who share it cannot do the work of an economy at all.",
    photo: "/kisumu/S43A0042.jpg",
  },
  {
    number: "02",
    name: "The Builders Economy",
    score: 70,
    scoreSub: "entrepreneurial activity",
    scoreAlt: 83,
    scoreAltSub: "can't name an investment",
    tag: "Survival Mode",
    tagColor: "#F59E0B",
    body: "Despite cranes overhead and a visible construction boom, most participants could not name a single viable investment opportunity in their own city. Youth view construction profits as flowing to outsiders; tourism revenue clusters around a handful of players like Ciala Resort while the wider hospitality chain goes unexplored. A “no time” trap keeps micro-entrepreneurs from upskilling, and comfort on one end and resignation on the other rob the ecosystem of both risk-takers and grinders.",
    insight: "The cranes are visible. The value chain behind them is not — yet.",
    photo: "/kisumu/S43A0049.jpg",
  },
  {
    number: "03",
    name: "The Transactional Trap",
    score: 25,
    scoreSub: "support infra",
    scoreAlt: 20,
    scoreAltSub: "formal capital",
    tag: "Critical Gap",
    tagColor: "#EF4444",
    body: "A recurring expectation has taken hold: attending a workshop, a networking event, or a community initiative should come with payment. This transactional trap collapses voluntary engagement into a dependency cycle, while formal capital access sits at just 20% — no functional bridge exists yet between Kisumu's builders and institutional investors. Many programs still rely on outsiders to organize and sustain them, undercutting the very idea of decentralization.",
    insight: "The shift Kisumu needs is from “what you earn today” to “who you meet today.”",
    photo: "/kisumu/S43A9123.jpg",
  },
  {
    number: "04",
    name: "The Digital Economy",
    score: 70,
    scoreSub: "aware",
    scoreAlt: 45,
    scoreAltSub: "adopted",
    tag: "Growing",
    tagColor: "#8B5CF6",
    body: "Ask about “tech companies” in Kisumu and the consensus points to phone repair shops and accessory vendors — valid micro-enterprises, but the lowest tier of the digital economy. Software developers, data analysts, agritech platforms and fintech innovators were conspicuously absent from the room. Universities like Maseno and Great Lakes continue producing technically capable graduates; the challenge is not talent production, it's opportunity retention.",
    insight: "Until “tech” means software and data, not hardware repair, Kisumu stays a consumer of digital products — not a creator of digital value.",
    photo: "/kisumu/S43A9040.jpg",
  },
  {
    number: "05",
    name: "Visibility, Media & Storytelling",
    score: 70,
    scoreSub: "market opportunity, undocumented",
    tag: "Undocumented",
    tagColor: "#06B6D4",
    body: "Kisumu is brimming with stories, yet very few travel beyond the city's borders. Much of the local creative community remains centred on low-ticket event coverage and tourism photography, with little focus on documenting the entrepreneurs and ecosystem builders who could prove the city's case. Because the builders are not seen, it is quietly assumed they do not exist — feeding the very bias toward outsourced Nairobi talent this report tries to dismantle.",
    insight: "The narrative must shift from “Nairobi is better” to “we are creating.”",
    photo: "/kisumu/S43A9127.jpg",
  },
];

const dashboard = [
  { label: "Community Trust Networks", value: "85%", color: "#10B981" },
  { label: "Entrepreneurial Activity", value: "70%", color: "#306CEC" },
  { label: "Informal Capital Availability", value: "70%", color: "#8B5CF6" },
  { label: "University Talent Production", value: "70%", color: "#306CEC" },
  { label: "Technology Awareness", value: "70%", color: "#06B6D4" },
  { label: "Market Opportunity", value: "70%", color: "#10B981" },
  { label: "Technology Adoption", value: "45%", color: "#F59E0B" },
  { label: "Startup Support Infrastructure", value: "25%", color: "#EF4444" },
  { label: "Formal Capital Accessibility", value: "20%", color: "#EF4444" },
];

const recommendations = [
  {
    n: "01",
    title: "Formalize the Trust Networks",
    body: "Kisumu's trust economy is real but stays locked between individuals — it never scales into something the wider community can draw on. Structured referral systems, vetted vendor registries, and chama-linked lending programs would let existing trust travel further than any single relationship, turning a fragmented asset into shared infrastructure.",
    priority: "High",
  },
  {
    n: "02",
    title: "Open a Formal Capital Pathway",
    body: "Formal capital accessibility sits at just 20%, while informal capital moves freely at 70%. A dedicated investor-readiness track — covering financial modelling, pitch practice, and warm introductions to national and diaspora investors — would connect Kisumu's builders to capital that already exists just outside their network.",
    priority: "High",
  },
  {
    n: "03",
    title: "Kill the Transactional Trap",
    body: "A growing expectation that any workshop or meetup should come with a stipend is quietly strangling grassroots participation. Rebuilding community means delivering on promises consistently enough that people invest their time for long-term gain — shifting the value proposition from “what you earn today” to “who you meet today.”",
    priority: "Medium",
  },
  {
    n: "04",
    title: "Fund Local Documentation",
    body: "Kisumu's creative economy is stuck covering low-ticket events instead of documenting the builders who could prove the city's case. A dedicated storytelling fund would preserve ecosystem memory, dismantle the “Nairobi is better” myth, and give younger builders documented examples to learn from.",
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

export default function KisumuReport() {
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
          <a href="/campaign/eldoret" style={{ fontSize: 13, fontWeight: 600, color: C.muted, textDecoration: "none", padding: "4px 14px", borderRadius: 100, border: `1px solid ${C.border}`, transition: "all 0.2s" }}
            onMouseEnter={e => { e.target.style.color = "#306CEC"; e.target.style.borderColor = "#306CEC"; }}
            onMouseLeave={e => { e.target.style.color = C.muted; e.target.style.borderColor = C.border; }}>
            Eldoret
          </a>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "#306CEC", padding: "4px 14px", borderRadius: 100 }}>Kisumu</span>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ position: "relative", height: "100vh", minHeight: 600, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: heroY }}>
          <img src="/kisumu/S43A9123.jpg" alt="Kisumu roadshow"
            style={{ width: "100%", height: "110%", objectFit: "cover", objectPosition: "center top" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #000 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 100%)" }} />
        </motion.div>

        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, fontSize: "clamp(80px,18vw,220px)", fontWeight: 900, color: "rgba(255,255,255,0.04)", lineHeight: 0.85, letterSpacing: "-0.04em", userSelect: "none", pointerEvents: "none", paddingLeft: "2vw", overflow: "hidden" }}>
          KISUMU
        </div>

        <motion.div style={{ position: "relative", zIndex: 2, maxWidth: 960, margin: "0 auto", padding: "0 24px 72px", width: "100%", opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, background: "rgba(48,108,236,0.15)", border: "1px solid rgba(48,108,236,0.35)", borderRadius: 100, padding: "6px 16px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#306CEC" }}>State of Decentralization Report</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: "clamp(2.8rem,6vw,5.5rem)", fontWeight: 900, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 20px", maxWidth: 760 }}>
            A city surrounded by opportunity it cannot see.
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)" }}>
              <MapPin size={14} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>Kisumu, Kisumu County, Kenya</span>
            </div>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>Mariama Waiganjo · Impact360 &amp; TOIG</span>
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
          {[{ v: "150+", l: "Attendees" }, { v: "5", l: "Systems Mapped" }, { v: "85%", l: "Community Trust" }, { v: "20%", l: "Formal Capital" }].map((s, i) => (
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
            On July 4th, 2026, 150+ founders, students, and ecosystem builders filled Baraza Media Lab for the Kisumu Edition of the Impact360 Roadshow — the third stop in a journey testing one idea: that talent is distributed even when opportunity isn't. The result is this report — a five-system analysis of Kisumu's innovation economy, scored live in the room, that surfaces a paradox no one expected: a city with cranes on every horizon, and 83% of its own people unable to name a single investment opportunity inside it.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            style={{ marginTop: 40, paddingLeft: 24, borderLeft: "3px solid #306CEC" }}>
            <p style={{ fontSize: "clamp(1.1rem,2vw,1.35rem)", fontWeight: 600, fontStyle: "italic", lineHeight: 1.6, color: C.text, margin: 0 }}>
              "The obstacle is not a lack of resources; it is a lack of collective belief."
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
            <p style={{ fontSize: 15, color: C.muted, maxWidth: 560, lineHeight: 1.6, margin: 0 }}>The same lens applied to Eldoret, pointed at Kisumu — and surfacing a different, more nuanced diagnosis: recognition asymmetry, not facilitation asymmetry.</p>
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
            <h2 style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.03em", color: C.text, margin: "0 0 16px" }}>Kisumu Ecosystem Dashboard</h2>
            <p style={{ fontSize: 14, color: C.muted, maxWidth: 520, lineHeight: 1.6 }}>Live scores generated by roadshow participants. Kisumu is not under-talented and not under-resourced — it is under-connected.</p>
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
            <a href="/campaign/eldoret" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.text, fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 100, textDecoration: "none" }}>
              Eldoret Report <ArrowUpRight size={14} />
            </a>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: `1px solid ${C.border}`, color: C.muted, fontWeight: 700, fontSize: 14, padding: "12px 24px", borderRadius: 100, cursor: "not-allowed", opacity: 0.4 }}>
              Mombasa — coming soon
            </span>
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
