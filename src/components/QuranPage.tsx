import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Play, Pause, Search, ChevronRight, X } from 'lucide-react';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  audio?: string;
  tafsir?: string;
}

const QuranPage: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTafsir, setActiveTafsir] = useState<{ text: string, number: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const fetchSurahContent = async (number: number) => {
    setLoading(true);
    try {
      const [textRes, audioRes, tafsirRes] = await Promise.all([
        axios.get(`https://api.alquran.cloud/v1/surah/${number}/quran-uthmani`),
        axios.get(`https://api.alquran.cloud/v1/surah/${number}/ar.husary`),
        axios.get(`https://api.alquran.cloud/v1/surah/${number}/ar.jalalayn`)
      ]);

      const combinedAyahs = textRes.data.data.ayahs.map((ayah: any, index: number) => ({
        ...ayah,
        audio: audioRes.data.data.ayahs[index].audio,
        tafsir: tafsirRes.data.data.ayahs[index].text
      }));

      setAyahs(combinedAyahs);
      setSelectedSurah(number);
      setCurrentAudioIndex(0);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error fetching surah content:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAyahClick = (ayah: Ayah) => {
    setActiveTafsir({ text: ayah.tafsir || 'لا يوجد تفسير متاح', number: ayah.numberInSurah });
  };

  const startAudioFromAyah = (index: number) => {
    setCurrentAudioIndex(index);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = ayahs[index].audio || '';
      audioRef.current.play();
    }
  };

  const filteredSurahs = surahs.filter(s => 
    s.name.includes(searchQuery) || 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString() === searchQuery
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {!selectedSurah ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-emerald-900 font-reem mb-2">المصحف الإلكتروني</h2>
              <p className="text-emerald-600 font-bold">تصفح سور القرآن الكريم مع التفسير والاستماع</p>
            </div>
            <div className="relative group">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder="بحث عن سورة (الاسم أو الرقم)..." 
                className="pr-12 pl-6 py-4 bg-white border-2 border-emerald-100 rounded-2xl w-full md:w-80 focus:border-amber-500 focus:outline-none shadow-sm transition-all text-lg font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSurahs.map((surah) => (
              <motion.div
                key={surah.number}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => fetchSurahContent(surah.number)}
                className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm hover:shadow-xl cursor-pointer group transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 font-bold group-hover:bg-amber-500 group-hover:text-white transition-colors">
                    {surah.number}
                  </div>
                  <div className="text-emerald-300 group-hover:text-amber-500 transition-colors">
                    <BookOpen size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-emerald-950 mb-1 font-amiri text-right">{surah.name}</h3>
                <div className="flex justify-between items-center text-gray-500 text-sm font-bold">
                  <span>{surah.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                  <span>{surah.numberOfAyahs} آية</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <div className="sticky top-20 z-40 bg-[#fdfbf7]/90 backdrop-blur-md py-4 mb-8 border-b border-emerald-100 flex items-center justify-between">
            <button 
              onClick={() => setSelectedSurah(null)}
              className="flex items-center text-emerald-700 font-bold hover:text-amber-600 transition-colors"
            >
              <ChevronRight className="ml-2" />
              العودة للفهرس
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-emerald-900 font-amiri">{surahs.find(s => s.number === selectedSurah)?.name}</h2>
              <div className="text-xs text-emerald-500 font-bold mt-1">
                {surahs.find(s => s.number === selectedSurah)?.revelationType === 'Meccan' ? 'مكيّة' : 'مدنيّة'} • {ayahs.length} آيات
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-emerald-600 ml-2 hidden md:inline">تشغيل السورة كاملة:</span>
              <button 
                onClick={toggleAudio}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${isPlaying ? 'bg-amber-500 text-white shadow-lg ring-4 ring-amber-500/20' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
              >
                {isPlaying ? <><Pause size={20} /> إيقاف</> : <><Play size={20} /> استماع</>}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl border border-emerald-50 mb-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20"></div>
              
              {selectedSurah !== 1 && selectedSurah !== 9 && (
                <div className="text-center mb-16 select-none">
                  <div className="inline-block relative">
                    <div className="text-5xl md:text-6xl font-amiri text-emerald-900 font-bold mb-4 drop-shadow-sm">
                      بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-[2px] w-20 bg-gradient-to-r from-transparent to-amber-500"></div>
                      <div className="w-3 h-3 rotate-45 border-2 border-amber-500"></div>
                      <div className="h-[2px] w-20 bg-gradient-to-l from-transparent to-amber-500"></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="leading-[5.5rem] text-right space-y-8" dir="rtl">
                {ayahs.map((ayah, index) => {
                  let displayContent = ayah.text;
                  if (index === 0 && selectedSurah !== 1 && displayContent.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ')) {
                    displayContent = displayContent.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
                  }

                  const showPageMarker = index > 0 && ayahs[index-1].page !== ayah.page;
                  const showQuarterMarker = index > 0 && ayahs[index-1].hizbQuarter !== ayah.hizbQuarter;

                  return (
                    <React.Fragment key={ayah.number}>
                      {showPageMarker && (
                        <div className="w-full flex items-center gap-4 my-16">
                          <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
                          <div className="bg-emerald-100 px-6 py-2 rounded-full text-sm font-bold text-emerald-800 shadow-sm border border-emerald-200">
                            بداية الصفحة {ayah.page}
                          </div>
                          <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-emerald-200 to-transparent"></div>
                        </div>
                      )}
                      {showQuarterMarker && (
                        <div className="w-full flex items-center gap-4 my-12">
                          <div className="flex-1 h-[2px] border-t-2 border-dashed border-amber-200"></div>
                          <div className="bg-amber-100 px-6 py-2 rounded-full text-xs font-bold text-amber-800 shadow-sm border border-amber-200">
                            الربع • حزب {Math.ceil(ayah.hizbQuarter / 4)}
                          </div>
                          <div className="flex-1 h-[2px] border-t-2 border-dashed border-amber-200"></div>
                        </div>
                      )}
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`inline-block font-amiri text-4xl md:text-5xl text-emerald-950 rounded-2xl px-3 py-2 transition-all relative group ${currentAudioIndex === index && isPlaying ? 'bg-amber-100/50 ring-2 ring-amber-400 shadow-lg' : 'hover:bg-emerald-50'}`}
                      >
                        <span 
                          onClick={() => handleAyahClick(ayah)}
                          className="cursor-pointer transition-colors hover:text-emerald-700"
                        >
                          {displayContent}
                        </span>
                        <span 
                          onClick={() => startAudioFromAyah(index)}
                          className="inline-flex items-center justify-center w-12 h-12 mx-3 border-2 border-amber-600 rounded-full text-xl font-bold text-amber-800 bg-amber-50 cursor-pointer hover:bg-amber-600 hover:text-white transition-all shadow-md active:scale-95"
                        >
                          {ayah.numberInSurah}
                        </span>
                        
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-900 text-white text-[12px] py-2 px-4 rounded-xl whitespace-nowrap z-10 flex flex-col items-center shadow-xl pointer-events-none">
                          <span className="font-bold">تفسير • استماع</span>
                        </div>
                      </motion.span>
                    </React.Fragment>
                  );
                })}
              </div>
              
              {ayahs.length > 0 && (
                <audio 
                  ref={audioRef}
                  src={ayahs[currentAudioIndex].audio}
                  onEnded={() => {
                    if (currentAudioIndex < ayahs.length - 1) {
                      setCurrentAudioIndex(prev => prev + 1);
                      setTimeout(() => audioRef.current?.play(), 100);
                    } else {
                      setIsPlaying(false);
                      setCurrentAudioIndex(0);
                    }
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              )}
            </div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {activeTafsir && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setActiveTafsir(null)}
              className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 border border-emerald-100"
            >
              <div className="bg-emerald-900 text-white p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-emerald-950 font-bold ml-4">
                    {activeTafsir.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-reem">التفسير الميسر</h3>
                    <p className="text-emerald-300 text-xs font-bold">تفسير الجلالين</p>
                  </div>
                </div>
                <button onClick={() => setActiveTafsir(null)} className="p-2 hover:bg-emerald-800 rounded-lg transition-colors">
                  <X />
                </button>
              </div>
              <div className="p-8 md:p-12 overflow-y-auto max-h-[60vh]">
                <div className="text-2xl leading-relaxed text-emerald-950 font-amiri font-medium">
                  {activeTafsir.text}
                </div>
              </div>
              <div className="p-6 bg-emerald-50 border-t border-emerald-100 text-center">
                <button 
                  onClick={() => setActiveTafsir(null)}
                  className="bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuranPage;