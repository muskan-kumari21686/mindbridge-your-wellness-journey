import { Globe } from "lucide-react";
import { useMindBridge } from "@/lib/mindbridge/store";
import { LANGUAGES, type Lang } from "@/lib/mindbridge/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Language switcher. Add languages in src/lib/mindbridge/i18n.ts. */
export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useMindBridge();

  return (
    <Select value={language} onValueChange={(v) => setLanguage(v as Lang)}>
      <SelectTrigger
        aria-label="Select language"
        className={compact ? "w-[5.5rem] rounded-xl" : "w-full rounded-xl"}
      >
        <Globe className="size-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
