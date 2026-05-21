import "./App.css"; // Jalur ini sesuaikan dengan nama file CSS Anda

import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════
   DATA & MATERI FOR LMS (Kurikulum Merdeka / CTL)
══════════════════════════════════════════════ */
const CONTEXTUAL_CHATS = [
  { id: 1, sender: "wakminah", name: "Wak Minah", role: "Pemilik Warung Kopi", avatar: "👵", text: "Bud! Tolong besarkan lagi api kompornya itu. Biar airnya makin cepat mendidih dan kopinya makin mantap panasnya!", delay: 0 },
  { id: 2, sender: "budi", name: "Budi", role: "Siswa SMA (Keponakan)", avatar: "👦", text: "Eh, Wak... kalau airnya sudah mendidih bergolak begitu, mau apinya dibesarkan sampai sebesar api unggun pun suhunya tidak akan naik lagi dari 100°C, lho!", delay: 2000 },
  { id: 3, sender: "wakminah", name: "Wak Minah", role: "Pemilik Warung Kopi", avatar: "👵", text: "Hush, sembarangan kamu Bud! Logika dapur Wak ya kalau api makin besar, pasti airnya makin panas. Kamu ini belajar dari mana?", delay: 4500 },
  { id: 4, sender: "kalo", name: "KALO Bot", role: "Asisten Sains Virtual", avatar: "🤖", text: "Hai Wak Minah & Budi! Budi 100% benar. Ketika air sudah mencapai titik didihnya, kalor yang diberikan kompor bukan lagi digunakan untuk naik suhu, melainkan untuk mengubah wujud zat menjadi uap. Yuk kita buktikan di lab virtual!", delay: 7000 }
];

const LAB_EXPERIMENTS = [
  {
    id: "sensibel",
    title: "Fase 1: Kalor Sensibel (Menaikkan Suhu)",
    concept: "Q = m × c × ΔT",
    description: "Amati bagaimana energi kalor menaikkan suhu air dari suhu ruang (25°C) hingga tepat sebelum mendidih (100°C).",
    substance: "Air Bersih",
    massaOptions: [0.1, 0.2, 0.5], // kg
    cValue: 4200, // J/kg°C
    dTValues: [25, 50, 75], // perubahan suhu
    badgeColor: "bg-rose-500",
    textColor: "text-rose-600",
    borderColor: "border-rose-200",
    bgColor: "bg-rose-50/30"
  },
  {
    id: "laten",
    title: "Fase 2: Kalor Laten (Mengubah Wujud)",
    concept: "Q = m × U",
    description: "Air sudah berada di suhu 100°C. Amati bahwa penambahan kalor TIDAK MENAIKKAN SUHU, melainkan mengubah air menjadi uap air.",
    substance: "Air Mendidih (100°C)",
    massaOptions: [0.1, 0.2, 0.3], // kg air yang diuapkan
    uValue: 2260000, // J/kg (Kalor Uap Air)
    badgeColor: "bg-sky-500",
    textColor: "text-sky-600",
    borderColor: "border-sky-200",
    bgColor: "bg-sky-50/30"
  }
];

const QUIZ_BANK = [
  {
    id: 1,
    level: "C2 - Pemahaman",
    question: "Mengapa ketika air sudah mendidih bergolak, suhunya cenderung tetap konstan di angka 100°C meskipun nyala api kompor terus dibesarkan?",
    options: [
      "Karena kalor dari api kompor habis diserap oleh dinding panci logam.",
      "Karena seluruh energi kalor digunakan untuk memutuskan ikatan antarmolekul zat cair untuk berubah wujud menjadi gas.",
      "Karena air melepaskan dingin ke udara sekitar dengan laju yang sama dengan kalor yang diterima.",
      "Karena kapasitas kalor jenis air mendadak turun menjadi nol ketika mendidih."
    ],
    correct: 1,
    explanation: "Ketika mencapai titik didih, zat cair berada dalam fase transisi. Energi panas (kalor) dialokasikan sepenuhnya sebagai Kalor Laten Penguapan untuk merubah wujud cair menjadi gas, sehingga tidak ada kenaikan energi kinetik rata-molekul (suhu tetap)."
  },
  {
    id: 2,
    level: "C3 - Aplikasi",
    question: "Wak Minah memanaskan 0.5 kg air bersuhu 25°C hingga mencapai 75°C untuk menyeduh secangkir kopi hitam. Jika kalor jenis air adalah 4.200 J/kg°C, berapakah jumlah kalor yang diserap air?",
    options: [
      "105.000 Joule",
      "210.000 Joule",
      "157.500 Joule",
      "52.500 Joule"
    ],
    correct: 0,
    explanation: "Diketahui: m = 0.5 kg, c = 4200 J/kg°C, ΔT = 75°C - 25°C = 50°C. Menggunakan rumus Q = m·c·ΔT = 0.5 × 4200 × 50 = 105.000 Joule."
  },
  {
    id: 3,
    level: "C4 - Analisis",
    question: "Budi memasukkan es batu bermassa sama ke dalam dua wadah berbeda: Wadah A berisi air panas, Wadah B berisi kopi hangat. Wadah A mencairkan es lebih cepat. Pernyataan fisis yang paling tepat mendeskripsikan kejadian tersebut adalah...",
    options: [
      "Laju perpindahan kalor berbanding lurus dengan perbedaan suhu antar dua benda yang berinteraksi.",
      "Air panas memiliki kalor jenis yang jauh lebih kecil dibandingkan dengan kopi hangat.",
      "Kopi hangat menolak penyerapan kalor karena partikel pekat di dalamnya.",
      "Massa es batu di wadah B bertambah secara spontan akibat pengendapan kopi."
    ],
    correct: 0,
    explanation: "Berdasarkan prinsip perpindahan kalor (termodinamika), laju hantaran atau transfer kalor berbanding lurus dengan gradien atau perbedaan suhu (ΔT) awal antara dua medium. Perbedaan suhu es-air panas > es-kopi hangat."
  }
];

