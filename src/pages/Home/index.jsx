import React from 'react';
import { Link } from 'react-router-dom';
import { Play, BarChart2, BookOpen, Layers, Zap, Cpu } from 'lucide-react';

export default function Home() {
  const features = [
    {
      title: 'Diverse AI Algorithms',
      description: 'Explore 6 search methods, including BFS, DFS, UCS, Greedy, and A* with multiple heuristic strategies.',
      icon: Cpu,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Live Walkthrough Timeline',
      description: 'Animate solutions step-by-step. Control speeds, play/pause, and scrub through action states.',
      icon: Zap,
      color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    },
    {
      title: 'Compare Mode',
      description: 'Run two algorithms simultaneously side-by-side to compare expanded nodes, times, and path costs.',
      icon: BarChart2,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Educational Breakdowns',
      description: 'See live f(n), g(n), h(n) math, parent-child transitions, and decision rationales at every state.',
      icon: BookOpen,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-12 px-4 overflow-hidden">
      {/* Background Animated Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-5xl mx-auto text-center z-10 space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-400 shadow-md">
          <Layers className="w-3.5 h-3.5" />
          <span>Search Space Visualizer</span>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
            AI 8-Puzzle Solver
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-200 to-blue-400">
              Artificial Intelligence Search Visualizer
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400">
            Understand classical uninformed and informed search algorithms. Manually solve or trigger AI engines to search, evaluate, and animate step-by-step.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/solver"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:brightness-110 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-purple-500/20 hover:scale-103 hover:shadow-purple-500/30 transition-all duration-200"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Start Solving</span>
          </Link>
          <Link
            to="/compare"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 text-slate-300 font-semibold px-8 py-4 rounded-2xl glass-panel border border-white/10 hover:bg-white/10 hover:text-white transition duration-200"
          >
            <BarChart2 className="w-5 h-5" />
            <span>Compare Algorithms</span>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-12">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center text-center space-y-3 glass-panel-hover"
              >
                <div className={`p-3 rounded-xl border ${feature.color} mb-1`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-100">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
