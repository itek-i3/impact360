import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, Loader2, CheckCircle } from "lucide-react";
import { useDarkMode } from "../DarkModeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const EMAILJS_TEMPLATE = process.env.REACT_APP_EMAILJS_TEMPLATE_USER;

const sendRoadshowEmail = async (form, town) => {
  try {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    const isTBA = town.status === "tba";
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE, {
      to_email: form.email,
      email_subject: isTBA
        ? `Registration Received: Impact360 Roadshow ${town.name}`
        : `Registration Confirmed: Impact360 Roadshow ${town.name}`,
      welcome_message: isTBA
        ? `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#333;line-height:1.8;">
            <p style="font-size:15px;margin:0 0 20px;">Dear ${form.name},</p>
            <p style="font-size:15px;margin:0 0 16px;">
              Thank you for registering your interest in the <strong>${town.name} Roadshow</strong>.
            </p>
            <p style="font-size:15px;margin:0 0 24px;">
              We are still finalising the date for this city. We will reach out to you as soon as it is confirmed. Keep an eye on your inbox.
            </p>
            <p style="font-size:15px;margin:0 0 32px;">
              Thank you for being part of this journey.
            </p>
            <p style="font-size:15px;margin:0 0 4px;">Best regards,</p>
            <p style="font-size:15px;font-weight:700;color:#306CEC;margin:0;">Impact360 Team</p>
           </div>`
        : `<div style="font-family:'Segoe UI',Arial,sans-serif;color:#333;line-height:1.8;">
            <p style="font-size:15px;margin:0 0 20px;">Dear ${form.name},</p>
            <p style="font-size:15px;margin:0 0 16px;">
              Thank you for registering for the <strong>${town.name} Roadshow</strong>.
            </p>
            <p style="font-size:15px;margin:0 0 24px;">
              We are pleased to confirm your registration and look forward to hosting you at this exciting event. The roadshow will bring together innovators, entrepreneurs, students, technology enthusiasts, and ecosystem stakeholders to connect, learn, and explore opportunities within the digital and innovation landscape.
            </p>
            <p style="font-size:15px;font-weight:700;color:#0a0a14;margin:0 0 16px;">Event Details</p>
            <table style="font-size:15px;border-collapse:collapse;margin-bottom:24px;">
              <tr><td style="padding:6px 16px 6px 0;font-weight:600;">Event</td><td style="padding:6px 0;">${town.name} Roadshow</td></tr>
              <tr><td style="padding:6px 16px 6px 0;font-weight:600;">Date</td><td style="padding:6px 0;">${town.date}</td></tr>
              <tr><td style="padding:6px 16px 6px 0;font-weight:600;">Venue</td><td style="padding:6px 0;">${town.venue || town.name}</td></tr>
              ${town.time ? `<tr><td style="padding:6px 16px 6px 0;font-weight:600;">Time</td><td style="padding:6px 0;">${town.time}</td></tr>` : ""}
            </table>
            <p style="font-size:15px;margin:0 0 16px;">
              Kindly arrive early to facilitate a smooth registration process. If you have any questions or require further assistance, feel free to contact us.
            </p>
            <p style="font-size:15px;margin:0 0 24px;">
              Thank you for being part of this journey. We look forward to seeing you in ${town.name}.
            </p>
            <div style="background:#FFF8E1;border-left:4px solid #F59E0B;border-radius:8px;padding:14px 18px;margin-bottom:24px;">
              <p style="font-size:13px;font-weight:700;color:#92400E;margin:0 0 4px;">📷 Please Note</p>
              <p style="font-size:13px;color:#92400E;margin:0;line-height:1.7;">Photography and videography will take place during the event. By attending, you may appear in photos or footage used for Impact360 promotional and documentation purposes.</p>
            </div>
            <div style="background:#E7F8EF;border-left:4px solid #25D366;border-radius:8px;padding:14px 18px;margin-bottom:28px;">
              <p style="font-size:13px;font-weight:700;color:#1a7a3f;margin:0 0 6px;">💬 Join our WhatsApp Group</p>
              <p style="font-size:13px;color:#1a7a3f;margin:0 0 8px;line-height:1.7;">Stay updated with event announcements, connect with other attendees, and get reminders by joining our WhatsApp group.</p>
              <a href="https://chat.whatsapp.com/BGXIn5f4GYbIVLgnaya9Rf" style="display:inline-block;background:#25D366;color:#fff;font-size:13px;font-weight:700;padding:8px 18px;border-radius:100px;text-decoration:none;">Join WhatsApp Group →</a>
            </div>
            <p style="font-size:15px;margin:0 0 4px;">Best regards,</p>
            <p style="font-size:15px;font-weight:700;color:#306CEC;margin:0 0 4px;">Impact360 Team</p>
           </div>`,
      additional_info: `<div style="font-family:'Segoe UI',Arial,sans-serif;background:#EEF3FD;padding:28px 32px;border-radius:12px;">
          <p style="font-size:11px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;color:#306CEC;margin:0 0 14px;">Your Registration Details</p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#333;">
            <tr><td style="padding:8px 0;border-bottom:1px solid #dce8fb;font-weight:600;width:120px;">Name</td><td style="padding:8px 0;border-bottom:1px solid #dce8fb;">${form.name}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #dce8fb;font-weight:600;">Email</td><td style="padding:8px 0;border-bottom:1px solid #dce8fb;">${form.email}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #dce8fb;font-weight:600;">Phone</td><td style="padding:8px 0;border-bottom:1px solid #dce8fb;">${form.phone}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #dce8fb;font-weight:600;">Organization</td><td style="padding:8px 0;border-bottom:1px solid #dce8fb;">${form.organization}</td></tr>
            ${!isTBA ? `<tr><td style="padding:8px 0;border-bottom:1px solid #dce8fb;font-weight:600;">Date</td><td style="padding:8px 0;border-bottom:1px solid #dce8fb;color:#306CEC;font-weight:600;">${town.date}</td></tr>` : ""}
            ${!isTBA && town.venue ? `<tr><td style="padding:8px 0;font-weight:600;">Venue</td><td style="padding:8px 0;">${town.venue}</td></tr>` : ""}
          </table>
        </div>`,
    });
  } catch (err) {
    console.warn("Roadshow confirmation email failed:", err);
  }
};

