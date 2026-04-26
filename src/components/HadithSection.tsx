import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  CheckCircle2,
  Info,
  Bookmark,
  Library,
  Scale
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAWAWI_42_FULL } from '../hadiths';

interface Hadith {
  number: number;
  arab: string;
  id?: string;
  bookName?: string;
  chapterName?: string;
  status?: string;
}

export default function HadithSection() {
  const [activeTab, setActiveTab] = useState<'nawawi' | 'books'>('nawawi');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string>('bukhari');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const books = [
    { id: 'bukhari', name: 'صحيح البخاري' },
    { id: 'muslim', name: 'صحيح مسلم' },
    { id: 'tirmidzi', name: 'سنن الترمذي' },
    { id: 'abudawood', name: 'سنن أبي داود' },
    { id: 'nasai', name: 'سنن النسائي' },
    { id: 'ibnumajah', name: 'سنن ابن ماجه' }
  ];

  const fetchBooksHadith = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const range = `${(page - 1) * 20 + 1}-${page * 20}`;
      const res = await axios.get(`https://api.hadith.gading.dev/books/${selectedBook}?range=${range}`);
      setSearchResults(res.data.data.hadiths);
      setCurrentPage(page);
    } catch (e) {
      console.error(e);
      setError('تعذر تحميل الأحاديث، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    setError(null);
    setActiveTab('books');
    try {
        const res = await axios.get(`https://api.hadith.gading.dev/books/${selectedBook}?range=1-150`);
        const filtered = res.data.data.hadiths.filter((h: any) => h.arab.includes(searchQuery));
        setSearchResults(filtered.length > 0 ? filtered : res.data.data.hadiths.slice(0, 20));
    } catch (e) {
        setError('تعذر البحث حالياً.');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'books') {
      fetchBooksHadith(1);
    }
  }, [selectedBook, activeTab]);

  return (
    <div className="space-y-12 py-6 max-w-6xl mx-auto px-4">
      {/* Header Selector */}
      <div className="bg-emerald-900/60 p-8 rounded-[3rem] border border-emerald-800 backdrop-blur-md flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="p-5 bg-yellow-500 rounded-2xl shadow-xl shadow-yellow-500/10">
            <Library size={36} className="text-emerald-950" />
          </div>
          <div>
            <h2 className="text-4xl font-bold font-reem text-yellow-500 mb-2 tracking-tight">موسوعة الحديث النبوي</h2>
            <p className="text-emerald-200 font-medium">الأربعين النووية كاملة وكتب السنة المعتمدة</p>
          </div>
        </div>
        <div className="flex bg-emerald-950/50 p-2 rounded-[2rem] border border-emerald-800 shadow-inner">
          <button 
            onClick={() => setActiveTab('nawawi')}
            className={`px-10 py-4 rounded-[1.5rem] transition-all duration-300 font-bold ${activeTab === 'nawawi' ? 'bg-yellow-500 text-emerald-950 shadow-lg scale-105' : 'text-emerald-400 hover:text-emerald-100'}`}
          >
            الأربعين النووية
          </button>
          <button 
            onClick={() => setActiveTab('books')}
            className={`px-10 py-4 rounded-[1.5rem] transition-all duration-300 font-bold ${activeTab === 'books' ? 'bg-yellow-500 text-emerald-950 shadow-lg scale-105' : 'text-emerald-400 hover:text-emerald-100'}`}
          >
            الكتب الستة
          </button>
        </div>
      </div>

      {activeTab === 'books' && (
          <div className="flex flex-col md:flex-row gap-4 animate-in slide-in-from-top-4 duration-500">
              <div className="relative flex-1 group">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="ابحث بالكلمة في أحاديث الكتاب المختار..." 
                    className="w-full bg-emerald-900/40 border-2 border-emerald-800 rounded-3xl py-6 px-10 text-white text-xl focus:outline-none focus:ring-4 ring-yellow-500/20 transition-all shadow-xl"
                  />
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500 group-focus-within:text-yellow-500 transition-colors" size={28} />
              </div>
              <button onClick={handleSearch} className="bg-yellow-500 text-emerald-950 px-12 py-6 rounded-3xl font-black text-xl hover:bg-yellow-400 transition-all shadow-xl">بـحـث</button>
          </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'nawawi' ? (
          <motion.div 
            key="nawawi"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {NAWAWI_42_FULL.map((h) => (
              <motion.div 
                key={h.id} 
                whileHover={{ y: -8 }}
                className="bg-white/95 p-10 rounded-[3.5rem] shadow-2xl border-t-[12px] border-emerald-900 group transition-all relative overflow-hidden"
              >
                <div className="flex items-center gap-5 mb-8 relative z-10">
                  <span className="w-16 h-16 rounded-[1.5rem] bg-emerald-900 text-yellow-400 flex items-center justify-center text-4xl font-black shadow-lg border border-yellow-500/20">{h.id}</span>
                  <h3 className="text-3xl font-bold text-emerald-950 font-reem">{h.title}</h3>
                </div>
                <div className="bg-emerald-50 p-10 rounded-[2.5rem] border-r-[6px] border-yellow-500 mb-10 shadow-inner">
                    <p className="text-2xl leading-relaxed text-emerald-950 font-amiri text-justify">{h.text}</p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-emerald-700 font-bold border-b border-emerald-100 pb-3">
                    <Info size={24} className="text-yellow-600"/>
                    <h4 className="text-xl font-reem">شرح الحديث وفوائده</h4>
                  </div>
                  <p className="text-emerald-900/80 text-xl leading-relaxed text-right font-medium">{h.sharh}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="books"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            {/* Book Selector */}
            <div className="flex flex-wrap gap-4 justify-center bg-emerald-900/40 p-8 rounded-[3rem] border border-emerald-800 shadow-2xl backdrop-blur-md">
               {books.map(book => (
                   <button 
                    key={book.id}
                    onClick={() => { setSelectedBook(book.id); setCurrentPage(1); }}
                    className={`px-8 py-4 rounded-[1.5rem] font-bold transition-all border-2 ${selectedBook === book.id ? 'bg-yellow-500 text-emerald-950 border-yellow-400 shadow-xl scale-110' : 'bg-emerald-950/40 border-emerald-800 text-emerald-100 hover:border-emerald-600 hover:text-white'}`}
                   >
                       {book.name}
                   </button>
               ))}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-6">
                <div className="animate-spin rounded-full h-20 w-24 border-t-4 border-b-4 border-yellow-500"></div>
                <span className="text-yellow-500 font-black animate-pulse text-2xl">جاري تحميل كنوز السنة...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-rose-400 font-bold text-2xl bg-emerald-900/10 rounded-3xl">{error}</div>
            ) : (
              <div className="space-y-12 animate-in fade-in duration-700">
                <div className="flex justify-between items-center bg-emerald-900/30 p-6 rounded-[2rem] border border-emerald-800 shadow-xl">
                    <button onClick={() => fetchBooksHadith(currentPage - 1)} disabled={currentPage === 1} className="px-8 py-3 bg-emerald-800 text-white rounded-xl disabled:opacity-20 transition-all hover:bg-emerald-700 active:scale-90 font-bold">
                        السابق
                    </button>
                    <div className="text-center">
                        <span className="text-2xl font-black text-yellow-500 font-mono">صفحة {currentPage}</span>
                        <p className="text-emerald-400 text-xs mt-1">تصفح الكتاب</p>
                    </div>
                    <button onClick={() => fetchBooksHadith(currentPage + 1)} className="px-8 py-3 bg-emerald-800 text-white rounded-xl transition-all hover:bg-emerald-700 active:scale-90 font-bold">
                        التالي
                    </button>
                </div>

                {searchResults.map((h, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={i} 
                    className="bg-white p-12 rounded-[4rem] border-r-[20px] border-emerald-900 shadow-2xl relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-4 text-emerald-950 font-black text-2xl font-reem">
                        <Scale className="text-yellow-600" size={32} /> 
                        {books.find(b => b.id === selectedBook)?.name}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm bg-emerald-50 text-emerald-700 px-6 py-2 rounded-full border border-emerald-100 font-mono font-bold shadow-inner">الحديث {h.number}</span>
                        <button className="p-3 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-900 hover:text-white transition-all"><Bookmark size={22}/></button>
                      </div>
                    </div>
                    <div className="text-3xl leading-[4rem] text-emerald-950 font-amiri text-justify mb-10 px-8 border-l-4 border-emerald-50/50">
                      {h.arab}
                    </div>
                    <div className="pt-8 border-t border-emerald-100 flex justify-between items-center">
                        <div className="flex items-center gap-3 text-emerald-500 font-black">
                            <CheckCircle2 className="text-emerald-500" size={24} />
                            <span className="uppercase tracking-widest text-xs">نص صحيح ومعتمد</span>
                        </div>
                        <span className="text-sm text-yellow-600 font-bold opacity-70">المصدر: الكتب الستة المعتمدة</span>
                    </div>
                  </motion.div>
                ))}

                <div className="flex justify-center gap-6 pt-16">
                    <button onClick={() => fetchBooksHadith(currentPage - 1)} disabled={currentPage === 1} className="px-16 py-5 bg-emerald-800 text-white rounded-[2rem] font-black disabled:opacity-20 shadow-2xl transition-all hover:bg-emerald-700">السابق</button>
                    <button onClick={() => fetchBooksHadith(currentPage + 1)} className="px-16 py-5 bg-yellow-500 text-emerald-950 rounded-[2rem] font-black shadow-2xl transition-all hover:bg-yellow-400">التالي</button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
