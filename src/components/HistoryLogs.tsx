import React, { useState } from "react";
import { ChatMessage, DiagnosisResult } from "../types";
import { Calendar, Trash2, Sprout, ShieldAlert, HeartHandshake, Eye, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HistoryLogsProps {
  chatHistory: ChatMessage[];
  onDeleteHistoryItem: (id: string) => void;
  onClearAllHistory: () => void;
}

export default function HistoryLogs({
  chatHistory,
  onDeleteHistoryItem,
  onClearAllHistory,
}: HistoryLogsProps) {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Filter messages that contain a structured diagnosis result
  const diagnosisCases = chatHistory.filter((msg) => msg.isDiagnosis && msg.diagnosisResult);

  const toggleCase = (id: string) => {
    setSelectedCaseId(selectedCaseId === id ? null : id);
  };

  return (
    <div className="space-y-6" id="diagnostic-history-container">
      {/* Intro Info */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-amber-900 font-semibold text-lg">Riwayat Diagnosis Kasus</h3>
          <p className="text-amber-700 text-sm mt-0.5">
            Daftar seluruh diagnosis hama dan rekomendasi PHT yang pernah Anda lakukan. Catatan ini disimpan secara lokal di perangkat Anda agar dapat ditinjau kembali sewaktu-waktu di lapangan.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-slate-800 text-base">Kasus Tersimpan ({diagnosisCases.length})</h4>
        {diagnosisCases.length > 0 && (
          <button
            id="btn-clear-all-history"
            onClick={() => {
              if (window.confirm("Apakah Anda yakin ingin menghapus semua riwayat diagnosis?")) {
                onClearAllHistory();
              }
            }}
            className="text-xs text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-red-100"
          >
            Hapus Semua Riwayat
          </button>
        )}
      </div>

      <div className="space-y-4" id="history-cases-list">
        {diagnosisCases.length > 0 ? (
          diagnosisCases.map((msg) => {
            const diag = msg.diagnosisResult as DiagnosisResult;
            const isSelected = selectedCaseId === msg.id;

            return (
              <div
                key={msg.id}
                id={`history-card-${msg.id}`}
                className={`bg-white rounded-2xl border transition-all ${
                  isSelected ? "border-amber-500 shadow-md ring-1 ring-amber-500/10" : "border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                {/* Header Block clickable */}
                <div
                  onClick={() => toggleCase(msg.id)}
                  className="p-5 flex justify-between items-center cursor-pointer select-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {msg.timestamp}
                      </span>
                      <span>•</span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                        {msg.cropType || "Umum"}
                      </span>
                      <span>•</span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded-full ${
                          diag.overallSeverity === "Berat"
                            ? "bg-red-50 text-red-700"
                            : diag.overallSeverity === "Sedang"
                            ? "bg-orange-50 text-orange-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        Serangan: {diag.overallSeverity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-slate-900 text-base">
                        {diag.suspectedPests[0]?.name || "Diagnosis Hama"}
                      </h5>
                      {diag.suspectedPests[0] && (
                        <span className="text-xs text-slate-400 italic font-mono">
                          ({diag.suspectedPests[0].scientificName})
                        </span>
                      )}
                    </div>

                    {msg.image && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md font-medium">
                        📸 Memiliki Lampiran Gambar
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      id={`btn-delete-history-${msg.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Hapus kasus ini dari riwayat?")) {
                          onDeleteHistoryItem(msg.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Hapus Riwayat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="text-slate-400 text-xs font-semibold">
                      {isSelected ? "Tutup" : "Tinjau"}
                    </span>
                  </div>
                </div>

                {/* Expanded Diagnosis Content */}
                <AnimatePresence initial={false}>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                    >
                      <div className="p-5 space-y-5 text-sm">
                        {/* Intro */}
                        <div className="bg-white p-4 rounded-xl border border-slate-100">
                          <p className="text-slate-700 leading-relaxed text-xs">
                            {diag.introAnalysis}
                          </p>
                        </div>

                        {/* All Suspected Pests list */}
                        <div>
                          <h6 className="font-semibold text-slate-800 flex items-center gap-1.5 mb-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            Daftar Kemungkinan Hama
                          </h6>
                          <div className="space-y-2">
                            {diag.suspectedPests.map((pest, index) => (
                              <div key={index} className="bg-white p-3.5 rounded-xl border border-slate-200">
                                <div className="flex justify-between items-center mb-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900">{pest.name}</span>
                                    <span className="text-xs text-slate-400 italic">({pest.scientificName})</span>
                                  </div>
                                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-md">
                                    Akurasi: {pest.confidence}%
                                  </span>
                                </div>
                                <p className="text-slate-600 text-xs leading-relaxed">{pest.explanation}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Behavior */}
                        <div>
                          <h6 className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                            <Eye className="w-4 h-4 text-emerald-600" />
                            Siklus Hidup & Perilaku Serangan
                          </h6>
                          <p className="text-slate-600 text-xs leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                            {diag.cycleAndBehavior}
                          </p>
                        </div>

                        {/* PHT Recommendations Grid */}
                        <div>
                          <h6 className="font-semibold text-slate-800 flex items-center gap-1.5 mb-2.5">
                            <HeartHandshake className="w-4 h-4 text-emerald-600" />
                            Rencana Tindakan Pengendalian Hama Terpadu (PHT)
                          </h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                              <span className="text-xs font-bold text-slate-800 block mb-1">🌱 Kultur Teknis / Sanitasi</span>
                              <p className="text-slate-600 text-xs leading-relaxed">{diag.phtRecommendations.kulturTeknis}</p>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                              <span className="text-xs font-bold text-slate-800 block mb-1">⚙️ Pengendalian Mekanis</span>
                              <p className="text-slate-600 text-xs leading-relaxed">{diag.phtRecommendations.mekanis}</p>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                              <span className="text-xs font-bold text-emerald-800 block mb-1">🐞 Pengendalian Biologis</span>
                              <p className="text-slate-600 text-xs leading-relaxed">{diag.phtRecommendations.biologis}</p>
                            </div>
                            <div className="bg-red-50 p-3.5 rounded-xl border border-red-100">
                              <span className="text-xs font-bold text-red-800 flex items-center gap-1 mb-1">
                                🧪 Opsi Kimiawi (Pilihan Terakhir)
                              </span>
                              <p className="text-slate-700 text-xs leading-relaxed">{diag.phtRecommendations.kimiawi}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-500 bg-white border border-slate-150 rounded-2xl">
            <Sprout className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">Belum ada riwayat diagnosis tersimpan.</p>
            <p className="text-xs text-slate-400 mt-1">
              Kirimkan keluhan tanaman Anda di menu utama Konsultasi untuk memulai diagnosis pertama.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
