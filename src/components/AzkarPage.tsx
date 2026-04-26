import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Bed, ShieldCheck, RotateCcw } from 'lucide-react';

interface Zikr {
  id: number;
  text: string;
  count: number;
  currentCount: number;
  benefit: string;
}

interface AzkarCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  azkar: Zikr[];
}

const AzkarPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('morning');
  
  const [categories, setCategories] = useState<AzkarCategory[]>([
    {
      id: 'morning',
      name: 'أذكار الصباح',
      icon: <Sun className="w-6 h-6 text-amber-500" />,
      azkar: [
        { id: 1, text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, currentCount: 0, benefit: "من قالها حين يصبح أعطي خير ما في ذلك اليوم" },
        { id: 2, text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ", count: 1, currentCount: 0, benefit: "سيد الاستغفار: من قالها موقنا بها فمات من يومه دخل الجنة" },
        { id: 3, text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ", count: 100, currentCount: 0, benefit: "حطت خطاياه وإن كانت مثل زبد البحر" },
        { id: 4, text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شأْنِي كُلَّهُ وَلا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", count: 3, currentCount: 0, benefit: "صلاح الشأن كله" }
      ]
    },
    {
      id: 'evening',
      name: 'أذكار المساء',
      icon: <Moon className="w-6 h-6 text-indigo-400" />,
      azkar: [
        { id: 5, text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, currentCount: 0, benefit: "من قالها حين يمسي أعطي خير ما في تلك الليلة" },
        { id: 6, text: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", count: 3, currentCount: 0, benefit: "لم تضره حمة تلك الليلة" },
        { id: 7, text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", count: 1, currentCount: 0, benefit: "ذكر المساء" }
      ]
    },
    {
      id: 'sleep',
      name: 'أذكار النوم',
      icon: <Bed className="w-6 h-6 text-purple-400" />,
      azkar: [
        { id: 8, text: "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا، بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ", count: 1, currentCount: 0, benefit: "حفظ النفس أثناء النوم" },
        { id: 9, text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", count: 3, currentCount: 0, benefit: "الوقاية من عذاب الله" }
      ]
    }
  ]);

  const handleIncrement = (catId: string, zikrId: number) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        azkar: cat.azkar.map(z => {
          if (z.id !== zikrId || z.currentCount >= z.count) return z;
          
          // Haptic feedback if supported
          if ('vibrate' in navigator) {
            navigator.vibrate(50);
          }
          
          return { ...z, currentCount: z.currentCount + 1 };
        })
      };
    }));
  };

  const handleReset = (catId: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        azkar: cat.azkar.map(z => ({ ...z, currentCount: 0 }))
      };
    }));
  };

  const currentCategory = categories.find(c => c.id === activeCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-emerald-900 font-reem mb-4">حصن المسلم</h2>
        <p className="text-emerald-600 font-bold">الأذكار اليومية والأدعية المأثورة</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
              activeCategory === cat.id 
              ? 'bg-emerald-900 text-white shadow-xl scale-105' 
              : 'bg-white text-emerald-800 border-2 border-emerald-50 hover:border-emerald-200'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-emerald-950 font-reem">{currentCategory?.name}</h3>
        <button 
          onClick={() => handleReset(activeCategory)}
          className="flex items-center gap-2 text-emerald-600 hover:text-amber-600 font-bold text-sm transition-colors"
        >
          <RotateCcw size={16} />
          إعادة ضبط العداد
        </button>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {currentCategory?.azkar.map((zikr) => (
            <motion.div
              key={zikr.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => handleIncrement(activeCategory, zikr.id)}
              className={`relative p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer group ${
                zikr.currentCount >= zikr.count 
                ? 'bg-emerald-50 border-emerald-200 opacity-60' 
                : 'bg-white border-emerald-50 hover:border-amber-200 shadow-sm hover:shadow-xl'
              }`}
            >
              <div className="text-2xl leading-relaxed text-emerald-950 font-amiri text-right mb-6">
                {zikr.text}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 font-bold text-xl">
                    {zikr.currentCount}
                  </div>
                  <span className="text-gray-400 font-bold">/ {zikr.count}</span>
                </div>
                
                <div className="flex items-center gap-2 text-emerald-600/60 text-sm font-bold">
                  <ShieldCheck size={16} />
                  {zikr.benefit}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 h-1.5 bg-amber-500 rounded-b-full transition-all duration-300" style={{ width: `${(zikr.currentCount / zikr.count) * 100}%` }}></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AzkarPage;