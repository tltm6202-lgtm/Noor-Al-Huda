import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, RefreshCcw, Trophy, Award } from 'lucide-react';

const TasbihSection: React.FC = () => {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [goal, setGoal] = useState(33);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const savedTotal = localStorage.getItem('total_tasbih');
    if (savedTotal) setTotal(parseInt(savedTotal));
  }, []);

  const handleIncrement = () => {
    const newCount = count + 1;
    const newTotal = total + 1;
    setCount(newCount);
    setTotal(newTotal);
    localStorage.setItem('total_tasbih', newTotal.toString());

    if (navigator.vibrate) {
      if (newCount === goal) navigator.vibrate([100, 50, 100]);
      else navigator.vibrate(50);
    }

    if (newCount === goal) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
      setCount(0);
    }
  };

  const reset = () => {
    setCount(0);
    if (window.confirm('هل تريد تصغير العداد الكلي أيضاً؟')) {
      setTotal(0);
      localStorage.setItem('total_tasbih', '0');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold kufi-font text-yellow-400">السبحة الإلكترونية الذكية</h2>
        <p className="text-emerald-100/60">"ألا بذكر الله تطمئن القلوب"</p>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Progress Circle Background */}
        <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border-8 border-emerald-900/50 flex items-center justify-center shadow-inner cursor-pointer" onClick={handleIncrement}>
          <div className="absolute inset-0 rounded-full border-8 border-yellow-500 border-t-transparent animate-spin-slow opacity-20"></div>
          
          {/* Main Counter */}
          <motion.div 
            key={count}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-2 z-10"
          >
            <div className="text-9xl font-black text-white tabular-nums drop-shadow-xl">{count}</div>
            <div className="text-yellow-500 font-bold text-xl uppercase tracking-widest">تسبيحة</div>
          </motion.div>

          {/* Goal Ring Progress */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="transparent"
              stroke="#eab308"
              strokeWidth="8"
              strokeDasharray={`${(count / goal) * 300}% 300%`}
              className="transition-all duration-300"
            />
          </svg>
        </div>

        <div className="absolute -bottom-10 flex gap-6">
           <button 
             onClick={reset}
             className="w-16 h-16 bg-emerald-900/60 rounded-full flex items-center justify-center text-emerald-400 hover:text-red-400 border border-emerald-500/20 shadow-xl transition-all"
           >
             <RefreshCcw className="w-8 h-8" />
           </button>
           <div className="bg-yellow-500 text-emerald-950 px-10 py-5 rounded-[2rem] font-bold text-2xl shadow-2xl flex flex-col items-center">
             <span className="text-xs opacity-70 uppercase tracking-tighter">الهدف</span>
             <select 
               value={goal} 
               onChange={(e) => setGoal(parseInt(e.target.value))}
               className="bg-transparent border-none focus:outline-none cursor-pointer"
             >
               <option value={33}>33</option>
               <option value={100}>100</option>
               <option value={1000}>1000</option>
             </select>
           </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-6">
        <div className="bg-emerald-900/40 p-8 rounded-3xl border border-emerald-500/10 flex items-center gap-6">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
            <Trophy className="w-10 h-10" />
          </div>
          <div>
            <p className="text-emerald-300/60 text-sm">إجمالي الذكر</p>
            <h4 className="text-3xl font-black text-white">{total}</h4>
          </div>
        </div>
        <div className="bg-emerald-900/40 p-8 rounded-3xl border border-emerald-500/10 flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
            <Award className="w-10 h-10" />
          </div>
          <div>
            <p className="text-emerald-300/60 text-sm">المستوى</p>
            <h4 className="text-3xl font-black text-white">{Math.floor(total/100) + 1}</h4>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-[100]"
          >
            <div className="bg-yellow-500 text-emerald-950 p-12 rounded-full shadow-[0_0_100px_rgba(234,179,8,0.5)] flex flex-col items-center gap-4">
              <Star className="w-20 h-20 animate-bounce" />
              <h2 className="text-4xl font-bold kufi-font">تم الإتمام!</h2>
              <p className="font-bold">تقبل الله منك</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TasbihSection;
