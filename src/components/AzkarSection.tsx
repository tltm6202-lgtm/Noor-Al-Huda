import { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Bed, 
  Sunrise, 
  ShieldCheck,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AZKAR_DATA = {
  morning: [
    { text: "أَصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1 },
    { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِيَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", count: 1 },
    { text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ", count: 100 },
    { text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", count: 1 },
    { text: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3 },
    { text: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3 },
    { text: "رَضِيتُ بِاللهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", count: 3 }
  ],
  evening: [
    { text: "أَمْسَيْنَا وَأَمْسَى المُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1 },
    { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", count: 1 },
    { text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ", count: 100 },
    { text: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3 },
    { text: "بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", count: 3 },
    { text: "رَضِيتُ بِاللهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", count: 3 }
  ],
  sleep: [
    { text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ", count: 1 },
    { text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", count: 3 },
    { text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", count: 1 },
    { text: "سُبْحَانَ اللَّهِ (33) ، الحَمْدُ لِلَّهِ (33) ، اللَّهُ أَكْبَرُ (34)", count: 1 }
  ],
  wakeup: [
    { text: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", count: 1 },
    { text: "لاَ إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ المُلْكُ وَلَهُ الحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالحَمْدُ لِلَّهِ، وَلاَ إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلَّا بِاللَّهِ العَلِيِّ العَظِيمِ", count: 1 }
  ]
};

export default function AzkarSection() {
  const [category, setCategory] = useState<keyof typeof AZKAR_DATA>('morning');
  const [progress, setProgress] = useState<{ [key: string]: number }>({});

  const handleIncrement = (categoryKey: string, index: number, max: number) => {
    const key = `${categoryKey}-${index}`;
    const current = progress[key] || 0;
    if (current < max) {
      setProgress(prev => ({ ...prev, [key]: current + 1 }));
      if (window.navigator.vibrate) window.navigator.vibrate(50);
    }
  };

  const resetCategory = () => {
    const newProgress = { ...progress };
    AZKAR_DATA[category].forEach((_, i) => {
      delete newProgress[`${category}-${i}`];
    });
    setProgress(newProgress);
  };

  const categories = [
    { id: 'morning', label: 'أذكار الصباح', icon: Sunrise, color: 'text-orange-400' },
    { id: 'evening', label: 'أذكار المساء', icon: Moon, color: 'text-indigo-400' },
    { id: 'sleep', label: 'أذكار النوم', icon: Bed, color: 'text-blue-400' },
    { id: 'wakeup', label: 'أذكار الاستيقاظ', icon: Sun, color: 'text-yellow-400' }
  ];

  return (
    <div className="space-y-10 py-6 max-w-5xl mx-auto">
      <div className="bg-emerald-900/60 p-8 rounded-[2.5rem] border border-emerald-800 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
            <ShieldCheck className="text-yellow-500" size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-bold font-reem text-yellow-500 mb-1">حصن المسلم</h2>
            <p className="text-emerald-300/60 text-sm font-medium">الأذكار اليومية المستجابة بإذن الله</p>
          </div>
        </div>
        <div className="flex bg-emerald-950/50 p-1.5 rounded-2xl border border-emerald-800 overflow-x-auto max-w-full">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setCategory(cat.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 font-bold whitespace-nowrap ${category === cat.id ? 'bg-yellow-500 text-emerald-950 shadow-lg' : 'text-emerald-400 hover:text-emerald-200'}`}
            >
              <cat.icon size={18} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
          <button 
            onClick={resetCategory}
            className="flex items-center gap-2 text-emerald-400 hover:text-yellow-500 transition-colors text-sm font-bold bg-emerald-900/40 px-4 py-2 rounded-lg border border-emerald-800"
          >
              <RotateCcw size={16} />
              <span>إعادة عداد الفئة الحالية</span>
          </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="wait">
          {AZKAR_DATA[category].map((zekr, i) => {
            const currentCount = progress[`${category}-${i}`] || 0;
            const isDone = currentCount >= zekr.count;

            return (
              <motion.div
                key={`${category}-${i}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleIncrement(category, i, zekr.count)}
                className={`group relative overflow-hidden p-8 rounded-[2rem] border transition-all duration-500 cursor-pointer select-none ${
                  isDone 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-emerald-900/30 border-emerald-800/50 hover:border-yellow-500/40 hover:bg-emerald-900/40'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1 text-center md:text-right">
                    <p className={`text-2xl md:text-3xl leading-relaxed font-amiri transition-colors ${isDone ? 'text-emerald-300 opacity-60' : 'text-white'}`}>
                      {zekr.text}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                className="text-emerald-950"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="currentColor"
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * currentCount) / zekr.count}
                                className={`transition-all duration-500 ${isDone ? 'text-emerald-500' : 'text-yellow-500'}`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {isDone ? (
                                <CheckCircle2 className="text-emerald-500" size={32} />
                            ) : (
                                <>
                                    <span className="text-3xl font-bold text-white leading-none">{zekr.count - currentCount}</span>
                                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">باقي</span>
                                </>
                            )}
                        </div>
                    </div>
                  </div>
                </div>
                
                {isDone && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 text-emerald-500 opacity-20"
                  >
                    <CheckCircle2 size={120} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