/* ─── VIDEO DATA ─── */
const videos = [
  { id: 1, title: "Impact360 Nakuru Roadshow", location: "Nakuru, Kenya", date: "Feb 7, 2026", tag: "RECAP", youtubeId: "lGnBbmGK6V8", thumb: "https://i.ytimg.com/vi/lGnBbmGK6V8/hqdefault.jpg" },
  { id: 2, title: "Founders Taking The Stage", location: "Eldoret, Kenya", date: "May 9th, 2026", tag: "PITCHES", youtubeId: "DDM1aMN1YRE", thumb: "https://i.ytimg.com/vi/DDM1aMN1YRE/hqdefault.jpg" },
  { id: 3, title: "Innovation On The Ground", location: "Kisumu, Kenya", date: "July 4th, 2026", tag: "PANEL", youtubeId: "Mbl0osnVSHI", thumb: "https://i.ytimg.com/vi/Mbl0osnVSHI/hqdefault.jpg" },
  { id: 4, title: "Decentralising Opportunity", location: "Nairobi, Kenya", date: "Coming Soon", tag: "KEYNOTE", youtubeId: "sUzzM2vPBLo", thumb: "https://i.ytimg.com/vi/sUzzM2vPBLo/hqdefault.jpg" },
  { id: 5, title: "Coastal Innovation Highlight", location: "Mombasa, Kenya", date: "Coming Soon", tag: "HIGHLIGHT", youtubeId: "ExUopo1-Zh4", thumb: "https://i.ytimg.com/vi/ExUopo1-Zh4/hqdefault.jpg" },
];
const displayedVideos = videos.slice(0, 5);

