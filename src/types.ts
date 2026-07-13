export interface SuspectedPest {
  name: string;
  scientificName: string;
  confidence: number;
  explanation: string;
}

export interface PhtRecommendations {
  kulturTeknis: string;
  mekanis: string;
  biologis: string;
  kimiawi: string;
}

export interface DiagnosisResult {
  introAnalysis: string;
  suspectedPests: SuspectedPest[];
  cycleAndBehavior: string;
  phtRecommendations: PhtRecommendations;
  overallSeverity: string;
  interactiveQuestions: string[];
}

export interface EcoContext {
  weather: string;
  cropAge: string;
  locationType: string;
  lastFertilization: string;
  infestationArea: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content?: string;
  timestamp: string;
  isDiagnosis?: boolean;
  diagnosisResult?: DiagnosisResult;
  image?: string; // Optional attached base64 image
  cropType?: string; // Optional attached crop type
  ecoContextAttached?: EcoContext; // Optional attached eco context
}

export interface FieldLog {
  id: string;
  date: string;
  cropType: string;
  cropAge: string;
  weather: string;
  conditionNotes: string;
  pestSeverity: "Ringan" | "Sedang" | "Berat" | "Tidak Ada";
}
