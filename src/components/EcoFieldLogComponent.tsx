import React, { useState } from "react";
import { FieldLog } from "../types";
import { Plus, Trash2, Calendar, Cloud, Compass, CheckCircle2, Circle, Sparkles, Tag } from "lucide-react";

interface EcoFieldLogComponentProps {
  logs: FieldLog[];
  activeLogId: string | null;
  onAddLog: (log: Omit<FieldLog, "id" | "date">) => void;
  onDeleteLog: (id: string) => void;
  onSetActiveLog: (id: string | null) => void;
}

export default function EcoFieldLogComponent({
  logs,
  activeLogId,
  onAddLog,
  onDeleteLog,
  onSetActiveLog,
}: EcoFieldLogComponentProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [cropType, setCropType] = useState("Padi");
  const [cropAge, setCropAge] = useState("");
  const [weather, setWeather] = useState("Cerah");
  const [pestSeverity, setPestSeverity] = useState<"Ringan" | "Sedang" | "Berat" | "Tidak Ada">("Tidak Ada");
  const [conditionNotes, setConditionNotes] = useState("");

  const weatherOptions = [
    "Cerah",
    "Berawan / Mendung",
    "Hujan Ringan",
    "Hujan Lebat (Intensitas Tinggi)",
    "Kemarau Kering",
    "Pancaroba / Berangin"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropAge) return;

    onAddLog({
      cropType,
      cropAge: cropAge + " HST (Hari Setelah Tanam)",
      weather,
      pestSeverity,
      conditionNotes,
    });

    // Reset Form
    setCropAge("");
    setConditionNotes("");
    setPestSeverity("Tidak Ada");
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6" id="field-log-manager">
      {/* Header Info */}
      <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl flex items-start gap-3">
        <Compass className="w-6 h-6 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sky-900 font-semibold text-lg">Catatan Ekologi Lahan</h3>
          <p className="text-sky-700 text-sm mt-0.5">
            Catat keadaan lingkungan, usia tanaman, dan iklim mikro sawah/kebunmu. Aktifkan catatan sebagai <strong>Konteks Ekologi</strong> agar Konsultan AI dapat memberikan analisis PHT yang lebih akurat sesuai cuaca setempat!
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-slate-800 text-base">Riwayat Kondisi Lahan</h4>
        <button
          id="btn-toggle-add-log-form"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? "Batal" : "Catat Kondisi Baru"}
        </button>
      </div>

      {/* Form to Add New Log */}
      {showAddForm && (
        <form
          id="add-log-form"
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Crop Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Tanaman</label>
              <select
                id="form-crop-type"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                <option value="Padi">🌾 Padi</option>
                <option value="Jagung">🌽 Jagung</option>
                <option value="Cabai">🌶️ Cabai</option>
                <option value="Bawang Merah">🧅 Bawang Merah</option>
                <option value="Tomat">🍅 Tomat</option>
                <option value="Jeruk">🍊 Jeruk</option>
                <option value="Mangga">🥭 Mangga</option>
                <option value="Sawi / Sayuran">🥬 Sawi / Sayuran</option>
              </select>
            </div>

            {/* Crop Age */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Umur Tanaman (HST / Hari)</label>
              <input
                type="number"
                id="form-crop-age"
                required
                placeholder="Contoh: 25"
                value={cropAge}
                onChange={(e) => setCropAge(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            {/* Localized Weather */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Cuaca Belakangan Ini</label>
              <select
                id="form-weather"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                {weatherOptions.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            {/* Existing Pest Sighting */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tingkat Serangan Hama Terlihat
              </label>
              <div className="flex gap-2">
                {(["Tidak Ada", "Ringan", "Sedang", "Berat"] as const).map((sev) => (
                  <button
                    key={sev}
                    id={`btn-sev-${sev.replace(/\s+/g, "-")}`}
                    type="button"
                    onClick={() => setPestSeverity(sev)}
                    className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${
                      pestSeverity === sev
                        ? sev === "Tidak Ada"
                          ? "bg-slate-100 text-slate-800 border-slate-300 font-semibold"
                          : sev === "Ringan"
                          ? "bg-amber-50 text-amber-800 border-amber-300 font-semibold"
                          : sev === "Sedang"
                          ? "bg-orange-50 text-orange-800 border-orange-300 font-semibold"
                          : "bg-red-50 text-red-800 border-red-300 font-semibold"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Condition Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan Lahan</label>
            <textarea
              id="form-notes"
              rows={2}
              placeholder="Misal: Dosis pupuk urea agak tinggi, ada gulma rumput tebal di parit sawah, banyak laba-laba kecil terlihat..."
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              id="btn-cancel-add-log"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-medium border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
            >
              Batal
            </button>
            <button
              type="submit"
              id="btn-submit-log"
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-xs"
            >
              Simpan Catatan Lahan
            </button>
          </div>
        </form>
      )}

      {/* Logs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="logs-grid-container">
        {logs.length > 0 ? (
          logs.map((log) => {
            const isActive = activeLogId === log.id;
            return (
              <div
                key={log.id}
                id={`log-card-${log.id}`}
                className={`bg-white rounded-2xl border p-5 space-y-4 relative transition-all ${
                  isActive
                    ? "border-sky-500 ring-2 ring-sky-500/10 shadow-sm bg-sky-50/10"
                    : "border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                {/* Header line */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {log.date}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{log.cropType}</span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        {log.cropAge}
                      </span>
                    </div>
                  </div>

                  <button
                    id={`btn-delete-log-${log.id}`}
                    onClick={() => onDeleteLog(log.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus Catatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Badges Info */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-sky-500" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Cuaca Lahan</span>
                      <span className="font-semibold text-slate-700">{log.weather}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-xl flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-500" />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Hama Terpantau</span>
                      <span
                        className={`font-semibold ${
                          log.pestSeverity === "Berat"
                            ? "text-red-600"
                            : log.pestSeverity === "Sedang"
                            ? "text-orange-600"
                            : log.pestSeverity === "Ringan"
                            ? "text-amber-600"
                            : "text-slate-600"
                        }`}
                      >
                        {log.pestSeverity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {log.conditionNotes && (
                  <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600">
                    <strong>Catatan Lahan:</strong> {log.conditionNotes}
                  </div>
                )}

                {/* Activate Action Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {isActive ? (
                    <div className="flex items-center gap-1.5 text-xs text-sky-700 font-semibold bg-sky-100/50 px-2.5 py-1.5 rounded-lg border border-sky-200">
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                      Aktif Sebagai Konteks AI
                    </div>
                  ) : (
                    <button
                      id={`btn-activate-log-${log.id}`}
                      onClick={() => onSetActiveLog(log.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition-colors flex items-center gap-1.5 border border-slate-200 hover:border-sky-200"
                    >
                      <Circle className="w-4 h-4 text-slate-400" />
                      Gunakan Sebagai Konteks AI
                    </button>
                  )}

                  {isActive && (
                    <button
                      id={`btn-deactivate-log-${log.id}`}
                      onClick={() => onSetActiveLog(null)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Nonaktifkan
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-slate-500 bg-white border border-slate-150 rounded-2xl">
            <Compass className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium">Belum ada Catatan Lahan.</p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Simpan catatan lahan pertamamu untuk mendokumentasikan kondisi ekologi dan mempermudah konsultasi hama terpadu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
