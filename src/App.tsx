import React, { useState, useEffect } from "react";
import { ChatMessage, FieldLog, DiagnosisResult, EcoContext } from "./types";
import ChatConsultant from "./components/ChatConsultant";
import PocketGuide from "./components/PocketGuide";
import EduLessons from "./components/EduLessons";
import EcoFieldLogComponent from "./components/EcoFieldLogComponent";
import HistoryLogs from "./components/HistoryLogs";
import {
  Sprout,
  Bot,
  BookOpen,
  Compass,
  ShieldAlert,
  Sparkles,
  Leaf,
  Menu,
  GraduationCap,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"consultant" | "guide" | "edu" | "logs" | "history">("consultant");

  // Load state from LocalStorage on init
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("pht_chat_messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [logs, setLogs] = useState<FieldLog[]>(() => {
    const saved = localStorage.getItem("pht_field_logs");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeLogId, setActiveLogId] = useState<string | null>(() => {
    return localStorage.getItem("pht_active_log_id") || null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem("pht_chat_messages", JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem("pht_field_logs", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (activeLogId) {
      localStorage.setItem("pht_active_log_id", activeLogId);
    } else {
      localStorage.removeItem("pht_active_log_id");
    }
  }, [activeLogId]);

  // Find the active log object if it exists
  const activeLog = logs.find((l) => l.id === activeLogId) || null;

  // Add a message from the pocket guide "Tanya AI" button
  const handleAskAboutPest = (pestName: string) => {
    setActiveTab("consultant");
    // Wait a brief moment to switch tabs and then trigger send in the ChatConsultant
    setTimeout(() => {
      handleSendMessage(
        `Saya ingin tahu lebih dalam mengenai gejala serangan hama ${pestName} dan bagaimana strategi pengendalian terpadunya.`,
        "Umum",
        undefined,
        false
      );
    }, 150);
  };

  // Add new field log
  const handleAddLog = (newLog: Omit<FieldLog, "id" | "date">) => {
    const logObj: FieldLog = {
      ...newLog,
      id: "log_" + Date.now(),
      date: new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
    setLogs([logObj, ...logs]);
    // Automatically make it the active context if it's the first log
    if (logs.length === 0) {
      setActiveLogId(logObj.id);
    }
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter((l) => l.id !== id));
    if (activeLogId === id) {
      setActiveLogId(null);
    }
  };

  const handleSetActiveLog = (id: string | null) => {
    setActiveLogId(id);
  };

  // Delete specific history case
  const handleDeleteHistoryItem = (id: string) => {
    setChatMessages(chatMessages.filter((msg) => msg.id !== id));
  };

  // Clear all diagnosis histories
  const handleClearAllHistory = () => {
    // Only clear diagnosis result objects
    setChatMessages([]);
  };

  // Core API query function to communicate with full-stack backend
  const handleSendMessage = async (
    symptomsText: string,
    selectedCrop: string,
    imageBase64?: string,
    useEcoContext = true
  ) => {
    const userMessageId = "msg_" + Date.now();
    const userTimestamp = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Extract active context parameters if selected
    let ecoContextPayload: EcoContext | undefined = undefined;
    if (useEcoContext && activeLog) {
      ecoContextPayload = {
        weather: activeLog.weather,
        cropAge: activeLog.cropAge,
        locationType: "Sawah / Kebun",
        lastFertilization: activeLog.conditionNotes || "Tidak ada catatan",
        infestationArea: activeLog.pestSeverity === "Berat" ? "Merata / Severe" : "Mengelompok / Spotty",
      };
    }

    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: symptomsText,
      cropType: selectedCrop,
      image: imageBase64,
      ecoContextAttached: ecoContextPayload,
      timestamp: userTimestamp,
    };

    // Update state to include user's message
    const updatedHistory = [...chatMessages, newUserMessage];
    setChatMessages(updatedHistory);
    setIsLoading(true);

    // Setup helper for delay / backoff
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    let attempts = 0;
    const maxAttempts = 3;
    let success = false;
    let diagnosisData: DiagnosisResult | null = null;
    let lastError: any = null;

    while (attempts < maxAttempts && !success) {
      try {
        attempts++;
        
        // Build API request payload
        const chatHistorySubset = chatMessages
          .slice(-4)
          .map((m) => ({ role: m.role, content: m.content || "Lampiran gambar" }));

        const response = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symptoms: symptomsText,
            cropType: selectedCrop,
            image: imageBase64,
            ecoContext: ecoContextPayload,
            chatHistory: chatHistorySubset,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const status = response.status;
          const details = errData.details || "";
          
          const customError: any = new Error(details || `HTTP error! status: ${status}`);
          customError.status = status;
          customError.details = details;
          throw customError;
        }

        diagnosisData = await response.json();
        success = true;
      } catch (error: any) {
        lastError = error;
        console.warn(`Attempt ${attempts} failed:`, error);
        
        // If it's a 503 or 429, wait a bit before retrying
        const isTransient = 
          error.status === 503 || 
          error.status === 429 || 
          JSON.stringify(error).includes("503") || 
          JSON.stringify(error).includes("429") ||
          (error.details && (error.details.includes("503") || error.details.includes("UNAVAILABLE") || error.details.includes("high demand")));

        if (isTransient && attempts < maxAttempts) {
          // Exponential backoff: 1.5s, 3s
          await delay(1500 * attempts);
        } else {
          // If it's another error (like 400 bad API key or we hit max attempts), break the retry loop
          break;
        }
      }
    }

    if (success && diagnosisData) {
      const modelMessageId = "msg_" + (Date.now() + 1);
      const modelTimestamp = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const modelMessage: ChatMessage = {
        id: modelMessageId,
        role: "model",
        isDiagnosis: true,
        diagnosisResult: diagnosisData,
        timestamp: modelTimestamp,
      };

      setChatMessages((prev) => [...prev, modelMessage]);
    } else {
      console.error("API call ultimately failed after attempts:", lastError);
      
      // Determine user-friendly error message based on error signature
      const errorString = lastError ? (lastError.details || lastError.message || JSON.stringify(lastError)) : "";
      const is503OrBusy = 
        lastError?.status === 503 || 
        lastError?.status === 429 ||
        errorString.includes("503") || 
        errorString.includes("429") || 
        errorString.includes("UNAVAILABLE") || 
        errorString.includes("high demand") ||
        errorString.includes("busy");

      let friendlyErrorMessage = "";
      if (is503OrBusy) {
        friendlyErrorMessage = "Waduh, tampaknya 'satelit diagnosis' kami sedang sangat sibuk karena banyak antrean. Mohon tunggu beberapa saat lagi atau coba gunakan fitur Buku Saku Hama terlebih dahulu ya! 🌱";
      } else {
        friendlyErrorMessage = "Maaf, terjadi kendala koneksi atau konfigurasi API Key Anda belum selesai di panel Secrets. Mohon periksa kembali pengaturannya ya! 🙏";
      }

      const errorMsg: ChatMessage = {
        id: "msg_err_" + Date.now(),
        role: "model",
        content: friendlyErrorMessage,
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    }
    
    setIsLoading(false);
  };

  const numDiagnosisCases = chatMessages.filter((msg) => msg.isDiagnosis && msg.diagnosisResult).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="main-application-frame">
      {/* Dynamic Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shrink-0" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-md shadow-emerald-600/15 flex items-center justify-center">
              <Leaf className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-black text-slate-900 tracking-tight">KonsulTani Hama</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                  Sistem PHT
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Ahli Entomologi Proteksi Tanaman & Diagnosis Hama Mandiri
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto overflow-x-auto" id="nav-tabs">
            <button
              id="tab-consultant"
              onClick={() => setActiveTab("consultant")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === "consultant"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Konsultasi AI</span>
            </button>

            <button
              id="tab-guide"
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === "guide"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Buku Saku Hama</span>
            </button>

            <button
              id="tab-edu"
              onClick={() => setActiveTab("edu")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === "edu"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Edukasi PHT</span>
            </button>

            <button
              id="tab-logs"
              onClick={() => setActiveTab("logs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 relative ${
                activeTab === "logs"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Kondisi Lahan</span>
              {activeLog && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-sky-500 rounded-full animate-ping" />
              )}
            </button>

            <button
              id="tab-history"
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 relative ${
                activeTab === "history"
                  ? "bg-white text-emerald-800 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Riwayat</span>
              {numDiagnosisCases > 0 && (
                <span className="bg-emerald-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {numDiagnosisCases}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 overflow-hidden">
        {activeTab === "consultant" && (
          <ChatConsultant
            chatMessages={chatMessages}
            activeFieldLog={activeLog}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === "guide" && <PocketGuide onAskAboutPest={handleAskAboutPest} />}

        {activeTab === "edu" && <EduLessons />}

        {activeTab === "logs" && (
          <EcoFieldLogComponent
            logs={logs}
            activeLogId={activeLogId}
            onAddLog={handleAddLog}
            onDeleteLog={handleDeleteLog}
            onSetActiveLog={handleSetActiveLog}
          />
        )}

        {activeTab === "history" && (
          <HistoryLogs
            chatHistory={chatMessages}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearAllHistory={handleClearAllHistory}
          />
        )}
      </main>

      {/* Humid footer block */}
      <footer className="bg-white border-t border-slate-200 py-3 shrink-0 text-center text-xs text-slate-400" id="main-footer">
        <p>KonsulTani Hama © 2026 • Dirancang Sesuai Kaidah Praktis Pengendalian Hama Terpadu (PHT)</p>
      </footer>
    </div>
  );
}
