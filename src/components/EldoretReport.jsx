import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Users, TrendingUp, Target, BarChart3,
  CheckCircle, Globe, Lightbulb, Building2,
  ArrowRight, ChevronDown, ChevronUp, Rocket,
  GraduationCap, Handshake, Megaphone, Award,
  PieChart, Activity, Zap, Heart, Network, Shield
} from "lucide-react";
import { useDarkMode } from "../DarkModeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

// ─── Data ────────────────────────────────────────────────────────────────────

const impactMetrics = [
  { label: "Attendees", value: "45", icon: Users, color: "#306CEC" },
  { label: "Economic Systems Mapped", value: "5", icon: Network, color: "#10B981" },
  { label: "Community Trust Score", value: "90%", icon: Shield, color: "#F59E0B" },
  { label: "Partner Organizations", value: "10+", icon: Handshake, color: "#306CEC" },
];

const ecosystemDashboard = [
  { name: "Community Trust Networks", percentage: 90, color: "#10B981" },
  { name: "Entrepreneurial Activity", percentage: 75, color: "#306CEC" },
  { name: "Informal Capital Availability", percentage: 75, color: "#8B5CF6" },
  { name: "University Talent Production", percentage: 75, color: "#F59E0B" },
  { name: "Technology Awareness", percentage: 75, color: "#06B6D4" },
  { name: "Market Opportunity", percentage: 75, color: "#10B981" },
  { name: "Technology Adoption", percentage: 50, color: "#F59E0B" },
  { name: "Startup Support Infrastructure", percentage: 30, color: "#EF4444" },
  { name: "Formal Capital Accessibility", percentage: 25, color: "#EF4444" },
];

const systems = [
  {
    number: "01",
    name: "Trust Economy",
    score: "90%",
    color: "#10B981",
    description:
      "Eldoret's greatest asset is its dense web of community trust networks — informal social capital built through cultural institutions, faith communities, and longstanding trade relationships. At 90%, this is the city's highest-scoring system and forms the foundation for all other economic activity.",
    insight:
      "Trust networks already move capital, talent, and information efficiently. Formalizing these channels creates immediate leverage for startup growth.",
  },
  {
    number: "02",
    name: "Builders Economy",
    score: "75%",
    color: "#306CEC",
    description:
      "Entrepreneurial activity in Eldoret is vigorous. Founders operate across agribusiness, logistics, education, and trade sectors. The roadshow surface a high density of active builders who have started ventures without institutional support — driven purely by necessity and ambition.",
    insight:
      "The builders are already building. What's missing is infrastructure: mentorship, market access, and structured pathways to scale.",
  },
  {
    number: "03",
    name: "Access Economy",
    score: "25% formal / 75% informal",
    color: "#F59E0B",
    description:
      "Informal capital — family networks, rotating savings groups (chamas), and peer-to-peer lending — is abundant at 75%. Formal capital, at just 25%, remains extremely thin. No functional angel network or VC presence exists in Eldoret. Most founders have never had a conversation with an institutional investor.",
    insight:
      "Bridging the formal capital gap is the single highest-leverage intervention. Even basic financial literacy and investor-readiness programming would unlock existing informal capital flows.",
  },
  {
    number: "04",
    name: "Digital Economy",
    score: "75% awareness / 50% adoption",
    color: "#8B5CF6",
    description:
      "Technology awareness is high — founders understand digital tools and their potential. But adoption lags at 50%, held back by connectivity costs, device access, and lack of localized support. University graduates arrive digitally literate; the adoption gap sits in the small business middle layer.",
    insight:
      "There is a teachable moment here. A focused digital-tools cohort — tied to real revenue outcomes — would close the awareness-to-adoption gap rapidly.",
  },
  {
    number: "05",
    name: "Visibility & Storytelling",
    score: "75%",
    color: "#06B6D4",
    description:
      "Eldoret's ecosystem is poorly documented and underrepresented in national narratives. Despite a 75% market opportunity score, founders lack access to media platforms, content creation skills, and the distribution channels that would tell their stories beyond the county. The roadshow itself became a visibility event.",
    insight:
      "Every city needs its own storytellers. Supporting local media creators and documentation projects multiplies the impact of all other investments.",
  },
];

