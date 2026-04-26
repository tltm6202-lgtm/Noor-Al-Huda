import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, MapPin, Bell, BellOff, Volume2 } from 'lucide-react';

export default function PrayerTimes() {
  const [times, setTimes] = useState<any>(null);
  const [nextPrayer, setNextPrayer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchTimes(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Fallback to Cairo if location denied
          fetchTimes(30.0444, 31.2357);
          setLocationError("لم نتمكن من تحديد موقعك، تم عرض مواقيت القاهرة كافتراضي.");
        }
      );
    } else {
      fetchTimes(30.0444, 31.2357);
    }
  }, []);

  const fetchTimes = async (lat: number, lng: number) => {
    try {
      const response = await axios.get(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=5`);
      setTimes(response.data.data.timings);
      calculateNextPrayer(response.data.data.timings);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  };

  const calculateNextPrayer = (timings: any) => {
    const prayers = [
      { name: 'Fajr', label: 'الفجر' },
      { name: 'Dhuhr', label: 'الظهر' },
      { name: 'Asr', label: 'العصر' },
      { name: 'Maghrib', label: 'المغرب' },
      { name: 'Isha', label: 'العشاء' }
    ];

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let found = false;
    for (let prayer of prayers) {
      const [hours, minutes] = timings[prayer.name].split(':');
      const prayerTime = parseInt(hours) * 60 + parseInt(minutes);

      if (prayerTime > currentTime) {
        setNextPrayer(prayer.label);
        updateCountdown(timings[prayer.name]);
        found = true;
        break;
      }
    }

    if (!found) {
      setNextPrayer('الفجر'); // Next day
      updateCountdown(timings['Fajr']);
    }
  };

  const updateCountdown = (targetTimeStr: string) => {
    const update = () => {
      const now = new Date();
      const [h, m] = targetTimeStr.split(':');
      const target = new Date();
      target.setHours(parseInt(h), parseInt(m), 0);
      
      if (target < now) target.setDate(target.getDate() + 1);
      
      const diff = target.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  };

  const formatTo12Hour = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    let hour = parseInt(h);
    const ampm = hour >= 12 ? 'م' : 'ص';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${m} ${ampm}`;
  };

  if (!times) return (
    <div className="flex justify-center py-20">
      <div className="animate-pulse text-yellow-500 font-bold text-xl">جاري تحميل المواقيت...</div>
    </div>
  );

  const prayerDisplay = [
    { key: 'Fajr', label: 'الفجر', icon: Bell },
    { key: 'Dhuhr', label: 'الظهر', icon: Volume2 },
    { key: 'Asr', label: 'العصر', icon: Clock },
    { key: 'Maghrib', label: 'المغرب', icon: Bell },
    { key: 'Isha', label: 'العشاء', icon: BellOff },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Countdown */}
      <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 p-10 rounded-3xl border border-yellow-500/20 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/20 text-yellow-500 text-sm font-bold">
             <Clock size={16} />
             <span>الصلاة القادمة</span>
          </div>
          <h2 className="text-5xl font-bold font-reem text-white">{nextPrayer}</h2>
          <div className="text-6xl font-mono text-yellow-500 tracking-widest bg-emerald-950/50 py-4 rounded-2xl border border-emerald-800">
             {timeLeft}
          </div>
          <p className="text-emerald-300/60 flex items-center justify-center gap-2">
            <MapPin size={16} />
            {locationError || `مواقيت الصلاة حسب موقعك الحالي`}
          </p>
        </div>
      </div>

      {/* Prayers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {prayerDisplay.map((p) => (
          <div 
            key={p.key}
            className={`p-6 rounded-3xl border transition-all duration-300 text-center space-y-3 ${
              nextPrayer === p.label 
              ? 'bg-yellow-500 border-yellow-400 text-emerald-950 shadow-lg scale-105' 
              : 'bg-emerald-900/40 border-emerald-800 text-emerald-100 hover:border-yellow-500/30'
            }`}
          >
            <p className={`text-sm font-bold uppercase tracking-widest ${nextPrayer === p.label ? 'text-emerald-900' : 'text-emerald-500'}`}>
              {p.label}
            </p>
            <p className="text-3xl font-bold font-mono">
               {formatTo12Hour(times[p.key])}
            </p>
            <div className={`flex justify-center ${nextPrayer === p.label ? 'text-emerald-800' : 'text-emerald-600'}`}>
               <p.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-900/20 p-6 rounded-2xl border border-emerald-800 text-sm text-emerald-400/80 leading-relaxed text-center">
        تعتمد المواقيت على تقويم أم القرى (مكة المكرمة) كمعيار أساسي للبحث، مع تعديل حسب الموقع الجغرافي المكتشف.
      </div>
    </div>
  );
}
