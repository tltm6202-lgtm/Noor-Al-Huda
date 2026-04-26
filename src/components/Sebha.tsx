import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Target, Fingerprint } from 'lucide-react';

export default function Sebha() {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [target, setTarget] = useState(33);

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    setTotal(prev => prev + 1);
    
    // Simulate haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="max-w-md mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold font-reem text-yellow-500">السبحة الإلكترونية</h2>
        <p className="text-emerald-300/60">اذكر الله يذكرك</p>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Outer Ring */}
        <div className="w-80 h-80 rounded-full bg-emerald-900/20 border-8 border-emerald-900 flex items-center justify-center relative shadow-2xl">
          {/* Inner Counter */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleIncrement}
            className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-800 to-emerald-950 border-4 border-yellow-500/30 flex flex-col items-center justify-center gap-2 shadow-inner group transition-all relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Fingerprint size={48} className="text-yellow-500/20 mb-2" />
            <span className="text-7xl font-bold font-mono text-yellow-500">{count}</span>
            <span className="text-sm font-bold text-yellow-500/40 uppercase tracking-widest">اضغط للتسبيح</span>
          </motion.button>

          {/* Target Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle
              cx="160"
              cy="160"
              r="156"
              fill="transparent"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 156}
              strokeDashoffset={2 * Math.PI * 156 * (1 - (count % target) / target)}
              className="transition-all duration-300"
            />
          </svg>
        </div>

        {/* Controls */}
        <div className="flex gap-6 mt-12 w-full">
           <button 
             onClick={reset}
             className="flex-1 bg-emerald-900/50 border border-emerald-800 p-4 rounded-2xl flex items-center justify-center gap-3 text-emerald-300 hover:text-yellow-500 hover:border-yellow-500/30 transition-all"
           >
             <RotateCcw size={20} />
             <span>تصفير</span>
           </button>
           <div className="flex-1 bg-emerald-900/50 border border-emerald-800 p-4 rounded-2xl flex items-center justify-center gap-3 text-yellow-500">
             <Target size={20} />
             <select 
               value={target}
               onChange={(e) => setTarget(parseInt(e.target.value))}
               className="bg-transparent font-bold focus:outline-none cursor-pointer"
             >
               <option value="33" className="bg-emerald-900">33</option>
               <option value="99" className="bg-emerald-900">99</option>
               <option value="100" className="bg-emerald-900">100</option>
               <option value="1000" className="bg-emerald-900">1000</option>
             </select>
           </div>
        </div>
      </div>

      <div className="bg-emerald-900/40 p-6 rounded-3xl border border-emerald-800 flex justify-between items-center">
        <span className="text-emerald-400">إجمالي التسبيحات:</span>
        <span className="text-2xl font-bold font-mono text-white">{total}</span>
      </div>
    </div>
  );
}
