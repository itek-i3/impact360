import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DarkModeProvider } from "./DarkModeContext";
import HomePage from "./components/HomePage.jsx";
import About from "./components/About.jsx"; 
import Programs from "./components/Programs.jsx"; 
import Eventpage from "./components/Eventpage.jsx"; 
import Subscription from "./components/Subscription.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import AdminDashboard from "./components/admin.jsx";
import TicketVerification from "./components/TicketVerification.jsx";
import CampaignReport from "./components/CampaignReport.jsx";
import EldoretReport from "./components/EldoretReport.jsx";
import RoadshowPage from "./components/RoadshowPage.jsx";
import LocalsPage from "./components/LocalsPage.jsx";
import HighlightsPage from "./components/HighlightsPage.jsx";


export default function App() {
  return (
    <DarkModeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/events" element={<Eventpage />} />
            <Route path="/events/roadshow" element={<RoadshowPage />} />
            <Route path="/events/locals" element={<LocalsPage />} />
            <Route path="/events/highlights" element={<HighlightsPage />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/campaign" element={<CampaignReport />} />
            <Route path="/campaign/eldoret" element={<EldoretReport />} />
            <Route path="*" element={<HomePage />} />
            <Route path="/navbar" element={<Navbar />} />
            <Route path="/footer" element={<Footer />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/verify" element={<TicketVerification />} />
          </Routes>
        </div>
      </Router>
    </DarkModeProvider>
  );
}