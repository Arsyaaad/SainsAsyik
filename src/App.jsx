import "./App.css"; 

import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════
   DATA & MATERI FOR LMS (Kurikulum Merdeka / CTL)
══════════════════════════════════════════════ */
const CONTEXTUAL_CHATS = [
  { id: 1, sender: "wakminah", name: "Wak Minah", role: "Pemilik Warung Kopi", avatar: "👵", text: "Bud! Tolong besarkan lagi api kompornya itu. Biar airnya makin cepat mendidih dan kopinya makin mantap panasnya!", delay: 0 },
  { id: 2, sender: "budi", name: "Budi", role: "Siswa SMP (Keponakan)", avatar: "👦", text: "Eh, Wak... kalau airnya sudah mendidih bergolak begitu, mau apinya dibesarkan sampai sebesar api unggun pun suhunya tidak akan naik lagi dari 100°C, lho!", delay: 2000 },
  { id: 3, sender: "wakminah", name: "Wak Minah", role: "Pemilik Warung Kopi", avatar: "👵", text: "Hush, sembarangan kamu Bud! Logika dapur Wak ya kalau api makin besar, pasti airnya makin panas. Kamu ini belajar dari mana?", delay: 4500 },
  { id: 4, sender: "kalo", name: "KALO Bot", role: "Asisten Sains Virtual", avatar: "🤖", text: "Hai Wak Minah & Budi! Budi 100% benar. Ketika air sudah mencapai titik didihnya, kalor yang diberikan kompor bukan lagi digunakan untuk naik suhu, melainkan untuk mengubah wujud zat menjadi uap. Yuk kita pelajari teorinya!", delay: 7000 }
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
    bgColor: "bg-rose-50/30",
    insight: "Q = mcΔT. Semakin besar massa atau kenaikan suhu, semakin banyak kalor yang diserap oleh air."
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
    bgColor: "bg-sky-50/30",
    insight: "Q = m.U. Saat terjadi perubahan wujud zat (mendidih/menguap), SUHU AIR TETAP KONSTAN meskipun kalor terus diberikan!"
  }
];

