export interface PestDetail {
  id: string;
  name: string;
  scientificName: string;
  cropCategory: "Padi" | "Jagung" | "Cabai & Sayuran" | "Buah-buahan" | "Semua";
  symptoms: string[];
  behavior: string;
  phtRecommendations: {
    kulturTeknis: string;
    mekanis: string;
    biologis: string;
    kimiawi: string;
  };
  imageUrl?: string;
}

export const POCKET_PESTS: PestDetail[] = [
  {
    id: "wbc",
    name: "Wereng Batang Cokelat (WBC)",
    scientificName: "Nilaparvata lugens",
    cropCategory: "Padi",
    symptoms: [
      "Batang padi menguning kemudian berubah cokelat kering.",
      "Tanaman padi tampak seperti terbakar (hopperburn) melingkar.",
      "Terdapat kumpulan serangga kecil kecokelatan di pangkal batang padi, tepat di atas permukaan air."
    ],
    behavior: "Menghisap cairan sel pada pelepah daun padi. Menyukai kondisi rimbun, lembap, dan pemupukan Nitrogen berlebih. Juga merupakan vektor virus kerdil hampa dan kerdil rumput.",
    phtRecommendations: {
      kulturTeknis: "Gunakan varietas tahan (seperti Inpari 30/33/42/43). Terapkan sistem tanam Jajar Legowo (2:1 atau 4:1) untuk mengurangi kelembapan mikro. Hindari dosis pupuk Urea (N) berlebih.",
      mekanis: "Keringkan sawah secara berkala (intermittent irrigation) agar pangkal batang tidak lembap. Amati berkala ambang batas kendali (kendali jika >15 ekor per rumpun).",
      biologis: "Lestarikan musuh alami seperti laba-laba Lycosa, kepik Cyrtorhinus lividipennis, dan gunakan agens hayati jamur entomopatogen Beauveria bassiana atau Metarhizium anisopliae.",
      kimiawi: "Gunakan pestisida sistemik berbahan aktif Pimetrozin atau imidakloprid secara bijak hanya di pangkal batang jika populasi telah melampaui ambang kendali."
    }
  },
  {
    id: "ulat-grayak",
    name: "Ulat Grayak Frugiperda (FAW)",
    scientificName: "Spodoptera frugiperda",
    cropCategory: "Jagung",
    symptoms: [
      "Daun jagung berlubang besar tidak beraturan.",
      "Terdapat serbuk kasar seperti kotoran gergaji di pucuk daun jagung.",
      "Titik tumbuh pucuk jagung rusak/patah."
    ],
    behavior: "Ulat aktif di malam hari dan bersembunyi di dalam corong daun pada siang hari. Larva instar akhir bersifat kanibal dan sangat rakus menghabiskan daun muda jagung pada fase vegetatif.",
    phtRecommendations: {
      kulturTeknis: "Lakukan penanaman serempak di suatu wilayah. Tumpang sari jagung dengan tanaman pengusir seperti kacang-kacangan (Desmodium) untuk menarik musuh alami.",
      mekanis: "Cari kelompok telur (seperti kapas kecokelatan di balik daun) atau larva secara manual di pagi/sore hari, lalu musnahkan.",
      biologis: "Gunakan musuh alami tawon parasitoid Trichogramma sp., semprotkan suspensi virus NPV (Spodoptera frugiperda Multicapsid Nucleopolyhedrovirus), atau bakteri Bacillus thuringiensis (Bt).",
      kimiawi: "Semprotkan insektisida berbahan aktif Emamektin Benzoat atau Klorantraniliprol tepat sasaran ke dalam corong daun jagung yang terserang pada sore hari."
    }
  },
  {
    id: "walang-sangit",
    name: "Walang Sangit",
    scientificName: "Leptocorisa oratorius",
    cropCategory: "Padi",
    symptoms: [
      "Bulir padi menjadi hampa atau terdapat bercak cokelat/hitam di kulit bulir.",
      "Mengeluarkan bau menyengat yang khas saat diganggu.",
      "Padi dipanen dengan kualitas beras yang pecah-pecah."
    ],
    behavior: "Menyerang bulir padi pada fase masak susu. Walang sangit menghisap cairan bulir yang sedang tumbuh sehingga bulir padi mengering atau menjadi hampa.",
    phtRecommendations: {
      kulturTeknis: "Tanam serempak dalam satu hamparan untuk memutus siklus hidup. Bersihkan gulma berdaun sempit (seperti rumput-rumputan) di pematang sawah yang menjadi inang alternatif.",
      mekanis: "Gunakan perangkap bangkai (seperti kepiting mati, keong mas, atau daging busuk) yang diletakkan di tiang bambu pematang untuk mengumpulkan walang sangit, lalu bakar/musnahkan.",
      biologis: "Lepaskan predator seperti laba-laba, atau semprot dengan Beauveria bassiana yang diformulasikan khusus.",
      kimiawi: "Aplikasi insektisida kontak berbahan aktif Deltametrin atau fipronil pada pagi hari sebelum pukul 09.00 saat walang sangit berkumpul di bagian atas kanopi padi."
    }
  },
  {
    id: "penggerek-batang",
    name: "Penggerek Batang Padi Kuning",
    scientificName: "Scirpophaga incertulas",
    cropCategory: "Padi",
    symptoms: [
      "Fase vegetatif: Pucuk padi layu, kering, dan mudah dicabut (gejala 'sundep').",
      "Fase generatif: Malai padi memutih hampa dan tegak berdiri, tidak berisi (gejala 'beluk').",
      "Terdapat lubang gerek kecil di bagian bawah batang padi."
    ],
    behavior: "Kupu-kupu meletakkan telur berlapis bulu halus pada daun padi. Larva menetas kemudian menggerek masuk ke dalam batang padi, merusak jaringan pembuluh angkut air dan nutrisi.",
    phtRecommendations: {
      kulturTeknis: "Atur waktu tanam agar tidak bersamaan dengan puncak penerbangan ngengat. Sabas sabut/lakukan pemangkasan ujung daun bibit padi saat pindah tanam untuk membuang kelompok telur.",
      mekanis: "Kumpulkan kelompok telur di persemaian dan pertanaman secara manual. Genangi sawah setelah panen untuk mematikan larva yang bersembunyi di pangkal jerami.",
      biologis: "Konservasi tawon parasitoid telur (Trichogramma japonicum) dan predator seperti kepik atau laba-laba.",
      kimiawi: "Gunakan insektisida granular (butiran) sistemik berbahan aktif Karbofuran atau Fipronil yang ditaburkan saat pemupukan pertama jika intensitas sundep >10%."
    }
  },
  {
    id: "lalat-buah",
    name: "Lalat Buah",
    scientificName: "Bactrocera sp.",
    cropCategory: "Buah-buahan",
    symptoms: [
      "Terdapat titik hitam bekas sengatan ovipositor pada kulit buah cabai, tomat, atau mangga.",
      "Buah membusuk dari dalam, berair, dan rontok sebelum waktunya.",
      "Jika buah dibelah, terdapat larva/belatung putih kecil bergerak di dalamnya."
    ],
    behavior: "Lalat betina menusuk kulit buah muda untuk menyuntikkan telur. Setelah menetas, belatung memakan daging buah dari dalam, memicu infeksi sekunder bakteri pembusuk.",
    phtRecommendations: {
      kulturTeknis: "Lakukan sanitasi kebun secara ketat: kumpulkan buah-buahan yang rontok ke tanah, lalu kubur sedalam minimal 50 cm atau masukkan kantong plastik tertutup agar belatung mati.",
      mekanis: "Pasang perangkap lalat buah menggunakan atraktan Methyl Eugenol (ME) di dalam botol bekas untuk menangkap lalat jantan, atau lakukan pembungkusan buah sejak dini.",
      biologis: "Manfaatkan semut rangrang sebagai predator alami belatung lalat buah yang jatuh ke tanah untuk berkepompong.",
      kimiawi: "Semprot umpan protein (protein bait) yang dicampur insektisida dosis rendah pada cabang/daun non-buah untuk menarik dan mematikan lalat dewasa."
    }
  },
  {
    id: "kutu-kebul",
    name: "Kutu Kebul (Whitefly)",
    scientificName: "Bemisia tabaci",
    cropCategory: "Cabai & Sayuran",
    symptoms: [
      "Kumpulan serangga putih kecil seperti bedak berterbangan saat daun cabai digoyang.",
      "Daun cabai mengeriting, mengkerut, dan tumbuh kerdil.",
      "Daun berwarna kuning terang mengkilap (gejala virus gemini / bule)."
    ],
    behavior: "Menghisap cairan daun tanaman dan mengeluarkan sekresi madu (honey dew) yang mengundang jamur jelaga hitam. Hama ini sangat berbahaya karena bertindak sebagai penular utama virus gemini.",
    phtRecommendations: {
      kulturTeknis: "Tanam tanaman pembatas/barikade seperti jagung di sekeliling lahan cabai (4-5 baris). Lakukan rotasi tanaman bukan inang (hindari menanam famili solanaceae berturut-turut).",
      mekanis: "Pasang perangkap kuning berperekat (Yellow Sticky Trap) sebanyak 40 lembar per hektar setinggi tajuk tanaman untuk menangkap kutu kebul dewasa.",
      biologis: "Gunakan agens hayati jamur Beauveria bassiana atau Lecanicillium lecanii yang disemprotkan di balik permukaan daun pada sore hari.",
      kimiawi: "Aplikasi insektisida berbahan aktif Abamektin, Imidakloprid, atau Diafentiuron secara berselang-seling untuk mencegah resistensi."
    }
  },
  {
    id: "ulat-grayak-cabai",
    name: "Ulat Grayak Cabai / Sayur",
    scientificName: "Spodoptera litura",
    cropCategory: "Cabai & Sayuran",
    symptoms: [
      "Daun cabai/bawang berlubang-lubang hingga hanya menyisakan tulang daun.",
      "Kerusakan parah pada daun tampak transparan atau menerawang (karena lapisan epidermis dimakan).",
      "Ulat berwarna cokelat/hijau gelap dengan bintik segitiga hitam di tubuh samping."
    ],
    behavior: "Ulat muda hidup berkelompok merusak daun, sedangkan ulat dewasa menyebar dan aktif menyerang pada malam hari. Menyukai cuaca hangat dan kering.",
    phtRecommendations: {
      kulturTeknis: "Lakukan sanitasi gulma di sekitar pertanaman yang menjadi sarang ngengat. Atur waktu tanam serempak.",
      mekanis: "Kumpulkan kelompok telur dan ulat instar awal yang bergerombol di balik daun secara manual. Pasang perangkap lampu (Light Trap) di malam hari untuk menangkap ngengat dewasa.",
      biologis: "Semprotkan suspensi Sl-NPV (Spodoptera litura Nuclear Polyhedrovirus) atau gunakan agens hayati nematoda entomopatogen (Steinernema sp.).",
      kimiawi: "Gunakan insektisida berbahan aktif Lufenuron, Klorfenapir, atau Spinetoram dengan volume semprot tinggi menyasar permukaan bawah daun."
    }
  },
  {
    id: "kutu-daun",
    name: "Kutu Daun (Aphids)",
    scientificName: "Aphis gossypii",
    cropCategory: "Cabai & Sayuran",
    symptoms: [
      "Daun muda mengeriput, melengkung ke bawah, dan pucuk kerdil.",
      "Permukaan daun lengket dan terdapat lapisan hitam (embun jelaga) akibat jamur.",
      "Kumpulan serangga kecil berwarna hijau gelap, kuning, atau hitam menumpuk di pucuk tunas."
    ],
    behavior: "Menghisap cairan sel tanaman terutama pada tunas muda dan daun bawah. Mengeluarkan embun madu yang memicu jamur jelaga hitam dan mengundang semut. Vektor pembawa virus mosaik.",
    phtRecommendations: {
      kulturTeknis: "Tanam varietas tahan dan kurangi aplikasi nitrogen berlebih. Bersihkan sisa tanaman gulma.",
      mekanis: "Semprot tanaman dengan air bertekanan tinggi di pagi hari untuk merontokkan koloni kutu daun. Pasang mulsa plastik perak untuk memantulkan cahaya matahari guna menghalau kedatangan kutu.",
      biologis: "Pelihara predator alami kepik helm (Coccinellidae), larva lalat Syrphidae, dan lacewing.",
      kimiawi: "Aplikasi sabun kalium/pestisida organik berbahan minyak neem (mimba), atau insektisida sistemik berbahan aktif Tiametoksam jika serangan kritis."
    }
  }
];