const reportSections = [
  {
    id: "overview",
    title: "Campaign Overview",
    icon: Globe,
    content: `The Impact360 Decentralization Roadshow landed in Eldoret on the campus of Baraza Media Lab as part of a national mission to activate innovation ecosystems beyond Nairobi. Eldoret — Kenya's fifth-largest city and home to world-class athletics talent — has an entrepreneurial community that punches well above its weight. The roadshow mapped this ecosystem across five economic systems: Trust, Builders, Access, Digital, and Visibility.`,
    highlight: "Eldoret: Where Champions Build More Than Records",
  },
  {
    id: "objectives",
    title: "Campaign Objectives",
    icon: Target,
    items: [
      "Map Eldoret's entrepreneurial ecosystem across five economic systems",
      "Surface high-potential founders operating without institutional support",
      "Identify the critical gaps between informal and formal capital access",
      "Build cross-sector connections between tech, agri, and trade communities",
      "Generate a replicable State of Decentralization evidence base for the county",
    ],
  },
  {
    id: "activities",
    title: "Event Activities",
    icon: Activity,
    timeline: [
      {
        phase: "Ecosystem Roundtable",
        date: "Morning",
        description: "Deep-dive roundtable sessions structured around each of the five economic systems. Participants self-identified their ecosystem role and mapped connections to other sectors.",
        status: "completed",
      },
      {
        phase: "Networking & Community Building",
        date: "Mid-Morning",
        description: "Structured networking designed to surface unexpected connections — pairing founders with potential collaborators, mentors, and resource providers they wouldn't otherwise meet.",
        status: "completed",
      },
      {
        phase: "Presentations & Panel",
        date: "Afternoon",
        description: "Seven speakers from the local ecosystem — founders, investors, and community organizers — shared insights on building in Eldoret. The Hotseat format enabled real-time challenge and debate.",
        status: "completed",
      },
      {
        phase: "Ecosystem Dashboard Review",
        date: "Late Afternoon",
        description: "Collective scoring of the Eldoret ecosystem across nine indicators, creating a live, room-generated snapshot of the city's strengths and gaps.",
        status: "completed",
      },
    ],
  },
  {
    id: "findings",
    title: "Key Findings",
    icon: Lightbulb,
    findings: [
      {
        title: "Trust is the Real Infrastructure",
        description:
          "Community trust networks scored 90% — the highest of any indicator. Social capital is Eldoret's invisible infrastructure, moving resources and information faster than any formal system.",
        metric: "90% Trust",
        icon: Shield,
      },
      {
        title: "The Capital Access Paradox",
        description:
          "Informal capital flows freely at 75%, yet formal capital sits at just 25%. Founders are resourceful but locked out of institutional finance — a critical bottleneck for scale.",
        metric: "25% Formal",
        icon: BarChart3,
      },
      {
        title: "Digital Adoption Gap",
        description:
          "Awareness of digital tools (75%) far outpaces actual adoption (50%). Cost, connectivity, and absence of localized support are the primary barriers keeping founders offline.",
        metric: "50% Adoption",
        icon: TrendingUp,
      },
      {
        title: "Thin Support Infrastructure",
        description:
          "Startup support infrastructure scored just 30% — well below the national baseline. Incubators, accelerators, and co-working spaces are virtually absent outside a handful of university programs.",
        metric: "30% Support",
        icon: Building2,
      },
    ],
  },
  {
    id: "outcomes",
    title: "Outcomes & Impact",
    icon: Award,
    outcomes: [
      {
        label: "Founders Connected",
        value: "45",
        description: "Participants representing entrepreneurs, community organizers, investors, and ecosystem builders across Eldoret and the North Rift region",
      },
      {
        label: "Economic Systems Documented",
        value: "5",
        description: "Trust, Builders, Access, Digital, and Visibility systems fully mapped and scored with community input",
      },
      {
        label: "Ecosystem Indicators Scored",
        value: "9",
        description: "Live, room-generated dashboard scoring across nine indicators forming the National Decentralization Index baseline for Eldoret",
      },
      {
        label: "Community Trust Score",
        value: "90%",
        description: "The strongest finding of the day — Eldoret's social capital is a hidden superpower waiting to be harnessed for formal innovation infrastructure",
      },
    ],
  },
];

