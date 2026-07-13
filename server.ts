import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Set up JSON body parser with a generous limit to handle base64 images
app.use(express.json({ limit: "25mb" }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint to handle pest diagnostics using Gemini API
app.post("/api/diagnose", async (req, res) => {
  try {
    const { symptoms, cropType, image, ecoContext, chatHistory } = req.body;

    if (!symptoms && !image) {
      return res.status(400).json({ error: "Symptom description or crop image is required." });
    }

    // Prepare system instructions to align with requested persona
    const systemInstruction = `
Kamu adalah Ahli Entomologi Proteksi Tanaman dan Konsultan Pertanian Indonesia yang sangat berpengalaman, interaktif, praktis, dan suportif.
Tugas utamamu adalah mendiagnosis masalah hama (khususnya serangga/hewan pengganggu tanaman), menjelaskan perilakunya, dan menyusun strategi Pengendalian Hama Terpadu (PHT) yang ramah lingkungan.

Gaya Bahasa:
Gunakan bahasa Indonesia yang profesional namun santai, mudah dipahami oleh praktisi lapangan atau petani, bersahabat, dan suportif. Berikan penjelasan singkat jika menggunakan istilah ilmiah.

Kamu WAJIB mengembalikan respon dalam format JSON yang valid dengan struktur berikut:
{
  "introAnalysis": "Kalimat pembuka yang bersahabat, menganalisis gejala yang dialami petani secara singkat dan suportif.",
  "suspectedPests": [
    {
      "name": "Nama Umum Hama (Bahasa Indonesia)",
      "scientificName": "Nama Ilmiah (Latin)",
      "confidence": 85, // Angka persentase keyakinan (integer)
      "explanation": "Penjelasan mengapa hama ini dicurigai menyerang berdasarkan gejala."
    }
  ],
  "cycleAndBehavior": "Penjelasan singkat (maksimal 2 kalimat) mengenai siklus hidup atau perilaku hama tersebut menyerang bagian tanaman itu pada fase tertentu.",
  "phtRecommendations": {
    "kulturTeknis": "Pengendalian kultur teknis / sanitasi lahan (misal: penjarangan jarak tanam, rotasi tanaman, pembersihan gulma).",
    "mekanis": "Pengendalian fisik atau mekanis (misal: pemasangan perangkap kuning/ Yellow Sticky Trap, pemendaman sisa tanaman, pemotongan daun terserang).",
    "biologis": "Pengendalian biologis memanfaatkan musuh alami atau agens hayati (misal: pelepasan parasitoid Trichogramma, pemanfaatan jamur entomopatogen Beauveria bassiana).",
    "kimiawi": "Pengendalian kimiawi sebagai opsi terakhir jika ambang ekonomi terlampaui. Sebutkan bahan aktif pestisida spesifik yang tepat guna dan ramah lingkungan beserta anjuran pemakaian bijak."
  },
  "overallSeverity": "Ringan / Sedang / Berat",
  "interactiveQuestions": [
    "Pertanyaan diagnostik lanjutan ke-1 untuk memahami kondisi ekologis lapangan secara lebih detail.",
    "Pertanyaan diagnostik lanjutan ke-2 (jika diperlukan) untuk membantu mempersempit kemungkinan hama."
  ]
}

Aturan Khusus:
1. Jika gejala sangat umum (misal: "daun rontok"), berikan penjelasan bahwa informasi masih umum, sebutkan beberapa kemungkinan serangga/penyebab umum, dan minta informasi tambahan melalui 'interactiveQuestions'.
2. Selalu tekankan bahwa metode kimiawi adalah OPSI TERAKHIR (Ultimum Remedium). Sebutkan bahan aktif yang spesifik (misal: Imidakloprid, Abamektin, dll.), bukan merk dagang.
    `;

    // Construct the contents parts array
    const parts: any[] = [];

    // Add conversational history if provided
    let conversationContext = "";
    if (chatHistory && Array.isArray(chatHistory) && chatHistory.length > 0) {
      conversationContext = "Berikut adalah riwayat obrolan konsultasi sebelumnya untuk konteks tambahan:\n";
      chatHistory.forEach((msg: any) => {
        conversationContext += `${msg.role === "user" ? "Petani" : "Konsultan"}: ${msg.content}\n`;
      });
      conversationContext += "\nMohon jawab keluhan terbaru petani di bawah ini:\n";
    }

    // Build the main text prompt
    let textPrompt = `${conversationContext}`;
    textPrompt += `Jenis Tanaman: ${cropType || "Tidak ditentukan / Umum"}\n`;
    textPrompt += `Gejala Kerusakan / Deskripsi: ${symptoms || "Gambar terlampir"}\n`;

    if (ecoContext) {
      textPrompt += `Konteks Ekologis Lapangan:\n`;
      if (ecoContext.weather) textPrompt += `- Cuaca saat ini: ${ecoContext.weather}\n`;
      if (ecoContext.cropAge) textPrompt += `- Umur tanaman: ${ecoContext.cropAge}\n`;
      if (ecoContext.locationType) textPrompt += `- Lokasi/Jenis lahan: ${ecoContext.locationType}\n`;
      if (ecoContext.lastFertilization) textPrompt += `- Pemupukan terakhir: ${ecoContext.lastFertilization}\n`;
      if (ecoContext.infestationArea) textPrompt += `- Pola serangan: ${ecoContext.infestationArea}\n`;
    }

    textPrompt += `\nLakukan analisis proteksi tanaman berdasarkan detail di atas. Berikan respon dalam format JSON yang valid sesuai petunjuk sistem.`;

    parts.push({ text: textPrompt });

    // Handle optional base64 image data
    if (image) {
      // image is expected to be in format "data:image/jpeg;base64,..."
      const matches = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        });
      }
    }

    // Call Gemini Model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introAnalysis: { type: Type.STRING },
            suspectedPests: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  scientificName: { type: Type.STRING },
                  confidence: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ["name", "scientificName", "confidence", "explanation"],
              },
            },
            cycleAndBehavior: { type: Type.STRING },
            phtRecommendations: {
              type: Type.OBJECT,
              properties: {
                kulturTeknis: { type: Type.STRING },
                mekanis: { type: Type.STRING },
                biologis: { type: Type.STRING },
                kimiawi: { type: Type.STRING },
              },
              required: ["kulturTeknis", "mekanis", "biologis", "kimiawi"],
            },
            overallSeverity: { type: Type.STRING },
            interactiveQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "introAnalysis",
            "suspectedPests",
            "cycleAndBehavior",
            "phtRecommendations",
            "overallSeverity",
            "interactiveQuestions",
          ],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API.");
    }

    // Parse and return the JSON
    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Diagnosis error:", error);
    res.status(500).json({
      error: "Gagal memproses diagnosis.",
      details: error.message || "Kesalahan internal server.",
    });
  }
});

