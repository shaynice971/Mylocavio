"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { GENERIC_SAVE_ERROR } from "@/lib/errors";
import Link from "next/link";
import { ArrowLeft, TrendingUp, CheckCircle } from "lucide-react";

const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all";
const labelClass = "block text-sm font-medium text-gray-500 mb-1.5";

export default function RevisionIrlPage({ params }: { params: { id: string } }) {
  const [bienLoyer, setBienLoyer] = useState<number | null>(null);
  const [bienAdresse, setBienAdresse] = useState("");
  const [loyerActuel, setLoyerActuel] = useState("");
  const [irlRef, setIrlRef] = useState("");
  const [irlNouv, setIrlNouv] = useState("");
  const [result, setResult] = useState<{ nouveauLoyer: number; augmentation: number; pourcentage: number } | null>(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBien() {
      const supabase = createClient();
      const { data } = await supabase.from("biens").select("loyer, adresse").eq("id", params.id).single();
      if (data) { setBienLoyer(data.loyer); setBienAdresse(data.adresse); setLoyerActuel(String(data.loyer)); }
    }
    fetchBien();
  }, [params.id]);

  const calculate = useCallback(() => {
    const l = parseFloat(loyerActuel);
    const r = parseFloat(irlRef);
    const n = parseFloat(irlNouv);
    if (!l || !r || !n || r === 0) { setResult(null); return; }
    const nouveauLoyer = (l * n) / r;
    const augmentation = nouveauLoyer - l;
    const pourcentage = (augmentation / l) * 100;
    setResult({ nouveauLoyer, augmentation, pourcentage });
  }, [loyerActuel, irlRef, irlNouv]);

  useEffect(() => { calculate(); }, [calculate]);

  async function handleApply() {
    if (!result) return;
    setApplyLoading(true); setApplyError(null); setApplySuccess(false);
    const supabase = createClient();
    const { error } = await supabase.from("biens").update({ loyer: Math.round(result.nouveauLoyer * 100) / 100 }).eq("id", params.id);
    if (error) { setApplyError(GENERIC_SAVE_ERROR); } else {
      setApplySuccess(true);
      setBienLoyer(result.nouveauLoyer);
      setLoyerActuel(String(Math.round(result.nouveauLoyer * 100) / 100));
    }
    setApplyLoading(false);
  }

  return (
    <div>
      <div className="mb-8">
        <Link href={`/biens/${params.id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour au bien{bienAdresse ? ` — ${bienAdresse}` : ""}
        </Link>
        <h1 className="text-2xl font-black text-gray-900">Révision annuelle du loyer</h1>
        <p className="text-gray-500 mt-1 text-sm">Calculez le nouveau loyer selon l&apos;Indice de Référence des Loyers (IRL) publié par l&apos;INSEE</p>
      </div>

      <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6 max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Calcul IRL</p>
            <p className="text-gray-400 text-xs">Nouveau loyer = loyer × (IRL nouveau / IRL référence)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass} htmlFor="loyer_actuel">Loyer actuel HC (€)</label>
            <input id="loyer_actuel" type="number" min={0} step="0.01" value={loyerActuel} onChange={(e) => setLoyerActuel(e.target.value)} className={inputClass} placeholder={bienLoyer ? String(bienLoyer) : "ex: 800"} />
          </div>
          <div>
            <label className={labelClass} htmlFor="irl_ref">IRL de référence (trimestre de signature du bail)</label>
            <input id="irl_ref" type="number" step="0.01" value={irlRef} onChange={(e) => setIrlRef(e.target.value)} className={inputClass} placeholder="ex: 143.46" />
          </div>
          <div>
            <label className={labelClass} htmlFor="irl_nouv">IRL du nouveau trimestre</label>
            <input id="irl_nouv" type="number" step="0.01" value={irlNouv} onChange={(e) => setIrlNouv(e.target.value)} className={inputClass} placeholder="ex: 147.22" />
          </div>
          <p className="text-xs text-gray-400">
            L&apos;IRL est publié trimestriellement par l&apos;INSEE. Consultez{" "}
            <a href="https://www.insee.fr" target="_blank" rel="noopener noreferrer" className="text-[#2A9FD6] hover:text-[#5bb8e8] transition-colors">
              insee.fr
            </a>{" "}
            pour les dernières valeurs.
          </p>
        </div>

        {result && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 mb-4 font-mono">
              {loyerActuel} × ({irlNouv} / {irlRef}) =
            </p>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Nouveau loyer HC</p>
                <p className="text-3xl font-black text-[#2A9FD6]">
                  {result.nouveauLoyer.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Augmentation :{" "}
                <span className="font-semibold text-gray-900">
                  +{result.augmentation.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € / mois
                </span>{" "}
                <span className="text-emerald-700">
                  (+{result.pourcentage.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%)
                </span>
              </p>
            </div>

            {applySuccess ? (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl">
                <CheckCircle className="w-4 h-4" />
                Le loyer a été mis à jour avec succès.
              </div>
            ) : (
              <>
                {applyError && (
                  <div className="mb-3 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">{applyError}</div>
                )}
                <button onClick={handleApply} disabled={applyLoading} className="bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25">
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
