import type { CheckIn, JournalEntry, SupportProfile } from "./types";

/** Demo seed so charts and lists are never empty during a demo. */
export const DEMO_ANON_ID = "MB-7F3A92";

export function generateAnonId(): string {
  const chars = "0123456789ABCDEF";
  let out = "";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]!;
  return `MB-${out}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

export const FACTORS = [
  "Studies",
  "Career",
  "Relationships",
  "Family",
  "Financial pressure",
  "Peer pressure",
  "Social comparison",
  "Sleep",
  "Loneliness",
  "Other",
];

export const DEMO_CHECKINS: CheckIn[] = [
  {
    id: "demo-1",
    date: daysAgo(5),
    mood: 4,
    stress: 8,
    sleep: 4,
    energy: 4,
    confidence: 4,
    loneliness: 6,
    factors: ["Studies", "Sleep"],
  },
  {
    id: "demo-2",
    date: daysAgo(4),
    mood: 5,
    stress: 7,
    sleep: 5,
    energy: 5,
    confidence: 4,
    loneliness: 6,
    factors: ["Studies", "Social comparison"],
  },
  {
    id: "demo-3",
    date: daysAgo(3),
    mood: 5,
    stress: 7,
    sleep: 5,
    energy: 5,
    confidence: 5,
    loneliness: 5,
    factors: ["Career"],
  },
  {
    id: "demo-4",
    date: daysAgo(2),
    mood: 6,
    stress: 6,
    sleep: 6,
    energy: 6,
    confidence: 5,
    loneliness: 4,
    factors: ["Studies"],
  },
  {
    id: "demo-5",
    date: daysAgo(1),
    mood: 6,
    stress: 7,
    sleep: 5,
    energy: 6,
    confidence: 5,
    loneliness: 4,
    factors: ["Studies", "Peer pressure"],
  },
];

export const DEMO_JOURNAL: JournalEntry[] = [
  {
    id: "j-1",
    date: daysAgo(2),
    mood: 6,
    title: "A slightly lighter day",
    body: "Finished one assignment I had been avoiding for a week. Still tired, but it felt good to close one tab in my head.",
  },
  {
    id: "j-2",
    date: daysAgo(4),
    mood: 4,
    title: "Too many comparisons",
    body: "Spent the evening scrolling and feeling behind everyone. Reminding myself that I only see their highlights.",
  },
];

export const SUPPORT_PROFILES: SupportProfile[] = [
  {
    id: "sp-a",
    name: "Support Person A",
    role: "Peer Listener",
    focus: ["Academic stress", "Focus"],
    status: "available",
    languages: ["English", "Hindi"],
    initials: "A",
  },
  {
    id: "sp-b",
    name: "Support Person B",
    role: "Wellness Volunteer",
    focus: ["Loneliness", "Confidence"],
    status: "available",
    languages: ["English"],
    initials: "B",
  },
  {
    id: "sp-c",
    name: "Support Person C",
    role: "Peer Listener",
    focus: ["Sleep", "Family"],
    status: "offline",
    languages: ["Hindi"],
    initials: "C",
  },
];

export const SAFETALK_PROMPTS = [
  "I'm feeling stressed.",
  "I can't focus on my studies.",
  "I feel lonely.",
  "I'm comparing myself with others.",
  "I don't feel confident.",
];
