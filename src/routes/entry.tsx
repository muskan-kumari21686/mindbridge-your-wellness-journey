import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/mindbridge/WellnessBits";
import { generateAnonId } from "@/lib/mindbridge/mock-data";
import { useMindBridge } from "@/lib/mindbridge/store";

export const Route = createFileRoute("/entry")({
  head: () => ({
    meta: [
      { title: "Anonymous Entry — MindBridge" },
      {
        name: "description",
        content:
          "Enter MindBridge with an anonymous ID. No name, email, phone number or account required.",
      },
      { property: "og:title", content: "Anonymous Entry — MindBridge" },
      {
        property: "og:description",
        content: "Your wellness journey is linked to an anonymous ID, not your identity.",
      },
    ],
  }),
  component: EntryPage,
});

function EntryPage() {
  const { anonId, setAnonId } = useMindBridge();
  const navigate = useNavigate();
  const [id, setId] = useState("MB-7F3A92");
  const [spin, setSpin] = useState(false);

  useEffect(() => {
    setId(anonId ?? generateAnonId());
  }, [anonId]);

  const regenerate = () => {
    setSpin(true);
    setId(generateAnonId());
    setTimeout(() => setSpin(false), 500);
  };

  return (
    <div className="canvas-glow flex min-h-screen items-center justify-center px-4 py-12">
      <div className="surface animate-rise w-full max-w-lg p-8 sm:p-10">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          <ShieldCheck className="size-6" />
        </span>
        <h1 className="mt-5 text-3xl">You're entering MindBridge anonymously.</h1>
        <p className="mt-3 text-muted-foreground">
          Your wellness journey is linked to an anonymous ID rather than your personal identity.
        </p>

        <div className="mt-7 rounded-2xl border border-dashed border-primary/40 bg-secondary/50 px-5 py-6 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Your anonymous ID
          </p>
          <p
            className={`mt-2 font-display text-4xl tracking-tight transition-opacity ${spin ? "opacity-40" : "opacity-100"}`}
          >
            {id}
          </p>
        </div>

        <ul className="mt-6 grid gap-2 text-sm text-muted-foreground">
          {["No name", "No email", "No phone number", "No college ID", "No social account"].map(
            (x) => (
              <li key={x} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" /> {x} requested
              </li>
            ),
          )}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1 rounded-xl"
            size="lg"
            onClick={() => {
              setAnonId(id);
              navigate({ to: "/checkin" });
            }}
          >
            Continue <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" size="lg" className="rounded-xl" onClick={regenerate}>
            <RefreshCw className={`size-4 ${spin ? "animate-spin" : ""}`} /> Generate New ID
          </Button>
        </div>

        <div className="mt-6">
          <Disclaimer>
            The ID and all demo data stay in this browser's local storage. A production version
            would use secure backend storage with encryption and access control.
          </Disclaimer>
        </div>
      </div>
    </div>
  );
}