// BANK SOAL (15 Soal)
const QUIZ_BANK = [
  {
    id: 1, level: "C2 - Pemahaman",
    question: "Mengapa ketika air sudah mendidih bergolak, suhunya cenderung tetap konstan di angka 100°C meskipun nyala api kompor terus dibesarkan?",
    options: [
      "Karena kalor dari api kompor habis diserap oleh dinding panci.",
      "Karena energi digunakan untuk mengubah wujud cair menjadi gas.",
      "Karena air melepaskan dingin ke udara sekitar dengan cepat.",
      "Karena kapasitas kalor jenis air menurun drastis saat mendidih."
    ],
    correct: 1, explanation: "Kalor Laten: Energi panas digunakan untuk fase transisi (mengubah wujud zat), sehingga tidak menambah energi kinetik/suhu."
  },
  {
    id: 2, level: "C3 - Aplikasi",
    question: "Wak Minah memanaskan 0.5 kg air bersuhu 25°C hingga mencapai 75°C. Jika kalor jenis air adalah 4.200 J/kg°C, berapakah kalor yang diserap?",
    options: ["105.000 Joule", "210.000 Joule", "52.500 Joule", "157.500 Joule"],
    correct: 0, explanation: "Q = m·c·ΔT = 0.5 × 4200 × (75-25) = 0.5 × 4200 × 50 = 105.000 Joule."
  },
  {
    id: 3, level: "C4 - Analisis",
    question: "Manakah pernyataan di bawah ini yang paling tepat menggambarkan perbedaan fungsi Kalor Sensibel dan Kalor Laten?",
    options: [
      "Kalor Sensibel mengubah wujud, Kalor Laten mengubah suhu.",
      "Kalor Sensibel berlaku di benda padat, Kalor Laten di benda cair.",
      "Kalor Sensibel mengubah suhu, Kalor Laten mengubah wujud (suhu tetap).",
      "Keduanya memiliki fungsi yang sama namun beda rumus."
    ],
    correct: 2, explanation: "Kalor Sensibel = Suhu naik/turun (ΔT). Kalor Laten = Suhu konstan, tapi wujudnya berubah."
  },
  {
    id: 4, level: "C3 - Aplikasi",
    question: "Jika 0.2 kg air yang sudah mendidih (100°C) ingin diuapkan seluruhnya (U = 2.260.000 J/kg), berapakah kalor yang dibutuhkan?",
    options: ["45.200 Joule", "226.000 Joule", "452.000 Joule", "1.130.000 Joule"],
    correct: 2, explanation: "Menggunakan rumus Kalor Laten Penguapan: Q = m·U = 0.2 × 2.260.000 = 452.000 Joule."
  },
  {
    id: 5, level: "C4 - Analisis",
    question: "Pada grafik pemanasan air (Suhu vs Waktu), garis yang mendatar horizontal pada suhu 100°C menunjukkan...",
    options: [
      "Terjadi pelepasan kalor ke lingkungan.",
      "Suhu air terus naik dengan konstan.",
      "Proses air membeku menjadi es.",
      "Proses air mendidih menyerap Kalor Laten tanpa naik suhu."
    ],
    correct: 3, explanation: "Garis mendatar pada grafik termal menandakan perubahan fase wujud, di mana energi yang diserap adalah Kalor Laten."
  },
  {
    id: 6, level: "C2 - Pemahaman",
    question: "Pernyataan matematis yang paling tepat dari Asas Black adalah...",
    options: ["Q lepas = Q terima", "Q = m·c·ΔT", "m1·c1 = m2·c2", "Q = m·L"],
    correct: 0, explanation: "Asas Black menyatakan bahwa dalam sistem tertutup, kalor yang dilepaskan benda bersuhu tinggi sama dengan kalor yang diterima benda bersuhu rendah."
  },
  {
    id: 7, level: "C4 - Analisis",
    question: "Air 100 gram bersuhu 80°C dicampur dengan air 100 gram bersuhu 20°C. Jika kalor jenis air sama, berapakah suhu campuran akhirnya?",
    options: ["100°C", "60°C", "50°C", "40°C"],
    correct: 2, explanation: "Karena massa dan kalor jenis sama, suhu campurannya adalah nilai tengah: (80+20)/2 = 50°C."
  },
  {
    id: 8, level: "C3 - Aplikasi",
    question: "Untuk menaikkan suhu 1 kg zat cair dari 20°C menjadi 30°C dibutuhkan kalor 40.000 Joule. Berapakah kalor jenis zat cair tersebut?",
    options: ["4.000 J/kg°C", "400 J/kg°C", "2.000 J/kg°C", "8.000 J/kg°C"],
    correct: 0, explanation: "c = Q / (m·ΔT) = 40.000 / (1 × 10) = 4.000 J/kg°C."
  },
  {
    id: 9, level: "C2 - Pemahaman",
    question: "Dalam Satuan Internasional (SI), besaran Kalor (Q) dan Kalor Jenis (c) berturut-turut diukur menggunakan satuan...",
    options: [
      "Joule dan Watt",
      "Kalori dan Joule/kg°C",
      "Joule dan Joule/kg°C",
      "Joule/sekon dan Kelvin"
    ],
    correct: 2, explanation: "Kalor (Q) adalah bentuk energi bersatuan Joule. Kalor Jenis (c) bersatuan Joule/kg°C."
  },
  {
    id: 10, level: "C4 - Analisis",
    question: "Jika Wak Minah terus membesarkan api kompor saat air *sudah* mendidih, apa dampak pastinya pada air di panci?",
    options: [
      "Suhu air akan melebihi 100°C.",
      "Air akan lebih lambat menguap.",
      "Air akan lebih cepat menguap, namun suhu tetap 100°C.",
      "Tidak ada pengaruh apa pun karena sudah mendidih."
    ],
    correct: 2, explanation: "Api besar berarti suplai kalor (Q) lebih cepat. Karena suhu konstan (100°C), kalor itu langsung mengubah wujud air jadi uap lebih cepat."
  },
  {
    id: 11, level: "C2 - Pemahaman",
    question: "Kalor yang diperlukan untuk mengubah wujud zat dari padat menjadi cair (contoh: es mencair) pada titik leburnya disebut...",
    options: ["Kalor Jenis", "Kalor Laten Lebur", "Kalor Laten Uap", "Kalor Sensibel"],
    correct: 1, explanation: "Transisi fase Padat -> Cair membutuhkan Kalor Laten Lebur."
  },
  {
    id: 12, level: "C4 - Analisis",
    question: "Mengapa air lebih lambat panas dibandingkan dengan minyak goreng saat dipanaskan dengan nyala api yang sama besar?",
    options: [
      "Karena air lebih mudah memuai dari minyak.",
      "Karena kalor jenis air jauh lebih besar daripada minyak goreng.",
      "Karena minyak goreng menyerap kalor laten terlebih dahulu.",
      "Karena massa air selalu lebih berat daripada minyak."
    ],
    correct: 1, explanation: "Kalor jenis air (c = 4200 J/kg°C) sangat tinggi, artinya butuh banyak sekali energi hanya untuk menaikkan suhunya 1°C."
  },
  {
    id: 13, level: "C3 - Aplikasi",
    question: "Es batu bermassa 0.5 kg pada suhu 0°C akan dicairkan seluruhnya. Jika Kalor lebur es = 336.000 J/kg, energi kalor yang diperlukan adalah...",
    options: ["168.000 Joule", "336.000 Joule", "672.000 Joule", "16.800 Joule"],
    correct: 0, explanation: "Q = m·L = 0.5 × 336.000 = 168.000 Joule."
  },
  {
    id: 14, level: "C2 - Pemahaman",
    question: "Simbol 'U' atau 'L' pada rumus Q = m·U melambangkan...",
    options: [
      "Usaha mekanik yang dilakukan zat.",
      "Luas permukaan wajan yang digunakan.",
      "Kalor Laten (penguapan/peleburan).",
      "Kenaikan suhu maksimal zat tersebut."
    ],
    correct: 2, explanation: "U (Kalor Uap) atau L (Kalor Lebur) adalah simbol untuk Kalor Laten yang bernilai spesifik untuk tiap zat."
  },
  {
    id: 15, level: "C4 - Analisis",
    question: "Dalam proses pertukaran kalor antara dua benda bersuhu berbeda, proses tersebut akan berhenti (mencapai Asas Black) ketika...",
    options: [
      "Benda yang panas kehabisan massa.",
      "Benda yang dingin sudah mencair.",
      "Suhu lingkungan menjadi lebih dingin.",
      "Kedua benda telah mencapai suhu yang sama (Keseimbangan Termal)."
    ],
    correct: 3, explanation: "Asas Black menghasilkan Keseimbangan Termal, di mana tidak ada lagi perpindahan kalor karena selisih suhu (ΔT) sudah nol."
  }
];

