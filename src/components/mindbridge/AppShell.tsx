import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, Sparkle, LifeBuoy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NAV_ITEMS } from "./nav-items";
import { useMindBridge, gardenStage } from "@/lib/mindbridge/store";
import { LanguageSelector } from "./LanguageSelector";

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
        <Sparkle className="size-4.5" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-lg font-semibold">MindBridge</span>
          <span className="block text-[11px] text-muted-foreground">
            Recognize. Support. Connect.
          </span>
        </span>
      )}
    </Link>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useMindBridge();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1" aria-label="Main navigation">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[var(--shadow-soft)]"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <item.icon className={cn("size-4.5 shrink-0", active && "text-primary")} />
            <span>{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function XpBadge() {
  const { xp } = useMindBridge();
  const { stage, progress } = gardenStage(xp);
  return (
    <Link
      to="/garden"
      className="surface flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-shadow hover:shadow-[var(--shadow-lift)]"
    >
      <span className="text-2xl" aria-hidden>
        {stage.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-muted-foreground">Mood Garden · {stage.name}</span>
        <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </span>
      </span>
      <span className="text-xs font-semibold text-primary">{xp} XP</span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { anonId } = useMindBridge();

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-68 flex-col gap-6 border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <BrandMark />
        <XpBadge />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <NavList />
        </div>
        <div className="space-y-3">
          <LanguageSelector />
          <Button asChild variant="destructive" className="w-full rounded-xl">
            <Link to="/safety">
              <LifeBuoy className="size-4" /> Get Help Now
            </Link>
          </Button>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {anonId ? `Signed in anonymously as ${anonId}` : "Browsing anonymously"}
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
        <BrandMark />
        <div className="flex items-center gap-2">
          <LanguageSelector compact />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl" aria-label="Open menu">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[17rem] bg-sidebar p-5">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mb-5">
                <BrandMark />
              </div>
              <XpBadge />
              <div className="mt-4">
                <NavList onNavigate={() => setOpen(false)} />
              </div>
              <Button asChild variant="destructive" className="mt-5 w-full rounded-xl">
                <Link to="/safety" onClick={() => setOpen(false)}>
                  <LifeBuoy className="size-4" /> Get Help Now
                </Link>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="pb-24 lg:ml-68 lg:pb-0">{children}</main>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-border bg-background/95 px-1 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
        aria-label="Quick navigation"
      >
        <MobileNav />
      </nav>
    </div>
  );
}

function MobileNav() {
  const { t } = useMindBridge();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <>
      {NAV_ITEMS.filter((i) => i.primary).map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="size-5" />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="animate-rise mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">{children}</div>;
}