// Endpoint for PHT Educational Assistant (strictly follows the PHT Lesson Guidebook)
app.post("/api/edu-chat", async (req, res) => {
  try {
    const { question, chatHistory } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Pertanyaan wajib disertakan." });
    }

    const systemInstruction = `
Kamu adalah Ahli Entomologi Proteksi Tanaman, Konsultan Pertanian, dan Asisten Edukasi PHT (Pengendalian Hama Terpadu). Tugas utamamu adalah membantu petani memahami materi pelajaran PHT dan menjawab pertanyaan konsultasi secara akurat.

PANDUAN UTAMA (BATASAN PENGETAHUAN):
1. Jawablah pertanyaan pengguna secara KETAT (strictly) berdasarkan dokumen "Buku Panduan PHT" yang disediakan di bawah ini.
2. Jika pengguna menanyakan hal di luar isi dokumen Buku Panduan PHT di bawah ini, jawablah secara persis atau mengacu pada kalimat berikut dengan sopan: "Maaf, sebagai Asisten Modul PHT, saya hanya dapat menjawab pertanyaan yang berkaitan dengan panduan kurikulum PHT yang tersedia di aplikasi ini. Silakan ajukan pertanyaan seputar hama atau materi yang ada pada bab ini ya!"
3. Gunakan bahasa Indonesia yang santai, suportif, mudah dipahami oleh petani lapangan, namun tetap berbasis ilmiah (tuliskan nama latin hama/tanaman jika relevan).

DOKUMEN REFERENSI: BUKU PANDUAN PHT & MATERI PELAJARAN:
==================================================
Bab 1: Prinsip Dasar PHT
- Definisi: Pengendalian Hama Terpadu (PHT) adalah konsep pengendalian hama yang mengutamakan kelestarian lingkungan dengan memadukan berbagai metode ramah lingkungan secara sinergis. Tujuannya adalah menjaga populasi hama tetap di bawah Ambang Batas Ekonomi, bukan memusnahkannya hingga nol ekor.
- 4 Prinsip Dasar PHT:
  1. Budidaya Tanaman Sehat: Menggunakan benih unggul tahan hama, pemupukan berimbang, serta sanitasi lahan. Tanaman yang sehat memiliki imunitas alami yang lebih kuat terhadap gangguan hama.
  2. Pelestarian Musuh Alami: Melindungi organisme predator dan parasitoid di lahan dengan cara meminimalkan penggunaan pestisida kimia sintetis yang bisa membunuh mereka.
  3. Pengamatan Rutin (Monitoring): Melakukan pemantauan lahan minimal seminggu sekali untuk mengamati perkembangan populasi hama dan musuh alami secara real-time.
  4. Petani Menjadi Ahli PHT: Petani diberdayakan agar mandiri dalam menganalisis kondisi ekologi lahan dan mengambil keputusan pengendalian terbaik secara mandiri.

Bab 2: Mengenal Musuh Alami (Sahabat Petani)
- Musuh alami terbagi menjadi tiga golongan utama:
  1. Predator (Pemangsa): Serangga atau hewan yang langsung memburu dan memakan hama tanaman. Contohnya: Laba-laba Serigala (Lycosa pseudoannulata) yang memakan wereng, Kepik Mirid (Cyrtorhinus lividipennis) penyedot telur wereng, Kumbang Kubah (Coccinellidae) pemakan kutu daun, serta Semut Rangrang pemakan berbagai ulat daun.
  2. Parasitoid: Serangga yang meletakkan telurnya di dalam atau pada tubuh hama (inang). Larva parasitoid akan menetas dan perlahan memakan jaringan tubuh inang hingga inang mati. Contohnya: Tawon Trichogramma spp. (parasitoid telur penggerek batang padi) dan Diadegma semiclausum (parasitoid larva ulat kubis Plutella xylostella).
  3. Patogen / Agens Hayati: Mikroorganisme (jamur, bakteri, virus) yang menyebabkan penyakit mematikan pada hama. Contohnya: Jamur Beauveria bassiana (menginfeksi wereng dan kutu-kutuan), Bakteri Bacillus thuringiensis / Bt (menghasilkan kristal protein racun yang merusak pencernaan ulat daun), serta virus Sl-NPV (Spodoptera litura Nuclear Polyhedrovirus) spesifik untuk membasmi ulat grayak.

Bab 3: Ambang Batas Ekonomi (AE) & Ambang Kendali
- Konsep Ambang Ekonomi: Batas kepadatan populasi hama yang memerlukan tindakan pengendalian untuk mencegah terjadinya kerugian ekonomi yang lebih besar daripada biaya pengendalian itu sendiri.
- Ketentuan Batas Kendali Spesifik:
  1. Wereng Batang Cokelat (WBC - Nilaparvata lugens) pada Padi: Pengendalian kimiawi baru boleh dilakukan jika populasi wereng melampaui rata-rata 15 ekor per rumpun pada tanaman berumur kurang dari 40 HST (Hari Setelah Tanam), atau lebih dari 20 ekor per rumpun pada tanaman berumur lebih dari 40 HST.
  2. Ulat Grayak Frugiperda (FAW - Spodoptera frugiperda) pada Jagung: Ambang batas kendali tercapai jika intensitas kerusakan daun tanaman muda (fase vegetatif) telah mencapai lebih dari 20% dari total populasi tanaman contoh yang diamati.
  3. Walang Sangit (Leptocorisa oratorius) pada Padi: Batas kendali adalah jika ditemukan lebih dari 6 ekor walang sangit per meter persegi pada fase masak susu bulir padi.

Bab 4: Pengendalian Kimiawi Secara Bijaksana
- Prinsip Ultimum Remedium: Pestisida kimia sintetis adalah obat darurat atau pilihan terakhir apabila metode ramah lingkungan (kultur teknis, mekanis, hayati) tidak mampu meredam populasi hama yang telah melampaui Ambang Ekonomi.
- Prinsip 6 Tepat Aplikasi Pestisida:
  1. Tepat Sasaran: Mengetahui secara pasti jenis hama penggangu tanaman (apakah ulat, kutu, atau serangga pengunyah) agar tidak salah membeli pestisida.
  2. Tepat Jenis: Memilih jenis pestisida yang paling efektif untuk hama target dan paling aman bagi lingkungan serta musuh alami.
  3. Tepat Dosis & Konsentrasi: Mengikuti petunjuk label takaran, tidak boleh melebihi dosis agar tidak menyebabkan resistensi (hama kebal) dan resurgensi (ledakan populasi hama sekunder).
  4. Tepat Waktu: Mengaplikasikan pestisida saat hama paling rentan atau aktif (contohnya menyemprot ulat grayak pada sore/malam hari karena mereka aktif di malam hari).
  5. Tepat Cara Aplikasi: Menyesuaikan alat dan teknik aplikasi, misalnya menyemprot bagian bawah permukaan daun untuk mengendalikan kutu kebul atau pangkal batang untuk wereng batang cokelat.
  6. Tepat Tempat: Hanya mengaplikasikan pestisida pada bagian atau tanaman yang terserang saja (spot spraying / penyemprotan melingkar lokal), tidak perlu menyemprot seluruh areal sawah jika serangan masih terlokalisir.
==================================================

Kamu WAJIB mengembalikan respon dalam format JSON yang valid dengan struktur berikut:
{
  "reply": "Jawaban terperinci, santai, bersahabat, terstruktur, dan mendalam yang murni bersumber dari dokumen di atas. Jangan sebutkan informasi di luar dokumen.",
  "relevantChapters": ["Daftar bab yang relevan dengan pertanyaan, misal: 'Bab 1: Prinsip Dasar PHT'"],
  "quizTip": "Tips singkat atau rangkuman 1 kalimat yang berguna untuk persiapan menjawab kuis PHT."
}
    `;

    // Construct simple history string for context
    let historyContext = "";
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg: any) => {
        historyContext += `${msg.role === "user" ? "Petani" : "Asisten"}: ${msg.content}\n`;
      });
    }

    const promptText = `${historyContext}Petani bertanya: ${question}\n\nJawablah dengan merujuk secara ketat pada Buku Panduan PHT. Kembalikan format JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { text: promptText },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            relevantChapters: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            quizTip: { type: Type.STRING }
          },
          required: ["reply", "relevantChapters", "quizTip"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API.");
    }

    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Edu-chat error:", error);
    res.status(500).json({
      error: "Gagal memproses edukasi.",
      details: error.message || "Kesalahan internal server."
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // In dev mode, mount Vite as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server mounted as middleware.");
  } else {
    // In production mode, serve built files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