/* ─── TOWNS ─── */
const towns = [
  { name: "Nakuru", img: "/events/Nakuru.jpg", date: "Feb 7, 2026", status: "past", formUrl: null },
  { name: "Eldoret", img: "/events/Eldoret.jpg", date: "May 23, 2026", status: "concluded", formUrl: "https://forms.gle/FoEdvsEvgt3ohDm48" },
  { name: "Kisumu", img: "/events/Kisumu.jpg", date: "July 4th, 2026", venue: "Baraza Media Lab", time: "12:00 PM", status: "past", formUrl: null },
  { name: "Nairobi", img: "/events/Nairobi.jpg", date: "Coming Soon", status: "tba", formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfBnrBvB8v6THmM1-_bzauyY3lymRe7ULXrVC9iHUn1TXy4Hg/viewform?usp=publish-editor" },
  { name: "Mombasa", img: "/events/Mombasa.jpg", date: "October 3rd, 2026", venue: "Baraza Media Lab", time: "12:00 PM", status: "next", formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfOYPX3TuQl14679C2UaAXElzUcP5x4iVd0tJrQAIlB8nQa-w/viewform?usp=publish-editor" },
  { name: "Arusha", img: "/events/Arusha.jpg", date: "Coming Soon", status: "tba", formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScbaFJyZ6az4BkW93Of8YHi5sRSCmkeqTzanJDQcoXJibV_RQ/viewform?usp=publish-editor" },
  { name: "Kigali", img: "/events/Kigali.jpg", date: "Coming Soon", status: "tba", formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSeqU-HkwV1JpShk-Ucme6DcusnA23L7XuPt6eebuZvxSjQpBg/viewform?usp=publish-editor" },
  { name: "Addis Ababa", img: "/events/Addis ababa.jpg", date: "Coming Soon", status: "tba", formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf-NKlWnfDjdJOttoQIx0Ff3Ix97WJju0DV2qeRCkDI5PBN3w/viewform?usp=publish-editor" },
  { name: "Kampala", img: "/events/Kampala.jpg", date: "Coming Soon", status: "tba", formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSckl1mHRVrdRj_bEWtRXKKAiTmttOtdQCoNiCPzy4e54SgElQ/viewform?usp=publish-editor" },
];

/* ─── VIDEO CARD ─── */
function VideoCard({ video, cardRef, darkMode }) {
  const isMobile = window.innerWidth < 768;
  return (
    <div
      ref={cardRef}
      style={{ position: "absolute", width: isMobile ? "min(280px, 80vw)" : "min(380px, 30vw)", borderRadius: "20px", overflow: "hidden", willChange: "transform, opacity, filter", background: "#000", border: `1px solid ${darkMode ? "rgba(48,108,236,0.25)" : "rgba(48,108,236,0.15)"}`, cursor: "pointer", opacity: 0, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
      onClick={() => { if (parseInt(cardRef.current?.style.zIndex) === 50) window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, "_blank", "noopener,noreferrer"); }}
    >
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", background: "#000" }}>
        <img onContextMenu={(e) => e.preventDefault()} draggable="false" src={video.thumb} alt={video.title} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} onError={e => { e.target.src = `https://placehold.co/400x400/306CEC/ffffff?text=${encodeURIComponent(video.location)}`; }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(48,108,236,0.92) 0%, rgba(48,108,236,0.25) 45%, transparent 70%)" }} />
        <div className="play-btn" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "52px", height: "52px", borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 24px rgba(48,108,236,0.5)", opacity: 0, pointerEvents: "none" }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 3.5l12 6.5-12 6.5V3.5z" fill="#306CEC" /></svg>
        </div>
        <div style={{ position: "absolute", top: "12px", left: "12px", background: "#306CEC", color: "#fff", borderRadius: "6px", padding: "4px 10px", fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", fontFamily: "'League Spartan', sans-serif" }}>{video.tag}</div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 14px 14px" }}>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.1em", margin: "0 0 4px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>{video.location}</p>
          <p style={{ color: "#fff", fontSize: "12px", fontWeight: 800, lineHeight: 1.25, margin: 0, textTransform: "uppercase", fontFamily: "'League Spartan', sans-serif" }}>{video.title}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── VIDEO HIGHLIGHTS ─── */
function VideoHighlights({ darkMode }) {
  const containerRef = React.useRef(null);
  const cardRefs = React.useRef(displayedVideos.map(() => React.createRef()));
  const pipRefs = React.useRef(displayedVideos.map(() => React.createRef()));
  const tagRef = React.useRef(null); const titleRef = React.useRef(null);
  const locationRef = React.useRef(null); const counterRef = React.useRef(null);
  const hintRef = React.useRef(null); const rawRef = React.useRef(0);
  const smoothRef = React.useRef(0); const rafRef = React.useRef(null);
  const prevIdxRef = React.useRef(0);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  React.useEffect(() => {
    const LERP = 0.08;
    const onScroll = () => {
      const el = containerRef.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      rawRef.current = Math.min(1, Math.max(0, -rect.top) / Math.max(1, el.scrollHeight - window.innerHeight)) * displayedVideos.length;
    };
    const applyCard = (el, sp, i) => {
      const cp = sp - i; const cl = Math.max(0, Math.min(1, cp)); const qd = Math.max(0, -cp);
      const gone = cp >= 1; const queued = cp < 0;
      el.style.transform = `translateX(${gone ? -130 : queued ? qd * 9 : -cl * 130}%) translateY(${queued ? qd * 6 : 0}px) scale(${gone ? 0.85 : queued ? Math.max(0.75, 1 - qd * 0.045) : 1 - cl * 0.06}) rotate(${gone ? -10 : queued ? Math.min(qd * 1.8, 8) : cl * -8}deg)`;
      el.style.opacity = gone ? 0 : queued ? Math.max(0.2, 1 - qd * 0.13) : 1 - cl * 0.55;
      el.style.filter = `brightness(${queued ? Math.max(0.55, 1 - qd * 0.13) : 1})`;
      el.style.zIndex = gone ? 0 : queued ? Math.max(1, 45 - Math.floor(qd) * 5) : 50;
      const btn = el.querySelector(".play-btn");
      if (btn) btn.style.opacity = (cp >= 0 && cp < 1) ? String(Math.max(0, 1 - cl * 2)) : "0";
    };
    const tick = () => {
      const sp = smoothRef.current + (rawRef.current - smoothRef.current) * LERP;
      smoothRef.current = sp;
      cardRefs.current.forEach((ref, i) => { if (ref.current) applyCard(ref.current, sp, i); });
      const ai = Math.min(Math.floor(sp), displayedVideos.length - 1);
      if (counterRef.current) counterRef.current.textContent = `${String(ai + 1).padStart(2, "0")} / ${String(displayedVideos.length).padStart(2, "0")}`;
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - sp * 2));
      pipRefs.current.forEach((ref, i) => { if (!ref.current) return; ref.current.style.width = i === ai ? "28px" : "10px"; ref.current.style.background = i === ai ? "#306CEC" : (darkMode ? "rgba(255,255,255,0.12)" : "#ddd"); });
      if (ai !== prevIdxRef.current) {
        prevIdxRef.current = ai; const v = displayedVideos[ai];
        if (tagRef.current) tagRef.current.textContent = v.tag;
        if (titleRef.current) titleRef.current.textContent = v.title;
        if (locationRef.current) locationRef.current.textContent = `${v.location} · ${v.date}`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); rafRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(rafRef.current); };
  }, [darkMode]);

  const first = displayedVideos[0];
  return (
    <div ref={containerRef} style={{ position: "relative", height: isMobile ? `${150 + displayedVideos.length * 120}vh` : `${100 + displayedVideos.length * 90}vh` }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: darkMode ? "radial-gradient(ellipse at 65% 50%, rgba(48,108,236,0.15) 0%, #000 60%)" : "radial-gradient(ellipse at 65% 50%, rgba(48,108,236,0.08) 0%, #FFFEF9 60%)", display: "flex", flexDirection: isMobile ? "column" : "row" }}>
        <div style={{ width: isMobile ? "100%" : "40%", display: "flex", flexDirection: "column", justifyContent: isMobile ? "flex-start" : "space-between", padding: isMobile ? "40px 20px 30px" : "80px 48px 52px", borderRight: isMobile ? "none" : `1px solid ${darkMode ? "rgba(48,108,236,0.12)" : "rgba(48,108,236,0.08)"}`, borderBottom: isMobile ? `1px solid ${darkMode ? "rgba(48,108,236,0.12)" : "rgba(48,108,236,0.08)"}` : "none" }}>
          <div>
            <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", color: "#306CEC", margin: "0 0 12px", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>IMPACT360 ROADSHOW</p>
            <h2 style={{ fontSize: isMobile ? "clamp(28px,6vw,48px)" : "clamp(40px,5.5vw,72px)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-0.04em", margin: "0 0 16px", fontFamily: "'League Spartan', sans-serif", textTransform: "uppercase", color: darkMode ? "#fff" : "#111" }}>EVENT<br /><span style={{ color: "#306CEC" }}>HIGHLIGHTS</span></h2>
            <p style={{ fontSize: "14px", lineHeight: 1.6, color: darkMode ? "#888" : "#666", fontFamily: "'DM Sans', sans-serif", maxWidth: "280px" }}>Watch moments from across Africa: pitches, panels, and connections reshaping innovation.</p>
          </div>
          {!isMobile && (
            <div>
              <div style={{ borderTop: `1px solid ${darkMode ? "rgba(48,108,236,0.18)" : "rgba(48,108,236,0.12)"}`, paddingTop: "22px", marginBottom: "22px" }}>
                <span ref={tagRef} style={{ display: "inline-block", background: "#306CEC", color: "#fff", borderRadius: "6px", padding: "3px 10px", fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em", marginBottom: "10px", fontFamily: "'League Spartan', sans-serif" }}>{first.tag}</span>
                <p ref={titleRef} style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.25, color: darkMode ? "#fff" : "#111", fontFamily: "'League Spartan', sans-serif", textTransform: "uppercase", margin: "0 0 6px" }}>{first.title}</p>
                <p ref={locationRef} style={{ fontSize: "11px", fontWeight: 600, color: "#306CEC", fontFamily: "'DM Sans', sans-serif", margin: 0, letterSpacing: "0.04em" }}>{first.location} · {first.date}</p>
              </div>
              <div style={{ display: "flex", gap: "7px" }}>
                {displayedVideos.map((_, i) => <div key={i} ref={pipRefs.current[i]} style={{ height: "3px", borderRadius: "2px", width: i === 0 ? "28px" : "10px", background: i === 0 ? "#306CEC" : (darkMode ? "rgba(255,255,255,0.12)" : "#ddd"), transition: "width 0.35s ease, background 0.35s ease" }} />)}
              </div>
            </div>
          )}
        </div>
        <div style={{ flex: isMobile ? "none" : 1, width: isMobile ? "100%" : "auto", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", minHeight: isMobile ? "60vh" : "100vh", padding: isMobile ? "20px" : "0" }}>
          <div style={{ position: "absolute", width: isMobile ? "200px" : "380px", height: isMobile ? "200px" : "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(48,108,236,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
          {displayedVideos.map((video, i) => <VideoCard key={video.id} video={video} cardIndex={i} cardRef={cardRefs.current[i]} darkMode={darkMode} />)}
          <div ref={hintRef} style={{ position: "absolute", bottom: isMobile ? "20px" : "44px", right: isMobile ? "20px" : "40px", display: "flex", alignItems: "center", gap: "10px", opacity: 1, pointerEvents: "none" }}>
            <div style={{ width: "40px", height: "2px", borderRadius: "1px", background: "linear-gradient(to right, transparent, #306CEC)" }} />
            <p style={{ color: "#306CEC", fontSize: "9px", fontWeight: 800, letterSpacing: "0.16em", margin: 0, textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>SCROLL</p>
          </div>
          <div ref={counterRef} style={{ position: "absolute", top: isMobile ? "20px" : "44px", right: isMobile ? "20px" : "40px", color: darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "'DM Sans', sans-serif" }}>
            01 / {String(displayedVideos.length).padStart(2, "0")}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ── REGISTRATION MODAL ── */
export function RegisterModal({ town, darkMode, onClose }) {
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", organization: "", whatYouDo: "", whySigningUp: "", expectations: "", hearAbout: "", hearAboutOther: "" });
  const [status, setStatus] = React.useState("idle");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await addDoc(collection(db, "roadshowRegistrations"), {
        ...form,
        hearAbout: form.hearAbout === "Other" ? (form.hearAboutOther || "Other") : form.hearAbout,
        city: town.name,
        eventDate: town.date,
        submittedAt: serverTimestamp(),
        status: "registered",
      });
      await sendRoadshowEmail(form, town);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const s = {
    overlay: { position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" },
    card: { background: darkMode ? "#0f0f0f" : "#fff", borderRadius: "20px", padding: "36px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto", position: "relative", border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(10,10,20,0.1)"}`, boxShadow: "0 32px 80px rgba(0,0,0,0.45)" },
    label: { display: "block", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px", color: darkMode ? "rgba(255,255,255,0.45)" : "rgba(10,10,20,0.45)", fontFamily: "'DM Sans', sans-serif" },
    input: { width: "100%", padding: "12px 14px", borderRadius: "10px", border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(10,10,20,0.12)"}`, background: darkMode ? "rgba(255,255,255,0.04)" : "#f7f8fa", color: darkMode ? "#fff" : "#0a0a14", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={s.overlay} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 28 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={s.card} onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", cursor: "pointer", color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(10,10,20,0.4)", padding: "4px" }}>
          <X size={18} />
        </button>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <CheckCircle size={48} color="#306CEC" style={{ marginBottom: "16px" }} />
            <h3 style={{ fontSize: "22px", fontWeight: 900, fontFamily: "'League Spartan', sans-serif", color: darkMode ? "#fff" : "#0a0a14", marginBottom: "8px", textTransform: "uppercase" }}>You're Registered!</h3>
            <p style={{ fontSize: "14px", color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(10,10,20,0.5)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
              {town.status === "tba"
                ? <>You're on the list for <strong>{town.name}</strong>. We'll email you as soon as the date is confirmed.</>
                : <>You're confirmed for <strong>{town.name}</strong> on <strong>{town.date}</strong>. Check your inbox for the confirmation email.</>
              }
            </p>
            <button onClick={onClose} style={{ marginTop: "24px", background: "#306CEC", color: "#fff", border: "none", borderRadius: "100px", padding: "12px 28px", fontWeight: 800, fontSize: "13px", fontFamily: "'League Spartan', sans-serif", cursor: "pointer" }}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#306CEC", letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Roadshow Registration</span>
              <h2 style={{ fontSize: "24px", fontWeight: 900, fontFamily: "'League Spartan', sans-serif", color: darkMode ? "#fff" : "#0a0a14", textTransform: "uppercase", letterSpacing: "-0.02em", margin: "6px 0 4px" }}>{town.name}</h2>
              <p style={{ fontSize: "12px", color: darkMode ? "rgba(255,255,255,0.4)" : "rgba(10,10,20,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{town.date}</p>
            </div>

            <form onSubmit={handleSubmit}>
              {[
                { label: "Full Name", name: "name", type: "text", placeholder: "Your full name", required: true },
                { label: "Email", name: "email", type: "email", placeholder: "you@example.com", required: true },
                { label: "Phone Number", name: "phone", type: "tel", placeholder: "+254 7XX XXX XXX", required: true },
                { label: "Organization / Institution", name: "organization", type: "text", placeholder: "Company, university, or institution", required: true },
              ].map(f => (
                <div key={f.name} style={{ marginBottom: "16px" }}>
                  <label style={s.label}>{f.label}</label>
                  <input style={s.input} type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.placeholder} required={f.required} />
                </div>
              ))}
              <div style={{ marginBottom: "16px" }}>
                <label style={s.label}>What do you do?</label>
                <textarea style={{ ...s.input, resize: "vertical", minHeight: "72px", lineHeight: 1.6 }} name="whatYouDo" value={form.whatYouDo} onChange={handleChange} placeholder="Briefly describe what you do..." />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={s.label}>Why are you attending?</label>
                <textarea style={{ ...s.input, resize: "vertical", minHeight: "80px", lineHeight: 1.6 }} name="whySigningUp" value={form.whySigningUp} onChange={handleChange} placeholder="Your motivation for joining..." />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={s.label}>What do you hope to gain?</label>
                <textarea style={{ ...s.input, resize: "vertical", minHeight: "80px", lineHeight: 1.6 }} name="expectations" value={form.expectations} onChange={handleChange} placeholder="What you expect from the event..." />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={s.label}>How did you hear about Impact360?</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                  {["From a Friend", "Instagram", "LinkedIn", "TikTok", "Other"].map(option => (
                    <label key={option} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", color: darkMode ? "rgba(255,255,255,0.8)" : "rgba(10,10,20,0.8)" }}>
                      <input
                        type="radio"
                        name="hearAbout"
                        value={option}
                        checked={form.hearAbout === option}
                        onChange={handleChange}
                        style={{ accentColor: "#306CEC", width: "16px", height: "16px", cursor: "pointer" }}
                      />
                      {option}
                    </label>
                  ))}
                  {form.hearAbout === "Other" && (
                    <input
                      style={{ ...s.input, marginTop: "4px" }}
                      type="text"
                      name="hearAboutOther"
                      value={form.hearAboutOther}
                      onChange={handleChange}
                      placeholder="Please specify..."
                    />
                  )}
                </div>
              </div>

              <div style={{ marginBottom: "24px", padding: "14px 16px", borderRadius: "10px", background: darkMode ? "rgba(255,255,255,0.04)" : "#f7f8fa", border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(10,10,20,0.08)"}`, display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "16px", flexShrink: 0 }}>📷</span>
                <p style={{ fontSize: "12px", color: darkMode ? "rgba(255,255,255,0.5)" : "rgba(10,10,20,0.55)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, margin: 0 }}>
                  By registering, you acknowledge that the event will be photographed and filmed. Images may be used for Impact360 promotional purposes.
                </p>
              </div>

              {status === "error" && (
                <p style={{ fontSize: "13px", color: "#ef4444", marginBottom: "12px", fontFamily: "'DM Sans', sans-serif" }}>Something went wrong. Please try again.</p>
              )}

              <button type="submit" disabled={status === "loading"} style={{ width: "100%", background: "#306CEC", color: "#fff", border: "none", borderRadius: "100px", padding: "14px", fontWeight: 800, fontSize: "14px", fontFamily: "'League Spartan', sans-serif", cursor: status === "loading" ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: status === "loading" ? 0.7 : 1 }}>
                {status === "loading" ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Submitting...</> : <>Register Now <ArrowRight size={15} /></>}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── 3D TOUR CAROUSEL ── */
function TourCarousel({ towns, darkMode, onRegister }) {
  const N = towns.length;
  const [active, setActive] = React.useState(1);
  const [paused, setPaused] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragDelta, setDragDelta] = React.useState(0);
  const dragStartX = React.useRef(null);
  const dragging = React.useRef(false);
  const dragDeltaRef = React.useRef(0);
  const CARD_W = 220;
  const CARD_H = 320;
  const RADIUS = Math.round(CARD_W / (2 * Math.tan(Math.PI / N))) + 40;
  const DEG_PER_CARD = 360 / N;

  // auto-rotate
  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive(i => (i + 1) % N), 5000);
    return () => clearInterval(t);
  }, [paused, N]);

  // global mouse/touch listeners so drag works even outside the container
  React.useEffect(() => {
    const getX = (e) => e.touches ? e.touches[0].clientX : e.clientX;

    const onMove = (e) => {
      if (!dragging.current || dragStartX.current === null) return;
      const delta = -(getX(e) - dragStartX.current) * 0.28;
      dragDeltaRef.current = delta;
      setDragDelta(delta);
    };

    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      setIsDragging(false);
      const steps = Math.round(dragDeltaRef.current / DEG_PER_CARD);
      setActive(i => ((i + steps) % N + N) % N);
      dragDeltaRef.current = 0;
      setDragDelta(0);
      dragStartX.current = null;
      setTimeout(() => setPaused(false), 1000);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [N, DEG_PER_CARD]);

  const onPointerDown = (e) => {
    dragging.current = true;
    dragStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    setIsDragging(true);
    setPaused(true);
  };

  const bg = darkMode ? "#000" : "#FFFEF9";
  const muted = darkMode ? "rgba(255,255,255,0.45)" : "rgba(10,10,20,0.45)";

  return (
    <section style={{ background: bg, padding: "80px 0 96px", overflow: "hidden" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 48px", display: "flex", alignItems: "center", gap: "56px", flexWrap: "wrap" }}>

        {/* LEFT: dynamic city info */}
        <div style={{ flex: "0 0 300px", minWidth: "260px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ height: "1px", width: "28px", background: "#306CEC" }} />
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#306CEC", letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>The Tour</span>
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 900, fontFamily: "'League Spartan', sans-serif", letterSpacing: "-0.02em", lineHeight: 0.95, textTransform: "uppercase", color: darkMode ? "#fff" : "#0a0a14", marginBottom: "16px" }}>
            9 Cities. <span style={{ color: "#306CEC" }}>One Movement.</span>
          </h2>
          <p style={{ fontSize: "14px", lineHeight: 1.75, color: muted, fontFamily: "'DM Sans', sans-serif", marginBottom: "28px", maxWidth: "280px" }}>
            Taking Africa's entrepreneurship conversation beyond the capital, town by town.
          </p>

          {/* Active city panel */}
          <div style={{ borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(10,10,20,0.08)"}`, paddingTop: "24px" }}>
            <div style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 900, fontFamily: "'League Spartan', sans-serif", letterSpacing: "-0.03em", lineHeight: 0.92, textTransform: "uppercase", color: darkMode ? "#fff" : "#0a0a14", marginBottom: "6px", transition: "all 0.4s" }}>
              {towns[active].name}
            </div>
            <div style={{ fontSize: "12px", color: "#306CEC", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: "16px" }}>
              {towns[active].date}
            </div>

            {towns[active].status === "past" ? (
              <span style={{ fontSize: "11px", color: muted, fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>This roadshow has concluded.</span>
            ) : (
              <button
                onClick={() => onRegister(towns[active])}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 800, color: "#fff", background: "#306CEC", padding: "12px 26px", borderRadius: "100px", border: "none", fontFamily: "'League Spartan', sans-serif", cursor: "pointer", boxShadow: "0 4px 20px rgba(48,108,236,0.4)", transition: "background 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#4A80FF"; e.currentTarget.style.transform = "scale(1.04)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#306CEC"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                Register Now <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: 3D carousel */}
        <div style={{ flex: 1, minWidth: "320px", position: "relative" }}>

          {/* 3D Stage */}
          <div
            style={{ perspective: "1100px", height: CARD_H + 80, position: "relative", userSelect: "none" }}
            onMouseDown={onPointerDown}
            onTouchStart={onPointerDown}
          >
            <div style={{
              width: "100%", height: "100%",
              position: "relative",
              transformStyle: "preserve-3d",
              transform: `rotateY(${-active * DEG_PER_CARD + dragDelta}deg)`,
              transition: dragDelta !== 0 ? "none" : "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              {towns.map((town, i) => {
                const angle = i * (360 / N);
                const isActive = i === active;
                return (
                  <div
                    key={town.name}
                    onClick={() => setActive(i)}
                    style={{
                      position: "absolute",
                      width: CARD_W,
                      height: CARD_H,
                      top: "50%", left: "50%",
                      marginLeft: -CARD_W / 2,
                      marginTop: -CARD_H / 2,
                      transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                      borderRadius: "16px",
                      overflow: "hidden",
                      cursor: isDragging ? "grabbing" : "grab",
                      transition: "box-shadow 0.4s, opacity 0.4s",
                      opacity: town.status === "past" && !isActive ? 0.7 : 1,
                      boxShadow: town.status === "next"
                        ? isActive
                          ? "0 0 0 2px #306CEC, 0 32px 80px rgba(48,108,236,0.6)"
                          : "0 0 0 2px rgba(48,108,236,0.55), 0 12px 40px rgba(48,108,236,0.2)"
                        : isActive
                          ? "0 24px 60px rgba(48,108,236,0.35)"
                          : "0 8px 24px rgba(0,0,0,0.3)",
                    }}
                  >
                    <img
                      src={town.img} alt={town.name} loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: town.status === "past" ? "grayscale(70%) brightness(0.65)" : "none", transition: "filter 0.4s" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)", pointerEvents: "none" }} />
                    {town.status === "past" && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", pointerEvents: "none" }} />}
                    {town.status === "next" && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(48,108,236,0.45) 0%, transparent 55%)", pointerEvents: "none" }} />}
                    {isActive && town.status !== "next" && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(48,108,236,0.5) 0%, transparent 60%)", pointerEvents: "none" }} />}

                    {/* Status badge */}
                    <div style={{ position: "absolute", top: "12px", left: "12px" }}>
                      {town.status === "past" && <span style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", padding: "4px 10px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.12)", fontFamily: "'DM Sans', sans-serif" }}>✓ Concluded</span>}
                      {town.status === "next" && <span style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", background: "#306CEC", padding: "4px 10px", borderRadius: "100px", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 0 14px rgba(48,108,236,0.8)" }}>● Next Stop</span>}
                      {town.status === "upcoming" && <span style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)", padding: "4px 10px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif" }}>Upcoming</span>}
                    </div>

                    {/* Bottom info */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px", pointerEvents: "none" }}>
                      <div style={{ fontSize: "16px", fontWeight: 900, color: "#fff", textTransform: "uppercase", fontFamily: "'League Spartan', sans-serif", letterSpacing: "-0.01em", marginBottom: "3px" }}>{town.name}</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif" }}>{town.date}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dot nav + arrows */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginTop: "28px" }}>

            {/* Left arrow */}
            <button
              onClick={() => { setActive(i => ((i - 1) + N) % N); setPaused(true); setTimeout(() => setPaused(false), 1000); }}
              style={{ width: "40px", height: "40px", borderRadius: "50%", border: `1px solid ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(10,10,20,0.15)"}`, background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(10,10,20,0.04)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(10,10,20,0.7)", transition: "all 0.2s", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = "#306CEC"; e.currentTarget.style.borderColor = "#306CEC"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "rgba(10,10,20,0.04)"; e.currentTarget.style.borderColor = darkMode ? "rgba(255,255,255,0.15)" : "rgba(10,10,20,0.15)"; e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.7)" : "rgba(10,10,20,0.7)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Dots */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {towns.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  style={{ height: "3px", borderRadius: "2px", border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s", width: i === active ? "28px" : "8px", background: i === active ? "#306CEC" : (darkMode ? "rgba(255,255,255,0.15)" : "rgba(10,10,20,0.15)") }}
                />
              ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => { setActive(i => (i + 1) % N); setPaused(true); setTimeout(() => setPaused(false), 1000); }}
              style={{ width: "40px", height: "40px", borderRadius: "50%", border: `1px solid ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(10,10,20,0.15)"}`, background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(10,10,20,0.04)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(10,10,20,0.7)", transition: "all 0.2s", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = "#306CEC"; e.currentTarget.style.borderColor = "#306CEC"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "rgba(10,10,20,0.04)"; e.currentTarget.style.borderColor = darkMode ? "rgba(255,255,255,0.15)" : "rgba(10,10,20,0.15)"; e.currentTarget.style.color = darkMode ? "rgba(255,255,255,0.7)" : "rgba(10,10,20,0.7)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

          </div>

          {/* Far-edge arrows overlaid on stage */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: CARD_H + 80, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px", zIndex: 10 }}>
            <button
              onClick={() => { setActive(i => ((i - 1) + N) % N); setPaused(true); setTimeout(() => setPaused(false), 1000); }}
              style={{ pointerEvents: "all", width: "48px", height: "48px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "all 0.2s", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = "#306CEC"; e.currentTarget.style.borderColor = "#306CEC"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => { setActive(i => (i + 1) % N); setPaused(true); setTimeout(() => setPaused(false), 1000); }}
              style={{ pointerEvents: "all", width: "48px", height: "48px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "all 0.2s", flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.background = "#306CEC"; e.currentTarget.style.borderColor = "#306CEC"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.45)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

        </div>{/* end right column */}
      </div>{/* end flex row */}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}


/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function RoadshowPage() {
  const { darkMode } = useDarkMode();
  const [showQR, setShowQR] = React.useState(false);
  const [registerTown, setRegisterTown] = React.useState(null);

  const kisumuTown = towns.find(t => t.name === "Mombasa");

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get("register");
    if (cityParam) {
      const match = towns.find(t => t.name.toLowerCase() === cityParam.toLowerCase());
      if (match) setRegisterTown(match);
    }
  }, []);

  const speakerImages = ["/events/Timothy.jpeg", "/events/Deborah.jpeg", "/events/geofrey.jpeg", "/events/Gilbert.jpeg"];
  const [activeSpeaker, setActiveSpeaker] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setActiveSpeaker(p => (p + 1) % speakerImages.length), 3500);
    return () => clearInterval(t);
  }, [speakerImages.length]);

  const bg = darkMode ? "#000" : "#FFFEF9";
  const fg = darkMode ? "#fff" : "#0a0a14";
  const muted = darkMode ? "rgba(255,255,255,0.45)" : "rgba(10,10,20,0.45)";
  const border = darkMode ? "rgba(255,255,255,0.07)" : "rgba(10,10,20,0.07)";

  return (
    <div style={{ backgroundColor: bg, color: fg }} className="font-sans min-h-screen transition-colors duration-700">
      <Navbar />

      {/* ── QR MODAL ── */}
      <AnimatePresence>
        {showQR && (
          <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQR(false)}>
            <motion.div className="bg-white dark:bg-[#111] rounded-3xl p-8 max-w-sm w-full relative shadow-2xl" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} transition={{ type: "spring", duration: 0.4 }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-gray-400 hover:bg-black/10 transition-colors">✕</button>
              <div className="text-center space-y-5">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white" style={{ fontFamily: "'League Spartan', sans-serif" }}>JOIN THE COMMUNITY</h2>
                <p className="text-sm text-gray-500">Scan to join our WhatsApp community</p>
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl flex items-center justify-center">
                  <img onContextMenu={(e) => e.preventDefault()} draggable="false" src="/frame.png" alt="WhatsApp QR Code" className="w-56 h-56 object-contain" />
                </div>
                <a href="https://chat.whatsapp.com/I0g8kpCNvSn84yWQxybzHa" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition-all duration-300 text-sm">Open WhatsApp →</a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── REGISTRATION MODAL ── */}
      <AnimatePresence>
        {registerTown && (
          <RegisterModal
            town={registerTown}
            darkMode={darkMode}
            onClose={() => setRegisterTown(null)}
          />
        )}
      </AnimatePresence>

      {/* ══ 1. HERO ══ */}
      <section style={{ position: "relative", minHeight: "100vh", overflow: "hidden", display: "flex", background: "#050508" }}>

        {/* Right: photo panel fading in from the right */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "60%" }}
        >
          <img
            src="/events/Roadshow-event.png"
            alt="Roadshow"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
          {/* Fade from left (dark bg) to transparent — no hard line */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #050508 0%, rgba(5,5,8,0.85) 18%, rgba(5,5,8,0.3) 45%, transparent 75%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,5,8,0.5) 0%, transparent 50%)" }} />
        </motion.div>

        {/* Left: text content */}
        <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "620px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "130px 60px 80px 64px" }}>

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.26em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif", marginBottom: "28px" }}
          >
            Impact360 &nbsp;·&nbsp; East Africa Tour
          </motion.p>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: "24px" }}
          >
            <div style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)", fontWeight: 900, fontFamily: "'League Spartan', sans-serif", letterSpacing: "-0.03em", lineHeight: 0.92, textTransform: "uppercase", color: "#fff" }}>
              Road<span style={{ color: "#306CEC" }}>show</span>
            </div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28 }}
            style={{ fontSize: "15px", lineHeight: 1.75, color: "rgba(255,255,255,0.8)", fontFamily: "'DM Sans', sans-serif", maxWidth: "360px", marginBottom: "40px" }}
          >
            Taking Africa's boldest entrepreneurship conversation beyond the capital, town by town.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "52px" }}
          >
            <button onClick={() => setRegisterTown(kisumuTown)}
              className="inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-200"
              style={{ background: "#306CEC", color: "#fff", padding: "13px 28px", borderRadius: "100px", fontFamily: "'League Spartan', sans-serif", fontWeight: 800, fontSize: "13px", cursor: "pointer", border: "none" }}
            >
              Register for Mombasa <ArrowRight size={14} />
            </button>
            <button onClick={() => setShowQR(true)}
              className="inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform duration-200"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "13px 28px", borderRadius: "100px", fontFamily: "'League Spartan', sans-serif", fontWeight: 800, fontSize: "13px", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}
            >
              Join the Crew
            </button>
          </motion.div>

          {/* Date strip */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.58 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "14px", padding: "9px 20px", borderRadius: "100px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", width: "fit-content" }}
          >
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#306CEC", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'DM Sans', sans-serif" }}>Next Stop</span>
            <div style={{ width: "1px", height: "10px", background: "rgba(255,255,255,0.14)" }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}>Mombasa · October 3rd, 2026</span>
          </motion.div>
        </div>

        {/* Mobile: photo underneath on small screens */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0" style={{ height: "45%", zIndex: 0 }}>
          <img onContextMenu={(e) => e.preventDefault()} draggable="false" src="/events/Roadshow-event.png" alt="Roadshow" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #050508 0%, rgba(5,5,8,0.3) 40%, rgba(5,5,8,0.7) 100%)" }} />
        </div>
      </section>

      {/* ══ 2. NEXT STOP: MOMBASA ══ */}
      <section className="relative overflow-hidden" style={{ background: darkMode ? "#0a0a14" : "#EEF3FF" }}>
        {/* BG glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: darkMode ? "radial-gradient(ellipse at 70% 50%, rgba(48,108,236,0.18) 0%, transparent 65%)" : "radial-gradient(ellipse at 70% 50%, rgba(48,108,236,0.12) 0%, transparent 65%)" }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-36 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* Left text */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-8 bg-[#306CEC]" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#306CEC]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Next Stop</span>
            </div>
            <h2 className="font-black uppercase leading-[0.85] mb-6" style={{ fontFamily: "'League Spartan', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", letterSpacing: "-0.03em", color: darkMode ? "#fff" : "#0a0a14" }}>
              Mom<span style={{ color: "#306CEC" }}>basa</span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <div className="inline-block bg-[#306CEC]/15 border border-[#306CEC]/30 text-[#306CEC] text-sm font-bold px-4 py-2 rounded-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                October 3rd, 2026
              </div>
              <div className="inline-block bg-[#306CEC]/15 border border-[#306CEC]/30 text-[#306CEC] text-sm font-bold px-4 py-2 rounded-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Baraza Media Lab
              </div>
            </div>
            <p className="text-base md:text-lg mb-10 max-w-lg" style={{ fontFamily: "'DM Sans', sans-serif", color: darkMode ? "rgba(255,255,255,0.55)" : "rgba(10,10,20,0.6)", lineHeight: 1.75 }}>
              Kenya's coastal jewel. A city where culture, trade, and ambition meet the ocean. The Roadshow is heading to Mombasa. Be there.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-10">
              {["Pitch Sessions", "Panels", "Workshops", "Networking"].map(tag => (
                <span key={tag} className="text-xs font-bold px-4 py-2 rounded-full" style={{ fontFamily: "'DM Sans', sans-serif", background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(48,108,236,0.08)", color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(10,10,20,0.75)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(48,108,236,0.2)"}` }}>{tag}</span>
              ))}
            </div>

            <button onClick={() => setRegisterTown(kisumuTown)}
              className="inline-flex items-center gap-2 bg-[#306CEC] text-white px-8 py-4 rounded-full font-black text-sm hover:bg-[#4A80FF] transition-all duration-300 hover:scale-105"
              style={{ fontFamily: "'League Spartan', sans-serif", cursor: "pointer", border: "none" }}
            >
              Register Now <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Right image */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="relative">
            <div className="absolute -inset-3 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(48,108,236,0.3) 0%, transparent 60%)", filter: "blur(20px)" }} />
            <img
              src="/events/Mombasa.jpg"
              alt="Mombasa Roadshow"
              className="relative rounded-2xl w-full object-cover"
              style={{ minHeight: "320px", maxHeight: "480px" }}
            />
            {/* Overlay badge */}
            <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
              <div className="text-[9px] font-black tracking-[0.2em] uppercase text-[#306CEC]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Mombasa, Kenya</div>
              <div className="text-sm font-black text-white mt-0.5" style={{ fontFamily: "'League Spartan', sans-serif" }}>OCTOBER 3RD, 2026</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ 4. THE TOUR — 3D revolving carousel ══ */}
      <TourCarousel towns={towns} darkMode={darkMode} onRegister={setRegisterTown} />

      {/* ══ 5. SPEAKERS ══ */}
      <section className="py-24 md:py-32" style={{ background: darkMode ? "#0a0a14" : "#F5F6F8" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: info */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-[#306CEC]" />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-[#306CEC]" style={{ fontFamily: "'DM Sans', sans-serif" }}>The Speakers</span>
              </div>
              <h2 className="font-black uppercase leading-[0.88] mb-6" style={{ fontFamily: "'League Spartan', sans-serif", fontSize: "clamp(2.2rem, 5vw, 4.5rem)", letterSpacing: "-0.03em" }}>
                Voices That<br /><span style={{ color: "#306CEC" }}>Move Africa.</span>
              </h2>
              <p className="text-base mb-10 max-w-md" style={{ fontFamily: "'DM Sans', sans-serif", color: muted, lineHeight: 1.75 }}>
                Founders, investors, and builders: people who've done it and come back to share the map.
              </p>
              {/* Speaker dots */}
              <div className="flex gap-2">
                {speakerImages.map((_, i) => (
                  <button key={i} onClick={() => setActiveSpeaker(i)}
                    className="h-1.5 rounded-full transition-all duration-400"
                    style={{ width: activeSpeaker === i ? "32px" : "8px", background: activeSpeaker === i ? "#306CEC" : border }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Right: speaker photo grid */}
            <div className="relative h-[480px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSpeaker}
                  initial={{ opacity: 0, scale: 0.97, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.97, x: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={speakerImages[activeSpeaker]}
                    alt={`Speaker ${activeSpeaker + 1}`}
                    className="w-full h-full object-cover rounded-3xl"
                    style={{ objectPosition: activeSpeaker === 2 ? "center 42%" : "center top" }}
                    onError={e => { e.target.src = "https://placehold.co/600x480/306CEC/ffffff?text=Speaker"; }}
                  />
                  <div className="absolute inset-0 rounded-3xl" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
                </motion.div>
              </AnimatePresence>
              {/* Counter */}
              <div className="absolute top-5 right-5 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full z-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {String(activeSpeaker + 1).padStart(2, "0")} / {String(speakerImages.length).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 6. VIDEO HIGHLIGHTS ══ */}
      <VideoHighlights darkMode={darkMode} />

      {/* ══ 7. CTA STRIP ══ */}
      <section className="py-24 px-6 md:px-12" style={{ background: darkMode ? "#0a0a14" : "#306CEC" }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <h2 className="font-black uppercase mb-4" style={{ fontFamily: "'League Spartan', sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "-0.02em", color: "#fff" }}>
              Don't miss<br /><span style={{ color: darkMode ? "#306CEC" : "rgba(255,255,255,0.75)" }}>Mombasa.</span>
            </h2>
            <p className="text-base mb-10" style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.65)" }}>
              October 3rd, 2026 · Register now before spots fill up.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => setRegisterTown(kisumuTown)}
                className="inline-flex items-center gap-2 text-sm hover:scale-105 transition-all duration-300"
                style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 800, background: "#fff", color: "#306CEC", padding: "14px 32px", borderRadius: "100px", cursor: "pointer", border: "none" }}
              >
                Register Now <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => setShowQR(true)}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-black text-sm text-white border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all duration-300"
                style={{ fontFamily: "'League Spartan', sans-serif" }}
              >
                Join Community
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
