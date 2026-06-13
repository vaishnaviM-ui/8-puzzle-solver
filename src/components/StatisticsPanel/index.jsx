import React from 'react';
import { Clock, Navigation, GitBranch, Layers, Award, BarChart } from 'lucide-react';

export default function StatisticsPanel({ stats }) {
  if (!stats) return null;

  const statItems = [
    {
      title: 'Time Taken',
      value: `${stats.searchTime.toFixed(2)} ms`,
      icon: Clock,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/25',
    },
    {
      title: 'Solution Moves',
      value: stats.success ? stats.moves.length : 'N/A',
      icon: Navigation,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
    },
    {
      title: 'Nodes Expanded',
      value: stats.exploredCount.toLocaleString(),
      icon: GitBranch,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/25',
      desc: 'Count of states removed from frontier'
    },
    {
      title: 'Nodes Generated',
      value: stats.generatedCount.toLocaleString(),
      icon: BarChart,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
      desc: 'Total unique states discovered'
    },
    {
      title: 'Max Frontier Size',
      value: stats.maxFrontierSize.toLocaleString(),
      icon: Layers,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/25',
      desc: 'Maximum queue size during search'
    },
    {
      title: 'Path Cost',
      value: stats.success ? stats.moves.length : 'N/A',
      icon: Award,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
      desc: 'Sum of step weights (each move costs 1)'
    },
  ];

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Algorithm Banner */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-lg backdrop-blur-md">
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Run Summary</h4>
          <h3 className="text-lg font-bold text-slate-200">{stats.algoName}</h3>
        </div>
        {stats.heuristicName && (
          <div className="self-start sm:self-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
            Heuristic: {stats.heuristicName}
          </div>
        )}
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.title} 
              className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between shadow-lg backdrop-blur-md glass-panel-hover"
              title={item.desc}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-slate-400">{item.title}</span>
                <div className={`p-1.5 rounded-lg border ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
