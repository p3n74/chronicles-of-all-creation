import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SERVER_IP } from "@/lib/constants";

export function CopyIpButton() {
  const [copied, setCopied] = useState<"main" | null>(null);

  async function handleCopy(ip: string, which: "main") {
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(which);
      toast.success(`Copied ${ip}`);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Could not copy. Select the IP manually.");
    }
  }

  return (
    <button
      type="button"
      onClick={() => handleCopy(SERVER_IP, "main")}
      className="inline-flex items-center gap-3 border border-gold/50 bg-gold px-6 py-3.5 font-display text-sm font-semibold tracking-[0.12em] text-ink uppercase transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-gold-bright active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      aria-label={`Copy server IP ${SERVER_IP}`}
    >
      <span>{copied === "main" ? "Copied" : "Copy server IP"}</span>
      <span className="hidden font-body text-xs font-normal normal-case tracking-normal text-ink/70 sm:inline">
        {SERVER_IP}
      </span>
      {copied === "main" ? (
        <Check className="size-4" aria-hidden />
      ) : (
        <Copy className="size-4" aria-hidden />
      )}
    </button>
  );
}
