/**
 * Minimal i18n dictionary for the prototype.
 * Adding a language = adding a key here plus an entry in LANGUAGES.
 * A production build would load these from a translation service / CDN.
 */

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

const dict = {
  "nav.home": { en: "Home", hi: "होम" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "nav.checkin": { en: "Check-in", hi: "चेक-इन" },
  "nav.safetalk": { en: "SafeTalk", hi: "सेफटॉक" },
  "nav.safeconnect": { en: "SafeConnect", hi: "सेफकनेक्ट" },
  "nav.mindgym": { en: "MindGym", hi: "माइंडजिम" },
  "nav.plan": { en: "Wellness Plan", hi: "वेलनेस योजना" },
  "nav.journal": { en: "Journal", hi: "डायरी" },
  "nav.garden": { en: "Mood Garden", hi: "मूड गार्डन" },
  "nav.safety": { en: "Safety", hi: "सुरक्षा" },
  "nav.privacy": { en: "Privacy", hi: "गोपनीयता" },
  "common.welcome": {
    en: "Welcome to your MindBridge space",
    hi: "आपके MindBridge स्पेस में आपका स्वागत है",
  },
  "common.anonId": { en: "Anonymous ID", hi: "गुमनाम आईडी" },
  "common.mood": { en: "Mood", hi: "मनोदशा" },
  "common.stress": { en: "Stress", hi: "तनाव" },
  "common.sleep": { en: "Sleep", hi: "नींद" },
  "common.energy": { en: "Energy", hi: "ऊर्जा" },
  "common.confidence": { en: "Confidence", hi: "आत्मविश्वास" },
  "common.loneliness": { en: "Loneliness", hi: "अकेलापन" },
  "common.startAnon": { en: "Start Anonymously", hi: "गुमनाम रूप से शुरू करें" },
  "common.explore": { en: "Explore MindBridge", hi: "MindBridge देखें" },
  "common.todaysWellness": { en: "Today's Wellness", hi: "आज की वेलनेस" },
  "common.trend": { en: "Wellness Trend", hi: "वेलनेस रुझान" },
  "common.xp": { en: "Wellness XP", hi: "वेलनेस XP" },
  "common.disclaimer": {
    en: "MindBridge provides mental-wellness support and does not replace professional diagnosis or treatment.",
    hi: "MindBridge मानसिक-स्वास्थ्य सहयोग देता है और यह पेशेवर निदान या उपचार का विकल्प नहीं है।",
  },
} as const;

export type TKey = keyof typeof dict;

export function translate(key: TKey, lang: Lang): string {
  return dict[key][lang] ?? dict[key].en;
}
