import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Solver from './pages/Solver';
import Compare from './pages/Compare';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-brand-dark selection:bg-purple-600/35 select-none">
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-gradient-to-bl from-purple-900/10 via-indigo-950/0 to-transparent blur-[120px] pointer-events-none z-0"></div>
        
        <Navbar />
        <main className="flex-grow z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solver" element={<Solver />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
