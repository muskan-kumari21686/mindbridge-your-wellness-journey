import type { CheckIn, WellnessScores } from "./types";

/**
 * Simulated AI / NLP layer.
 *
 * FUTURE BACKEND NOTE: every function here would become a call into
 * API Layer -> AI/NLP Services -> Safety & Moderation Layer.
 * Signatures are async-friendly on purpose (see api.ts wrappers).
 *
 * SAFETY RULE: nothing here diagnoses. No condition names, no medical claims.
 */

export interface AnalysisResult {
  headline: string;
  summary: string;
  pressureLevel: "steady" | "moderate" | "elevated";
  drivers: string[];
  steps: { label: string; detail: string; to: string }[];
}

export function analyseCheckIn(c: CheckIn): AnalysisResult {
  const load =
    c.stress + c.loneliness + (10 - c.mood) + (10 - c.sleep) + (10 - c.energy) + (10 - c.confidence);
  const pressureLevel: AnalysisResult["pressureLevel"] =
    load >= 38 ? "elevated" : load >= 26 ? "moderate" : "steady";

  const headline =
    pressureLevel === "elevated"
      ? "Your responses suggest you may be carrying a high amount of emotional pressure right now."
      : pressureLevel === "moderate"
        ? "Your responses suggest you may be experiencing increased emotional pressure."
        : "Your responses suggest things feel relatively steady for you today.";

  const drivers: string[] = [];
  if (c.stress >= 7) drivers.push("Stress levels are running high in your self-report.");
  if (c.sleep <= 5) drivers.push("Rest appears to be lower than what usually feels sustainable.");
  if (c.energy <= 5) drivers.push("Your energy reserves seem low at the moment.");
  if (c.confidence <= 5) drivers.push("Self-confidence feels shaky in your responses.");
  if (c.loneliness >= 6) drivers.push("You may be feeling more disconnected from people than usual.");
  if (c.factors.length)
    drivers.push(`You pointed to ${c.factors.join(", ").toLowerCase()} as what's weighing on you.`);
  if (!drivers.length) drivers.push("Nothing stands out sharply — a good moment to build habits.");

  const steps: AnalysisResult["steps"] = [];
  if (c.stress >= 6)
    steps.push({
      label: "Try a 2-minute breathing activity",
      detail: "Breathing Bubble guides a slow inhale–hold–exhale cycle.",
      to: "/mindgym",
    });
  if (c.energy <= 6)
    steps.push({
      label: "Take a short, deliberate break",
      detail: "Step away from screens for ten minutes before your next task.",
      to: "/plan",
    });
  steps.push({
    label: "Write down what's bothering you",
    detail: "Naming a worry in your private journal often shrinks it.",
    to: "/journal",
  });
  if (c.confidence <= 6 || c.mood <= 6)
    steps.push({
      label: "Try a focus activity",
      detail: "A short win in MindGym can reset a difficult afternoon.",
      to: "/mindgym",
    });
  if (c.loneliness >= 5)
    steps.push({
      label: "Talk to someone you trust",
      detail: "SafeConnect lets you reach a demo support profile when you're ready.",
      to: "/safeconnect",
    });

  const summary =
    drivers.slice(0, 2).join(" ") +
    " These are self-reported signals, not a medical assessment.";

  return { headline, summary, pressureLevel, drivers, steps };
}

/* ------------------------------------------------------------------ */
/* Safety & moderation (simulated)                                     */
/* ------------------------------------------------------------------ */

const UNSAFE_PATTERNS: { category: string; words: string[] }[] = [
  { category: "Abusive language", words: ["idiot", "stupid", "shut up", "loser", "moron", "trash"] },
  { category: "Sexual or inappropriate content", words: ["sexy", "nude", "sext", "hookup", "horny"] },
  { category: "Threatening language", words: ["kill you", "beat you", "hurt you", "destroy you", "threat"] },
  { category: "Harassment", words: ["stalk", "follow you home", "leave me your address", "send pics"] },
  { category: "Hate or unsafe content", words: ["hate you people", "go back to your", "worthless people"] },
];

const CRISIS_PATTERNS = [
  "kill myself",
  "end my life",
  "suicide",
  "self harm",
  "self-harm",
  "hurt myself",
  "don't want to live",
  "dont want to live",
  "no reason to live",
];

export interface ModerationResult {
  safe: boolean;
  category?: string;
  reason?: string;
}

export function moderateMessage(text: string): ModerationResult {
  const t = text.toLowerCase();
  for (const rule of UNSAFE_PATTERNS) {
    const hit = rule.words.find((w) => t.includes(w));
    if (hit) {
      return {
        safe: false,
        category: rule.category,
        reason:
          "Your message contains content that may be inappropriate or unsafe. Please rewrite it respectfully.",
      };
    }
  }
  return { safe: true };
}

