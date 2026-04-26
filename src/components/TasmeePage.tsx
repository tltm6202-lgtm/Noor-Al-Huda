import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RefreshCw, CheckCircle2, AlertCircle, BookOpen, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface Surah {
  number: number;
  name: string;
  englishName: string;
}

interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
}

const normalizeText = (text: string) => {
  return text
    .replace(/[\u064B-\u0652]/g, "") // Remove harakat
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();
};

const TasmeePage: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [, setLoading] = useState(false);
  const [targetText, setTargetText] = useState<string[]>([]);
  const [, setOriginalVerses] = useState<Verse[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [recognizedWords, setRecognizedWords] = useState<string[]>([]);
  const [errorWord, setErrorWord] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [mode, setMode] = useState<'surah' | 'page'>('surah');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      const response = await axios.get('https://api.alquran.cloud/v1/surah');
      setSurahs(response.data.data);
    } catch (error) {
      console.error('Error fetching surahs:', error);
    }
  };

  const loadContent = async () => {
    setLoading(true);
    setRecognizedWords([]);
    setErrorWord(null);
    setCurrentWordIndex(0);
    try {
      let url = '';
      if (mode === 'surah') {
        url = `https://api.alquran.cloud/v1/surah/${selectedSurah}/quran-uthmani`;
      } else {
        url = `https://api.alquran.cloud/v1/page/${selectedPage}/quran-uthmani`;
      }
      const response = await axios.get(url);
      const data = response.data.data;
      const verses = mode === 'surah' ? data.verses : data.ayahs;
      setOriginalVerses(verses);
      
      const allText = verses.map((v: Verse) => v.text).join(' ');
      const words = allText.split(/\s+/).filter((w: string) => w.length > 0);
      setTargetText(words);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, [selectedSurah, selectedPage, mode]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('متصفحك لا يدعم خاصية التعرف على الصوت. يرجى استخدام متصفح حديث مثل Chrome.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'ar-SA';
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onend = () => setIsListening(false);

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      const heardWords = transcript.trim().split(/\s+/);
      
      processHeardWords(heardWords);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const processHeardWords = (heardWords: string[]) => {
    let newIndex = currentWordIndex;
    let newRecognized = [...recognizedWords];
    for (const word of heardWords) {
      if (newIndex >= targetText.length) break;

      const normalizedHeard = normalizeText(word);
      const normalizedTarget = normalizeText(targetText[newIndex]);

      if (normalizedHeard === normalizedTarget) {
        newRecognized.push(targetText[newIndex]);
        newIndex++;
        setErrorWord(null);
      } else {
        // Only set error if it's not a small mismatch (to be more forgiving)
        if (normalizedHeard.length > 1) {
            setErrorWord(word);
        }
      }
    }

    setRecognizedWords(newRecognized);
    setCurrentWordIndex(newIndex);
  };

  const reset = () => {
    setRecognizedWords([]);
    setErrorWord(null);
    setCurrentWordIndex(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-emerald-900 font-reem mb-4">التسميع التفاعلي</h2>
        <p className="text-emerald-700 text-lg">اختبر حفظك من خلال التسميع المباشر للمنصة</p>
        <div className="w-24 h-1.5 bg-amber-500 mx-auto rounded-full mt-4"></div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-emerald-50 mb-8">
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex bg-emerald-50 p-1 rounded-xl">
            <button 
              onClick={() => setMode('surah')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${mode === 'surah' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-700'}`}
            >
              بالسورة
            </button>
            <button 
              onClick={() => setMode('page')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${mode === 'page' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-700'}`}
            >
              بالصفحة
            </button>
          </div>

          {mode === 'surah' ? (
            <select 
              value={selectedSurah}
              onChange={(e) => setSelectedSurah(Number(e.target.value))}
              className="flex-1 bg-emerald-50 border-none rounded-xl px-4 py-2 font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500"
            >
              {surahs.map(s => (
                <option key={s.number} value={s.number}>{s.number}. {s.name}</option>
              ))}
            </select>
          ) : (
            <input 
              type="number" 
              min="1" 
              max="604"
              value={selectedPage}
              onChange={(e) => setSelectedPage(Number(e.target.value))}
              className="flex-1 bg-emerald-50 border-none rounded-xl px-4 py-2 font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-500"
              placeholder="رقم الصفحة (1-604)"
            />
          )}
        </div>

        <div className="flex justify-center gap-6 mb-12">
          {!isListening ? (
            <button 
              onClick={startListening}
              className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
            >
              <Mic size={24} />
              ابدأ التسميع
            </button>
          ) : (
            <button 
              onClick={stopListening}
              className="flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 animate-pulse"
            >
              <MicOff size={24} />
              إيقاف الميكروفون
            </button>
          )}
          
          <button 
            onClick={reset}
            className="flex items-center gap-3 bg-amber-100 text-amber-800 hover:bg-amber-200 px-8 py-4 rounded-2xl font-bold transition-all"
          >
            <RefreshCw size={24} />
            إعادة البدء
          </button>
        </div>

        {/* Display Area */}
        <div className="min-h-[300px] bg-slate-50 rounded-2xl p-8 relative overflow-hidden border-2 border-dashed border-emerald-100">
          <div className="absolute top-4 left-4 flex gap-2">
            <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-slate-300'}`}></div>
            <span className="text-xs font-bold text-slate-400">{isListening ? 'جاري الاستماع...' : 'الميكروفون متوقف'}</span>
          </div>

          <div className="prose prose-xl max-w-none text-right leading-relaxed font-amiri">
            {recognizedWords.map((word, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block ml-2 text-emerald-800 text-3xl"
              >
                {word}
              </motion.span>
            ))}
            
            <AnimatePresence>
              {errorWord && (
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="inline-block ml-2 text-red-500 text-3xl border-b-2 border-red-500 bg-red-50 px-1"
                >
                  {errorWord}
                </motion.span>
              )}
            </AnimatePresence>

            {!isListening && recognizedWords.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                <BookOpen size={64} className="mb-4 opacity-20" />
                <p className="text-xl">اختر السورة ثم اضغط على زر "ابدأ التسميع" وابدأ في القراءة بصوت واضح</p>
              </div>
            )}
          </div>

          {errorWord && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute bottom-4 right-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-sm"
            >
              <AlertCircle size={18} />
              <span>خطأ في الكلمة الأخيرة! حاول مرة أخرى</span>
            </motion.div>
          )}

          {currentWordIndex > 0 && currentWordIndex === targetText.length && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-emerald-900/10 backdrop-blur-[2px] flex items-center justify-center z-10"
            >
              <div className="bg-white p-8 rounded-3xl shadow-2xl text-center border-4 border-emerald-500 max-w-sm">
                <CheckCircle2 size={80} className="text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">أحسنت بارك الله فيك!</h3>
                <p className="text-emerald-700 mb-6">لقد أتممت التسميع بنجاح وبدون أخطاء.</p>
                <button 
                  onClick={reset}
                  className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
                >
                  تسميع آخر
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xl">
              {Math.round((recognizedWords.length / (targetText.length || 1)) * 100)}%
            </div>
            <div>
              <div className="text-blue-900 font-bold">نسبة التقدم</div>
              <div className="text-blue-700 text-sm">تم تسميع {recognizedWords.length} من {targetText.length} كلمة</div>
            </div>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center">
              <Search size={24} />
            </div>
            <div>
              <div className="text-amber-900 font-bold">تنبيه ذكي</div>
              <div className="text-amber-700 text-sm">توقف عند الخطأ تلقائياً لمساعدتك على التصحيح</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasmeePage;
