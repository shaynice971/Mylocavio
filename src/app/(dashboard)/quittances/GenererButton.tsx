"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { genererQuittancesDuMois } from "@/app/actions/quittances";
import { Plus, CheckCircle } from "lucide-react";

export default function GenererButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  function handleClick() {
    startTransition(async () => {
      try {
        const { count } = await genererQuittancesDuMois();
        setFeedback(
          count === 0
            ? "Aucune nouvelle quittance à générer."
            : `${count} quittance${count > 1 ? "s" : ""} générée${count > 1 ? "s" : ""}.`
        );
        router.refresh();
      } catch {
        setFeedback("Une erreur est survenue.");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      {feedback && (
        <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700 bg-emerald-500/10 border border-emerald-200 px-3 py-1.5 rounded-xl">
          <CheckCircle className="w-3.5 h-3.5" />
          {feedback}
        </span>
      )}
      <button
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25"
      >
        <Plus className="w-4 h-4" />
        {isPending ? "Génération..." : "Générer les quittances du mois"}
      </button>
    </div>
  );
}
