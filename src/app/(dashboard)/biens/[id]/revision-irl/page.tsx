"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const inputClass =
  "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent bg-white";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

export default function RevisionIrlPage({ params }: { params: { id: string } }) {
  const [bienLoyer, setBienLoyer] = useState<number | null>(null);
  const [bienAdresse, setBienAdresse] = useState("");

  const [loyerActuel, setLoyerActuel] = useState("");
  const [irlRef, setIrlRef] = useState("");
  const [irlNouv, setIrlNouv] = useState("");

  const [result, setResult] = useState<{
    nouveauLoyer: number;
    augmentation: number;
    pourcentage: number;
  } | null>(null);

  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBien() {
      const supabase = createClient();
      const { data } = await supabase
        .from("biens")
        .select("loyer, adresse")
        .eq("id", params.id)
        .single();
      if (data) {
        setBienLoyer(data.loyer);
        setBienAdresse(data.adresse);
        setLoyerActuel(String(data.loyer));
      }
    }
    fetchBien();
  }, [params.id]);

  const calculate = useCallback(() => {
    const l = parseFloat(loyerActuel);
    const r = parseFloat(irlRef);
    const n = parseFloat(irlNouv);
    if (!l || !r || !n || r === 0) {
      setResult(null);
      return;
    }
    const nouveauLoyer = (l * n) / r;
    const augmentation = nouveauLoyer - l;
    const pourcentage = (augmentation / l) * 100;
    setResult({ nouveauLoyer, augmentation, pourcentage });
  }, [loyerActuel, irlRef, irlNouv]);

  useEffect(() => {
    calculate();
  }, [calculate]);

  async function handleApply() {
    if (!result) return;
    setApplyLoading(true);
    setApplyError(null);
    setApplySuccess(false);

    const supabase = createClient();
    const { error } = await supabase
      .from("biens")
      .update({ loyer: Math.round(result.nouveauLoyer * 100) / 100 })
      .eq("id", params.id);

    if (error) {
      setApplyError(error.message);
    } else {
      setApplySuccess(true);
      setBienLoyer(result.nouveauLoyer);
      setLoyerActuel(String(Math.round(result.nouveauLoyer * 100) / 100));
    }
    setApplyLoading(false);
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href={`/biens/${params.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au bien{bienAdresse ? ` — ${bienAdresse}` : ""}
        </Link>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Révision annuelle du loyer</h1>
        <p className="text-gray-500 mt-1">
          Calculez le nouveau loyer selon l&apos;Indice de Référence des Loyers (IRL) publié par
          l&apos;INSEE
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8 max-w-xl">
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Loyer actuel HC (€)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={loyerActuel}
              onChange={(e) => setLoyerActuel(e.target.value)}
              className={inputClass}
              placeholder={bienLoyer ? String(bienLoyer) : "ex: 800"}
            />
          </div>
          <div>
            <label className={labelClass}>IRL de référence (trimestre de signature du bail)</label>
            <input
              type="number"
              step="0.01"
              value={irlRef}
              onChange={(e) => setIrlRef(e.target.value)}
              className={inputClass}
              placeholder="ex: 143.46"
            />
          </div>
          <div>
            <label className={labelClass}>IRL du nouveau trimestre</label>
            <input
              type="number"
              step="0.01"
              value={irlNouv}
              onChange={(e) => setIrlNouv(e.target.value)}
              className={inputClass}
              placeholder="ex: 147.22"
            />
          </div>
          <p className="text-xs text-gray-400">
            L&apos;IRL est publié trimestriellement par l&apos;INSEE. Consultez{" "}
            <a
              href="https://www.insee.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#2A9FD6] hover:underline"
            >
              insee.fr
            </a>{" "}
            pour les dernières valeurs.
          </p>
        </div>

        {result && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-4 font-mono">
              Nouveau loyer = {loyerActuel} × ({irlNouv} / {irlRef})
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Nouveau loyer HC</p>
                <p className="text-3xl font-bold text-[#2A9FD6]">
                  {result.nouveauLoyer.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  €
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Augmentation :{" "}
                <span className="font-medium text-gray-900">
                  +
                  {result.augmentation.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  € / mois
                </span>{" "}
                <span className="text-gray-400">
                  (+
                  {result.pourcentage.toLocaleString("fr-FR", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                  %)
                </span>
              </p>
            </div>

            {applySuccess ? (
              <div className="mt-5 px-4 py-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg">
                Le loyer a été mis à jour avec succès.
              </div>
            ) : (
              <>
                {applyError && (
                  <div className="mt-4 px-4 py-3 bg-rose-50 text-rose-600 text-sm rounded-lg">
                    {applyError}
                  </div>
                )}
                <button
                  onClick={handleApply}
                  disabled={applyLoading}
                  className="mt-5 bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                >
                  {applyLoading ? "Mise à jour..." : "Appliquer ce loyer"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
