import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ALT_SERVER_IP, SERVER_IP } from "@/lib/constants";

export function CopyIpButton() {
  const [copied, setCopied] = useState<"main" | "alt" | null>(null);

  async function handleCopy(ip: string, which: "main" | "alt") {
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(which);
      toast.success(`Copied ${ip}`);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Could not copy — select the IP manually");
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => handleCopy(SERVER_IP, "main")}
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm border border-gold/40 bg-gold px-6 py-3.5 font-display text-sm font-semibold tracking-[0.14em] text-ink uppercase transition duration-300 hover:bg-gold-bright hover:shadow-[0_0_40px_rgba(201,150,46,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        aria-label={`Copy server IP ${SERVER_IP}`}
      >
        <span className="absolute inset-0 translate-y-full bg-gradient-to-t from-ember/30 to-transparent transition duration-500 group-hover:translate-y-0" />
        <span className="relative">{copied === "main" ? "Copied" : "Copy Server IP"}</span>
        <span className="relative hidden font-body text-xs font-normal normal-case tracking-normal text-ink/70 sm:inline">
          {SERVER_IP}
        </span>
        {copied === "main" ? (
          <Check className="relative size-4" aria-hidden />
        ) : (
          <Copy className="relative size-4" aria-hidden />
        )}
      </button>

      <button
        type="button"
        onClick={() => handleCopy(ALT_SERVER_IP, "alt")}
        className="group inline-flex items-center gap-2 font-body text-xs text-parchment/55 transition hover:text-gold focus-visible:outline-none focus-visible:text-gold"
        aria-label={`Copy alternate server IP ${ALT_SERVER_IP}`}
        title="Use this address if the main one doesn't resolve"
      >
        <span className="inline-block size-1.5 rounded-full bg-steam" aria-hidden />
        <span>
          Can't connect? Direct IP:{" "}
          <span className="text-parchment/80 underline decoration-dotted underline-offset-4 group-hover:text-gold">
            {ALT_SERVER_IP}
          </span>
        </span>
        {copied === "alt" ? (
          <Check className="size-3.5 text-gold" aria-hidden />
        ) : (
          <Copy className="size-3.5 opacity-60" aria-hidden />
        )}
      </button>
    </div>
  );
}
