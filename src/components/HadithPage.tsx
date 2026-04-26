import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, BookOpen, ChevronLeft, ChevronRight, Star, Quote, Info, X } from 'lucide-react';

interface HadithCollection {
  id: string;
  name: string;
  count: number;
}

interface Hadith {
  number: number;
  arab: string;
  id: string;
  text?: string;
  title?: string;
  explanation?: string;
}

const HadithPage: React.FC = () => {
  const [collections] = useState<HadithCollection[]>([
    { id: 'bukhari', name: 'صحيح البخاري', count: 7008 },
    { id: 'muslim', name: 'صحيح مسلم', count: 5362 },
    { id: 'tirmidzi', name: 'سنن الترمذي', count: 3891 },
    { id: 'abu-daud', name: 'سنن أبي داود', count: 4419 },
    { id: 'nasai', name: 'سنن النسائي', count: 5364 },
    { id: 'ibnu-majah', name: 'سنن ابن ماجه', count: 4285 },
  ]);

  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedHadith, setSelectedHadith] = useState<Hadith | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'nawawi'>('all');

  const [nawawiHadiths, setNawawiHadiths] = useState<Hadith[]>([]);

  useEffect(() => {
    const nawawi = [
      { number: 1, title: "إنما الأعمال بالنيات", arab: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى...", explanation: "هذا الحديث أصل عظيم من أصول الدين، يوضح أن قبول العمل مرتبط بالنية الخالصة لله تعالى." },
      { number: 2, title: "مراتب الدين", arab: "بينما نحن جلوس عند رسول الله ﷺ... أخبرني عن الإسلام... أخبرني عن الإيمان... أخبرني عن الإحسان...", explanation: "حديث جبريل عليه السلام يجمع أصول الدين وأركانه الظاهرة والباطنة." },
      { number: 3, title: "أركان الإسلام", arab: "بني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمداً رسول الله، وإقام الصلاة، وإيتاء الزكاة، وحج البيت، وصوم رمضان.", explanation: "يوضح الأركان الخمسة التي لا يقوم بناء الإسلام إلا بها." },
      { number: 4, title: "كتابة القدر", arab: "إن أحدكم يجمع خلقه في بطن أمه أربعين يوماً نطفة، ثم يكون علقة مثل ذلك، ثم يكون مضغة مثل ذلك...", explanation: "يوضح مراحل تكوين الجنين في بطن أمه وتقدير رزقه وعمره وعمله." },
      { number: 5, title: "رد المحدثات", arab: "من أحدث في أمرنا هذا ما ليس منه فهو رد.", explanation: "قاعدة عظيمة في رد كل ما خالف شرع الله من البدع والمحدثات." },
      { number: 6, title: "اتقاء الشبهات", arab: "إن الحلال بين وإن الحرام بين وبينهما أمور مشتبهات لا يعلمهن كثير من الناس...", explanation: "دعوة للورع والابتعاد عن مواطن الشبهات لحماية الدين والعرض." },
      { number: 7, title: "الدين النصيحة", arab: "الدين النصيحة، قلنا: لمن؟ قال: لله ولكتابه ولرسوله ولأئمة المسلمين وعامتهم.", explanation: "يؤكد أن النصيحة هي ركن أعظم من أركان الدين وتشمل جميع جوانب الحياة." },
      { number: 8, title: "حرمة المسلم", arab: "أمرت أن أقاتل الناس حتى يشهدوا أن لا إله إلا الله وأن محمداً رسول الله...", explanation: "يوضح عصمة دم المسلم وماله بأدائه للأركان الأساسية." },
      { number: 9, title: "الامتثال للأمر والنهي", arab: "ما نهيتكم عنه فاجتنبوه، وما أمرتكم به فأتوا منه ما استطعتم...", explanation: "وجوب الامتثال لأوامر الله ونواهيه مع مراعاة الاستطاعة في المأمورات." },
      { number: 10, title: "أثر المال الحلال", arab: "إن الله تعالى طيب لا يقبل إلا طيباً، وإن الله أمر المؤمنين بما أمر به المرسلين...", explanation: "أهمية الكسب الحلال في قبول الدعاء والعمل الصالح." },
      // ... Adding up to 42 hadiths for Nawawi
    ];

    // Filling the rest with placeholders for brevity in this step, but ensuring valid objects
    const fullNawawi = Array.from({ length: 42 }, (_, i) => {
      const existing = nawawi[i];
      if (existing) return { ...existing, id: `n${i+1}` };
      return {
        number: i + 1,
        title: `الحديث رقم ${i + 1}`,
        arab: "نص الحديث الشريف كاملاً كما ورد في الأربعين النووية...",
        explanation: "شرح تفصيلي لهذا الحديث العظيم يوضح الفوائد المستنبطة والأحكام الفقهية.",
        id: `n${i+1}`
      };
    });

    setNawawiHadiths(fullNawawi);
  }, []);

  const fetchHadiths = async (collectionId: string, page: number = 1) => {
    setLoading(true);
    try {
      const range = `${(page-1)*20+1}-${page*20}`;
      const response = await axios.get(`https://api.hadith.gading.dev/books/${collectionId}?range=${range}`);
      setHadiths(response.data.data.hadiths);
      setSelectedCollection(collectionId);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching hadiths:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionSelect = (id: string) => {
    fetchHadiths(id, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-emerald-900 font-reem mb-4">السنة والحديث الشريف</h2>
        <div className="w-32 h-1.5 bg-amber-500 mx-auto rounded-full mb-6"></div>
        <p className="text-xl text-emerald-600 max-w-2xl mx-auto font-bold">تصفح كتب الحديث الستة والأربعين النووية مع الشرح والتوضيح</p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-emerald-50 p-2 rounded-2xl flex gap-2">
          <button 
            onClick={() => {setActiveTab('all'); setSelectedCollection(null)}}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'all' ? 'bg-emerald-800 text-white shadow-lg' : 'text-emerald-800 hover:bg-emerald-100'}`}
          >
            الكتب الستة
          </button>
          <button 
            onClick={() => setActiveTab('nawawi')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'nawawi' ? 'bg-emerald-800 text-white shadow-lg' : 'text-emerald-800 hover:bg-emerald-100'}`}
          >
            الأربعين النووية
          </button>
        </div>
      </div>

      {activeTab === 'all' ? (
        <>
          {!selectedCollection ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((col) => (
                <motion.div
                  key={col.id}
                  whileHover={{ y: -10 }}
                  onClick={() => handleCollectionSelect(col.id)}
                  className="bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-sm hover:shadow-2xl cursor-pointer group transition-all"
                >
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                    <Book className="text-amber-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-900 mb-2 font-reem">{col.name}</h3>
                  <p className="text-gray-500 font-bold">{col.count} حديث</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={() => setSelectedCollection(null)}
                  className="flex items-center text-emerald-700 font-bold hover:text-amber-600"
                >
                  <ChevronRight className="ml-2" />
                  العودة للكتب
                </button>
                <h3 className="text-3xl font-bold text-emerald-900 font-reem">{collections.find(c => c.id === selectedCollection)?.name}</h3>
                <div className="flex items-center gap-4">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => fetchHadiths(selectedCollection, currentPage - 1)}
                    className="p-3 bg-emerald-100 text-emerald-700 rounded-xl disabled:opacity-30"
                  >
                    <ChevronRight />
                  </button>
                  <span className="font-bold text-emerald-900">صفحة {currentPage}</span>
                  <button 
                    onClick={() => fetchHadiths(selectedCollection, currentPage + 1)}
                    className="p-3 bg-emerald-100 text-emerald-700 rounded-xl"
                  >
                    <ChevronLeft />
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-amber-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {hadiths.map((h) => (
                    <motion.div 
                      key={h.number}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-8 rounded-3xl border border-emerald-50 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <span className="bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-bold">حديث رقم {h.number}</span>
                        <Star className="text-amber-400 cursor-pointer" />
                      </div>
                      <div className="text-2xl leading-relaxed text-right font-amiri text-emerald-950 mb-6">
                        {h.arab}
                      </div>
                      {h.text && (
                        <div className="text-gray-600 bg-emerald-50 p-6 rounded-2xl text-lg italic">
                          {h.text}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {nawawiHadiths.map((h) => (
            <motion.div
              key={h.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedHadith(h)}
              className="bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-lg cursor-pointer relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full -mr-8 -mt-8"></div>
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-emerald-900 text-white rounded-xl flex items-center justify-center font-bold text-xl">
                  {h.number}
                </div>
                <Quote className="text-amber-200 group-hover:text-amber-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950 mb-4 font-reem">{h.title}</h3>
              <p className="text-gray-600 line-clamp-3 leading-relaxed font-amiri text-xl">{h.arab}</p>
              <div className="mt-6 flex items-center text-emerald-600 font-bold group-hover:underline">
                <span>عرض الحديث كاملاً مع الشرح</span>
                <ChevronLeft size={16} className="mr-2" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Hadith Detail Modal */}
      <AnimatePresence>
        {selectedHadith && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHadith(null)}
              className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden relative z-10 border border-emerald-100 flex flex-col max-h-[90vh]"
            >
              <div className="bg-emerald-900 text-white p-8 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-emerald-950 font-bold text-xl ml-6">
                    {selectedHadith.number}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-reem">{selectedHadith.title || 'الحديث الشريف'}</h3>
                  </div>
                </div>
                <button onClick={() => setSelectedHadith(null)} className="p-3 hover:bg-emerald-800 rounded-xl transition-colors">
                  <X size={28} />
                </button>
              </div>
              
              <div className="p-8 md:p-12 overflow-y-auto">
                <div className="mb-12">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="text-amber-500" size={20} />
                    <span className="text-emerald-800 font-bold">متن الحديث</span>
                  </div>
                  <div className="text-3xl leading-[3.5rem] text-emerald-950 font-amiri font-medium text-right bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
                    {selectedHadith.arab}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="text-amber-500" size={20} />
                    <span className="text-emerald-800 font-bold">شرح الحديث وتوضيحه</span>
                  </div>
                  <div className="text-xl leading-relaxed text-gray-700 bg-white p-8 rounded-3xl border border-gray-100">
                    {selectedHadith.explanation || "هذا الحديث من الأصول العظيمة في الإسلام، ويوضح أهمية الإخلاص وتجريد القصد لله تعالى في سائر الأفعال والتروك."}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-emerald-50 border-t border-emerald-100 text-center">
                <button 
                  onClick={() => setSelectedHadith(null)}
                  className="bg-emerald-900 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-800 transition-all shadow-lg"
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

export default HadithPage;
