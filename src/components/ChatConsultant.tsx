import React, { useState, useRef } from "react";
import { ChatMessage, DiagnosisResult, EcoContext, FieldLog } from "../types";
import {
  Send,
  Upload,
  Image as ImageIcon,
  X,
  User,
  Bot,
  Sprout,
  ShieldAlert,
  HeartHandshake,
  Eye,
  Activity,
  Compass,
  ArrowRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { motion } from "motion/react";

interface ChatConsultantProps {
  chatMessages: ChatMessage[];
  activeFieldLog: FieldLog | null;
  isLoading: boolean;
  onSendMessage: (symptoms: string, cropType: string, imageBase64?: string, useEcoContext?: boolean) => void;
}

export default function ChatConsultant({
  chatMessages,
  activeFieldLog,
  isLoading,
  onSendMessage,
}: ChatConsultantProps) {
  const [symptoms, setSymptoms] = useState("");
  const [cropType, setCropType] = useState("Padi");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attachEcoContext, setAttachEcoContext] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle image conversion to base64
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Hanya berkas gambar yang didukung.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() && !imagePreview) return;

    onSendMessage(
      symptoms,
      cropType,
      imagePreview || undefined,
      attachEcoContext && !!activeFieldLog
    );

    // Reset inputs
    setSymptoms("");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setTimeout(scrollToBottom, 100);
  };

  // Helper to trigger message when clicking interactive question pills
  const handleQuestionPillClick = (question: string) => {
    setSymptoms(question);
    // Autofill or keep cropType same
    setTimeout(() => {
      const form = document.getElementById("chat-input-form");
      if (form) {
        form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      }
    }, 100);
  };

  const cropOptions = ["Padi", "Jagung", "Cabai", "Bawang Merah", "Tomat", "Jeruk", "Mangga", "Sayuran"];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xs" id="chat-workspace">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6" id="chat-messages-container">
        {chatMessages.length === 0 ? (
          /* Welcome state if empty chat */
          <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto py-12 space-y-6 h-full">
            <div className="bg-emerald-100 p-4 rounded-3xl text-emerald-600 shadow-xs">
              <Bot className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">
                Konsultasi Ahli Proteksi Tanaman & PHT
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Halo! Saya adalah Konsultan Pertanian dan Ahli Entomologi Proteksi Tanaman Anda.
                Deskripsikan gejala kerusakan tanaman, sebutkan jenis tanamannya, atau langsung
                unggah foto hama/daun yang terserang untuk didiagnosis secara terpadu.
              </p>
            </div>

            {/* Quick Prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full text-left">
              <button
                id="btn-quick-prompt-1"
                onClick={() => {
                  setCropType("Jagung");
                  setSymptoms("Daun jagung saya bolong-bolong tidak beraturan dan ada seperti serbuk kayu di pucuknya. Ulat apa ya?");
                }}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/20 text-xs transition-all text-slate-700"
              >
                🌽 <strong>Jagung:</strong> Daun berlubang & ada serbuk kotoran digerek ulat...
              </button>
              <button
                id="btn-quick-prompt-2"
                onClick={() => {
                  setCropType("Padi");
                  setSymptoms("Tanaman padi saya menguning kering melingkar seperti terbakar di petakan tengah sawah.");
                }}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/20 text-xs transition-all text-slate-700"
              >
                🌾 <strong>Padi:</strong> Kuning kering melingkar hopperburn di petak sawah...
              </button>
              <button
                id="btn-quick-prompt-3"
                onClick={() => {
                  setCropType("Cabai");
                  setSymptoms("Banyak serangga putih kecil berterbangan di balik daun cabai saya dan daunnya mulai keriting kuning.");
                }}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/20 text-xs transition-all text-slate-700"
              >
                🌶️ <strong>Cabai:</strong> Kutu putih kecil berterbangan di balik daun keriting...
              </button>
              <button
                id="btn-quick-prompt-4"
                onClick={() => {
                  setCropType("Tomat");
                  setSymptoms("Buah tomat membusuk berair dan ada titik hitam kecil di kulitnya, setelah dibuka ada belatung bergerak.");
                }}
                className="p-3 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/20 text-xs transition-all text-slate-700"
              >
                🍅 <strong>Tomat:</strong> Buah busuk berair dan ada belatung di dalamnya...
              </button>
            </div>
          </div>
        ) : (
          /* Chat logs render */
          <div className="space-y-6">
            {chatMessages.map((msg) => {
              const isUser = msg.role === "user";

              return (
                <div
                  key={msg.id}
                  id={`chat-bubble-${msg.id}`}
                  className={`flex gap-3 md:gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {/* Left avatar for Assistant */}
                  {!isUser && (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  {/* Message Box */}
                  <div className={`max-w-[85%] md:max-w-[75%] space-y-2`}>
                    {/* Username or Title */}
                    <div className={`text-xs text-slate-400 font-semibold px-1 flex items-center gap-1.5 ${isUser ? "justify-end" : "justify-start"}`}>
                      {isUser ? (
                        <>
                          <span>Petani / Praktisi</span>
                          <User className="w-3 h-3 text-slate-400" />
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Ahli Proteksi Tanaman (AI)</span>
                        </>
                      )}
                      <span className="font-normal opacity-70">({msg.timestamp})</span>
                    </div>

                    {/* Chat Payload Card */}
                    <div
                      className={`p-4 rounded-2xl ${
                        isUser
                          ? "bg-slate-800 text-white rounded-tr-none shadow-xs"
                          : "bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm"
                      }`}
                    >
                      {/* USER SENT CHAT */}
                      {isUser && (
                        <div className="space-y-2">
                          {msg.cropType && (
                            <span className="inline-block bg-slate-700 border border-slate-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded-md mb-1">
                              Tanaman: {msg.cropType}
                            </span>
                          )}

                          {msg.image && (
                            <div className="relative max-w-xs rounded-xl overflow-hidden border border-slate-700 bg-black/10">
                              <img
                                src={msg.image}
                                alt="Gambar Keluhan Tanaman"
                                className="w-full h-auto object-cover max-h-48"
                              />
                            </div>
                          )}

                          {msg.content && <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>}

                          {msg.ecoContextAttached && (
                            <div className="mt-2.5 bg-slate-700/50 p-2.5 rounded-xl border border-slate-600/50 text-[11px] text-slate-300">
                              <span className="font-semibold text-white block mb-1">🌍 Konteks Lahan Terlampir:</span>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                <span>• Cuaca: {msg.ecoContextAttached.weather}</span>
                                <span>• Usia: {msg.ecoContextAttached.cropAge}</span>
                                <span>• Lahan: {msg.ecoContextAttached.locationType || "Kebun"}</span>
                                <span>• Serangan: {msg.ecoContextAttached.infestationArea || "Menyebar"}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* AI RETURNED DIAGNOSIS */}
                      {!isUser && msg.isDiagnosis && msg.diagnosisResult && (
                        <div className="space-y-5 text-sm">
                          {/* 1. Intro Analysis */}
                          <div className="text-slate-700 leading-relaxed italic bg-emerald-50/50 p-3 rounded-xl border border-emerald-50/50 text-xs">
                            "{msg.diagnosisResult.introAnalysis}"
                          </div>

                          {/* 2. Suspected Pests list */}
                          <div className="space-y-2.5">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                              🚨 Analisis Diagnostik Awal
                            </span>
                            {msg.diagnosisResult.suspectedPests.map((pest, pIdx) => (
                              <div
                                key={pIdx}
                                className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col md:flex-row md:items-start justify-between gap-3"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-slate-900 text-base">{pest.name}</span>
                                    <span className="text-xs text-slate-400 italic">({pest.scientificName})</span>
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed">{pest.explanation}</p>
                                </div>
                                <div className="shrink-0 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-emerald-200 text-center flex flex-col justify-center">
                                  <span className="text-[9px] text-emerald-600 block uppercase font-medium">Keyakinan</span>
                                  <span className="text-sm font-black">{pest.confidence}%</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* 3. Cycle & Behavior */}
                          <div className="bg-amber-50/50 border border-amber-100/80 p-3.5 rounded-xl space-y-1">
                            <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              Siklus & Perilaku Serangan
                            </span>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {msg.diagnosisResult.cycleAndBehavior}
                            </p>
                          </div>

                          {/* 4. PHT Recommendations */}
                          <div className="space-y-3">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                              🛠️ Rekomendasi PHT (Pengendalian Hama Terpadu)
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              {/* Kultur Teknis */}
                              <div className="bg-emerald-50/20 border border-emerald-100/50 p-3.5 rounded-xl space-y-1.5">
                                <span className="text-xs font-bold text-slate-800 block">🌱 Kultur Teknis / Sanitasi</span>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {msg.diagnosisResult.phtRecommendations.kulturTeknis}
                                </p>
                              </div>

                              {/* Mekanis */}
                              <div className="bg-sky-50/20 border border-sky-100/50 p-3.5 rounded-xl space-y-1.5">
                                <span className="text-xs font-bold text-slate-800 block">⚙️ Mekanis / Fisik</span>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {msg.diagnosisResult.phtRecommendations.mekanis}
                                </p>
                              </div>

                              {/* Biologis */}
                              <div className="bg-teal-50/20 border border-teal-100/50 p-3.5 rounded-xl space-y-1.5">
                                <span className="text-xs font-bold text-teal-800 block">🐞 Biologis (Musuh Alami)</span>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {msg.diagnosisResult.phtRecommendations.biologis}
                                </p>
                              </div>

                              {/* Kimiawi */}
                              <div className="bg-red-50/40 border border-red-100 p-3.5 rounded-xl space-y-1.5">
                                <span className="text-xs font-bold text-red-800 flex items-center gap-1">
                                  🧪 Kimiawi (Opsi Pilihan Terakhir)
                                </span>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                  {msg.diagnosisResult.phtRecommendations.kimiawi}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Severity badge block */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                            <span className="flex items-center gap-1 text-slate-500 font-medium">
                              <Activity className="w-4 h-4 text-slate-400" />
                              Tingkat Kerusakan Lahan:
                              <span
                                className={`font-bold px-2 py-0.5 rounded-full ml-1 text-[10px] ${
                                  msg.diagnosisResult.overallSeverity === "Berat"
                                    ? "bg-red-100 text-red-800 border border-red-200"
                                    : msg.diagnosisResult.overallSeverity === "Sedang"
                                    ? "bg-orange-100 text-orange-800 border border-orange-200"
                                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                }`}
                              >
                                {msg.diagnosisResult.overallSeverity}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}

                      {/* NORMAL CONVERSATIONAL CHAT (NOT STRUCTURED DIAGNOSIS) */}
                      {!isUser && !msg.isDiagnosis && msg.content && (
                        <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
                      )}
                    </div>

                    {/* Interactive Follow-Up Questions (Actions Pills) */}
                    {!isUser && msg.isDiagnosis && msg.diagnosisResult && msg.diagnosisResult.interactiveQuestions && (
                      <div className="pt-2 flex flex-col gap-2">
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-wider">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          Pertanyaan Diagnostik (Klik Untuk Menjawab):
                        </span>
                        <div className="flex flex-col gap-2">
                          {msg.diagnosisResult.interactiveQuestions.map((q, qIdx) => (
                            <button
                              key={qIdx}
                              id={`question-pill-${msg.id}-${qIdx}`}
                              disabled={isLoading}
                              onClick={() => handleQuestionPillClick(q)}
                              className="text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100/80 p-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none group"
                            >
                              <span>{q}</span>
                              <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right avatar for User */}
                  {isUser && (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-4 items-start" id="chat-loading-indicator">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 animate-bounce">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="space-y-1 max-w-[85%]">
                  <div className="text-xs text-slate-400 font-semibold px-1">
                    Ahli Proteksi Tanaman sedang menganalisis...
                  </div>
                  <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-slate-200 shadow-xs flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium animate-pulse">
                      Membaca foto tanaman & memeriksa pola ekologi lapangan...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input controls form */}
      <div className="bg-white p-4 border-t border-slate-200 space-y-3 shrink-0" id="chat-input-controls">
        {/* Active Field Log Context Bar */}
        {activeFieldLog && (
          <div className="flex items-center justify-between bg-sky-50 border border-sky-100 px-3 py-2 rounded-xl text-xs text-sky-800">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-600 animate-spin" style={{ animationDuration: "12s" }} />
              <span>
                Konteks ekologi aktif: <strong>{activeFieldLog.cropType}</strong> ({activeFieldLog.cropAge}) • Cuaca {activeFieldLog.weather}
              </span>
            </div>
            <label className="flex items-center gap-1.5 font-semibold cursor-pointer select-none shrink-0 ml-3">
              <input
                type="checkbox"
                id="checkbox-attach-eco"
                checked={attachEcoContext}
                onChange={(e) => setAttachEcoContext(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 border-slate-300"
              />
              Sertakan dalam diagnosis
            </label>
          </div>
        )}

        {/* Drag and drop image dropzone placeholder */}
        {isDragging && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed border-emerald-500 bg-emerald-50/50 p-6 rounded-xl text-center text-sm font-semibold text-emerald-800"
          >
            Lepaskan gambar di sini untuk melampirkan...
          </div>
        )}

        {/* Image Attachment & Crop Selector Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">Komoditas:</span>
            <div className="flex gap-1 overflow-x-auto max-w-[280px] md:max-w-md py-0.5">
              {cropOptions.map((crop) => (
                <button
                  key={crop}
                  type="button"
                  id={`btn-crop-select-${crop}`}
                  onClick={() => setCropType(crop)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                    cropType === crop
                      ? "bg-slate-800 text-white"
                      : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Hidden Input File */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="chat-file-upload-input"
            />
            <button
              type="button"
              id="btn-upload-trigger"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors border border-slate-200 flex items-center gap-1 text-xs font-semibold bg-white"
              title="Unggah Foto Hama/Daun"
            >
              <Upload className="w-4 h-4" />
              <span>Foto Hama</span>
            </button>
          </div>
        </div>

        {/* Image preview box */}
        {imagePreview && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl max-w-sm relative shadow-xs">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-emerald-200">
              <img src={imagePreview} alt="Pratinjau" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-xs text-emerald-800">
              <span className="font-bold block">Foto terlampir!</span>
              <span className="text-[10px] text-emerald-600">Gemini akan mendeteksi serangga & kerusakan</span>
            </div>
            <button
              type="button"
              id="btn-remove-preview-img"
              onClick={handleClearImage}
              className="p-1 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input box form */}
        <form
          onSubmit={handleSubmit}
          id="chat-input-form"
          className="flex items-center gap-2"
          onDragOver={handleDragOver}
        >
          <input
            type="text"
            id="chat-message-input-field"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            disabled={isLoading}
            placeholder={
              imagePreview
                ? "Tekan Kirim atau tambahkan detail keluhan..."
                : "Tulis keluhan (misal: daun padi layu kecokelatan di ujungnya...)"
            }
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white shadow-xs"
          />

          <button
            type="submit"
            id="btn-send-message"
            disabled={isLoading || (!symptoms.trim() && !imagePreview)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:hover:bg-emerald-600 shadow-sm shrink-0 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
