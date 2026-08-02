import React from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RegisterModal } from "./RoadshowPage";
import { useDarkMode } from "../DarkModeContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const stories = [
  {
    vol: "No. 01",
    date: "Feb 7, 2026",
    city: "Nakuru",
    country: "Kenya",
    headline: "Where it\nall began.",
    intro: "On 7 February 2026, six speakers and a full room at Taydis, Nakuru spent an afternoon in real conversation: discussions, networking, and the kind of community that doesn't end when the event does.",
    introColor: "#306CEC",
    body: "The event began with networking and introductions before moving into RoundXchange, a gamified interaction session where participants exchanged ideas, tackled mini-challenges, and explored thought-provoking topics in small groups. Following a networking break, the audience engaged in The Great Debate, where speakers and participants discussed key issues through structured and solution-focused conversations. The energy continued into the Open Mic session, giving attendees an opportunity to share perspectives, ask questions, and contribute directly to the discussion. The day concluded by highlighting key insights and encouraging participants to stay connected as the roadshow journey continues in other locations. The Nakuru Roadshow successfully demonstrated the power of conversation, collaboration, and community-driven storytelling.",
    pullQuote: "This isn't an event. It's a live episode in an ongoing story.",
    stats: [{ v: "120+", l: "people showed up" }, { v: "6", l: "speakers on stage" }, { v: "4", l: "sessions" }],
    galleryUrl: "https://aroni6.pixieset.com/impact360roadshownakuruedition-1/",
    cover: "/Nakuru/mainNakuru.jpg",
    photos: [
      { src: "/Nakuru/Nakuru1.jpg", caption: "Founders on stage, Nakuru" },
      { src: "/Nakuru/Nakuru2.jpg", caption: "A workshop in the afternoon" },
      { src: "/Nakuru/Nakuru3.jpg", caption: "Still talking at the end" },
      { src: "/Nakuru/Nakuru4.jpg", caption: "The crowd kept growing" },
      { src: "/Nakuru/Nakuru5.jpg", caption: "A moment at the close" },
    ],
  },
  {
    vol: "No. 02",
    date: "May 23, 2026",
    venue: "Comfy Inn",

    city: "Eldoret",
    country: "Kenya",
    headline: "The north\nhas builders.",
    intro: "On 23 May 2026, Comfy Inn, Eldoret became the room where the real questions got asked: about building outside the capital, leading without a blueprint, and what African ecosystems look like when you stop waiting.",
    introColor: "#306CEC",
    body: "The morning opened with Round Exchange, an unfiltered session on ecosystem realities, innovation gaps, and what founders in emerging markets actually need. No slides. No rehearsed answers. The Founder Hotseat followed: honest accounts of building, failing, pivoting, and pushing through in markets that don't always show up on startup maps. The afternoon widened into Architects of the Future, where founders, operators, creatives, and ecosystem leaders asked harder questions about leadership, opportunity, and what comes next for African cities beyond Nairobi. By the time the room wrapped up, it had produced something harder to measure than metrics: real connections, and the quiet conviction that Eldoret was already building something worth watching.",
    pullQuote: "The north didn't need permission. It needed a room.",
    stats: [{ v: "180+", l: "people showed up" }, { v: "8", l: "voices on stage" }, { v: "5", l: "sessions" }],
    galleryUrl: "https://i3studios73.pixieset.com/eldoretroadshow/",
    cover: "/eldoret/mainEldoret.jpg",
    photos: [
      { src: "/eldoret/Eldoret1.jpg", caption: "The panel that wouldn't stop" },
      { src: "/eldoret/Eldoret2.jpg", caption: "Conversations that mattered" },
      { src: "/eldoret/Eldoret3.jpg", caption: "Learning by doing" },
      { src: "/eldoret/Eldoret4.jpg", caption: "Eldoret showed up" },
      { src: "/eldoret/Eldoret5.jpg", caption: "Still talking outside" },
    ],
  },
  {
    vol: "No. 03",
    date: "July 4th, 2026",
    venue: "Baraza Media Lab",
    city: "Kisumu",
    country: "Kenya",
    headline: "The lake\ncity showed up.",
    intro: "On 4 July 2026, Baraza Media Lab in Kisumu became the room where western Kenya's builders, dreamers, and doers gathered to prove that innovation doesn't only happen near the coast.",
    introColor: "#306CEC",
    body: "The day opened with an electric networking session, setting the tone for what would become one of the most engaged roadshow stops yet. Participants moved into structured roundtables exploring the unique challenges and opportunities of building in western Kenya — from access to capital, to reaching customers in mid-tier cities. A high-energy Founder Hotseat followed, where entrepreneurs shared raw, unfiltered accounts of building businesses away from the spotlight of Nairobi. The afternoon brought The Great Debate to Kisumu, with speakers and participants sparring over what inclusive innovation really looks like in a city with this much potential. An Open Mic session wrapped the day, with attendees — many of them first-time event participants — stepping up to share ideas, ask bold questions, and connect with peers. Kisumu didn't just attend the roadshow. It added a chapter.",
    pullQuote: "Kisumu has always had the talent. Now it has the room.",
    stats: [{ v: "150+", l: "people showed up" }, { v: "7", l: "speakers on stage" }, { v: "4", l: "sessions" }],
    galleryUrl: "#",
    cover: "/Kisumu/S43A9040.jpg",
    photos: [
      { src: "/Kisumu/S43A9040.jpg", caption: "Baraza Media Lab set up for the day" },
      { src: "/Kisumu/S43A0042.jpg", caption: "Connections made at Baraza" },
      { src: "/Kisumu/S43A0049.jpg", caption: "Voices from Kisumu" },
      { src: "/Kisumu/S43A9123.jpg", caption: "Ideas in the round" },
      { src: "/Kisumu/S43A9127.jpg", caption: "The Hotseat in action" },
    ],
  },
];

