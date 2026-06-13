import React from 'react';
import { Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-brand-dark/50 backdrop-blur px-4 py-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
          <Cpu className="w-4 h-4 text-purple-500" />
          <span>8-Puzzle Solver Visualizer &copy; {new Date().getFullYear()}</span>
        </div>
        <div className="text-xs text-slate-500 text-center sm:text-right">
          Built with <span className="text-purple-400">React</span> &amp; <span className="text-blue-400">Tailwind CSS</span> | AI Search Algorithms Visualization
        </div>
      </div>
    </footer>
  );
}
