"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Send } from "lucide-react";

interface Props {
  relanceId: string;
}

export default function RelanceButton({ relanceId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  function handleClick() {
    startTransition(async () => {
      const supabase = createClient();
      await supabase
        .from("relances")
        .update({ statut: "relance" })
        .eq("id", relanceId);
      setDone(true);
      router.refresh();
    });
  }

  if (done) {
    return <span className="text-xs text-amber-600 font-medium">Relancé</span>;
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2A9FD6] hover:text-[#238bbf] disabled:opacity-60 transition-colors"
    >
      <Send className="w-3.5 h-3.5" />
      {isPending ? "Envoi..." : "Envoyer une relance"}
    </button>
  );
}
