/**
 * MindBridge core domain types.
 *
 * FUTURE BACKEND NOTE
 * -------------------
 * These types are the contract between the UI and the (currently mocked)
 * data layer. In production the shape stays the same; only the transport
 * changes:
 *   Frontend -> API Layer -> AI/NLP -> Safety & Moderation -> Database
 * See src/lib/mindbridge/api.ts for the seam where real calls plug in.
 */

export type WellnessMetric =
  | "mood"
  | "stress"
  | "sleep"
  | "energy"
  | "confidence"
  | "loneliness";

export interface WellnessScores {
  mood: number;
  stress: number;
  sleep: number;
  energy: number;
  confidence: number;
  loneliness: number;
}

export interface CheckIn extends WellnessScores {
  id: string;
  /** ISO date string (day granularity is enough for the prototype) */
  date: string;
  factors: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: number;
  title: string;
  body: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  blocked?: boolean;
  createdAt: string;
}

export interface SupportProfile {
  id: string;
  name: string;
  role: string;
  focus: string[];
  status: "available" | "offline";
  languages: string[];
  initials: string;
}

export interface MindBridgeState {
  anonId: string | null;
  checkIns: CheckIn[];
  journal: JournalEntry[];
  xp: number;
  completedActivities: string[];
  language: "en" | "hi";
}