const appear = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
};

const vp = { once: true, margin: "-60px" };
const fadeUp  = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } };
const fadeIn  = { hidden: { opacity: 0 },        show: { opacity: 1,        transition: { duration: 0.7, ease: "easeOut" } } };

function Story({ s, i, darkMode }) {
  const isEven = i % 2 === 0;
  const c = {
    dot:       darkMode ? "rgba(255,255,255,0.2)"  : "rgba(0,0,0,0.2)",
    meta:      darkMode ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)",
    headline:  darkMode ? "#fff"                   : "#0a0a0a",
    intro:     darkMode ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
    body:      darkMode ? "rgba(255,255,255,0.78)" : "rgba(0,0,0,0.7)",
    caption:   darkMode ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.3)",
    quote:     darkMode ? "rgba(255,255,255,0.8)"  : "rgba(0,0,0,0.75)",
    separator: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    photoPlaceholder: darkMode ? "#1a1a1a" : "#e0e0e0",
  };

  return (
    <motion.article style={{ marginBottom: "100px" }}>

      {/* Constrained: vol/date, city, headline, intro — staggered */}
      <motion.div
        initial="hidden" whileInView="show" viewport={vp}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 80px 40px" }}
      >
        <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <span style={{ fontSize: "11px", color: "#306CEC", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{s.vol}</span>
          <span style={{ fontSize: "11px", color: c.dot, fontFamily: "'DM Sans', sans-serif" }}>·</span>
          <span style={{ fontSize: "11px", color: c.meta, fontFamily: "'DM Sans', sans-serif" }}>{s.date}{s.venue ? ` · ${s.venue}` : ""}</span>
        </motion.div>

        <motion.p variants={fadeUp} style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", color: "#306CEC", margin: "0 0 10px" }}>
          {s.city}, {s.country}
        </motion.p>

        <motion.h2 variants={fadeUp} style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.03em", fontFamily: "'League Spartan', sans-serif", color: c.headline, margin: "0 0 20px", whiteSpace: "pre-line" }}>
          {s.headline}
        </motion.h2>

        <motion.p variants={fadeUp} style={{ fontSize: "16px", fontStyle: "italic", color: s.introColor || c.intro, fontFamily: "'DM Sans', sans-serif", margin: 0, lineHeight: 1.65 }}>
          {s.intro}
        </motion.p>
      </motion.div>

      {/* Full-bleed: image + text */}
      <div className="story-body" style={{
        display: "grid",
        gridTemplateColumns: isEven
          ? "calc(max(80px, (100vw - 1100px) / 2 + 80px) + 420px) 1fr"
          : "1fr calc(max(80px, (100vw - 1100px) / 2 + 80px) + 420px)",
        gap: "0 48px",
        alignItems: "start",
        marginBottom: "36px",
      }}>
        {/* Image — slides in from its side */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={vp}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ order: isEven ? 0 : 1, display: "flex", justifyContent: isEven ? "flex-end" : "flex-start" }}
        >
          <div style={{ width: "420px", flexShrink: 0 }}>
            <div className="story-img-wrap" style={{ overflow: "hidden", aspectRatio: "4/3", borderRadius: "6px" }}>
              <img onContextMenu={(e) => e.preventDefault()} draggable="false" src={s.cover} alt={s.city} className="story-img"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.9)" }}
                onError={e => { e.target.parentElement.style.background = c.photoPlaceholder; }} />
            </div>
            <p style={{ fontSize: "10px", color: c.caption, fontFamily: "'DM Sans', sans-serif", marginTop: "8px", fontStyle: "italic" }}>
              {s.city}, {s.date}
            </p>
          </div>
        </motion.div>

        {/* Text — fades in */}
        <motion.div
          initial="hidden" whileInView="show" viewport={vp} variants={fadeIn}
          style={{ order: isEven ? 1 : 0, paddingLeft: isEven ? 0 : "calc(max(80px, (100vw - 1100px) / 2 + 80px))", paddingRight: isEven ? "80px" : 0 }}
        >
          <p style={{ fontSize: "15px", lineHeight: 1.95, color: c.body, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
            {s.body}
          </p>
        </motion.div>
      </div>

      {/* Pull quote */}
      <motion.div
        initial="hidden" whileInView="show" viewport={vp} variants={fadeUp}
        style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 80px", marginTop: "40px", marginBottom: "48px" }}
      >
        <div style={{ borderLeft: "2px solid #306CEC", paddingLeft: "18px" }}>
          <p style={{ fontSize: "1.1rem", fontStyle: "italic", color: c.quote, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, margin: 0 }}>
            "{s.pullQuote}"
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      {s.stats && (
        <motion.div
          initial="hidden" whileInView="show" viewport={vp}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 80px 48px", display: "flex", gap: "40px", flexWrap: "wrap" }}
        >
          {s.stats.map((st, si) => (
            <motion.div key={si} variants={fadeUp}>
              <p style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, fontFamily: "'League Spartan', sans-serif", color: "#306CEC", margin: 0, lineHeight: 1 }}>{st.v}</p>
              <p style={{ fontSize: "12px", color: c.meta, fontFamily: "'DM Sans', sans-serif", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.1em" }}>{st.l}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Photo strip — photos stagger in */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 80px" }}>
        <motion.div
          initial="hidden" whileInView="show" viewport={vp}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          style={{ position: "relative", height: "220px" }}
        >
          {s.photos.map((ph, pi) => {
            const scatter = [
              { left: "0%",  top: "40px", rotate: "-6deg", zIndex: 2 },
              { left: "16%", top: "8px",  rotate: "4deg",  zIndex: 5 },
              { left: "32%", top: "30px", rotate: "-3deg", zIndex: 3 },
              { left: "50%", top: "0px",  rotate: "7deg",  zIndex: 4 },
              { left: "67%", top: "20px", rotate: "-5deg", zIndex: 1 },
            ];
            const p = scatter[pi];
            return (
              <motion.div
                key={pi} className="polaroid"
                variants={{ hidden: { opacity: 0, y: 20, rotate: 0 }, show: { opacity: 1, y: 0, rotate: parseFloat(p.rotate), transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
                style={{ position: "absolute", left: p.left, top: p.top, zIndex: p.zIndex, width: "240px", borderRadius: "3px", overflow: "hidden" }}
              >
                <div style={{ aspectRatio: "4/3", background: c.photoPlaceholder }}>
                  <img onContextMenu={(e) => e.preventDefault()} draggable="false" src={ph.src} alt={ph.caption}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    onError={e => { e.target.style.display = "none"; }} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={vp} variants={fadeUp} style={{ marginTop: "24px", textAlign: "center" }}>
          <a href={s.galleryUrl || "#"} target="_blank" rel="noopener noreferrer" style={{ fontSize: "13px", color: "#306CEC", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            View more photos <ArrowRight size={13} />
          </a>
        </motion.div>

        <div style={{ height: "1px", background: c.separator, marginTop: "48px" }} />
      </div>

    </motion.article>
  );
}

export default function EventsPage() {
  const { darkMode } = useDarkMode();
  const [mombasaModal, setMombasaModal] = React.useState(false);
  const mombasa = { name: "Mombasa", img: "/events/Mombasa.jpg", date: "October 3rd, 2026", venue: "Baraza Media Lab", time: "12:00 PM", status: "next" };
  const heroRef = React.useRef(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 160]);

  const stagger = {
    animate: { transition: { staggerChildren: 0.12 } },
  };
  const fadeUp = {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div style={{ background: darkMode ? "#0a0a0a" : "#fff", color: darkMode ? "#fff" : "#0a0a0a", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <header ref={heroRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        {/* Parallax image */}
        <motion.img
          src="/eldoret/heroImg.jpg"
          alt="Impact360 Roadshow"
          style={{ width: "100%", height: "110%", objectFit: "cover", objectPosition: "center 20%", display: "block", y: heroY }}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* gradient */}
        <div style={{ position: "absolute", inset: 0, background: darkMode
          ? "linear-gradient(to bottom, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.97) 85%, #0a0a0a 100%)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 40%, rgba(255,255,255,0.92) 85%, #fff 100%)"
        }} />

        {/* Staggered text */}
        <motion.div
          variants={stagger} initial="initial" animate="animate"
          style={{ position: "absolute", bottom: "72px", left: 0, right: 0, maxWidth: "1100px", margin: "0 auto", padding: "0 80px" }}
        >
          <motion.p variants={fadeUp} style={{ fontSize: "11px", color: "#306CEC", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "16px" }}>
            Impact360 &nbsp;·&nbsp; 2026
          </motion.p>
          <motion.h1 variants={fadeUp} style={{ fontSize: "clamp(2.8rem, 7vw, 6.5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.04em", fontFamily: "'League Spartan', sans-serif", marginBottom: "20px", color: darkMode ? "#fff" : "#0a0a0a" }}>
            The ground<br />
            <span style={{ color: "#306CEC" }}>beneath us.</span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ fontSize: "15px", lineHeight: 1.8, color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", maxWidth: "460px", marginBottom: "32px", fontStyle: "italic" }}>
            Every city we visit leaves something behind. These are the stories we carried home.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/events/roadshow"
              style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "#306CEC", color: "#fff", padding: "11px 22px", borderRadius: "100px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "13px", textDecoration: "none" }}>
              See upcoming cities <ArrowRight size={13} />
            </Link>
          </motion.div>
        </motion.div>
      </header>

      {/* Stories */}
      <main style={{ width: "100%" }}>
        {stories.map((s, i) => <Story key={s.city} s={s} i={i} darkMode={darkMode} />)}

        {/* Mombasa — next stop */}
        <motion.div {...appear} style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 80px 100px" }}>
          <p style={{ fontSize: "11px", color: "#306CEC", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "12px" }}>
            No. 04 &nbsp;·&nbsp; Next stop
          </p>
          <h3 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, fontFamily: "'League Spartan', sans-serif", color: darkMode ? "#fff" : "#0a0a0a", margin: "0 0 10px", letterSpacing: "-0.025em", lineHeight: 1 }}>
            Mombasa, October 3.
          </h3>
          <p style={{ fontSize: "14px", color: darkMode ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.45)", fontFamily: "'DM Sans', sans-serif", margin: "0 0 6px", fontStyle: "italic" }}>
            The next page is unwritten. Come help us write it.
          </p>
          <p style={{ fontSize: "13px", color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)", fontFamily: "'DM Sans', sans-serif", margin: "0 0 28px" }}>
            Baraza Media Lab · 12:00 PM
          </p>
          <button onClick={() => setMombasaModal(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "7px", border: `1px solid ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.2)"}`, color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)", padding: "11px 22px", borderRadius: "100px", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "13px", background: "none", cursor: "pointer" }}>
            Register now <ArrowRight size={13} />
          </button>
        </motion.div>
      </main>

      <AnimatePresence>
        {mombasaModal && <RegisterModal town={mombasa} darkMode={true} onClose={() => setMombasaModal(false)} />}
      </AnimatePresence>

      <Footer />

      <style>{`
        .story-img { transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }
        .story-img-wrap:hover .story-img { transform: scale(1.04); }
        .polaroid { transition: transform 0.3s ease; cursor: default; }
        .polaroid:hover { transform: rotate(0deg) scale(1.12) !important; z-index: 10 !important; }
        @media (max-width: 768px) {
          .story-body { grid-template-columns: 1fr !important; }
          .story-body > div:first-child { justify-content: flex-start !important; }
          .story-body > div:first-child > div { width: 100% !important; }
          .story-body > div:last-child { padding-right: 24px !important; padding-left: 24px; }
        }
      `}</style>
    </div>
  );
}
