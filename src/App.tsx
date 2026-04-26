import { useState, useEffect } from 'react';
import { 
  Book, 
  Heart, 
  Clock, 
  Home,
  Menu,
  X,
  Compass,
  Volume2,
  ChevronLeft,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import QuranSection from './components/QuranSection';
import HadithSection from './components/HadithSection';
import AzkarSection from './components/AzkarSection';
import PrayerTimes from './components/PrayerTimes';
import Sebha from './components/Sebha';

type Section = 'home' | 'quran' | 'hadith' | 'azkar' | 'prayers' | 'sebha';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'quran', label: 'القرآن الكريم', icon: Book },
    { id: 'hadith', label: 'السنة والحديث', icon: Heart },
    { id: 'azkar', label: 'الأذكار', icon: Star },
    { id: 'sebha', label: 'السبحة', icon: Compass },
    { id: 'prayers', label: 'المواقيت', icon: Clock },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'home': return <HomeSection onNavigate={setActiveSection} />;
      case 'quran': return <QuranSection />;
      case 'hadith': return <HadithSection />;
      case 'azkar': return <AzkarSection />;
      case 'prayers': return <PrayerTimes />;
      case 'sebha': return <Sebha />;
      default: return <HomeSection onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#022c22] text-[#fefce8] selection:bg-yellow-500 selection:text-emerald-950">
      {/* Visual Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 to-emerald-950/90 z-10"></div>
        <img 
          src="/images/islamic-bg-new.jpg" 
          alt="" 
          className="w-full h-full object-cover opacity-30"
          onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=2000')}
        />
        <div className="absolute inset-0 opacity-[0.03] z-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0l3.398 10.354h10.887l-8.81 6.402 3.398 10.354-8.863-6.44-8.863 6.44 3.398-10.354-8.81-6.402h10.887L40 0z' fill='%23fbbf24' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled ? 'bg-emerald-950/95 backdrop-blur-md py-2 border-emerald-800 shadow-xl' : 'bg-transparent py-5 border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveSection('home')}>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <Volume2 className="text-emerald-950 w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-reem tracking-tight text-white">وحي</h1>
              <span className="text-[10px] block text-yellow-500 font-bold uppercase tracking-widest opacity-80">Noor Al-Huda Platform</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as Section)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeSection === item.id 
                    ? 'bg-yellow-500 text-emerald-950 shadow-lg' 
                    : 'text-emerald-100/70 hover:bg-emerald-900/50 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <button className="lg:hidden p-2 text-yellow-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-28 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative z-10 bg-emerald-950/60 backdrop-blur-md border-t border-emerald-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-yellow-500 font-bold font-reem text-xl mb-3">وحي - نور الهدى</p>
          <p className="text-emerald-300/50 text-sm max-w-lg mx-auto leading-relaxed">
            منصة إسلامية متكاملة تهدف إلى نشر العلم النافع وتيسير حفظ وتدبر القرآن الكريم والسنة النبوية الشريفة بأفضل الوسائل التقنية الممكنة.
          </p>
          <div className="mt-8 flex justify-center gap-4 text-emerald-600">
            <span className="text-xs">صحيح البخاري</span>
            <span className="text-xs">•</span>
            <span className="text-xs">صحيح مسلم</span>
            <span className="text-xs">•</span>
            <span className="text-xs">الأربعين النووية</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomeSection({ onNavigate }: { onNavigate: (s: Section) => void }) {
  const features = [
    { id: 'quran', title: 'القرآن الكريم', desc: 'تلاوة، تفسير، واستماع بمميزات ذكية', icon: Book, color: 'from-emerald-600 to-emerald-800' },
    { id: 'hadith', title: 'السنة النبوية', desc: 'الكتب الستة والأربعين النووية كاملة', icon: Heart, color: 'from-emerald-700 to-emerald-900' },
    { id: 'azkar', title: 'حصن المسلم', desc: 'الأذكار اليومية والأوراد المستجابة', icon: Star, color: 'from-yellow-600 to-amber-800' },
    { id: 'sebha', title: 'السبحة الإلكترونية', desc: 'عداد تسبيح تفاعلي لحفظ الأوراد', icon: Compass, color: 'from-amber-500 to-yellow-700' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center space-y-8 mb-20">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block p-5 rounded-[2rem] bg-yellow-500/10 border border-yellow-500/20">
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-2xl">﷽</h1>
        </motion.div>
        <h2 className="text-4xl md:text-6xl font-bold font-reem bg-gradient-to-b from-yellow-200 to-yellow-500 bg-clip-text text-transparent">
          مرحباً بكم في منصة وحي
        </h2>
        <p className="text-xl md:text-2xl text-emerald-100/80 max-w-3xl mx-auto leading-[1.8] font-medium">
          "نور الهدى" هي بوابتكم الرقمية للعلم النافع والتدبر والذكر. صُممت لتكون رفيقكم الصادق في رحلة العلم والعبادة، بأحدث تقنيات التسميع الذكي وأدق المصادر الشرعية.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((f, idx) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onNavigate(f.id as Section)}
            className="group cursor-pointer relative overflow-hidden p-10 rounded-[2.5rem] bg-emerald-900/40 border border-emerald-800/50 hover:border-yellow-500/40 transition-all duration-500"
          >
            <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${f.color} opacity-10 group-hover:opacity-25 transition-opacity blur-3xl`} />
            <div className="relative z-10 flex items-start gap-8">
              <div className={`p-5 rounded-2xl bg-gradient-to-br ${f.color} shadow-2xl`}>
                <f.icon className="text-white w-10 h-10" />
              </div>
              <div className="text-right">
                <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors font-reem">{f.title}</h3>
                <p className="text-emerald-300/70 text-lg leading-relaxed">{f.desc}</p>
              </div>
              <ChevronLeft className="mr-auto self-center text-emerald-800 group-hover:text-yellow-500 group-hover:-translate-x-2 transition-all" size={32} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default App;
