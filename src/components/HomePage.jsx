import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Lightbulb, Users, TrendingUp, Rocket, Calendar } from "lucide-react";
import { useDarkMode } from "../DarkModeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

function CountUp({ target, duration = 1.5 }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function HomePage() {
  const [showQR, setShowQR] = useState(false);
    const [currentPhoto, setCurrentPhoto] = useState(0);
  const { darkMode } = useDarkMode();

  const photos = React.useMemo(() => [
    "/DSC_2851.jpg",
    "/DSC_2843.jpg",
    "/DSC_2790.jpg",
    "/DSC_2726.jpg",
    "/DSC_2703.jpg",
    "/DSC_2690.jpg"
  ], []);

  const featuresData = [
    { icon: Lightbulb, title: "Innovation", desc: "Transform ideas into reality with cutting-edge tools" },
    { icon: Users, title: "Community", desc: "Connect with Africa's top changemakers" },
    { icon: TrendingUp, title: "Growth", desc: "Scale your ventures with proven frameworks" },
  ];

  const offers = [
    {
      title: "Incubation & Acceleration",
      description: "We support founders from idea to execution through mentorship, structured programs, and strategic resources.",
      icon: Rocket,
      image: "/incubation.png",
      link: "/programs",
    },
    {
      title: "Events",
      description: "We run workshops, bootcamps, and founder meetups to help innovators learn, connect, and grow.",
      icon: Calendar,
      image: "/event.png",
      link: "/events",
    },
  ];

  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload first image
  useEffect(() => {
    const img = new Image();
    img.src = photos[0];
    img.onload = () => {
      setImagesLoaded(true);
    };
  }, [photos]);

  // Auto slideshow every 3 seconds - only start after first image loads
  useEffect(() => {
    if (!imagesLoaded) return;
    
    const interval = setInterval(() => {
      setCurrentPhoto(prev => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [photos.length, imagesLoaded]);

  return (
    <div className={`transition-colors duration-1000 ${darkMode ? 'bg-[#000000]' : 'bg-white'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
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
            className={`rounded-3xl p-8 max-w-md w-full relative shadow-2xl ${darkMode ? 'bg-[#1a1f3a]' : 'bg-white'}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQR(false)}
              className={`absolute top-4 right-4 text-2xl font-bold ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
              ×
            </button>
            <div className="text-center space-y-6">
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Join Our Community</h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Scan the QR code to join our WhatsApp community</p>
              <div className={`p-8 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <img onContextMenu={(e) => e.preventDefault()} draggable="false" 
                  src="/frame.png" 
                  alt="WhatsApp QR Code"
                  className="w-64 h-64 object-contain"
                />
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Or click below to join directly</p>
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
        
      {/* HERO SECTION */}
      <section className={`min-h-screen flex items-center justify-center relative overflow-hidden pt-20 ${darkMode ? 'bg-[#000000]' : 'bg-gray-900'}`}>

        {/* SLIDESHOW BACKGROUND */}
        <div className="absolute inset-0">
          {/* Loading placeholder with gradient */}
          {!imagesLoaded && (
            <div className={`absolute inset-0 flex items-center justify-center ${darkMode ? 'bg-[#000000]' : 'bg-[#306CEC]'}`}>
              <div className="text-white text-xl font-semibold">Loading...</div>
            </div>
          )}
          
          {photos.map((photo, index) => (
            <div
              key={photo}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${photo})`,
                zIndex: currentPhoto === index ? 2 : 1,
                opacity: imagesLoaded && currentPhoto === index ? 1 : 0,
                transition: 'opacity 1s ease-in-out',
              }}
            />
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPhoto(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentPhoto === index ? "bg-white w-8" : "bg-white/40 w-2"
              }`}
            />
          ))}
        </div>

        {/* CENTERED HERO TEXT */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
          <h1
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight"
            style={{
              fontFamily: 'League Spartan, sans-serif',
              textShadow: "0 4px 20px rgba(0,0,0,0.7), 0 2px 10px rgba(0,0,0,0.5)"
            }}
          >
            Decentralizing Innovation Across Africa
          </h1>

          <p
            className="text-lg md:text-xl lg:text-2xl text-white mb-10 max-w-4xl mx-auto font-light leading-relaxed"
            style={{
              textShadow: "0 2px 12px rgba(0,0,0,0.7)"
            }}
          >
            Breaking barriers and bringing world class entrepreneurship resources to every corner of the continent empowering founders everywhere to build sustainable, scalable solutions.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-5 justify-center">
            <a href="/about">
              <button className="border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-[#000000] transition-all duration-300 shadow-lg hover:shadow-xl" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                Learn More
              </button>
            </a>

            <button 
              onClick={() => setShowQR(true)}
              className="bg-black text-white border-2 border-white/40 px-10 py-4 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-white hover:text-black"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              Join Community
            </button>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className={`py-20 px-6 transition-colors duration-1000 ${darkMode ? 'bg-[#000000]' : 'bg-[#FFFEF9]'}`}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { value: 10, label: "Founders Supported" },
            { value: 3,  label: "Cities Visited" },
            { value: 3,  label: "Programs Running" },
            { value: 1,  label: "Strategic Partner" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-5xl md:text-6xl font-black leading-none mb-3 text-[#306CEC]" style={{ fontFamily: 'League Spartan, sans-serif' }}>
                +<CountUp target={stat.value} />
              </p>
              <p className={`text-sm font-semibold tracking-widest uppercase ${darkMode ? 'text-white/50' : 'text-black/40'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* WHAT WE DO — alternating split rows */}
      <section className={`transition-colors duration-1000 ${darkMode ? 'bg-[#000000]' : 'bg-[#FFFEF9]'}`}>
        {offers.map((offer, index) => {
          const IconComponent = offer.icon;
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              viewport={{ once: true, amount: 0.25 }}
              className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} min-h-[480px]`}
            >
              {/* Image half */}
              <div className="relative w-full md:w-1/2 h-72 md:h-auto overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-6 left-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 w-14 h-14 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Content half */}
              <div className={`w-full md:w-1/2 flex items-center px-10 md:px-16 py-14 ${darkMode ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
                <div className="max-w-md">
                  <p className="text-xs font-bold tracking-[0.2em] text-[#306CEC] uppercase mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {String(index + 1).padStart(2, '0')} — What We Offer
                  </p>
                  <h3
                    className={`text-4xl md:text-5xl font-black leading-tight mb-5 ${darkMode ? 'text-white' : 'text-[#111]'}`}
                    style={{ fontFamily: 'League Spartan, sans-serif' }}
                  >
                    {offer.title}
                  </h3>
                  <div className={`h-px w-12 mb-5 bg-[#306CEC]`} />
                  <p className={`text-base leading-relaxed mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {offer.description}
                  </p>
                  <a
                    href={offer.link}
                    className="inline-flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-[#306CEC] hover:gap-5 transition-all duration-300"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Learn More <span>→</span>
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* WHY IMPACT360 — asymmetric editorial */}
      <section className={`py-24 px-6 transition-colors duration-1000 ${darkMode ? 'bg-[#000000]' : 'bg-[#F5F6F8]'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-start">

          {/* Left: bold heading */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="md:w-2/5 md:sticky md:top-28"
          >
            <p className="text-xs font-bold tracking-[0.2em] text-[#306CEC] uppercase mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>Why Us</p>
            <h2
              className={`text-5xl md:text-7xl font-black leading-none mb-6 ${darkMode ? 'text-white' : 'text-[#111]'}`}
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              BUILT<br />FOR<br /><span className="text-[#306CEC]">FOUNDERS</span>
            </h2>
            <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Everything we do is designed around the needs of African founders, from idea to scale.
            </p>
          </motion.div>

          {/* Right: feature list */}
          <div className="md:w-3/5 flex flex-col gap-0">
            {featuresData.map((item, i) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`flex items-start gap-6 py-8 border-b transition-colors duration-300 group cursor-default ${
                    darkMode ? 'border-white/8 hover:bg-white/3' : 'border-black/8 hover:bg-black/2'
                  }`}
                >
                  <span className={`text-xs font-bold tracking-widest mt-1 ${darkMode ? 'text-white/30' : 'text-black/30'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="w-5 h-5 text-[#306CEC]" strokeWidth={2} />
                      <h3
                        className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-[#111]'}`}
                        style={{ fontFamily: 'League Spartan, sans-serif' }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <p className={`text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {item.desc}
                    </p>
                  </div>
                  <span className={`text-2xl mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#306CEC]`}>→</span>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* TOIG COMPANIES */}
      <section className={`py-24 px-6 transition-colors duration-1000 ${darkMode ? 'bg-[#000000]' : 'bg-[#F5F6F8]'}`}>
        <div className="max-w-7xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="text-xs font-bold tracking-[0.25em] text-[#306CEC] uppercase mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Portfolio
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2
                className={`text-5xl md:text-6xl font-black leading-none ${darkMode ? 'text-white' : 'text-[#111]'}`}
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                TOIG<br /><span className="text-[#306CEC]">COMPANIES</span>
              </h2>
              <p className={`max-w-sm text-base leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
                Ventures built and accelerated through the Impact360 Forge program.
              </p>
            </div>
            <div className={`h-px w-full mt-8 ${darkMode ? 'bg-white/8' : 'bg-black/8'}`} />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "I³Plus",    category: "Marketing Agency",  logo: "/companyLogos/5 (1).png",    desc: "Creative marketing solutions", invert: false, fit: "cover"   },
              { name: "iTek",      category: "ICT Agency",        logo: "/companyLogos/Picture1.png", desc: "Digital & ICT infrastructure", invert: true,  fit: "contain" },
              { name: "I³Studios", category: "Media Production",  logo: "/companyLogos/11 (1).png",   desc: "Professional media production", invert: false, fit: "cover"   },
              { name: "i3x Africa",  category: "Event Agency",      logo: "/companyLogos/africa.jpg", desc: "Events & experiences", invert: false, fit: "cover" },
            ].map((company, i) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl overflow-hidden bg-black transition-all duration-300 cursor-default hover:shadow-xl hover:shadow-black/30"
              >
                {/* Logo image */}
                <div className="w-full h-32 overflow-hidden bg-black flex items-center justify-center">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className={`w-full h-full ${company.fit === 'contain' ? 'object-contain object-top pt-3 px-4 pb-4' : 'object-cover'} ${company.invert ? 'invert hue-rotate-180' : ''}`}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center">
                      <span className="text-white/20 text-xl">+</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className={`px-4 py-3 text-center ${darkMode ? 'bg-[#0d0d0d]' : 'bg-white'}`}>
                  <h3 className={`text-sm font-black leading-tight mb-0.5 ${darkMode ? 'text-white' : 'text-[#111]'}`} style={{ fontFamily: 'League Spartan, sans-serif' }}>
                    {company.name}
                  </h3>
                  <p className={`text-[10px] font-semibold tracking-widest uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {company.category}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERSHIP SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        viewport={{ once: true, amount: 0.3 }}
        className={`py-28 px-6 transition-colors duration-1000 ${darkMode ? 'bg-black' : 'bg-white'}`}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xs font-bold tracking-[0.25em] text-[#306CEC] uppercase mb-10"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Official Partnership
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-8 mb-10"
          >
            <img
              src="/logo2-transparent.png"
              alt="Impact360"
              className="h-24 md:h-36 w-auto object-contain"
            />
            <span className="text-4xl md:text-6xl font-light text-[#306CEC]">×</span>
            <div className={`rounded-xl px-6 py-3 flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-white'}`}>
              <img
                src="/companyLogos/DINAO-logo-RGB-transparant-01.png"
                alt="DINAO"
                className="h-20 md:h-32 w-auto object-contain"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className={`h-px w-full mb-10 origin-left ${darkMode ? 'bg-white/10' : 'bg-black/10'}`}
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className={`text-lg leading-relaxed max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Together, Impact360 and DINAO are expanding access to entrepreneurship resources, funding pathways, and mentorship networks, bringing world-class support to founders in every corner of Africa.
          </motion.p>
        </div>
      </motion.section>

      {/* CTA SECTION */}
      <section className={`py-24 px-6 transition-colors duration-1000 ${darkMode ? 'bg-[#000000]' : 'bg-[#F5F6F8]'}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="text-xs font-bold tracking-[0.25em] text-[#306CEC] uppercase mb-4" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Get Involved
          </p>
          <h2
            className={`text-5xl md:text-7xl font-black leading-tight mb-6 ${darkMode ? 'text-white' : 'text-[#111]'}`}
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            READY TO BUILD<br />
            <span className="text-[#306CEC]">YOUR FUTURE?</span>
          </h2>
          <p className={`text-lg mb-10 max-w-xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Join hundreds of founders already building with Impact360 across Africa.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/programs">
              <button
                className="bg-[#306CEC] text-white px-10 py-4 rounded-full font-bold hover:bg-[#4A80FF] transition-all duration-300 shadow-lg hover:shadow-xl"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                Explore Programs
              </button>
            </a>
            <button
              onClick={() => setShowQR(true)}
              className={`border-2 px-10 py-4 rounded-full font-bold transition-all duration-300 ${darkMode ? 'border-white/30 text-white hover:border-white' : 'border-black/20 text-[#111] hover:border-black'}`}
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              Join Community
            </button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <Footer/>

    </div>
  );
}