import React, { useState } from "react";
import { POCKET_PESTS, PestDetail } from "../data/pests";
import { Search, Sprout, ShieldAlert, HeartHandshake, Eye, BookOpen, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PocketGuideProps {
  onAskAboutPest: (pestName: string) => void;
}

export default function PocketGuide({ onAskAboutPest }: PocketGuideProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [expandedPestId, setExpandedPestId] = useState<string | null>(null);

  const categories = ["Semua", "Padi", "Jagung", "Cabai & Sayuran", "Buah-buahan"];

  const filteredPests = POCKET_PESTS.filter((pest) => {
    const matchesSearch =
      pest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pest.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pest.behavior.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Semua" || pest.cropCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedPestId(expandedPestId === id ? null : id);
  };

  return (
    <div className="space-y-6" id="pocket-guide-container">
      {/* Header */}
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3">
        <BookOpen className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-emerald-900 font-semibold text-lg">Buku Saku Hama Digital</h3>
          <p className="text-emerald-700 text-sm mt-0.5">
            Katalog cepat hama utama di pertanian Indonesia lengkap dengan biologi perilaku serta rekomendasi PHT (Kultur Teknis, Mekanis, Hayati/Biologis, dan Kimiawi).
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            id="pest-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari hama, nama latin, gejala..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-xs text-sm"
          />
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl max-w-max self-start">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`cat-btn-${cat.replace(/\s+/g, "-")}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-white text-emerald-700 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pests Grid/List */}
      <div className="grid grid-cols-1 gap-4" id="pests-list">
        {filteredPests.length > 0 ? (
          filteredPests.map((pest) => {
            const isExpanded = expandedPestId === pest.id;
            return (
              <div
                key={pest.id}
                id={`pest-card-${pest.id}`}
                className={`bg-white rounded-2xl border transition-all ${
                  isExpanded ? "border-emerald-500 shadow-md ring-1 ring-emerald-500/10" : "border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                {/* Simple Summary Header */}
                <div
                  onClick={() => toggleExpand(pest.id)}
                  className="p-5 flex justify-between items-center cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-700">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-slate-900 text-base">{pest.name}</h4>
                        <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                          {pest.cropCategory}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 italic font-mono mt-0.5 block">
                        {pest.scientificName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      id={`btn-ask-${pest.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskAboutPest(pest.name);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center gap-1.5 transition-colors border border-emerald-100"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Tanya AI
                    </button>
                    <span className="text-slate-400 text-xs font-medium">
                      {isExpanded ? "Tutup" : "Detail"}
                    </span>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-slate-100 bg-slate-50/50"
                    >
                      <div className="p-5 space-y-5 text-sm">
                        {/* Behavior & Bio */}
                        <div>
                          <h5 className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                            <Eye className="w-4 h-4 text-emerald-600" />
                            Biologi & Perilaku Serangan
                          </h5>
                          <p className="text-slate-600 text-xs leading-relaxed">{pest.behavior}</p>
                        </div>

                        {/* Symptoms Checklist */}
                        <div>
                          <h5 className="font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
                            <ShieldAlert className="w-4 h-4 text-amber-600" />
                            Gejala Kerusakan Utama
                          </h5>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {pest.symptoms.map((sym, index) => (
                              <li key={index} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600">
                                <span className="bg-amber-100 text-amber-800 w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">
                                  {index + 1}
                                </span>
                                {sym}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* IPM / PHT Recommendation Grid */}
                        <div>
                          <h5 className="font-semibold text-slate-800 flex items-center gap-1.5 mb-2.5">
                            <HeartHandshake className="w-4 h-4 text-emerald-600" />
                            Panduan Pengendalian Hama Terpadu (PHT)
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                              <span className="text-xs font-bold text-slate-800 block mb-1">🌱 Kultur Teknis / Sanitasi</span>
                              <p className="text-slate-600 text-[11px] leading-relaxed">{pest.phtRecommendations.kulturTeknis}</p>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                              <span className="text-xs font-bold text-slate-800 block mb-1">⚙️ Pengendalian Mekanis</span>
                              <p className="text-slate-600 text-[11px] leading-relaxed">{pest.phtRecommendations.mekanis}</p>
                            </div>
                            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                              <span className="text-xs font-bold text-emerald-800 block mb-1">🐞 Pengendalian Biologis</span>
                              <p className="text-slate-600 text-[11px] leading-relaxed">{pest.phtRecommendations.biologis}</p>
                            </div>
                            <div className="bg-red-50 p-3.5 rounded-xl border border-red-100">
                              <span className="text-xs font-bold text-red-800 flex items-center gap-1 mb-1">
                                🧪 Opsi Kimiawi (Pilihan Terakhir)
                              </span>
                              <p className="text-slate-700 text-[11px] leading-relaxed">{pest.phtRecommendations.kimiawi}</p>
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
            <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm">Hama tidak ditemukan. Coba gunakan kata kunci lainnya.</p>
          </div>
        )}
      </div>
    </div>
  );
}
