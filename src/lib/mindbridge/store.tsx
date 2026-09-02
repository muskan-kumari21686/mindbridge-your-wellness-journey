import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CheckIn, JournalEntry, MindBridgeState } from "./types";
import { DEMO_CHECKINS, DEMO_JOURNAL, generateAnonId } from "./mock-data";
import { translate, type Lang, type TKey } from "./i18n";

/**
 * Client-side state store (localStorage backed).
 *
 * FUTURE BACKEND NOTE: replace the localStorage read/write with API calls
 * (`GET /me/state`, `POST /checkins`, ...). Component code only touches the
 * actions below, so the swap is contained to this file.
 */

const STORAGE_KEY = "mindbridge.state.v1";

const initialState: MindBridgeState = {
  anonId: null,
  checkIns: DEMO_CHECKINS,
  journal: DEMO_JOURNAL,
  xp: 40,
  completedActivities: [],
  language: "en",
};

export const XP_REWARDS = {
  checkin: 15,
  journal: 10,
  activity: 10,
  action: 5,
} as const;

export const GARDEN_STAGES = [
  { name: "Seed", emoji: "🌱", min: 0 },
  { name: "Sprout", emoji: "🌿", min: 60 },
  { name: "Growing", emoji: "🌳", min: 140 },
  { name: "Bloom", emoji: "🌸", min: 240 },
] as const;

type GardenStage = (typeof GARDEN_STAGES)[number];

export function gardenStage(xp: number) {
  let stage: GardenStage = GARDEN_STAGES[0];
  for (const s of GARDEN_STAGES) if (xp >= s.min) stage = s;
  const index = GARDEN_STAGES.findIndex((s) => s.name === stage.name);
  const next = GARDEN_STAGES[index + 1];
  const progress = next
    ? Math.round(((xp - stage.min) / (next.min - stage.min)) * 100)
    : 100;
  return { stage, next, progress, index };
}

interface StoreValue extends MindBridgeState {
  hydrated: boolean;
  latestCheckIn: CheckIn | null;
  t: (key: TKey) => string;
  setLanguage: (lang: Lang) => void;
  setAnonId: (id: string) => void;
  ensureAnonId: () => string;
  addCheckIn: (c: Omit<CheckIn, "id" | "date">) => CheckIn;
  addJournal: (e: Omit<JournalEntry, "id" | "date">) => void;
  deleteJournal: (id: string) => void;
  awardXp: (amount: number, activity?: string) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function MindBridgeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MindBridgeState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as MindBridgeState) });
    } catch {
      /* ignore corrupt demo data */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable */
    }
  }, [state, hydrated]);

  const setLanguage = useCallback((language: Lang) => setState((s) => ({ ...s, language })), []);
  const setAnonId = useCallback((anonId: string) => setState((s) => ({ ...s, anonId })), []);

  const ensureAnonId = useCallback(() => {
    const id = generateAnonId();
    setState((s) => (s.anonId ? s : { ...s, anonId: id }));
    return state.anonId ?? id;
  }, [state.anonId]);

  const addCheckIn = useCallback((c: Omit<CheckIn, "id" | "date">) => {
    const entry: CheckIn = { ...c, id: `c-${Date.now()}`, date: new Date().toISOString() };
    setState((s) => ({ ...s, checkIns: [...s.checkIns, entry], xp: s.xp + XP_REWARDS.checkin }));
    return entry;
  }, []);

  const addJournal = useCallback((e: Omit<JournalEntry, "id" | "date">) => {
    const entry: JournalEntry = { ...e, id: `j-${Date.now()}`, date: new Date().toISOString() };
    setState((s) => ({ ...s, journal: [entry, ...s.journal], xp: s.xp + XP_REWARDS.journal }));
  }, []);

  const deleteJournal = useCallback((id: string) => {
    setState((s) => ({ ...s, journal: s.journal.filter((j) => j.id !== id) }));
  }, []);

  const awardXp = useCallback((amount: number, activity?: string) => {
    setState((s) => ({
      ...s,
      xp: s.xp + amount,
      completedActivities: activity
        ? [...s.completedActivities.filter((a) => a !== activity), activity]
        : s.completedActivities,
    }));
  }, []);

  const resetDemo = useCallback(() => setState({ ...initialState, anonId: generateAnonId() }), []);

  const value = useMemo<StoreValue>(
    () => ({
      ...state,
      hydrated,
      latestCheckIn: state.checkIns.length ? state.checkIns[state.checkIns.length - 1]! : null,
      t: (key: TKey) => translate(key, state.language),
      setLanguage,
      setAnonId,
      ensureAnonId,
      addCheckIn,
      addJournal,
      deleteJournal,
      awardXp,
      resetDemo,
    }),
    [
      state,
      hydrated,
      setLanguage,
      setAnonId,
      ensureAnonId,
      addCheckIn,
      addJournal,
      deleteJournal,
      awardXp,
      resetDemo,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useMindBridge(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useMindBridge must be used inside MindBridgeProvider");
  return ctx;
}