/* ══════════════════════════════════════════════
   MAIN LMS COMPONENT
══════════════════════════════════════════════ */
export default function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [userProgress, setUserProgress] = useState({ story: false, lab: false, quiz: false });
  const [quizScore, setQuizScore] = useState(null);
  const [showPopup, setShowPopup] = useState(true);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 flex flex-col selection:bg-amber-200 relative">
      
      {/* Developer Pop-Up Modal */}
      {showPopup && <DeveloperPopup onClose={() => setShowPopup(false)} />}

      {/* Top Professional Header Branding */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/60 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl shadow-sm shadow-orange-500/20">
              🔥
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 font-brand">SainsAsyik: LMS Kalor</h1>
              <p className="text-xs text-stone-500">Modul Pembelajaran Fisika Kontekstual - SMA Kelas 11</p>
            </div>
          </div>
          
          {/* Top Navigation Bar */}
          <nav className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/40 overflow-x-auto w-full md:w-auto">
            {[
              { id: "dashboard", label: "Beranda", icon: "📊" },
              { id: "story", label: "Cerita", icon: "💬" },
              { id: "lab", label: "Lab", icon: "🧪" },
              { id: "quiz", label: "Kuis", icon: "📝" },
              { id: "developer", label: "Profil Dev", icon: "👨‍💻" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  currentTab === tab.id
                    ? "bg-white text-orange-600 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col justify-start">
        {currentTab === "dashboard" && (
          <DashboardView 
            progress={userProgress} 
            quizScore={quizScore} 
            startModule={(target) => setCurrentTab(target)} 
          />
        )}
        {currentTab === "story" && (
          <StoryView 
            onComplete={() => {
              setUserProgress(p => ({ ...p, story: true }));
              setCurrentTab("lab");
            }} 
          />
        )}
        {currentTab === "lab" && (
          <LabView 
            onComplete={() => {
              setUserProgress(p => ({ ...p, lab: true }));
              setCurrentTab("quiz");
            }} 
          />
        )}
        {currentTab === "quiz" && (
          <QuizView 
            onComplete={(score) => {
              setQuizScore(score);
              setUserProgress(p => ({ ...p, quiz: true }));
              setCurrentTab("dashboard");
            }} 
          />
        )}
        {currentTab === "developer" && (
          <DeveloperView />
        )}
      </main>

      {/* Subtle Educational Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6 text-center text-xs mt-12 border-t border-stone-800">
        <p className="font-medium text-stone-300">Didesain untuk Media Pembelajaran Fisika SMA - Materi Suhu & Kalor</p>
        <p className="text-stone-500 mt-1">© 2026 SainsAsyik LMS Platform. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════
   0. DEVELOPER POPUP & VIEW COMPONENTS
══════════════════════════════════════════════ */
function DeveloperPopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-stone-200/50 animate-slideIn relative text-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-amber-100 to-orange-100 rounded-full mx-auto flex items-center justify-center text-4xl mb-4 shadow-inner border border-orange-200">
          👋
        </div>
        <h2 className="text-2xl font-black text-stone-900 font-brand mb-2">Selamat Datang!</h2>
        <p className="text-sm text-stone-600 leading-relaxed mb-6">
          Aplikasi LMS Fisika Materi Kalor ini dikembangkan oleh <strong>Arsyad</strong>, Mahasiswa Pendidikan Fisika, sebagai media pembelajaran interaktif untuk memudahkan pemahaman sains.
        </p>
        <button 
          onClick={onClose}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer uppercase tracking-wider text-xs"
        >
          Mulai Belajar Sekarang
        </button>
      </div>
    </div>
  );
}

function DeveloperView() {
  return (
    <div className="max-w-3xl mx-auto w-full animate-fadeIn mt-4">
      <div className="bg-white rounded-3xl border border-stone-200/60 shadow-xs overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-2xl p-1 shadow-md rotate-3">
            <div className="w-full h-full bg-stone-100 rounded-xl flex items-center justify-center text-4xl border border-stone-200">
              👨‍💻
            </div>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="pt-16 pb-8 px-8">
          <h2 className="text-3xl font-black text-stone-900 font-brand">Arsyad</h2>
          <div className="inline-block mt-2 px-3 py-1 bg-orange-100 text-orange-700 font-bold text-xs rounded-full uppercase tracking-widest">
            Pengembang LMS
          </div>
          
          <div className="mt-6 space-y-4 text-sm text-stone-600 leading-relaxed max-w-2xl">
            <p>
              Halo! Saya adalah mahasiswa <strong>Program Studi Pendidikan Fisika</strong> yang memiliki ketertarikan pada pengembangan media pembelajaran berbasis teknologi.
            </p>
            <p>
              Aplikasi <em>SainsAsyik: LMS Kalor</em> ini dirancang khusus untuk membawa konsep Fisika yang abstrak menjadi lebih nyata dan kontekstual. Dengan mengintegrasikan cerita kehidupan sehari-hari (seperti Dapur Wak Minah) dan simulasi praktikum virtual, diharapkan siswa dapat lebih mudah menguasai materi Suhu, Kalor Sensibel, dan Kalor Laten.
            </p>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 mt-4">
              <h3 className="font-bold text-stone-800 mb-2">Spesifikasi Media Pembelajaran:</h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-stone-500">
                <li>Pendekatan: Contextual Teaching and Learning (CTL)</li>
                <li>Materi Pokok: Perpindahan Kalor & Perubahan Wujud Zat</li>
                <li>Tingkat Kognitif Kuis: C2 (Pemahaman) hingga C4 (Analisis) Bloom</li>
                <li>Teknologi: React.js & Tailwind CSS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   1. DASHBOARD VIEW COMPONENT
══════════════════════════════════════════════ */
function DashboardView({ progress, quizScore, startModule }) {
  const getProgressPercent = () => {
    let count = 0;
    if (progress.story) count += 33;
    if (progress.lab) count += 33;
    if (progress.quiz) count += 34;
    return count;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
      {/* Welcome Message Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent rounded-3xl p-6 border border-amber-500/20 flex flex-col md:flex-row items-center gap-6">
        <div className="text-5xl">☕</div>
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl font-extrabold text-stone-900 font-brand">Selamat Datang di Modul Energi Kalor!</h2>
          <p className="text-sm text-stone-600 max-w-xl">
            Mari bantu Wak Minah memahami hukum fisika di balik merebus air kopi agar hemat gas elpiji dan paham rahasia perubahan wujud zat.
          </p>
        </div>
      </div>

      {/* Progress Track Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-2xl">💬</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${progress.story ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {progress.story ? "Selesai" : "Belum Selesai"}
              </span>
            </div>
            <h3 className="font-bold text-base text-stone-900 mt-3 font-brand">1. Cerita Kontekstual</h3>
            <p className="text-xs text-stone-500 mt-1">Perdebatan seru fisis antara Wak Minah dan Budi tentang kompor gas.</p>
          </div>
          <button onClick={() => startModule("story")} className="w-full mt-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all">
            {progress.story ? "Baca Ulang" : "Mulai Belajar"}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-2xl">🧪</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${progress.lab ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {progress.lab ? "Selesai" : "Belum Selesai"}
              </span>
            </div>
            <h3 className="font-bold text-base text-stone-900 mt-3 font-brand">2. Laboratorium Virtual</h3>
            <p className="text-xs text-stone-500 mt-1">Simulasi interaktif menghitung rumus asas kalor sensibel & kalor laten.</p>
          </div>
          <button onClick={() => startModule("lab")} className="w-full mt-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all">
            {progress.lab ? "Eksperimen Lagi" : "Mulai Praktikum"}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-2xl">🏆</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${progress.quiz ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {progress.quiz ? "Selesai" : "Belum Selesai"}
              </span>
            </div>
            <h3 className="font-bold text-base text-stone-900 mt-3 font-brand">3. Kuis Evaluasi</h3>
            <p className="text-xs text-stone-500 mt-1">Uji penguasaan konsep fisika Anda melalui soal berbasis Taksonomi Bloom.</p>
          </div>
          <button onClick={() => startModule("quiz")} className="w-full mt-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all">
            {progress.quiz ? `Ulangi Kuis (Skor: ${quizScore}%)` : "Mulai Ujian"}
          </button>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs space-y-2">
        <div className="flex justify-between text-xs font-bold text-stone-600">
          <span>Total Progres Pembelajaran</span>
          <span>{getProgressPercent()}%</span>
        </div>
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-700" style={{ width: `${getProgressPercent()}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   2. CONTEXTUAL STORY VIEW COMPONENT
══════════════════════════════════════════════ */
function StoryView({ onComplete }) {
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (activeMessageIndex < CONTEXTUAL_CHATS.length - 1) {
      const timer = setTimeout(() => {
        setActiveMessageIndex(prev => prev + 1);
      }, CONTEXTUAL_CHATS[activeMessageIndex + 1].delay - CONTEXTUAL_CHATS[activeMessageIndex].delay);
      return () => clearTimeout(timer);
    }
  }, [activeMessageIndex]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessageIndex]);

  return (
    <div className="max-w-xl mx-auto w-full space-y-6 animate-fadeIn">
      {/* Introduction Banner */}
      <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
        <strong>Skenario Kehidupan Nyata:</strong> Pagi hari di warung kopi tradisional, Budi memperhatikan neneknya sedang merebus air untuk kopi tubruk pesanan pelanggan dengan api maksimal padahal air sudah mendidih.
      </div>

      {/* Chat Windows Simulation */}
      <div className="bg-white rounded-3xl border border-stone-200/70 shadow-sm overflow-hidden flex flex-col h-[480px]">
        {/* Chat Header */}
        <div className="bg-stone-50 border-b border-stone-200/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-stone-700">Diskusi Masak Air Kopi</span>
          </div>
          <span className="text-[10px] bg-stone-200 text-stone-600 font-bold px-2 py-0.5 rounded-md">Live Room</span>
        </div>

        {/* Chat Flow Screen */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F5]">
          {CONTEXTUAL_CHATS.slice(0, activeMessageIndex + 1).map((msg) => {
            const isWak = msg.sender === "wakminah";
            const isKalo = msg.sender === "kalo";

            return (
              <div key={msg.id} className={`flex gap-3 animate-slideIn ${isWak ? "flex-row" : isKalo ? "flex-row" : "flex-row-reverse"}`}>
                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-lg shrink-0">
                  {msg.avatar}
                </div>
                {/* Bubble Container */}
                <div className={`max-w-[80%] space-y-0.5`}>
                  <div className={`flex items-center gap-1.5 px-1 ${!isWak && !isKalo ? "flex-row-reverse" : ""}`}>
                    <span className="text-[11px] font-bold text-stone-800">{msg.name}</span>
                    <span className="text-[9px] text-stone-400">({msg.role})</span>
                  </div>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                    isWak ? "bg-white text-stone-800 rounded-tl-xs border border-stone-200/80" :
                    isKalo ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-tl-xs font-medium" :
                    "bg-orange-500 text-white rounded-tr-xs"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Conditional Next Step Controller */}
      {activeMessageIndex === CONTEXTUAL_CHATS.length - 1 && (
        <div className="text-center animate-fadeIn">
          <button onClick={onComplete} className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-all active:scale-98">
            Lanjut ke Lab Virtual: Buktikan Teori Budi 🧪
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   3. LAB SIMULATION VIEW COMPONENT
══════════════════════════════════════════════ */
function LabView({ onComplete }) {
  const [activeExpIdx, setActiveExpIdx] = useState(0);
  const [selectedMass, setSelectedMass] = useState(null);
  const [selectedDeltaT, setSelectedDeltaT] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentExp = LAB_EXPERIMENTS[activeExpIdx];

  const handleStartSim = () => {
    setIsSimulating(true);
    setSimulatedProgress(0);
    setShowResult(false);
  };

  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimulatedProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsSimulating(false);
            setShowResult(true);
            return 100;
          }
          return prev + 4;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Formula Compute Logic
  const computeQ = () => {
    if (activeExpIdx === 0) {
      return (selectedMass || 0) * currentExp.cValue * (selectedDeltaT || 0);
    } else {
      return (selectedMass || 0) * currentExp.uValue;
    }
  };

  const isFormValid = activeExpIdx === 0 ? (selectedMass && selectedDeltaT) : selectedMass;

  return (
    <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
      
      {/* Left Columns: Simulator Panel Configuration */}
      <div className="lg:col-span-5 space-y-4">
        {/* Phase Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-2 flex gap-2">
          {LAB_EXPERIMENTS.map((exp, idx) => (
            <button
              key={exp.id}
              onClick={() => {
                setActiveExpIdx(idx);
                setSelectedMass(null);
                setSelectedDeltaT(null);
                setShowResult(false);
              }}
              className={`flex-1 py-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                activeExpIdx === idx 
                  ? `${exp.badgeColor} text-white shadow-xs` 
                  : "bg-stone-50 text-stone-600 hover:text-stone-900"
              }`}
            >
              Fase {idx + 1}
            </button>
          ))}
        </div>

        {/* Configurations Dashboard */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-stone-900">{currentExp.title}</h3>
            <p className="text-xs text-stone-500 leading-relaxed">{currentExp.description}</p>
          </div>

          <div className="border-t border-stone-100 pt-3 space-y-3">
            <span className="text-xs font-bold text-stone-700 block">Konstanta Fisika:</span>
            <div className="bg-stone-50 rounded-xl p-3 text-[11px] text-stone-600 space-y-1 font-mono">
              <div>Medium Zat: {currentExp.substance}</div>
              {activeExpIdx === 0 ? (
                <div>Kalor Jenis air (c): 4.200 J/kg°C</div>
              ) : (
                <div>Kalor Uap air (U): 2.260.000 J/kg</div>
              )}
              <div className="font-bold text-orange-600 mt-1">Rumus Utama: {currentExp.concept}</div>
            </div>
          </div>

          {/* Mass Input Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 block">Pilih Massa Air (m):</label>
            <div className="grid grid-cols-3 gap-2">
              {currentExp.massaOptions.map(m => (
                <button
                  key={m}
                  onClick={() => { setSelectedMass(m); setShowResult(false); }}
                  className={`py-2 text-xs font-bold border rounded-xl transition-all cursor-pointer ${
                    selectedMass === m 
                      ? "border-orange-500 bg-orange-50 text-orange-700" 
                      : "border-stone-200 bg-white hover:border-stone-300 text-stone-600"
                  }`}
                >
                  {m} kg ({m * 1000}g)
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Delta Selection (Only Phase 1 Sensibel) */}
          {activeExpIdx === 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">Pilih Kenaikan Suhu (ΔT):</label>
              <div className="grid grid-cols-3 gap-2">
                {currentExp.dTValues.map(dt => (
                  <button
                    key={dt}
                    onClick={() => { setSelectedDeltaT(dt); setShowResult(false); }}
                    className={`py-2 text-xs font-bold border rounded-xl transition-all cursor-pointer ${
                      selectedDeltaT === dt 
                        ? "border-orange-500 bg-orange-50 text-orange-700" 
                        : "border-stone-200 bg-white hover:border-stone-300 text-stone-600"
                  }`}
                  >
                    +{dt}°C
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Simulator Button */}
          <button
            disabled={!isFormValid || isSimulating}
            onClick={handleStartSim}
            className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-xs transition-all ${
              isFormValid && !isSimulating
                ? "bg-slate-900 hover:bg-slate-800 cursor-pointer"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            {isSimulating ? "Menghitung Aliran Kalor..." : "Nyalakan Kompor Simulasi 🛠️"}
          </button>
        </div>
      </div>

      {/* Right Columns: Animated Lab Apparatus Render Container */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="bg-white rounded-3xl border border-stone-200/60 p-6 flex-1 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
          
          {/* Apparatus Canvas Vector Setup */}
          <div className="flex items-center gap-10 z-10 w-full justify-center">
            {/* Glass Beaker and Fluid Illustration */}
            <div className="relative flex flex-col items-center">
              <div className="w-28 h-32 border-4 border-b-8 border-stone-400 rounded-b-2xl relative bg-stone-50/20 flex items-end px-1 pb-1">
                {/* Water Volume Render Level */}
                <div 
                  className={`w-full bg-gradient-to-t from-blue-400/50 to-sky-300/40 rounded-b-lg transition-all duration-1000 ease-in-out relative`}
                  style={{ height: selectedMass ? `${(selectedMass / 0.5) * 80}%` : "30%" }}
                >
                  {/* Dynamic Bubbles & Vapor Particle Generation during state changes */}
                  {(isSimulating || (showResult && activeExpIdx === 1)) && (
                    <div className="absolute inset-0 overflow-hidden text-center text-xs space-y-1 animate-pulse pt-2 select-none">
                      <span className="inline-block animate-bounce delay-75 text-sky-500">🫧</span>
                      <span className="inline-block animate-bounce text-sky-400">🫧</span>
                      <span className="inline-block animate-bounce delay-150 text-sky-300">🫧</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Burner Flame Vector Component */}
              <div className="w-20 h-4 bg-stone-300 rounded-md mt-1 border-b border-stone-400" />
              <div className={`w-14 h-12 bg-gradient-to-t from-orange-600 via-amber-500 to-transparent rounded-full blur-xs transition-all duration-300 ${
                isSimulating ? "opacity-100 scale-y-110" : "opacity-0 scale-y-0"
              }`} />
            </div>

            {/* Dynamic Thermometer Readout Component */}
            <div className="flex flex-col items-center">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Termometer</div>
              <div className="text-4xl font-black text-stone-800 tracking-tight mt-1 font-mono">
                {isSimulating 
                  ? `${Math.min(100, Math.round(25 + (simulatedProgress / 100) * (activeExpIdx === 0 ? (selectedDeltaT || 0) : 75)))}°C`
                  : showResult 
                    ? `${activeExpIdx === 0 ? 25 + (selectedDeltaT || 0) : 100}°C` 
                    : "25°C"}
              </div>
              
              {/* Thermometer Stem Design */}
              <div className="w-5 h-36 bg-stone-100 border-2 border-stone-300 rounded-full mt-2 relative p-0.5 overflow-hidden flex flex-col justify-end">
                <div 
                  className="w-full bg-gradient-to-t from-rose-600 to-red-500 rounded-full transition-all duration-500"
                  style={{ 
                    height: isSimulating 
                      ? `${simulatedProgress}%` 
                      : showResult 
                        ? "100%" 
                        : "20%" 
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Results Analytics Display Overlay */}
          {showResult && (
            <div className="w-full mt-6 p-4 rounded-xl border border-blue-100 bg-blue-50/50 animate-fadeIn space-y-1.5">
              <div className="text-[10px] font-mono font-bold tracking-wider text-blue-500">OUTPUT KALOR YANG DISERAP (Q)</div>
              <div className="text-3xl font-black text-blue-700 tracking-tight font-mono">
                {computeQ().toLocaleString("id-ID")} Joule
              </div>
              <div className="text-xs text-slate-700 font-medium bg-white/80 p-3 rounded-lg border border-blue-50">
                <strong>Analisis Sains:</strong> {currentExp.insight}
              </div>
            </div>
          )}
        </div>

        {/* Phase Iteration Button Navigator */}
        {showResult && (
          <div className="animate-fadeIn">
            {activeExpIdx === 0 ? (
              <button 
                onClick={() => {
                  setActiveExpIdx(1);
                  setSelectedMass(null);
                  setSelectedDeltaT(null);
                  setShowResult(false);
                }} 
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Lanjut ke Eksperimen 2: Kalor Laten →
              </button>
            ) : (
              <button 
                onClick={onComplete} 
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Selesai Praktikum & Uji Pemahaman Kuis →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   4. INTERACTIVE QUIZ VIEW COMPONENT
══════════════════════════════════════════════ */
function QuizView({ onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalCorrectCount, setTotalCorrectCount] = useState(0);

  const currentQuestion = QUIZ_BANK[currentIdx];

  const handleOptionClick = (index) => {
    if (!isSubmitted) setSelectedAns(index);
  };

  const handleSubmitAnswer = () => {
    setIsSubmitted(true);
    if (selectedAns === currentQuestion.correct) {
      setTotalCorrectCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < QUIZ_BANK.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAns(null);
      setIsSubmitted(false);
    } else {
      const finalPercentage = Math.round((totalCorrectCount / QUIZ_BANK.length) * 100);
      onComplete(finalPercentage);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full space-y-6 animate-fadeIn">
      {/* Quiz Section Header Meta */}
      <div className="flex items-center justify-between text-xs font-bold text-stone-500 bg-white px-4 py-2 rounded-xl border border-stone-200/40">
        <span>SOAL EVALUASI: {currentIdx + 1} dari {QUIZ_BANK.length}</span>
        <span className="bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded-md">{currentQuestion.level}</span>
      </div>

      {/* Main Card Element Area */}
      <div className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-xs space-y-4">
        <p className="text-sm font-semibold text-stone-900 leading-relaxed">
          {currentQuestion.question}
        </p>

        {/* Radio Matrix Options Setup */}
        <div className="space-y-2.5 pt-2">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAns === idx;
            const isCorrectOption = idx === currentQuestion.correct;
            const isWrongSelection = isSelected && idx !== currentQuestion.correct;

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleOptionClick(idx)}
                className={`w-full p-4 rounded-xl text-left text-xs font-medium border transition-all flex items-start gap-3 cursor-pointer ${
                  isSubmitted
                    ? isCorrectOption
                      ? "border-green-500 bg-green-50/60 text-green-800"
                      : isWrongSelection
                        ? "border-red-500 bg-red-50/60 text-red-800"
                        : "border-stone-100 bg-stone-50/40 text-stone-400"
                    : isSelected
                      ? "border-orange-500 bg-orange-50/30 text-orange-900 font-semibold"
                      : "border-stone-200 bg-white hover:border-stone-300 text-stone-700"
                }`}
              >
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isSubmitted && isCorrectOption ? "bg-green-500 border-green-600 text-white" :
                  isSubmitted && isWrongSelection ? "bg-red-500 border-red-600 text-white" :
                  isSelected ? "bg-orange-500 border-orange-600 text-white" : "bg-stone-50 text-stone-500 border-stone-300"
                }`}>
                  {["A", "B", "C", "D"][idx]}
                </span>
                <span className="leading-relaxed">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Immediate feedback analysis explanation panel cards */}
      {isSubmitted && (
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 animate-slideIn space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold font-brand">
            <span>{selectedAns === currentQuestion.correct ? "✅ Hebat, Jawaban Benar!" : "❌ Kurang Tepat!"}</span>
          </div>
          <p className="text-[11px] text-stone-300 leading-relaxed bg-stone-800/60 p-3 rounded-lg">
            <strong>Kunci Pembahasan:</strong> {currentQuestion.explanation}
          </p>
        </div>
      )}

      {/* Control Navigation Flow Button System */}
      <div className="pt-2">
        {!isSubmitted ? (
          <button
            disabled={selectedAns === null}
            onClick={handleSubmitAnswer}
            className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-xs ${
              selectedAns !== null 
                ? "bg-orange-500 hover:bg-orange-600 cursor-pointer" 
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            Kunci & Kirim Jawaban
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xs cursor-pointer"
          >
            {currentIdx + 1 < QUIZ_BANK.length ? "Lanjut ke Soal Berikutnya →" : "Selesai & Lihat Laporan Kelulusan"}
          </button>
        )}
      </div>
    </div>
  );
}