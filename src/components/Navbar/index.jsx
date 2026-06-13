import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Cpu, Menu, X, Play, BarChart2, Info, Home } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Solver', path: '/solver', icon: Play },
    { name: 'Compare', path: '/compare', icon: BarChart2 },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-brand-dark/70 backdrop-blur-md border-b border-white/5 px-4 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center space-x-2.5 group">
          <div className="p-2 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-all">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-purple-400">
            8-Puzzle<span className="text-purple-500">AI</span>
          </span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-inner'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none rounded-lg hover:bg-white/5"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-2 pb-4 border-t border-white/5 space-y-1 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-purple-500/15 text-purple-400 border border-purple-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
}
