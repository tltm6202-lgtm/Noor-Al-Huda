import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Plus, Minus, Settings, List, Trophy } from 'lucide-react';

const TasbihPage: React.FC = () => {
  const [count, setCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [target, setTarget] = useState(33);
  const [sessionTarget] = useState(100);
  const [zikrText, setZikrText] = useState('سُبْحَانَ اللهِ');

  useEffect(() => {
    const savedTotal = localStorage.getItem('tasbih-total');
    if (savedTotal) setTotal(parseInt(savedTotal));
  }, []);

  const increment = () => {
    setCount(prev => {
      const next = prev + 1;
      if (next % target === 0) {
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
      } else {
        if ('vibrate' in navigator) navigator.vibrate(50);
      }
      return next;
    });
    setTotal(prev => {
      const next = prev + 1;
      localStorage.setItem('tasbih-total', next.toString());
      return next;
    });
  };

  const reset = () => {
    setCount(0);
  };

  const tasbihs = [
    'سُبْحَانَ اللهِ',
    'الْحَمْدُ لِلَّهِ',
    'لاَ إِلَهَ إِلاَّ اللهُ',
    'اللهُ أَكْبَرُ',
    'لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللهِ',
    'أَسْتَغْفِرُ اللهَ',
    'صَلَّى اللهُ عَلَى مُحَمَّدٍ'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-emerald-900 font-reem mb-4">السبحة الإلكترونية</h2>
        <p className="text-emerald-600 font-bold">اذكر الله يذكرك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm text-center">
          <div className="text-gray-400 text-sm font-bold mb-2">إجمالي التسبيحات</div>
          <div className="text-3xl font-bold text-emerald-900 font-mono">{total}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm text-center">
          <div className="text-gray-400 text-sm font-bold mb-2">الهدف الحالي</div>
          <div className="text-3xl font-bold text-amber-600 font-mono">{target}</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm text-center">
          <div className="text-gray-400 text-sm font-bold mb-2">الإنجاز</div>
          <div className="text-3xl font-bold text-blue-600 font-mono">{Math.floor((count / sessionTarget) * 100)}%</div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Main Tasbih Circle */}
        <div className="relative mb-12">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: count % target === 0 && count !== 0 ? 3 : 0 }}
            onClick={increment}
            className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-emerald-900 shadow-[0_20px_60px_rgba(6,78,59,0.3)] flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group select-none"
          >
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="text-emerald-400 text-lg font-bold mb-4 z-10">{zikrText}</div>
            <div className="text-8xl md:text-9xl font-bold text-white font-mono z-10 drop-shadow-xl">{count}</div>
            <div className="text-emerald-300/60 font-bold mt-4 animate-pulse z-10">اضغط للتسبيح</div>
            
            {/* Visual Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeOpacity="0.05"
              />
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="8"
                strokeDasharray={`${(count % target) * (2 * Math.PI * 48 / target)} 1000`}
                className="transition-all duration-300"
              />
            </svg>
          </motion.div>

          {/* Reset Button */}
          <button 
            onClick={reset}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-emerald-900 p-4 rounded-full shadow-lg border border-emerald-50 hover:bg-emerald-50 transition-colors"
          >
            <RotateCcw size={24} />
          </button>
        </div>

        {/* Zikr Selector */}
        <div className="w-full">
          <h4 className="text-xl font-bold text-emerald-900 mb-6 font-reem flex items-center gap-2">
            <List size={20} className="text-amber-500" />
            اختر الذكر
          </h4>
          <div className="flex flex-wrap gap-3 justify-center">
            {tasbihs.map((t) => (
              <button
                key={t}
                onClick={() => {setZikrText(t); reset();}}
                className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                  zikrText === t 
                  ? 'bg-amber-500 text-emerald-950 shadow-md' 
                  : 'bg-white text-emerald-800 border-2 border-emerald-50 hover:border-emerald-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2rem] border border-emerald-50">
            <h4 className="font-bold text-emerald-900 mb-6 flex items-center gap-2">
              <Settings size={18} className="text-amber-500" />
              تخصيص العداد
            </h4>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-500 mb-3 font-bold">هدف الدورة الواحدة (الاهتزاز)</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setTarget(Math.max(1, target - 1))} className="p-2 bg-emerald-50 rounded-lg"><Minus size={16} /></button>
                  <input 
                    type="number" 
                    value={target} 
                    onChange={(e) => setTarget(parseInt(e.target.value) || 1)}
                    className="w-full text-center py-2 bg-emerald-50 rounded-xl font-bold focus:outline-none"
                  />
                  <button onClick={() => setTarget(target + 1)} className="p-2 bg-emerald-50 rounded-lg"><Plus size={16} /></button>
                </div>
              </div>
              <div className="flex gap-2">
                {[33, 100, 1000].map(val => (
                  <button 
                    key={val} 
                    onClick={() => setTarget(val)}
                    className="flex-1 py-2 bg-gray-50 rounded-lg text-sm font-bold hover:bg-gray-100"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-emerald-900 p-8 rounded-[2rem] text-white">
            <h4 className="font-bold mb-6 flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" />
              إنجازات اليوم
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-emerald-300 text-sm">
                <span>التقدم اليومي</span>
                <span>{count} / {sessionTarget}</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${Math.min(100, (count / sessionTarget) * 100)}%` }}></div>
              </div>
              <p className="text-xs text-emerald-400 font-bold leading-relaxed">
                "أحب الأعمال إلى الله أدومها وإن قل" - استمر في ذكر الله لتصل إلى هدفك اليومي.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasbihPage;