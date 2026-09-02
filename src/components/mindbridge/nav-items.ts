import {
  Home,
  LayoutDashboard,
  ClipboardCheck,
  MessagesSquare,
  Handshake,
  Brain,
  Target,
  BookOpen,
  Sprout,
  LifeBuoy,
  Lock,
  type LucideIcon,
} from "lucide-react";
import type { TKey } from "@/lib/mindbridge/i18n";

export interface NavItem {
  to: string;
  labelKey: TKey;
  icon: LucideIcon;
  emoji: string;
  primary?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", labelKey: "nav.home", icon: Home, emoji: "🏠", primary: true },
  { to: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard, emoji: "📊", primary: true },
  { to: "/checkin", labelKey: "nav.checkin", icon: ClipboardCheck, emoji: "📝", primary: true },
  { to: "/safetalk", labelKey: "nav.safetalk", icon: MessagesSquare, emoji: "💬", primary: true },
  { to: "/safeconnect", labelKey: "nav.safeconnect", icon: Handshake, emoji: "🤝" },
  { to: "/mindgym", labelKey: "nav.mindgym", icon: Brain, emoji: "🧠", primary: true },
  { to: "/plan", labelKey: "nav.plan", icon: Target, emoji: "🎯" },
  { to: "/journal", labelKey: "nav.journal", icon: BookOpen, emoji: "📖" },
  { to: "/garden", labelKey: "nav.garden", icon: Sprout, emoji: "🌱" },
  { to: "/safety", labelKey: "nav.safety", icon: LifeBuoy, emoji: "🚨" },
  { to: "/privacy", labelKey: "nav.privacy", icon: Lock, emoji: "🔒" },
];