/* ══════════════════════════════════════════════
   MAIN APP COMPONENT
══════════════════════════════════════════════ */
export default function App() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  
  // Menggunakan localStorage agar data tidak hilang saat direfresh
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem("lms_kalor_progress");
    return saved ? JSON.parse(saved) : { info: false, story: false, materi: false, lab: false, quiz: false };
  });
  
  const [quizScore, setQuizScore] = useState(() => {
    const saved = localStorage.getItem("lms_kalor_score");
    return saved ? JSON.parse(saved) : null;
  });

  const [showPopup, setShowPopup] = useState(true);

  // Sync data ke localStorage setiap kali ada perubahan
  useEffect(() => {
    localStorage.setItem("lms_kalor_progress", JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem("lms_kalor_score", JSON.stringify(quizScore));
  }, [quizScore]);

  // Fungsi Reset Data
  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin mereset seluruh progres pembelajaran Anda? Semua data akan dihapus.")) {
      setUserProgress({ info: false, story: false, materi: false, lab: false, quiz: false });
      setQuizScore(null);
      setCurrentTab("dashboard");
      localStorage.removeItem("lms_kalor_progress");
      localStorage.removeItem("lms_kalor_score");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 antialiased flex flex-col selection:bg-amber-200 relative">
      
      {showPopup && <DeveloperPopup onClose={() => setShowPopup(false)} />}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/60 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-xl shadow-sm shadow-orange-500/20">
              🔥
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 font-brand">SainsAsyik: LMS Kalor</h1>
              <p className="text-xs text-stone-500">Modul Pembelajaran Fisika Kontekstual - SMP Kelas VII</p>
            </div>
          </div>
          
          <nav className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/40 overflow-x-auto w-full md:w-auto hide-scrollbar">
            {[
              { id: "dashboard", label: "Beranda", icon: "📊" },
              { id: "info", label: "CP & TP", icon: "📋" },
              { id: "story", label: "Cerita", icon: "💬" },
              { id: "materi", label: "Materi", icon: "📚" },
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

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col justify-start">
        {currentTab === "dashboard" && (
          <DashboardView progress={userProgress} quizScore={quizScore} startModule={setCurrentTab} onReset={handleReset} />
        )}
        {currentTab === "info" && (
          <LearningObjectivesScreen onComplete={() => { setUserProgress(p => ({ ...p, info: true })); setCurrentTab("story"); }} />
        )}
        {currentTab === "story" && (
          <StoryView onComplete={() => { setUserProgress(p => ({ ...p, story: true })); setCurrentTab("materi"); }} />
        )}
        {currentTab === "materi" && (
          <TheoryView onComplete={() => { setUserProgress(p => ({ ...p, materi: true })); setCurrentTab("lab"); }} />
        )}
        {currentTab === "lab" && (
          <LabView onComplete={() => { setUserProgress(p => ({ ...p, lab: true })); setCurrentTab("quiz"); }} />
        )}
        {currentTab === "quiz" && (
          <QuizView onComplete={(score) => { setQuizScore(score); setUserProgress(p => ({ ...p, quiz: true })); setCurrentTab("dashboard"); }} />
        )}
        {currentTab === "developer" && (
          <DeveloperView />
        )}
      </main>

      <footer className="bg-stone-900 text-stone-400 py-6 text-center text-xs mt-12 border-t border-stone-800">
        <p className="font-medium text-stone-300">Didesain untuk Media Pembelajaran Fisika SMP - Materi Suhu & Kalor</p>
        <p className="text-stone-500 mt-1">© 2026 SainsAsyik LMS Platform. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DEVELOPER POPUP & VIEW
══════════════════════════════════════════════ */
function DeveloperPopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-stone-200/50 relative text-center">
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
          Masuk ke Dashboard Belajar
        </button>
      </div>
    </div>
  );
}

function DeveloperView() {
  return (
    <div className="max-w-3xl mx-auto w-full mt-4 animate-fadeIn">
      <div className="bg-white rounded-3xl border border-stone-200/60 shadow-xs overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-2xl p-1 shadow-md rotate-3">
            <div className="w-full h-full bg-stone-100 rounded-xl flex items-center justify-center text-4xl border border-stone-200">
              👨‍💻
            </div>
          </div>
        </div>
        
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
              Aplikasi <em>SainsAsyik: LMS Kalor</em> ini dirancang khusus untuk membawa konsep Fisika yang abstrak menjadi lebih nyata dan kontekstual. Dengan mengintegrasikan cerita kehidupan sehari-hari (seperti Dapur Wak Minah) dan simulasi praktikum virtual, diharapkan siswa SMP dapat lebih mudah menguasai materi Suhu, Kalor Sensibel, dan Kalor Laten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SCREEN 1: CP, TP, & PETA KONSEP (REVISED)
══════════════════════════════════════════════ */
function LearningObjectivesScreen({ onComplete }) {
  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">Sebelum Belajar Mulai</span>
        <h2 className="text-3xl font-black text-stone-900 font-brand mt-2">Target & Peta Pembelajaran</h2>
        <p className="text-xs text-stone-500 mt-1">Pahami capaian, tujuan pembelajaran, dan alur materi kalor berikut ini.</p>
      </div>

      <div className="space-y-6">
        {/* Row 1: CP & TP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-xs h-full">
            <div className="flex items-center gap-2 mb-2 text-orange-600 font-bold text-sm">
              <span>🎯</span>
              <h4>A. Capaian Pembelajaran (CP)</h4>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-100">
              Peserta didik dapat menjelaskan pengertian kalor, Asas Black dan penerapannya dalam perubahan suhu dan wujud, serta dapat menguraikan pemuaian panjang, luas, dan volume.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-xs h-full">
            <div className="flex items-center gap-2 mb-3 text-blue-600 font-bold text-sm">
              <span>📋</span>
              <h4>B. Tujuan Pembelajaran (TP)</h4>
            </div>
            <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <div className="p-3 bg-blue-50/40 rounded-xl border border-blue-100/50">
                <span className="font-bold text-blue-700 block mb-1">1. Materi Kalor Laten (Pemahaman - C2)</span>
                Peserta didik dapat menjelaskan mengapa suhu air tetap konstan saat mendidih meskipun pemanasan terus dilakukan.
              </div>
              <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100/50">
                <span className="font-bold text-rose-700 block mb-1">2. Materi Kalor Sensibel (Aplikasi - C3)</span>
                Peserta didik dapat menghitung besarnya energi kalor yang dibutuhkan untuk menaikkan suhu suatu zat.
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Peta Konsep Full Width Berdasarkan Gambar */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-6 text-emerald-600 font-bold text-sm">
            <span>🗺️</span>
            <h4>C. Peta Konsep Materi</h4>
          </div>
          
          <div className="w-full overflow-x-auto pb-4 hide-scrollbar bg-[#FAF9F5] rounded-xl border border-stone-200 p-6 shadow-inner">
            <div className="min-w-[700px] flex flex-col items-center">
              
              {/* Root */}
              <div className="bg-stone-800 text-white font-bold text-[12px] px-8 py-2.5 rounded-lg shadow-sm border border-stone-900 z-10">
                SUHU, KALOR DAN PEMUAIAN
              </div>

              {/* Vertical Trunk & Horizontal Branching */}
              <div className="w-px h-6 bg-stone-400"></div>
              <div className="w-full max-w-[620px] h-px bg-stone-400 relative"></div>
              <div className="w-full max-w-[620px] flex justify-between">
                <div className="w-px h-6 bg-stone-400"></div>
                <div className="w-px h-6 bg-stone-400"></div>
                <div className="w-px h-6 bg-stone-400"></div>
              </div>

              {/* Tiga Cabang Utama */}
              <div className="w-full max-w-[680px] flex justify-between gap-4 items-start">
                
                {/* Cabang 1: SUHU */}
                <div className="flex flex-col items-center w-[30%]">
                  <div className="bg-white border-2 border-rose-300 text-rose-700 font-bold text-[11px] px-6 py-2 rounded-md mb-4 w-full text-center shadow-xs">SUHU</div>
                  
                  <div className="flex gap-2 w-full justify-center relative">
                    <div className="absolute -top-4 w-[60%] h-px bg-stone-400"></div>
                    <div className="absolute -top-4 left-[20%] w-px h-4 bg-stone-400"></div>
                    <div className="absolute -top-4 right-[20%] w-px h-4 bg-stone-400"></div>

                    <div className="flex flex-col items-center w-1/2">
                      <span className="text-[9px] text-stone-500 mb-1">diukur dengan</span>
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 text-[10px] py-1.5 px-2 rounded-md text-center w-full">Termometer</div>
                    </div>
                    <div className="flex flex-col items-center w-1/2">
                      <span className="text-[9px] text-transparent mb-1">-</span>
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 text-[10px] py-1.5 px-2 rounded-md text-center w-full">Skala Suhu</div>
                    </div>
                  </div>
                </div>

                {/* Cabang 2: KALOR */}
                <div className="flex flex-col items-center w-[40%]">
                  <div className="bg-white border-2 border-sky-300 text-sky-700 font-bold text-[11px] px-6 py-2 rounded-md mb-4 w-full text-center shadow-xs">KALOR</div>
                  
                  <div className="flex gap-2 w-full justify-between relative">
                    <div className="absolute -top-4 w-[80%] left-[10%] h-px bg-stone-400"></div>
                    <div className="absolute -top-4 left-[10%] w-px h-4 bg-stone-400"></div>
                    <div className="absolute -top-4 left-1/2 w-px h-4 bg-stone-400"></div>
                    <div className="absolute -top-4 right-[10%] w-px h-4 bg-stone-400"></div>

                    <div className="flex flex-col items-center w-1/3">
                      <div className="bg-sky-50 border border-sky-200 text-sky-800 text-[10px] py-1.5 px-1 rounded-md text-center w-full min-h-[40px] flex items-center justify-center">Perpindahan Kalor</div>
                      <div className="w-px h-4 bg-stone-400"></div>
                      <div className="bg-sky-100 border border-sky-300 text-sky-900 text-[9px] py-1.5 px-1 rounded-md text-center w-full">Konduksi, Konveksi, Radiasi</div>
                    </div>
                    
                    <div className="flex flex-col items-center w-1/3">
                      <div className="bg-sky-50 border border-sky-200 text-sky-800 text-[10px] py-1.5 px-1 rounded-md text-center w-full min-h-[40px] flex items-center justify-center">Mengubah Suhu Zat</div>
                    </div>

                    <div className="flex flex-col items-center w-1/3">
                      <div className="bg-sky-50 border border-sky-200 text-sky-800 text-[10px] py-1.5 px-1 rounded-md text-center w-full min-h-[40px] flex items-center justify-center">Mengubah Wujud Zat</div>
                      <div className="w-px h-4 bg-stone-400"></div>
                      <div className="bg-sky-100 border border-sky-300 text-sky-900 text-[9px] py-1.5 px-1 rounded-md text-center w-full">Mencair, Membeku, Menguap, Mengembun, Menyublim, Mengkristal</div>
                    </div>
                  </div>
                </div>

                {/* Cabang 3: PEMUAIAN */}
                <div className="flex flex-col items-center w-[30%]">
                  <div className="bg-white border-2 border-emerald-300 text-emerald-700 font-bold text-[11px] px-6 py-2 rounded-md mb-4 w-full text-center shadow-xs">PEMUAIAN</div>
                  
                  <div className="flex gap-2 w-full justify-between relative">
                    <div className="absolute -top-4 w-[70%] left-[15%] h-px bg-stone-400"></div>
                    <div className="absolute -top-4 left-[15%] w-px h-4 bg-stone-400"></div>
                    <div className="absolute -top-4 left-1/2 w-px h-4 bg-stone-400"></div>
                    <div className="absolute -top-4 right-[15%] w-px h-4 bg-stone-400"></div>

                    <div className="flex flex-col items-center w-1/3">
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] py-1.5 px-1 rounded-md text-center w-full min-h-[40px] flex items-center justify-center">Pemuaian Zat Padat</div>
                      <div className="w-px h-4 bg-stone-400"></div>
                      <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 text-[9px] py-1.5 px-1 rounded-md text-center w-full">Panjang, Luas, Volume</div>
                    </div>

                    <div className="flex flex-col items-center w-1/3">
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] py-1.5 px-1 rounded-md text-center w-full min-h-[40px] flex items-center justify-center">Pemuaian Zat Cair</div>
                    </div>

                    <div className="flex flex-col items-center w-1/3">
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] py-1.5 px-1 rounded-md text-center w-full min-h-[40px] flex items-center justify-center">Pemuaian Zat Gas</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <button onClick={onComplete} className="w-full mt-6 py-4 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all text-center active:scale-95">
            Mulai Belajar Masuk Cerita →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SCREEN 2: CONTEXTUAL STORY
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
      <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 text-xs text-amber-900 leading-relaxed shadow-sm">
        <strong>Skenario Kehidupan Nyata:</strong> Pagi hari di warung kopi tradisional, Budi memperhatikan neneknya sedang merebus air untuk kopi tubruk pesanan pelanggan dengan api maksimal padahal air sudah mendidih.
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/70 shadow-md overflow-hidden flex flex-col h-[480px]">
        <div className="bg-stone-50 border-b border-stone-200/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-stone-700">Grup Keluarga: Dapur Wak Minah</span>
          </div>
          <span className="text-[10px] bg-stone-200 text-stone-600 font-bold px-2 py-0.5 rounded-md">Live Room</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF9F5]">
          {CONTEXTUAL_CHATS.slice(0, activeMessageIndex + 1).map((msg) => {
            const isWak = msg.sender === "wakminah";
            const isKalo = msg.sender === "kalo";

            return (
              <div key={msg.id} className={`flex gap-3 animate-slideIn ${isWak ? "flex-row" : isKalo ? "flex-row" : "flex-row-reverse"}`}>
                <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-lg shrink-0">
                  {msg.avatar}
                </div>
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

      {activeMessageIndex === CONTEXTUAL_CHATS.length - 1 && (
        <div className="text-center animate-fadeIn">
          <button onClick={onComplete} className="px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-all active:scale-98">
            Baca Materi: Kenapa Suhu Konstan? 📚
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   SCREEN 3: MATERI PEMBELAJARAN
══════════════════════════════════════════════ */
function TheoryView({ onComplete }) {
  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 animate-fadeIn pb-8">
      
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Ruang Teori</span>
        <h2 className="text-3xl font-black text-stone-900 font-brand mt-2">Kupas Tuntas: Energi Kalor</h2>
        <p className="text-sm text-stone-500 mt-2 leading-relaxed">
          Menjawab misteri mengapa air mendidih suhunya tidak bisa naik lagi meskipun dipanaskan terus-menerus oleh Wak Minah.
        </p>
      </div>

      <div className="bg-white rounded-3xl border-2 border-rose-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-rose-50 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-rose-100">
          <div className="text-6xl mb-4">🌡️</div>
          <h3 className="text-xl font-black text-rose-700 font-brand mb-1">Kalor Sensibel</h3>
          <p className="text-xs text-rose-600 font-medium bg-rose-100 px-3 py-1 rounded-full">Sang Pengubah Suhu</p>
        </div>
        <div className="md:w-2/3 p-6 md:p-8 space-y-4">
          <p className="text-sm text-stone-600 leading-relaxed">
            Pernahkah kamu memanaskan air dingin untuk mandi? Nah, panas yang membuat air tersebut dari dingin menjadi hangat hingga panas itulah yang disebut <strong>Kalor Sensibel</strong>. Kalor ini bekerja semata-mata untuk menaikkan (atau menurunkan) energi kinetik partikel sehingga <strong>Suhunya Berubah</strong>.
          </p>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">Persamaan Matematis:</span>
            <div className="font-mono text-xl md:text-2xl font-black text-rose-600 tracking-wider">
              Q = m · c · ΔT
            </div>
            <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-600">
              <li><strong>Q</strong> = Energi Kalor (Joule)</li>
              <li><strong>m</strong> = Massa Zat (kg)</li>
              <li><strong>c</strong> = Kalor Jenis Zat (J/kg°C)</li>
              <li><strong>ΔT</strong> = Perubahan Suhu (°C)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-sky-100 shadow-sm overflow-hidden flex flex-col md:flex-row-reverse">
        <div className="md:w-1/3 bg-sky-50 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-l border-sky-100">
          <div className="text-6xl mb-4">💨</div>
          <h3 className="text-xl font-black text-sky-700 font-brand mb-1">Kalor Laten</h3>
          <p className="text-xs text-sky-600 font-medium bg-sky-100 px-3 py-1 rounded-full">Sang Pengubah Wujud</p>
        </div>
        <div className="md:w-2/3 p-6 md:p-8 space-y-4">
          <p className="text-sm text-stone-600 leading-relaxed">
            Inilah jawaban untuk Wak Minah! Saat air mencapai 100°C, air sudah "mentok" panasnya. Jika kompor terus menyala, kalor tersebut tidak lagi menaikkan suhu, melainkan dipakai untuk menghancurkan ikatan air agar menguap menjadi gas. Kalor yang "tersembunyi" untuk mengubah fase zat ini disebut <strong>Kalor Laten</strong>, dan <strong>Suhunya Tetap Konstan</strong>.
          </p>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">Persamaan Matematis:</span>
            <div className="font-mono text-xl md:text-2xl font-black text-sky-600 tracking-wider">
              Q = m · L
            </div>
            <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-600">
              <li><strong>Q</strong> = Energi Kalor (Joule)</li>
              <li><strong>m</strong> = Massa Zat (kg)</li>
              <li><strong>L</strong> = Kalor Laten (J/kg) <br/> <span className="text-[10px] text-stone-400">(Bisa berupa kalor Lebur atau kalor Uap)</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-amber-100 border border-amber-300 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
        <div className="text-3xl">💡</div>
        <div>
          <h4 className="font-bold text-amber-900 mb-1">Kesimpulan Kasus Budi vs Wak Minah</h4>
          <p className="text-sm text-amber-800 leading-relaxed">
            Tindakan Wak Minah membesarkan api saat air sudah mendidih hanya akan <strong>mempercepat air habis menguap</strong> (Kalor Laten), bukan membuatnya lebih panas dari 100°C. Budi benar secara sains!
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <button onClick={onComplete} className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-md cursor-pointer transition-all active:scale-95 uppercase tracking-wider">
          Materi Dipahami, Lanjut ke Lab Simulasi 🧪
        </button>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════
   SCREEN 4: LAB SIMULATION
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
      }, 40);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

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
      <div className="lg:col-span-5 space-y-4">
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

        <div className="bg-white rounded-2xl border border-stone-200/60 p-5 space-y-4 shadow-xs">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-stone-900">{currentExp.title}</h3>
            <p className="text-xs text-stone-500 leading-relaxed">{currentExp.description}</p>
          </div>

          <div className="border-t border-stone-100 pt-3 space-y-3">
            <span className="text-xs font-bold text-stone-700 block">Konstanta Fisika (Sesuai Materi):</span>
            <div className="bg-stone-50 rounded-xl p-3 text-[11px] text-stone-600 space-y-1 font-mono border border-stone-100">
              <div>Medium Zat: {currentExp.substance}</div>
              {activeExpIdx === 0 ? (
                <div>Kalor Jenis air (c): 4.200 J/kg°C</div>
              ) : (
                <div>Kalor Uap air (L): 2.260.000 J/kg</div>
              )}
              <div className="font-bold text-orange-600 mt-1">Rumus Digunakan: {currentExp.concept}</div>
            </div>
          </div>

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
                  {m} kg
                </button>
              ))}
            </div>
          </div>

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

          <button
            disabled={!isFormValid || isSimulating}
            onClick={handleStartSim}
            className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-xs transition-all mt-4 ${
              isFormValid && !isSimulating
                ? "bg-slate-900 hover:bg-slate-800 cursor-pointer"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            {isSimulating ? "Menghitung Kalor..." : "Mulai Simulasi Kompor 🛠️"}
          </button>
        </div>
      </div>

      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="bg-white rounded-3xl border border-stone-200/60 p-6 flex-1 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden shadow-xs">
          <div className="flex items-center gap-10 z-10 w-full justify-center">
            <div className="relative flex flex-col items-center">
              <div className="w-28 h-32 border-4 border-b-8 border-stone-400 rounded-b-2xl relative bg-stone-50/20 flex items-end px-1 pb-1">
                <div 
                  className={`w-full bg-gradient-to-t from-blue-400/50 to-sky-300/40 rounded-b-lg transition-all duration-1000 ease-in-out relative`}
                  style={{ height: selectedMass ? `${(selectedMass / 0.5) * 80}%` : "30%" }}
                >
                  {(isSimulating || (showResult && activeExpIdx === 1)) && (
                    <div className="absolute inset-0 overflow-hidden text-center text-xs space-y-1 animate-pulse pt-2 select-none">
                      <span className="inline-block animate-bounce delay-75 text-sky-500">🫧</span>
                      <span className="inline-block animate-bounce text-sky-400">🫧</span>
                      <span className="inline-block animate-bounce delay-150 text-sky-300">🫧</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-20 h-4 bg-stone-300 rounded-md mt-1 border-b border-stone-400" />
              <div className={`w-14 h-12 bg-gradient-to-t from-orange-600 via-amber-500 to-transparent rounded-full blur-xs transition-all duration-300 ${
                isSimulating ? "opacity-100 scale-y-110" : "opacity-0 scale-y-0"
              }`} />
            </div>

            <div className="flex flex-col items-center">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest font-mono">Termometer</div>
              <div className="text-4xl font-black text-stone-800 tracking-tight mt-1 font-mono">
                {isSimulating 
                  ? `${Math.min(100, Math.round(25 + (simulatedProgress / 100) * (activeExpIdx === 0 ? (selectedDeltaT || 0) : 75)))}°C`
                  : showResult 
                    ? `${activeExpIdx === 0 ? 25 + (selectedDeltaT || 0) : 100}°C` 
                    : "25°C"}
              </div>
              <div className="w-5 h-36 bg-stone-100 border-2 border-stone-300 rounded-full mt-2 relative p-0.5 overflow-hidden flex flex-col justify-end shadow-inner">
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

          {showResult && (
            <div className="w-full mt-8 p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5 animate-fadeIn">
              <div className="text-[10px] font-mono font-bold tracking-wider text-blue-500">HASIL PERHITUNGAN ENERGI (Q)</div>
              <div className="text-3xl font-black text-blue-700 tracking-tight font-mono">
                {computeQ().toLocaleString("id-ID")} Joule
              </div>
              <div className="text-xs text-slate-700 font-medium bg-white/80 p-3 rounded-lg border border-blue-100 mt-2">
                <strong>💡 Analisis:</strong> {currentExp.insight}
              </div>
            </div>
          )}
        </div>

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
                className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm"
              >
                Lanjut ke Fase 2: Kalor Laten →
              </button>
            ) : (
              <button 
                onClick={onComplete} 
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow-sm"
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
   SCREEN 5: QUIZ EVALUATION (RANDOMIZED 10/15)
══════════════════════════════════════════════ */
function QuizView({ onComplete }) {
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [totalCorrectCount, setTotalCorrectCount] = useState(0);

  useEffect(() => {
    const shuffleArray = (array) => {
      let newArr = [...array];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };
    
    // Pilih 10 soal unik secara acak
    const randomized = shuffleArray(QUIZ_BANK).slice(0, 10);
    setActiveQuestions(randomized);
  }, []);

  if (activeQuestions.length === 0) return null;

  const currentQuestion = activeQuestions[currentIdx];

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
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAns(null);
      setIsSubmitted(false);
    } else {
      const finalPercentage = Math.round((totalCorrectCount / activeQuestions.length) * 100);
      onComplete(finalPercentage);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between text-xs font-bold text-stone-500 bg-white px-4 py-2 rounded-xl border border-stone-200/40 shadow-xs">
        <span>SOAL EVALUASI: {currentIdx + 1} dari {activeQuestions.length}</span>
        <span className="bg-amber-100 text-amber-800 font-mono px-2 py-0.5 rounded-md">{currentQuestion.level}</span>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-sm space-y-4">
        <p className="text-sm font-semibold text-stone-900 leading-relaxed">
          {currentQuestion.question}
        </p>

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

      {isSubmitted && (
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 space-y-2 animate-slideIn shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold font-brand tracking-wide">
            <span>{selectedAns === currentQuestion.correct ? "✅ HEBAT, JAWABAN BENAR!" : "❌ KURANG TEPAT!"}</span>
          </div>
          <p className="text-[11px] text-stone-300 leading-relaxed bg-stone-800/60 p-3 rounded-lg border border-stone-700">
            <strong>Kunci Pembahasan:</strong> {currentQuestion.explanation}
          </p>
        </div>
      )}

      <div className="pt-2">
        {!isSubmitted ? (
          <button
            disabled={selectedAns === null}
            onClick={handleSubmitAnswer}
            className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-xs transition-all ${
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
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xs cursor-pointer transition-all"
          >
            {currentIdx + 1 < activeQuestions.length ? "Lanjut ke Soal Berikutnya →" : "Selesai & Lihat Laporan"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   DASHBOARD VIEW (WITH PERFORMANCE REPORT & RESET)
══════════════════════════════════════════════ */
function DashboardView({ progress, quizScore, startModule, onReset }) {
  const getProgressPercent = () => {
    let count = 0;
    if (progress.info) count += 20;
    if (progress.story) count += 20;
    if (progress.materi) count += 20;
    if (progress.lab) count += 20;
    if (progress.quiz) count += 20;
    return count;
  };

  const isComplete = getProgressPercent() === 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full animate-fadeIn">
      
      {/* Tombol Reset */}
      <div className="flex justify-end">
        <button onClick={onReset} className="text-[10px] uppercase tracking-widest bg-rose-50 text-rose-600 px-4 py-2 rounded-lg font-bold hover:bg-rose-100 border border-rose-200 transition-all cursor-pointer">
          🔄 Reset Semua Progres Belajar
        </button>
      </div>

      {/* Tampilkan Laporan Hasil Evaluasi jika selesai 100% */}
      {isComplete ? (
        <PerformanceReport score={quizScore} />
      ) : (
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent rounded-3xl p-6 border border-amber-500/20 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="text-5xl drop-shadow-md">☕</div>
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-stone-900 font-brand">Selamat Datang di Modul Fisika!</h2>
            <p className="text-sm text-stone-600 max-w-xl">
              Mari pelajari rahasia sains Suhu & Kalor dengan membantu Wak Minah memasak air di dapur agar hemat gas elpiji.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs flex flex-col justify-between hover:border-orange-200 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">📋</span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${progress.info ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {progress.info ? "Selesai" : "Belum Mulai"}
              </span>
            </div>
            <h3 className="font-bold text-sm text-stone-900 font-brand">1. Target Belajar</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">Capaian Pembelajaran (CP) dan Peta Konsep Kalor.</p>
          </div>
          <button onClick={() => startModule("info")} className="w-full mt-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
            {progress.info ? "Lihat Ulang" : "Mulai Modul 1"}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs flex flex-col justify-between hover:border-orange-200 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">💬</span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${progress.story ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {progress.story ? "Selesai" : "Belum Mulai"}
              </span>
            </div>
            <h3 className="font-bold text-sm text-stone-900 font-brand">2. Kasus Cerita</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">Diskusi seru antara Wak Minah dan Budi.</p>
          </div>
          <button onClick={() => startModule("story")} className="w-full mt-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
            {progress.story ? "Baca Ulang" : "Mulai Modul 2"}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs flex flex-col justify-between hover:border-orange-200 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">📚</span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${progress.materi ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {progress.materi ? "Selesai" : "Belum Mulai"}
              </span>
            </div>
            <h3 className="font-bold text-sm text-stone-900 font-brand">3. Materi Teori</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">Kupas tuntas rumus dan fungsi perpindahan kalor.</p>
          </div>
          <button onClick={() => startModule("materi")} className="w-full mt-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
            {progress.materi ? "Baca Ulang" : "Mulai Modul 3"}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs flex flex-col justify-between hover:border-orange-200 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🧪</span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${progress.lab ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {progress.lab ? "Selesai" : "Belum Mulai"}
              </span>
            </div>
            <h3 className="font-bold text-sm text-stone-900 font-brand">4. Lab Simulasi</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">Praktikum virtual menghitung Q di atas kompor.</p>
          </div>
          <button onClick={() => startModule("lab")} className="w-full mt-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
            {progress.lab ? "Eksperimen Ulang" : "Mulai Modul 4"}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs flex flex-col justify-between hover:border-orange-200 transition-colors md:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🏆</span>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${progress.quiz ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {progress.quiz ? "Selesai" : "Belum Mulai"}
              </span>
            </div>
            <h3 className="font-bold text-sm text-stone-900 font-brand">5. Kuis Evaluasi</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">Uji penguasaan konsep fisika Anda melalui kuis acak.</p>
          </div>
          <button onClick={() => startModule("quiz")} className="w-full mt-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm">
            {progress.quiz ? `Ulangi (Skor Terakhir: ${quizScore}%)` : "Mulai Ujian"}
          </button>
        </div>

      </div>

      <div className="bg-white rounded-2xl p-5 border border-stone-200/60 shadow-xs space-y-2">
        <div className="flex justify-between text-xs font-bold text-stone-600">
          <span>Total Progres Pembelajaran Modul</span>
          <span>{getProgressPercent()}%</span>
        </div>
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-700" style={{ width: `${getProgressPercent()}%` }} />
        </div>
      </div>
    </div>
  );
}

// Komponen Evaluasi Akhir (Tampil saat progress 100%)
function PerformanceReport({ score }) {
  let predikat = "";
  let pesan = "";
  
  if (score >= 90) { 
    predikat = "Sangat Baik"; 
    pesan = "Luar biasa! Pemahaman Anda tentang Suhu, Kalor, dan Pemuaian sangat mantap. Anda sudah seperti ilmuwan fisika!"; 
  } else if (score >= 70) { 
    predikat = "Baik"; 
    pesan = "Bagus sekali! Anda sudah memahami konsep dasar dengan baik, mari pertahankan dan tingkatkan lagi detailnya."; 
  } else { 
    predikat = "Perlu Peningkatan"; 
    pesan = "Jangan menyerah! Fisika butuh pembiasaan. Silakan ulangi materi dan uji kuis ini kembali, soalnya pasti berubah kok."; 
  }

  return (
    <div className="bg-gradient-to-tr from-sky-600 to-blue-800 rounded-3xl p-6 md:p-8 text-white shadow-lg space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 text-8xl opacity-10 rotate-12">🎓</div>
      
      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-black font-brand mb-1">🎉 Selamat, Evaluasi Selesai!</h3>
        <p className="text-sm text-sky-100 mb-6">Berikut adalah laporan hasil performa belajar Anda secara keseluruhan:</p>
        
        <div className="grid grid-cols-2 gap-4 md:gap-6 mt-4">
          <div className="bg-white/10 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/20">
            <div className="text-[10px] md:text-xs uppercase tracking-widest mb-1 text-sky-200 font-bold">Skor Evaluasi (10 Soal Acak)</div>
            <div className="text-4xl font-black">{score}%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 md:p-5 rounded-2xl border border-white/20">
            <div className="text-[10px] md:text-xs uppercase tracking-widest mb-1 text-sky-200 font-bold">Predikat Pencapaian</div>
            <div className="text-xl md:text-2xl font-black mt-1 leading-tight">{predikat}</div>
          </div>
        </div>
        
        <div className="bg-sky-900/40 p-4 rounded-xl text-sm italic border border-sky-400/20 mt-6 leading-relaxed">
          " {pesan} "
        </div>
      </div>
    </div>
  );
}