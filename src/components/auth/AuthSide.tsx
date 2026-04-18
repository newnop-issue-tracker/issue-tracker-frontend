import { useState, useRef } from 'react';

const AuthSide = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-full bg-slate-950 relative flex items-center justify-center overflow-hidden"
    >
      {/* Static Glow underneath to ensure it looks good even without mouse movement */}
      <div className="absolute inset-0 bg-brand-navy/20 pointer-events-none" />

      {/* Sharp SVG Square Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none [mask-image:linear-gradient(to_bottom,white,transparent)]">
        <svg className="absolute inset-0 h-full w-full stroke-white/[0.05]" aria-hidden="true">
          <defs>
            <pattern id="square-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M.5 32V.5H32" fill="none" strokeDasharray="0" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#square-grid)" />
        </svg>
      </div>

      {/* Interactive Mouse Flashlight Effect overlaid on grid */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300 mix-blend-screen"
        style={{
          background: `radial-gradient(
            600px circle at ${mousePosition.x}px ${mousePosition.y}px,
            rgba(255, 255, 255, 0.08),
            transparent 40%
          )`
        }}
      />

      <div className="relative z-10 max-w-[380px] w-full px-4 font-Inter">
        {/* Card 1 */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-2xl transform -rotate-1 mb-5 hover:-translate-y-2 hover:rotate-0 hover:bg-slate-800/80 transition-all duration-300 cursor-default">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></div>
            </div>
            <span className="font-mono text-xs text-slate-400">IF-428</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 uppercase tracking-wider">Urgent</span>
          </div>
          <div className="font-semibold text-base text-white mb-2 leading-tight">
            Websocket reconnect loop saturates CPU
          </div>
          <div className="text-xs text-slate-400">
            Opened by Priya · updated 18m ago
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-2xl transform rotate-[1.5deg] hover:-translate-y-2 hover:rotate-0 hover:bg-slate-800/80 transition-all duration-300 cursor-default">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            </div>
            <span className="font-mono text-xs text-slate-400">IF-418</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">Low</span>
          </div>
          <div className="font-semibold text-base text-white mb-2 leading-tight">
            Verification link expires too fast
          </div>
          <div className="text-xs text-slate-400">
            Shipped in 2.14
          </div>
        </div>

        <div className="mt-10 text-[14px] text-slate-500 text-center font-Mainfront tracking-wide">
          Ship fewer bugs, faster.
        </div>
      </div>
    </div>
  );
};

export default AuthSide;
