"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { genererQuittancesDuMois } from "@/app/actions/quittances";
import { Plus } from "lucide-react";

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
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
          {feedback}
        </span>
      )}
      <button
        onClick={handleClick}
        disabled={isPending}
        className="flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        {isPending ? "Génération..." : "Générer les quittances du mois"}
      </button>
    </div>
  );
}
