import React from 'react';

export default function Loader({ message = 'Computing optimal path...' }) {
  return (
    <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
      <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 border border-white/10 shadow-2xl max-w-sm w-full mx-4">
        {/* Glow Effects */}
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse-slow"></div>

        {/* Dynamic Spinning Rings */}
        <div className="relative w-20 h-20 mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/10"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-pink-500 animate-spin" style={{ animationDuration: '2.5s' }}></div>
        </div>

        <h3 className="text-lg font-semibold text-slate-100 mb-2 tracking-wide">AI Engine Working</h3>
        <p className="text-sm text-slate-400 text-center animate-pulse">{message}</p>
      </div>
    </div>
  );
}
