import React, { useState } from "react";
import { 
  BookOpen, 
  GraduationCap, 
  MessageSquare, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Bot, 
  Sparkles, 
  RefreshCw, 
  HelpCircle,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EduChatMsg {
  id: string;
  role: "user" | "asisten";
  content: string;
  chapters?: string[];
  tip?: string;
  timestamp: string;
}

const LESSON_CHAPTERS = [
  {
    id: "bab-1",
    title: "Bab 1: Prinsip Dasar PHT",
    icon: "🌱",
    summary: "Konsep dasar kelestarian lingkungan dan 4 pilar kekuatan petani.",
    details: [
      {
        sub: "Definisi PHT",
        desc: "Pengendalian Hama Terpadu (PHT) adalah konsep pengendalian hama yang mengutamakan kelestarian lingkungan dengan memadukan berbagai metode ramah lingkungan secara sinergis. Tujuannya adalah menjaga populasi hama tetap di bawah Ambang Batas Ekonomi, bukan memusnahkannya hingga nol ekor."
      },
      {
        sub: "Prinsip 1: Budidaya Tanaman Sehat",
        desc: "Menggunakan benih unggul tahan hama, pemupukan berimbang, serta sanitasi lahan. Tanaman yang sehat memiliki imunitas alami yang lebih kuat terhadap gangguan hama."
      },
      {
        sub: "Prinsip 2: Pelestarian Musuh Alami",
        desc: "Melindungi organisme predator dan parasitoid di lahan dengan cara meminimalkan penggunaan pestisida kimia sintetis yang bisa membunuh mereka secara serampangan."
      },
      {
        sub: "Prinsip 3: Pengamatan Rutin (Monitoring)",
        desc: "Melakukan pemantauan lahan minimal seminggu sekali untuk mengamati perkembangan populasi hama dan musuh alami secara real-time."
      },
      {
        sub: "Prinsip 4: Petani Menjadi Ahli PHT",
        desc: "Petani diberdayakan agar mandiri dalam menganalisis kondisi ekologi lahan dan mengambil keputusan pengendalian terbaik secara mandiri."
      }
    ]
  },
  {
    id: "bab-2",
    title: "Bab 2: Mengenal Musuh Alami (Sahabat Petani)",
    icon: "🐞",
    summary: "Predator, parasitoid, dan agens hayati pembasmi hama biologis.",
    details: [
      {
        sub: "1. Predator (Pemangsa)",
        desc: "Serangga atau hewan yang langsung memburu dan memakan hama tanaman. Contohnya: Laba-laba Serigala (Lycosa pseudoannulata) pemangsa wereng, Kepik Mirid (Cyrtorhinus lividipennis) penyedot telur wereng, Kumbang Kubah (Coccinellidae) pemakan kutu daun, serta Semut Rangrang pemakan berbagai ulat daun."
      },
      {
        sub: "2. Parasitoid",
        desc: "Serangga yang meletakkan telurnya di dalam atau pada tubuh hama (inang). Larva parasitoid akan menetas dan perlahan memakan jaringan tubuh inang hingga mati. Contohnya: Tawon Trichogramma spp. (parasitoid telur penggerek batang padi) dan Diadegma semiclausum (parasitoid larva ulat kubis Plutella xylostella)."
      },
      {
        sub: "3. Patogen / Agens Hayati",
        desc: "Mikroorganisme (jamur, bakteri, virus) yang menyebabkan penyakit mematikan pada hama. Contohnya: Jamur Beauveria bassiana (menginfeksi wereng dan kutu-kutuan), Bakteri Bacillus thuringiensis / Bt (menghasilkan kristal protein racun yang merusak pencernaan ulat daun), serta virus Sl-NPV (Spodoptera litura Nuclear Polyhedrovirus) spesifik untuk membasmi ulat grayak."
      }
    ]
  },
  {
    id: "bab-3",
    title: "Bab 3: Ambang Batas Ekonomi (AE) & Ambang Kendali",
    icon: "📊",
    summary: "Menghitung batas kewajaran populasi sebelum bertindak.",
    details: [
      {
        sub: "Konsep Ambang Ekonomi",
        desc: "Batas kepadatan populasi hama yang memerlukan tindakan pengendalian untuk mencegah terjadinya kerugian ekonomi yang lebih besar daripada biaya pengendalian itu sendiri."
      },
      {
        sub: "Wereng Batang Cokelat (WBC - Nilaparvata lugens) pada Padi",
        desc: "Pengendalian kimiawi baru boleh dilakukan jika populasi wereng melampaui rata-rata 15 ekor per rumpun pada tanaman berumur kurang dari 40 HST (Hari Setelah Tanam), atau lebih dari 20 ekor per rumpun pada tanaman berumur lebih dari 40 HST."
      },
      {
        sub: "Ulat Grayak Frugiperda (FAW - Spodoptera frugiperda) pada Jagung",
        desc: "Ambang batas kendali tercapai jika intensitas kerusakan daun tanaman muda (fase vegetatif) telah mencapai lebih dari 20% dari total populasi tanaman contoh yang diamati."
      },
      {
        sub: "Walang Sangit (Leptocorisa oratorius) pada Padi",
        desc: "Batas kendali adalah jika ditemukan lebih dari 6 ekor walang sangit per meter persegi pada fase masak susu bulir padi."
      }
    ]
  },
  {
    id: "bab-4",
    title: "Bab 4: Pengendalian Kimiawi Secara Bijaksana",
    icon: "🧪",
    summary: "Prinsip 6 Tepat dan asas Ultimum Remedium penanganan darurat.",
    details: [
      {
        sub: "Prinsip Ultimum Remedium",
        desc: "Pestisida kimia sintetis adalah obat darurat atau pilihan terakhir apabila metode ramah lingkungan (kultur teknis, mekanis, hayati) tidak mampu meredam populasi hama yang telah melampaui Ambang Ekonomi."
      },
      {
        sub: "6 Tepat Aplikasi Pestisida",
        desc: "1. Tepat Sasaran: Mengetahui jenis hama pengganggu (ulat, kutu, atau pengunyah).\n2. Tepat Jenis: Memilih jenis yang paling efektif untuk sasaran dan paling aman bagi musuh alami.\n3. Tepat Dosis & Konsentrasi: Mengikuti petunjuk label takaran, menghindari resistensi (kekebalan) hama.\n4. Tepat Waktu: Mengaplikasikannya saat hama aktif (misal ulat grayak pada sore/malam hari).\n5. Tepat Cara Aplikasi: Menyesuaikan teknik, seperti menyemprot bawah daun untuk kutu kebul atau pangkal batang untuk wereng.\n6. Tepat Tempat: Hanya mengaplikasikan pada bagian terserang saja (spot spraying), tidak meluas ke seluruh sawah jika serangan bersifat lokal."
      }
    ]
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Apa prinsip dasar pertama dalam konsep Pengendalian Hama Terpadu (PHT)?",
    options: [
      { text: "Membasmi seluruh serangga di sawah hingga nol ekor", value: "A" },
      { text: "Budidaya tanaman sehat menggunakan benih unggul", value: "B" },
      { text: "Melakukan penyemprotan pestisida terjadwal seminggu sekali", value: "C" },
      { text: "Memberikan pupuk urea dalam dosis sebanyak mungkin", value: "D" }
    ],
    correctValue: "B",
    explanation: "Budidaya tanaman sehat adalah pondasi pertama PHT. Tanaman sehat memiliki ketahanan alami yang lebih kuat terhadap serangan hama dibandingkan tanaman yang kekurangan nutrisi."
  },
  {
    id: 2,
    question: "Siapakah di bawah ini yang tergolong sebagai PREDATOR alami wereng cokelat di lapangan?",
    options: [
      { text: "Tawon Trichogramma spp.", value: "A" },
      { text: "Laba-laba Serigala (Lycosa pseudoannulata)", value: "B" },
      { text: "Ulat Grayak", value: "C" },
      { text: "Jamur Beauveria bassiana", value: "D" }
    ],
    correctValue: "B",
    explanation: "Laba-laba Serigala (Lycosa pseudoannulata) adalah predator (pemangsa) aktif di lapangan yang memburu nimfa dan wereng dewasa secara langsung. Sedangkan Trichogramma adalah parasitoid, dan Beauveria adalah agens hayati patogen."
  },
  {
    id: 3,
    question: "Berapa ambang batas populasi Wereng Batang Cokelat (WBC) untuk memperbolehkan aplikasi pestisida kimia pada padi < 40 HST?",
    options: [
      { text: "Jika ditemukan minimal 1 ekor di areal sawah", value: "A" },
      { text: "Jika rata-rata populasi melampaui 15 ekor per rumpun", value: "B" },
      { text: "Bila daun padi mulai melingkar keriting", value: "C" },
      { text: "Jika musuh alami seperti kumbang kubah sudah punah", value: "D" }
    ],
    correctValue: "B",
    explanation: "Ambang Ekonomi untuk Wereng Batang Cokelat (WBC) pada padi berumur < 40 HST adalah rata-rata 15 ekor per rumpun. Sebelum melewati batas ini, tindakan pestisida tidak dianjurkan demi pelestarian musuh alami."
  },
  {
    id: 4,
    question: "Apa makna sesungguhnya dari asas 'Ultimum Remedium' dalam pengendalian hama?",
    options: [
      { text: "Pestisida harus diaplikasikan sesegera mungkin sejak masa tanam", value: "A" },
      { text: "Pencampuran berbagai jenis racun kimia dalam satu tangki semprot", value: "B" },
      { text: "Pestisida kimia sintetis diposisikan sebagai obat darurat atau pilihan terakhir", value: "C" },
      { text: "Pemilihan bahan aktif pestisida yang berbau menyengat saja", value: "D" }
    ],
    correctValue: "C",
    explanation: "Ultimum Remedium memposisikan pestisida kimia sebagai senjata pamungkas atau pilihan terakhir jika teknik ramah lingkungan lainnya terbukti tidak mampu membendung lonjakan hama di atas ambang ekonomi."
  },
  {
    id: 5,
    question: "Mengapa waktu sore atau malam hari sangat tepat digunakan untuk menyemprot ulat grayak (Spodoptera frugiperda)?",
    options: [
      { text: "Ulat grayak sangat aktif keluar dan memakan daun pada malam hari", value: "A" },
      { text: "Harga sewa alat semprot di sore hari jauh lebih terjangkau", value: "B" },
      { text: "Pestisida tidak cepat menguap oleh sinar matahari langsung", value: "C" },
      { text: "Hanya pada waktu itu embun pagi merusak tanaman", value: "D" }
    ],
    correctValue: "A",
    explanation: "Ulat grayak beraktivitas secara nokturnal (aktif di malam hari). Menyemprot pada sore hari memastikan racun masih basah dan segar ketika ulat keluar dari tempat persembunyian untuk memakan daun."
  }
];

export default function EduLessons() {
  const [subTab, setSubTab] = useState<"modules" | "assistant" | "quiz">("modules");
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>("bab-1");
  
  // Edu Assistant States
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantChat, setAssistantChat] = useState<EduChatMsg[]>([
    {
      id: "welcome",
      role: "asisten",
      content: "Halo Bapak/Ibu Tani! Saya adalah Asisten Modul PHT. Di sini Anda bisa menguji atau menanyakan segala hal mengenai materi kurikulum PHT yang ada pada Buku Panduan aplikasi ini. Silakan ajukan pertanyaan Anda seputar Prinsip Dasar, Musuh Alami, Ambang Batas Ekonomi, atau Aplikasi Pestisida Bijak! 🌱",
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);

  // Quiz States
  const [quizState, setQuizState] = useState<"start" | "active" | "finished">("start");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [farmerName, setFarmerName] = useState("");

  // Handle send to educational AI
  const handleSendEduQuestion = async () => {
    if (!assistantInput.trim() || isAssistantLoading) return;

    const userQuery = assistantInput;
    setAssistantInput("");

    const userMsg: EduChatMsg = {
      id: "edu_" + Date.now(),
      role: "user",
      content: userQuery,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    };

    setAssistantChat((prev) => [...prev, userMsg]);
    setIsAssistantLoading(true);

    try {
      // Create lightweight history subset
      const historySubset = assistantChat.slice(-4).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        content: m.content
      }));

      const res = await fetch("/api/edu-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuery,
          chatHistory: historySubset
        })
      });

      if (!res.ok) {
        throw new Error("Gagal memproses.");
      }

      const data = await res.json();

      const asistenMsg: EduChatMsg = {
        id: "edu_res_" + Date.now(),
        role: "asisten",
        content: data.reply,
        chapters: data.relevantChapters,
        tip: data.quizTip,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      };

      setAssistantChat((prev) => [...prev, asistenMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: EduChatMsg = {
        id: "edu_err_" + Date.now(),
        role: "asisten",
        content: "Aduh, satelit asisten edukasi kami sedang mengalami gangguan jaringan sementara. Coba ketik pertanyaan Anda lagi sebentar lagi ya! 🙏",
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
      };
      setAssistantChat((prev) => [...prev, errMsg]);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  // Quiz handlers
  const startQuiz = () => {
    if (!farmerName.trim()) return;
    setQuizScore(0);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizState("active");
  };

  const handleAnswerClick = (optionValue: string) => {
    if (selectedAnswer !== null) return; // Prevent changing answer
    setSelectedAnswer(optionValue);
    setShowExplanation(true);
    if (optionValue === QUIZ_QUESTIONS[currentQuestionIdx].correctValue) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setQuizState("finished");
    }
  };

  const restartQuizFlow = () => {
    setQuizState("start");
    setFarmerName("");
  };

  return (
    <div className="space-y-6" id="edu-pht-container">
      {/* Upper Navigation for Edu Sections */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edukasi PHT Tanaman</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Modul Pembelajaran Kurikulum, Asisten Tanya-Jawab Terbatas, dan Kuis Evaluasi Ahli PHT Mandiri.
          </p>
        </div>

        {/* Sub-tabs selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSubTab("modules")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === "modules" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Materi Buku</span>
          </button>
          <button
            onClick={() => setSubTab("assistant")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === "assistant" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Asisten Belajar</span>
          </button>
          <button
            onClick={() => setSubTab("quiz")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              subTab === "quiz" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Kuis Sertifikasi</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE SUBTAB CONTENT */}
      {subTab === "modules" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="edu-modules-grid">
          {/* Chapters Accordion List */}
          <div className="lg:col-span-2 space-y-4">
            {LESSON_CHAPTERS.map((chap) => {
              const isOpen = expandedChapterId === chap.id;
              return (
                <div 
                  key={chap.id}
                  className={`bg-white border rounded-2xl transition-all ${
                    isOpen ? "border-emerald-500 shadow-sm" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <button
                    onClick={() => setExpandedChapterId(isOpen ? null : chap.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{chap.icon}</span>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">{chap.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{chap.summary}</p>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                      >
                        <div className="p-5 space-y-4">
                          {chap.details.map((item, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/65 shadow-xs">
                              <h5 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5 mb-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                                {item.sub}
                              </h5>
                              <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
                                {item.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Quick Learning Stats / Motivation Card */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-emerald-800 to-teal-950 p-5 rounded-2xl text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 translate-x-3 translate-y-3">
                <GraduationCap className="w-40 h-40" />
              </div>
              <Sparkles className="w-5 h-5 text-emerald-300 animate-bounce mb-3" />
              <h4 className="text-base font-bold tracking-tight">Ayo Menjadi Ahli PHT Mandiri!</h4>
              <p className="text-xs text-emerald-100/90 leading-relaxed mt-2">
                PHT mengutamakan keseimbangan alam demi kelestarian jangka panjang lahan sawah Anda. Dengan menguasai 4 Prinsip Dasar, Anda bisa menghemat jutaan rupiah biaya pembelian racun kimia!
              </p>
              <div className="mt-4 pt-3 border-t border-emerald-700/50 flex justify-between items-center text-[11px] text-emerald-200 font-mono">
                <span>Kurikulum: PHT Standard Nasional</span>
                <span>v2.1</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl">
              <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Tautan Cepat Belajar</h5>
              <div className="space-y-2.5">
                <button
                  onClick={() => setSubTab("assistant")}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Tanya Asisten PHT</span>
                      <span className="text-[10px] text-slate-500">Konsultasi interaktif materi pelajaran</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setSubTab("quiz")}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Kuis Ujian PHT</span>
                      <span className="text-[10px] text-slate-500">Dapatkan sertifikat digital kelulusan</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER ASSISTANT SUBTAB CONTENT */}
      {subTab === "assistant" && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col h-[520px]" id="edu-assistant-layout">
          {/* Assistant Info Banner */}
          <div className="bg-slate-50 border-b border-slate-150 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-600 p-2 rounded-xl text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Asisten Modul PHT</h4>
                <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Siap Melayani Pertanyaan Kurikulum PHT secara Ketat
                </p>
              </div>
            </div>
            <button
              onClick={() => setAssistantChat([
                {
                  id: "welcome_reset",
                  role: "asisten",
                  content: "Halo Bapak/Ibu Tani! Obrolan telah diatur ulang. Ada materi atau bab PHT mana yang belum Anda pahami? Silakan tanyakan kepada saya! 🌱",
                  timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
                }
              ])}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Reset Percakapan"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Assistant Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
            {assistantChat.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {msg.role === "asisten" && (
                  <div className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-xs">
                    P
                  </div>
                )}
                <div className="space-y-1.5">
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs"
                    }`}
                  >
                    {msg.content}

                    {/* Meta information from Edu Chat Response */}
                    {msg.role === "asisten" && msg.chapters && msg.chapters.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1 items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Rujukan Bab:</span>
                        {msg.chapters.map((ch, i) => (
                          <span key={i} className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-emerald-100">
                            {ch}
                          </span>
                        ))}
                      </div>
                    )}

                    {msg.role === "asisten" && msg.tip && (
                      <div className="mt-3 bg-amber-50/60 border border-amber-200/50 p-2.5 rounded-xl flex items-start gap-2 text-amber-900">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] leading-normal font-medium">
                          <strong className="text-amber-800">Tip Kuis PHT:</strong> {msg.tip}
                        </p>
                      </div>
                    )}
                  </div>
                  <span className={`text-[9px] text-slate-400 block ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isAssistantLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto items-center">
                <div className="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 animate-pulse">
                  P
                </div>
                <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-500 ml-1">Asisten sedang membaca buku panduan...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Assistant Input Form */}
          <div className="p-3 bg-white border-t border-slate-150 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                id="edu-assistant-input"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendEduQuestion();
                }}
                disabled={isAssistantLoading}
                placeholder="Tanyakan materi PHT, misal: 'Apa pilar ke-2 PHT?' atau 'Ambang batas wereng'..."
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/50"
              />
              <button
                id="edu-assistant-send-btn"
                onClick={handleSendEduQuestion}
                disabled={!assistantInput.trim() || isAssistantLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white px-4 rounded-xl flex items-center justify-center transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RENDER QUIZ SUBTAB CONTENT */}
      {subTab === "quiz" && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6" id="edu-quiz-layout">
          {/* STARTING SCREEN */}
          {quizState === "start" && (
            <div className="max-w-md mx-auto text-center py-8 space-y-6">
              <div className="bg-amber-100 text-amber-700 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-md">
                <Award className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Ujian Pemahaman Ahli Muda PHT</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Uji kecakapan dan ketajaman analisis Anda terhadap prinsip-prinsip dasar PHT di lapangan. Jawab 5 pertanyaan taktis dan raih <strong>Sertifikat Kompetensi Digital Ahli PHT</strong> jika berhasil menjawab seluruhnya dengan benar!
                </p>
              </div>

              {/* Farmer Name Input */}
              <div className="space-y-2 text-left bg-slate-50 p-4 rounded-xl border border-slate-150">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nama Lengkap Peserta:
                </label>
                <input
                  type="text"
                  id="quiz-farmer-name"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="Masukkan nama lengkap untuk sertifikat..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  *Nama ini akan tertera secara otomatis pada sertifikat kelulusan digital Anda.
                </span>
              </div>

              <button
                id="btn-start-quiz"
                onClick={startQuiz}
                disabled={!farmerName.trim()}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <span>Mulai Kuis Sekarang</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ACTIVE QUIZ SCREEN */}
          {quizState === "active" && (
            <div className="space-y-6">
              {/* Quiz header / progress */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                    Ujian PHT
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Pertanyaan {currentQuestionIdx + 1} dari {QUIZ_QUESTIONS.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <span>Skor saat ini:</span>
                  <span className="font-bold text-emerald-700">{quizScore}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full transition-all duration-300" 
                  style={{ width: `${((currentQuestionIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Statement */}
              <div className="space-y-4">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {QUIZ_QUESTIONS[currentQuestionIdx].question}
                </h4>

                {/* Grid of options */}
                <div className="grid grid-cols-1 gap-3">
                  {QUIZ_QUESTIONS[currentQuestionIdx].options.map((opt) => {
                    const isSelected = selectedAnswer === opt.value;
                    const isCorrect = opt.value === QUIZ_QUESTIONS[currentQuestionIdx].correctValue;
                    
                    let btnStyle = "border-slate-200 hover:border-slate-300 hover:bg-slate-50";
                    if (selectedAnswer !== null) {
                      if (isCorrect) {
                        btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900";
                      } else if (isSelected) {
                        btnStyle = "border-red-500 bg-red-50 text-red-900";
                      } else {
                        btnStyle = "border-slate-200 bg-slate-50/50 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={opt.value}
                        id={`quiz-opt-${opt.value}`}
                        onClick={() => handleAnswerClick(opt.value)}
                        disabled={selectedAnswer !== null}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 text-xs sm:text-sm ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected 
                            ? "bg-slate-900 text-white" 
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {opt.value}
                        </span>
                        <span className="font-medium flex-1">{opt.text}</span>
                        {selectedAnswer !== null && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5 animate-bounce" />
                        )}
                        {selectedAnswer !== null && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Explanation & Next Button */}
              {showExplanation && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs text-slate-700 uppercase tracking-wider block mb-1">Kunci Penjelasan:</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {QUIZ_QUESTIONS[currentQuestionIdx].explanation}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2 border-t border-slate-200/50">
                    <button
                      id="quiz-next-btn"
                      onClick={nextQuestion}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>{currentQuestionIdx === QUIZ_QUESTIONS.length - 1 ? "Selesaikan Ujian" : "Lanjut Pertanyaan"}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* COMPLETED CERTIFICATE SCREEN */}
          {quizState === "finished" && (
            <div className="space-y-6 max-w-2xl mx-auto py-4 text-center">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">Ujian PHT Selesai! 🎉</h3>
                <p className="text-xs text-slate-500">
                  Hasil evaluasi kelulusan pemahaman PHT Anda telah diproses.
                </p>
              </div>

              {/* Show Stats */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Benar / Total</span>
                  <span className="text-xl font-bold text-slate-800 mt-1 block">{quizScore} / {QUIZ_QUESTIONS.length}</span>
                </div>
                <div className="text-center border-l border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Presentase</span>
                  <span className="text-xl font-bold text-slate-800 mt-1 block">{Math.round((quizScore / QUIZ_QUESTIONS.length) * 100)}%</span>
                </div>
              </div>

              {/* Conditional rendering for Certificate */}
              {quizScore === QUIZ_QUESTIONS.length ? (
                <div className="space-y-4">
                  {/* Real visual Digital Certificate */}
                  <div className="border-[12px] border-emerald-900 bg-amber-50/20 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden shadow-xl border-double max-w-xl mx-auto">
                    {/* Decorative watermark */}
                    <div className="absolute right-0 bottom-0 opacity-[0.03] translate-x-12 translate-y-12">
                      <GraduationCap className="w-80 h-80 text-emerald-900" />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div className="flex justify-center mb-1">
                        <Award className="w-12 h-12 text-emerald-800" />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-emerald-950 font-black tracking-widest text-[11px] uppercase">Sertifikat Kelulusan</h4>
                        <p className="text-[9px] text-slate-500 font-serif italic">Nomor Seri: CERT-PHT-{Date.now().toString().slice(-6)}</p>
                      </div>

                      <div className="border-t border-slate-200/80 my-4" />

                      <div className="space-y-2">
                        <p className="text-xs text-slate-500 font-serif">Sertifikat ini secara sah diberikan kepada:</p>
                        <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-wide underline decoration-emerald-800/30 decoration-wavy">
                          {farmerName}
                        </h2>
                      </div>

                      <p className="text-[11px] text-slate-600 font-serif leading-relaxed max-w-md mx-auto pt-2">
                        Atas kelulusannya menjawab seluruh tantangan uji kompetensi dengan nilai sempurna (100%), serta dinyatakan kompeten sebagai:
                      </p>

                      <div className="bg-emerald-800 text-white text-[11px] font-bold px-4 py-1.5 rounded-lg inline-block tracking-wider uppercase shadow-sm">
                        Ahli Muda Pengendalian Hama Terpadu (PHT)
                      </div>

                      <div className="border-t border-slate-200/80 my-4 pt-4 flex justify-between items-center text-[10px] text-slate-500">
                        <div className="text-left font-serif">
                          <p>Tanggal: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}</p>
                          <p>Lokasi: KonsulTani Hama Digital</p>
                        </div>
                        <div className="text-right font-serif">
                          <p className="font-bold text-emerald-800">Direktorat Edukasi</p>
                          <p className="text-[9px] italic text-slate-400">Terverifikasi Digital</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-emerald-800 font-medium">
                    Luar biasa sempurna! Anda berhak menyandang gelar Ahli Muda PHT Mandiri di desa Anda. 🌱
                  </p>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl max-w-md mx-auto space-y-3">
                  <h4 className="font-bold text-amber-900 text-sm">Belum Mencapai Nilai Sempurna</h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Jangan patah semangat! Untuk mendapatkan <strong>Sertifikat Ahli Muda PHT</strong>, Anda perlu menjawab seluruh 5 pertanyaan dengan benar (100% kelulusan). Mari baca kembali materi modul atau tanya langsung ke asisten PHT kami!
                  </p>
                  <button
                    onClick={() => {
                      setQuizState("active");
                      setQuizScore(0);
                      setCurrentQuestionIdx(0);
                      setSelectedAnswer(null);
                      setShowExplanation(false);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all inline-block"
                  >
                    Coba Ujian Lagi
                  </button>
                </div>
              )}

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={restartQuizFlow}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs px-5 py-2 rounded-xl transition-colors"
                >
                  Ganti Nama / Reset
                </button>
                <button
                  onClick={() => setSubTab("modules")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2 rounded-xl transition-colors"
                >
                  Kembali ke Materi
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