const recommendations = [
  {
    title: "Formalize the Trust Networks",
    description:
      "Design programs that plug into existing community trust infrastructure — chamas, faith groups, trade associations — to deliver startup support, mentorship, and early-stage capital without requiring founders to leave their existing networks.",
    priority: "High",
    icon: Shield,
  },
  {
    title: "Launch an Investor-Readiness Track",
    description:
      "The 25% formal capital score reveals a systemic gap. A dedicated investor-readiness cohort — covering financial modelling, due diligence preparation, and pitch practice — would unlock access to the national and diaspora investor base.",
    priority: "High",
    icon: Rocket,
  },
  {
    title: "Close the Digital Adoption Gap",
    description:
      "Partner with tech companies to deliver subsidized, localized digital tools training tied to real revenue outcomes. Pairing adoption with income generation is the fastest path from awareness to sustained use.",
    priority: "Medium",
    icon: Zap,
  },
  {
    title: "Fund Local Storytellers",
    description:
      "Eldoret's ecosystem is underdocumented. Supporting local journalists, content creators, and filmmakers to tell the city's innovation stories would multiply the reach of every other investment and attract outside attention.",
    priority: "Medium",
    icon: Megaphone,
  },
];

// ─── Animation Variants ─────────────────────────────────────────────────────

const fadeRise = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
};

// ─── Sub-Components ──────────────────────────────────────────────────────────

function MetricCard({ metric, index, darkMode }) {
  const Icon = metric.icon;
  return (
    <motion.div
      variants={scaleIn}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.03 }}
      className={`relative overflow-hidden rounded-2xl p-6 text-center group cursor-default ${
        darkMode
          ? "bg-[#1a1f3a] border border-gray-700/50"
          : "bg-white border border-gray-100 shadow-lg shadow-gray-200/50"
      }`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ backgroundColor: metric.color }}
      />
      <div
        className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${metric.color}15` }}
      >
        <Icon className="w-7 h-7" style={{ color: metric.color }} />
      </div>
      <p className="text-3xl md:text-4xl font-bold mb-1" style={{ color: metric.color }}>
        {metric.value}
      </p>
      <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {metric.label}
      </p>
    </motion.div>
  );
}

function TimelineItem({ item, index, darkMode, isLast }) {
  return (
    <motion.div
      variants={fadeRise}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex gap-4 md:gap-6"
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-[#306CEC] flex items-center justify-center shrink-0 shadow-lg shadow-[#306CEC]/30">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-2 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
        )}
      </div>
      <div className={`pb-8 flex-1 rounded-xl p-4 -mt-1 ${darkMode ? "bg-[#1a1f3a]/50" : "bg-gray-50"}`}>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#306CEC]/10 text-[#306CEC]">
            {item.date}
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-500/10 text-green-500">
            Completed
          </span>
        </div>
        <h4 className={`text-lg font-bold mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
          {item.phase}
        </h4>
        <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