export function detectCrisis(text: string): boolean {
  const t = text.toLowerCase();
  return CRISIS_PATTERNS.some((p) => t.includes(p));
}

/* ------------------------------------------------------------------ */
/* SafeTalk AI (simulated empathetic responses)                        */
/* ------------------------------------------------------------------ */

interface Intent {
  keys: string[];
  reply: string;
}

const INTENTS: Intent[] = [
  {
    keys: ["stress", "stressed", "pressure", "overwhelm", "too much"],
    reply:
      "That sounds heavy, and it makes sense that you'd feel stretched. Pressure usually piles up from several directions at once. Could we shrink it for a moment — what is the single nearest thing on your list? A two-minute Breathing Bubble first can make that easier to look at.",
  },
  {
    keys: ["focus", "concentrate", "study", "studies", "distracted", "procrastin"],
    reply:
      "Losing focus rarely means you're lazy — it often means your mind is holding too many open tabs. Try this: pick one task, set a ten-minute timer, and allow yourself to stop after it. The Focus Challenge in MindGym is built for exactly this kind of restart.",
  },
  {
    keys: ["lonely", "alone", "isolated", "no friends", "nobody"],
    reply:
      "Feeling unseen is genuinely painful, and saying it out loud takes courage. Connection can start small — one message to one person. If you'd like something gentler than that, SafeConnect lets you talk with a demo support profile whenever you feel ready.",
  },
  {
    keys: ["compar", "everyone else", "behind", "social media", "instagram"],
    reply:
      "Comparison is a rough measuring stick, because you're weighing your full inside story against everyone else's edited outside. What is one thing you handled this week that nobody posted about? Writing it in your journal makes it much harder to dismiss.",
  },
  {
    keys: ["confiden", "not good enough", "failure", "useless", "doubt"],
    reply:
      "Confidence tends to follow evidence, not the other way around. Rather than trying to feel certain first, let's collect a small proof: one task finished today, however minor. I'd note it down — those entries add up faster than they feel like they will.",
  },
  {
    keys: ["sleep", "tired", "insomnia", "can't sleep", "exhaust"],
    reply:
      "Short sleep quietly amplifies everything else you're carrying. Nothing dramatic needed tonight — same wind-down time, screens parked a little earlier, and a slow breathing cycle before bed. Would you like to try the Breathing Bubble now?",
  },
  {
    keys: ["family", "parents", "home", "relationship", "breakup", "friend"],
    reply:
      "Relationships can be both the support and the strain at the same time, and holding both is exhausting. What would you want the other person to understand, if it landed perfectly? Sometimes drafting it privately first makes the real conversation possible.",
  },
  {
    keys: ["money", "financ", "fees", "job", "career", "placement"],
    reply:
      "Uncertainty about the future has a way of occupying the present. You can't resolve the whole path today, but you can name the next concrete step. What's the smallest action that would move it one inch forward this week?",
  },
];

const FALLBACKS = [
  "Thank you for sharing that with me — it matters that you put it into words. Can you tell me a bit more about when this feeling tends to show up?",
  "I hear you, and you don't have to have it figured out to talk about it. What would 'a slightly better day' look like for you tomorrow?",
  "That sounds like a lot to hold on your own. If we picked just one part of it to look at together, which part feels loudest right now?",
];

export const CRISIS_REPLY =
  "What you've shared sounds really serious, and I want to be honest with you: I'm an AI support tool and I'm not the right help for this moment. Please reach out right now to emergency services, a trusted person nearby, or a qualified mental-health professional. You can open Safety & Support for the options — you deserve real, immediate care.";

export function safeTalkReply(text: string): string {
  if (detectCrisis(text)) return CRISIS_REPLY;
  const t = text.toLowerCase();
  const intent = INTENTS.find((i) => i.keys.some((k) => t.includes(k)));
  if (intent) return intent.reply;
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)] ?? FALLBACKS[0]!;
}

export function supportPersonReply(text: string, name: string): string {
  const t = text.toLowerCase();
  if (t.includes("stress") || t.includes("exam"))
    return `Thanks for trusting me with that. Exams and deadlines drain a lot of people — you're not weak for feeling it. What's due first? — ${name}`;
  if (t.includes("lonely") || t.includes("alone"))
    return `I'm glad you reached out instead of sitting with it alone. I'm here, take your time. — ${name}`;
  return `I'm listening. Tell me a little more about how that's been for you lately. — ${name}`;
}

export function averageScores(checkIns: CheckIn[]): WellnessScores | null {
  if (!checkIns.length) return null;
  const keys: (keyof WellnessScores)[] = [
    "mood",
    "stress",
    "sleep",
    "energy",
    "confidence",
    "loneliness",
  ];
  const out = {} as WellnessScores;
  for (const k of keys) {
    out[k] = Math.round((checkIns.reduce((s, c) => s + c[k], 0) / checkIns.length) * 10) / 10;
  }
  return out;
}
