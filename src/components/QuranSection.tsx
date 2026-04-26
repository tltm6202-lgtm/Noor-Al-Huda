import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Pause, 
  ChevronRight,
  BookOpen,
  Info,
  Users,
  X,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RECITERS = [
  { id: 'ar.minshawi', name: 'المنشاوي' },
  { id: 'ar.alafasy', name: 'مشاري راشد' }
];

export default function QuranSection() {
  const [surahs, setSurahs] = useState<any[]>([]);
  const [contentData, setContentData] = useState<{ ayahs: any[], name?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [audioMode, setAudioMode] = useState<'ayah' | 'surah' | 'page'>('page');
  const [selectedReciter, setSelectedReciter] = useState(RECITERS[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahPlaying, setCurrentAyahPlaying] = useState<number | null>(null);
  const [tafsir, setTafsir] = useState<{ [key: number]: string }>({});
  const [activeTafsirAyah, setActiveTafsirAyah] = useState<number | null>(null);
  const [viewType, setViewMode] = useState<'page' | 'surah'>('page');
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistRef = useRef<number[]>([]);
  const currentIdxRef = useRef(0);

  useEffect(() => {
    axios.get('https://api.alquran.cloud/v1/surah').then(res => setSurahs(res.data.data));
  }, []);

  const fetchSurahContent = async (number: number) => {
    setLoading(true);
    setSelectedSurah(number);
    setViewMode('surah');
    try {
      const res = await axios.get(`https://api.alquran.cloud/v1/surah/${number}/quran-uthmani`);
      setContentData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageContent = async (pageNum: number) => {
    if (pageNum < 1 || pageNum > 604) return;
    setLoading(true);
    setSelectedPage(pageNum);
    setViewMode('page');
    try {
      const res = await axios.get(`https://api.alquran.cloud/v1/page/${pageNum}/quran-uthmani`);
      setContentData({ ayahs: res.data.data.ayahs, name: `الصفحة ${pageNum}` });
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const fetchTafsir = async (ayahNumber: number) => {
    if (activeTafsirAyah === ayahNumber) {
        setActiveTafsirAyah(null);
        return;
    }
    setActiveTafsirAyah(ayahNumber);
    if (tafsir[ayahNumber]) return;
    try {
      const res = await axios.get(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/ar.jalalayn`);
      setTafsir(prev => ({ ...prev, [ayahNumber]: res.data.data.text }));
    } catch (e) { console.error(e); }
  };

  const playPlaylist = () => {
    if (currentIdxRef.current >= playlistRef.current.length) {
      setIsPlaying(false);
      setCurrentAyahPlaying(null);
      return;
    }

    const ayahNumber = playlistRef.current[currentIdxRef.current];
    const url = `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${ayahNumber}.mp3`;
    
    if (!audioRef.current) audioRef.current = new Audio(url);
    else audioRef.current.src = url;

    audioRef.current.play().catch(e => {
        console.error("Audio Play Error:", e);
        audioRef.current!.src = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`;
        audioRef.current!.play();
    });
    
    setIsPlaying(true);
    setCurrentAyahPlaying(ayahNumber);

    audioRef.current.onended = () => {
      currentIdxRef.current++;
      playPlaylist();
    };
  };

  const startAudio = (startAyah: number) => {
    if (isPlaying && currentAyahPlaying === startAyah) {
        audioRef.current?.pause();
        setIsPlaying(false);
        return;
    }

    if (!contentData) return;

    let playlist: number[] = [];
    if (audioMode === 'ayah') {
      playlist = [startAyah];
    } else {
      playlist = contentData.ayahs.map((a: any) => a.number);
    }

    playlistRef.current = playlist;
    currentIdxRef.current = playlist.indexOf(startAyah);
    if (currentIdxRef.current === -1) currentIdxRef.current = 0;
    
    playPlaylist();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 pb-20">
      <div className="bg-emerald-900/60 p-6 rounded-3xl border border-emerald-800 backdrop-blur-sm shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
            <BookOpen className="text-yellow-500" size={32} />
            <h2 className="text-3xl font-bold font-reem text-yellow-500">القرآن الكريم</h2>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-emerald-950/50 p-1 rounded-xl border border-emerald-800 px-3">
                <Users size={16} className="text-yellow-500" />
                <select 
                    value={selectedReciter} 
                    onChange={(e) => setSelectedReciter(e.target.value)}
                    className="bg-transparent border-none text-sm font-bold text-emerald-50 outline-none cursor-pointer"
                >
                    {RECITERS.map(r => <option key={r.id} value={r.id} className="bg-emerald-900">{r.name}</option>)}
                </select>
            </div>
            <div className="flex gap-2">
                {(['ayah', 'surah'] as const).map((mode) => (
                    <button
                    key={mode}
                    onClick={() => setAudioMode(mode === 'surah' ? (viewType === 'surah' ? 'surah' : 'page') : 'ayah')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        (audioMode === mode || (audioMode === 'page' && mode === 'surah'))
                        ? 'bg-yellow-500 text-emerald-900 border-yellow-400' 
                        : 'bg-emerald-800/50 text-emerald-200 border-emerald-700 hover:border-yellow-500/50'
                    }`}
                    >
                    {mode === 'ayah' ? 'آية' : viewType === 'surah' ? 'سورة' : 'صفحة'}
                    </button>
                ))}
            </div>
            <div className="flex bg-emerald-950/50 p-1 rounded-xl border border-emerald-800">
                <button onClick={() => setViewMode('surah')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${viewType === 'surah' ? 'bg-yellow-500 text-emerald-950 shadow-md' : 'text-emerald-400'}`}>السور</button>
                <button onClick={() => setViewMode('page')} className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${viewType === 'page' ? 'bg-yellow-500 text-emerald-950 shadow-md' : 'text-emerald-400'}`}>الصفحات</button>
            </div>
        </div>
      </div>

      {!contentData ? (
        viewType === 'surah' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-in fade-in duration-500">
                {surahs.map((surah) => (
                    <motion.button
                        whileHover={{ scale: 1.03, y: -5 }}
                        key={surah.number}
                        onClick={() => fetchSurahContent(surah.number)}
                        className="p-5 rounded-2xl bg-emerald-900/40 border border-emerald-800 hover:border-yellow-500/50 transition-all text-right group relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-xs text-yellow-400 group-hover:bg-yellow-500 group-hover:text-emerald-950 transition-colors font-bold border border-emerald-700">{surah.number}</span>
                            <span className="text-xl font-bold font-amiri leading-none text-white group-hover:text-yellow-400">{surah.name}</span>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">{surah.englishName}</div>
                    </motion.button>
                ))}
            </div>
        ) : (
            <div className="bg-emerald-900/40 p-12 rounded-[3rem] border border-emerald-800 text-center max-w-2xl mx-auto shadow-2xl backdrop-blur-md">
                <h3 className="text-3xl font-bold text-yellow-500 mb-8 font-reem">انتقل إلى الصفحة</h3>
                <div className="flex gap-4 items-center">
                    <button onClick={() => setSelectedPage(p => Math.max(1, p-1))} className="p-4 bg-emerald-800 rounded-2xl text-yellow-500 hover:bg-emerald-700 transition-all"><ChevronRight size={32}/></button>
                    <input 
                        type="number" 
                        min="1" max="604" 
                        value={selectedPage} 
                        onChange={(e) => setSelectedPage(parseInt(e.target.value))}
                        className="flex-1 bg-emerald-950 border-2 border-emerald-800 rounded-3xl py-6 px-10 text-5xl text-white text-center font-bold outline-none focus:ring-4 ring-yellow-500/20 transition-all"
                    />
                    <button onClick={() => setSelectedPage(p => Math.min(604, p+1))} className="p-4 bg-emerald-800 rounded-2xl text-yellow-500 hover:bg-emerald-700 transition-all"><ChevronLeft size={32}/></button>
                </div>
                <button onClick={() => fetchPageContent(selectedPage)} className="mt-10 w-full bg-yellow-500 text-emerald-950 font-black py-5 rounded-[2rem] text-2xl shadow-xl hover:bg-yellow-400 transform active:scale-95 transition-all">بدء القراءة</button>
            </div>
        )
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
          <div className="flex justify-between items-center gap-4">
             <button 
                onClick={() => { setContentData(null); setIsPlaying(false); audioRef.current?.pause(); }}
                className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors group bg-emerald-900/40 px-6 py-3 rounded-2xl border border-emerald-800 shadow-lg"
            >
                <ChevronRight size={24} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-lg">العودة للفهرس</span>
             </button>
            {viewType === 'page' && (
                <div className="flex items-center gap-4 bg-emerald-950/60 p-2 rounded-2xl border border-emerald-800">
                    <button disabled={selectedPage === 1} onClick={() => fetchPageContent(selectedPage - 1)} className="p-2 bg-emerald-800 rounded-lg text-yellow-500 disabled:opacity-20 transition-all active:scale-90"><ChevronRight/></button>
                    <span className="font-bold text-white px-4 border-x border-emerald-800">صفحة {selectedPage}</span>
                    <button disabled={selectedPage === 604} onClick={() => fetchPageContent(selectedPage + 1)} className="p-2 bg-emerald-800 rounded-lg text-yellow-500 disabled:opacity-20 transition-all active:scale-90"><ChevronLeft/></button>
                </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-40">
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-yellow-500"></div>
            </div>
          ) : (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[4rem] p-10 md:p-20 border-t-[18px] border-emerald-900 relative shadow-2xl"
            >
              <div className="text-center mb-16 relative">
                <h3 className="text-5xl font-bold font-amiri text-emerald-950 mb-8">{contentData.name || `الصفحة ${selectedPage}`}</h3>
                <div className="h-px w-32 bg-emerald-900/10 mx-auto rounded-full"></div>
              </div>

              {/* Standard Bismillah Header for all surahs except Tawbah */}
              {((viewType === 'surah' && selectedSurah !== 9) || (viewType === 'page' && contentData.ayahs.some((a:any) => a.numberInSurah === 1 && a.surah.number !== 9))) && (
                <div className="text-center mb-16 select-none">
                  <div className="inline-block relative px-16 py-8 rounded-[2.5rem] bg-emerald-50/50 border-2 border-amber-500/20 shadow-inner group">
                    <div className="text-4xl md:text-6xl font-amiri text-emerald-900 font-bold leading-normal relative z-10">
                      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flex items-center justify-center mt-6 gap-4 opacity-30">
                    <div className="h-px w-20 bg-emerald-900"></div>
                    <div className="w-2 h-2 rotate-45 bg-amber-500"></div>
                    <div className="h-px w-20 bg-emerald-900"></div>
                  </div>
                </div>
              )}

              <div className="quran-container bg-emerald-50/10 p-8 md:p-14 rounded-[3rem] border border-emerald-100/30 shadow-inner relative">
                {contentData.ayahs.map((ayah: any, index: number) => {
                  const cleanText = ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
                  const isActive = currentAyahPlaying === ayah.number;
                  
                  // Check if a new page or new surah starts
                  const isNewPage = index > 0 && ayah.page !== contentData.ayahs[index - 1].page;
                  const isNewSurah = index > 0 && ayah.surah && contentData.ayahs[index - 1].surah && ayah.surah.number !== contentData.ayahs[index - 1].surah.number;

                  return (
                    <span key={ayah.number} className="inline">
                      {isNewPage && (
                        <div className="w-full flex items-center justify-center my-12 opacity-50">
                          <div className="h-px bg-emerald-200 flex-grow"></div>
                          <span className="mx-4 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 tracking-widest uppercase">نهاية الصفحة {contentData.ayahs[index-1].page} • بداية الصفحة {ayah.page}</span>
                          <div className="h-px bg-emerald-200 flex-grow"></div>
                        </div>
                      )}

                      {isNewSurah && (
                        <div className="w-full text-center my-20">
                          <div className="inline-block px-10 py-2 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-700 font-bold mb-8">بداية {ayah.surah.name}</div>
                          <div className="text-4xl md:text-5xl font-amiri text-emerald-900 font-bold mb-10 py-6 border-y-2 border-emerald-50">
                             بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                          </div>
                        </div>
                      )}

                      <span 
                        className={`inline relative px-1 rounded-xl transition-all duration-300
                          ${isActive ? 'bg-yellow-200/60 ring-2 ring-yellow-400 shadow-md scale-105 inline-block z-10' : 'hover:bg-emerald-100/40'}`}
                      >
                        <span 
                          onClick={() => fetchTafsir(ayah.number)}
                          className="text-2xl md:text-3xl font-amiri text-emerald-950 cursor-pointer"
                          style={{ wordSpacing: '4px', lineHeight: '2.5' }}
                        >
                          {cleanText}
                        </span>
                        <span 
                          onClick={() => startAudio(ayah.number)}
                          className={`inline-flex items-center justify-center w-10 h-10 mx-3 rounded-full border-2 transition-all font-bold cursor-pointer shadow-sm
                            ${isActive && isPlaying ? 'bg-emerald-900 border-emerald-950 text-yellow-400' : 'bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-900 hover:text-white hover:border-emerald-900'}`}
                        >
                          {isActive && isPlaying ? <Pause size={18} /> : <span className="text-sm font-bold">{ayah.numberInSurah.toLocaleString('ar-EG')}</span>}
                        </span>
                        
                        <AnimatePresence>
                          {activeTafsirAyah === ayah.number && (
                              <motion.div 
                                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                  className="absolute z-[70] bottom-full left-1/2 -translate-x-1/2 mb-6 w-72 md:w-96 p-8 bg-[#022c22] border-2 border-yellow-500/30 shadow-2xl rounded-[2.5rem] text-right"
                              >
                                  <div className="flex justify-between items-center mb-4 border-b border-emerald-800 pb-3">
                                      <div className="flex items-center gap-2 text-yellow-500">
                                          <Info size={22} />
                                          <span className="font-bold text-lg font-reem text-white">التفسير الميسر</span>
                                      </div>
                                      <button onClick={(e) => { e.stopPropagation(); setActiveTafsirAyah(null); }} className="text-emerald-500 hover:text-white transition-all"><X size={20}/></button>
                                  </div>
                                  <p className="text-xl leading-relaxed text-emerald-50 font-amiri max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                      {tafsir[ayah.number] || 'جاري تحميل التفسير...'}
                                  </p>
                                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#022c22] border-r-2 border-b-2 border-yellow-500/30 rotate-45"></div>
                              </motion.div>
                          )}
                        </AnimatePresence>
                      </span>
                    </span>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