function DashboardBar({ indicator, darkMode }) {
  return (
    <motion.div variants={fadeRise} className="group">
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          {indicator.name}
        </span>
        <span className="text-sm font-bold" style={{ color: indicator.color }}>
          {indicator.percentage}%
        </span>
      </div>
      <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: indicator.color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${indicator.percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

function AccordionSection({ section, darkMode }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;
  return (
    <motion.div
      variants={fadeRise}
      className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
        darkMode
          ? "bg-[#1a1f3a] border-gray-700/50 hover:border-[#306CEC]/50"
          : "bg-white border-gray-100 shadow-md hover:shadow-lg"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#306CEC]/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-[#306CEC]" />
          </div>
          <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {section.title}
          </h3>
        </div>
        {open ? (
          <ChevronUp className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
        ) : (
          <ChevronDown className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`px-5 md:px-6 pb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {section.content && (
                <p className="text-base leading-relaxed">{section.content}</p>
              )}
              {section.items && (
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#306CEC] mt-0.5 shrink-0" />
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function EldoretReport() {
  const { darkMode } = useDarkMode();
  const [showQR, setShowQR] = useState(false);

  return (
    <div
      className={`font-sans transition-colors duration-1000 min-h-screen ${
        darkMode ? "bg-black" : "bg-[#F5F6F8]"
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar />

      {/* WhatsApp QR Code Modal */}
      {showQR && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowQR(false)}
        >
          <motion.div
            className={`rounded-3xl p-8 max-w-md w-full relative shadow-2xl ${darkMode ? "bg-[#1a1f3a]" : "bg-white"}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQR(false)}
              className={`absolute top-4 right-4 text-2xl font-bold ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
            >
              ×
            </button>
            <div className="text-center space-y-6">
              <h2 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Join Our Community</h2>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Scan the QR code to join our WhatsApp community</p>
              <div className={`p-8 rounded-2xl flex items-center justify-center ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <img
                  onContextMenu={(e) => e.preventDefault()}
                  draggable="false"
                  src="/frame.png"
                  alt="WhatsApp QR Code"
                  className="w-64 h-64 object-contain"
                />
              </div>
              <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>Or click below to join directly</p>
              <a
                href="https://chat.whatsapp.com/I0g8kpCNvSn84yWQxybzHa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition-all duration-300"
              >
                Open WhatsApp
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ═══════════ REPORTS NAV ═══════════ */}
      <div className={`pt-20 transition-colors duration-300 ${darkMode ? "bg-[#0a0f1e]" : "bg-white"}`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-wrap items-center gap-3">
          <span className={`text-xs font-bold tracking-widest uppercase ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Reports:
          </span>
          <a
            href="/campaign"
            className={`text-sm font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 ${
              darkMode
                ? "border-gray-700 text-gray-400 hover:border-[#306CEC]/50 hover:text-[#306CEC]"
                : "border-gray-200 text-gray-500 hover:border-[#306CEC]/50 hover:text-[#306CEC]"
            }`}
          >
            Nakuru
          </a>
          <span
            className="text-sm font-semibold px-4 py-1.5 rounded-full border bg-[#306CEC] border-[#306CEC] text-white"
          >
            Eldoret ✓
          </span>
          <span
            className={`text-sm font-semibold px-4 py-1.5 rounded-full border opacity-40 cursor-not-allowed ${
              darkMode ? "border-gray-700 text-gray-500" : "border-gray-200 text-gray-400"
            }`}
          >
            Kisumu — coming soon
          </span>
        </div>
      </div>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#162044] to-[#1a1f3a]" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(48,108,236,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(48,108,236,0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[#306CEC]/20 blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-[#306CEC]/15 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#306CEC]/20 border border-[#306CEC]/30 mb-8"
          >
            <Activity className="w-4 h-4 text-[#306CEC]" />
            <span className="text-sm font-semibold text-[#306CEC]">State of Decentralization Report — Eldoret Edition</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight"
          >
            State of{" "}
            <span className="bg-gradient-to-r from-[#306CEC] via-[#5b8af5] to-[#4a7eec] bg-clip-text text-transparent">
              Decentralization
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <MapPin className="w-5 h-5 text-[#306CEC]" />
            <span className="text-xl md:text-2xl font-semibold text-gray-300">Eldoret, Uasin Gishu County, Kenya</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            A five-system ecosystem analysis of Eldoret's innovation economy — mapping trust networks,
            capital flows, digital adoption, builder culture, and visibility infrastructure.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="text-sm text-gray-500 mb-10"
          >
            Prepared by Mariama Waiganjo &amp; Samuel Obukosia · Impact360 &amp; TOIG
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#report"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#306CEC] text-white font-bold rounded-full hover:bg-[#2558c9] transition-all duration-300 shadow-lg shadow-[#306CEC]/30 hover:shadow-[#306CEC]/50"
            >
              Read Full Report <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ IMPACT METRICS ═══════════ */}
      <motion.section
        id="report"
        className={`py-20 px-6 transition-colors duration-1000 ${darkMode ? "bg-black" : "bg-[#F5F6F8]"}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeRise} className="text-center mb-14">
            <span className="text-sm font-bold text-[#306CEC] tracking-widest uppercase">Impact At A Glance</span>
            <h2 className={`text-3xl md:text-5xl font-extrabold mt-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Eldoret by the Numbers
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {impactMetrics.map((metric, i) => (
              <MetricCard key={metric.label} metric={metric} index={i} darkMode={darkMode} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════ REPORT OVERVIEW & OBJECTIVES (Accordion) ═══════════ */}
      <motion.section
        className={`py-20 px-6 transition-colors duration-1000 ${darkMode ? "bg-[#0a0f1e]" : "bg-white"}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <motion.div variants={fadeRise} className="text-center mb-10">
            <span className="text-sm font-bold text-[#306CEC] tracking-widest uppercase">Deep Dive</span>
            <h2 className={`text-3xl md:text-4xl font-extrabold mt-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Campaign Details
            </h2>
          </motion.div>
          {reportSections.slice(0, 2).map((section) => (
            <AccordionSection key={section.id} section={section} darkMode={darkMode} />
          ))}
        </div>
      </motion.section>

      {/* ═══════════ FIVE SYSTEMS ═══════════ */}
      <motion.section
        className={`py-20 px-6 transition-colors duration-1000 ${darkMode ? "bg-black" : "bg-[#F5F6F8]"}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={stagger}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeRise} className="text-center mb-14">
            <span className="text-sm font-bold text-[#306CEC] tracking-widest uppercase">Framework</span>
            <h2 className={`text-3xl md:text-4xl font-extrabold mt-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Five Economic Systems
            </h2>
            <p className={`mt-3 text-base max-w-xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Eldoret's ecosystem was mapped across five interconnected systems that together determine how innovation thrives — or stalls.
            </p>
          </motion.div>

          <div className="space-y-6">
            {systems.map((system, i) => (
              <motion.div
                key={system.number}
                variants={fadeRise}
                transition={{ delay: i * 0.08 }}
                className={`rounded-2xl p-6 md:p-8 border transition-all duration-300 ${
                  darkMode
                    ? "bg-[#1a1f3a] border-gray-700/50"
                    : "bg-white border-gray-100 shadow-md"
                }`}
              >
                <div className="flex flex-wrap items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-lg text-white"
                    style={{ backgroundColor: system.color }}
                  >
                    {system.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h3 className={`text-xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {system.name}
                      </h3>
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full text-white"
                        style={{ backgroundColor: system.color }}
                      >
                        {system.score}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {system.description}
                    </p>
                    <div
                      className={`border-l-4 pl-4 ${darkMode ? "border-gray-600" : "border-gray-200"}`}
                      style={{ borderLeftColor: system.color }}
                    >
                      <p className={`text-sm font-semibold italic ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {system.insight}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════ TIMELINE ═══════════ */}
      <motion.section
        className={`py-20 px-6 transition-colors duration-1000 ${darkMode ? "bg-[#0a0f1e]" : "bg-white"}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeRise} className="text-center mb-14">
            <span className="text-sm font-bold text-[#306CEC] tracking-widest uppercase">Activities</span>
            <h2 className={`text-3xl md:text-4xl font-extrabold mt-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Day of the Roadshow
            </h2>
          </motion.div>
          <div className="space-y-0">
            {reportSections[2].timeline.map((item, i) => (
              <TimelineItem
                key={item.phase}
                item={item}
                index={i}
                darkMode={darkMode}
                isLast={i === reportSections[2].timeline.length - 1}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════ KEY FINDINGS ═══════════ */}
      <motion.section
        className={`py-20 px-6 transition-colors duration-1000 ${darkMode ? "bg-black" : "bg-[#F5F6F8]"}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeRise} className="text-center mb-14">
            <span className="text-sm font-bold text-[#306CEC] tracking-widest uppercase">Insights</span>
            <h2 className={`text-3xl md:text-4xl font-extrabold mt-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Key Findings
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {reportSections[3].findings.map((finding, i) => {
              const FIcon = finding.icon;
              return (
                <motion.div
                  key={finding.title}
                  variants={fadeRise}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl p-6 border transition-all duration-300 ${
                    darkMode
                      ? "bg-[#1a1f3a] border-gray-700/50 hover:border-[#306CEC]/40"
                      : "bg-[#F5F6F8] border-gray-100 hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#306CEC]/10 flex items-center justify-center shrink-0">
                      <FIcon className="w-6 h-6 text-[#306CEC]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {finding.title}
                        </h4>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#306CEC]/10 text-[#306CEC]">
                          {finding.metric}
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {finding.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ═══════════ ECOSYSTEM DASHBOARD ═══════════ */}
      <motion.section
        className={`py-20 px-6 transition-colors duration-1000 ${darkMode ? "bg-[#0a0f1e]" : "bg-white"}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeRise} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-3">
              <PieChart className="w-5 h-5 text-[#306CEC]" />
              <span className="text-sm font-bold text-[#306CEC] tracking-widest uppercase">Dashboard</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Eldoret Ecosystem Dashboard
            </h2>
            <p className={`mt-3 text-base ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Live-generated scores from 45 participants — the National Decentralization Index baseline for Eldoret
            </p>
          </motion.div>
          <motion.div
            variants={fadeRise}
            className={`rounded-2xl p-8 border ${
              darkMode ? "bg-[#1a1f3a] border-gray-700/50" : "bg-white border-gray-100 shadow-lg"
            }`}
          >
            <div className="space-y-6">
              {ecosystemDashboard.map((indicator) => (
                <DashboardBar key={indicator.name} indicator={indicator} darkMode={darkMode} />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ═══════════ OUTCOMES ═══════════ */}
      <motion.section
        className={`py-20 px-6 transition-colors duration-1000 ${darkMode ? "bg-black" : "bg-[#F5F6F8]"}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeRise} className="text-center mb-14">
            <span className="text-sm font-bold text-[#306CEC] tracking-widest uppercase">Results</span>
            <h2 className={`text-3xl md:text-4xl font-extrabold mt-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Outcomes &amp; Impact
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {reportSections[4].outcomes.map((outcome, i) => (
              <motion.div
                key={outcome.label}
                variants={fadeRise}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-6 border-l-4 border-l-[#306CEC] ${
                  darkMode ? "bg-[#1a1f3a]" : "bg-[#F5F6F8]"
                }`}
              >
                <p className="text-4xl font-extrabold text-[#306CEC] mb-2">{outcome.value}</p>
                <h4 className={`text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {outcome.label}
                </h4>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {outcome.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════ RECOMMENDATIONS ═══════════ */}
      <motion.section
        className={`py-20 px-6 transition-colors duration-1000 ${darkMode ? "bg-[#0a0f1e]" : "bg-white"}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeRise} className="text-center mb-14">
            <span className="text-sm font-bold text-[#306CEC] tracking-widest uppercase">Next Steps</span>
            <h2 className={`text-3xl md:text-4xl font-extrabold mt-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Recommendations
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.map((rec, i) => {
              const RIcon = rec.icon;
              return (
                <motion.div
                  key={rec.title}
                  variants={fadeRise}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden ${
                    darkMode
                      ? "bg-[#1a1f3a] border-gray-700/50"
                      : "bg-white border-gray-100 shadow-md hover:shadow-xl"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#306CEC]/10 flex items-center justify-center shrink-0">
                      <RIcon className="w-6 h-6 text-[#306CEC]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {rec.title}
                        </h4>
                      </div>
                      <span
                        className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${
                          rec.priority === "High"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-yellow-500/10 text-yellow-600"
                        }`}
                      >
                        {rec.priority} Priority
                      </span>
                      <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ═══════════ CTA ═══════════ */}
      <motion.section
        className="relative py-24 px-6 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeRise}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#306CEC] via-[#4a7eec] to-[#2558c9]" />
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            variants={fadeRise}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6"
          >
            <Heart className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white/90">Be Part of the Movement</span>
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Decentralization Starts With You
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
            Whether you're a founder, mentor, investor, or community leader, join Impact360 in
            building thriving innovation ecosystems across every county in Kenya.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowQR(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#306CEC] font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              <Zap className="w-4 h-4" />
              Join Impact360
            </button>
            <a
              href="/events"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300"
            >
              View Upcoming Events
            </a>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
