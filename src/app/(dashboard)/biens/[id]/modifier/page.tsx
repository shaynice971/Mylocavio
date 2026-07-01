"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all";
const labelClass = "block text-sm font-medium text-gray-500 mb-1.5";
const sectionClass = "text-sm font-bold text-gray-500 uppercase tracking-wider mb-4";

interface FormState {
  adresse: string;
  complement_adresse: string;
  code_postal: string;
  ville: string;
  type: string;
  surface: string;
  nb_pieces: string;
  loyer: string;
  charges: string;
  depot_garantie: string;
  statut: string;
}

export default function ModifierBienPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [form, setForm] = useState<FormState>({
    adresse: "", complement_adresse: "", code_postal: "", ville: "",
    type: "appartement", surface: "", nb_pieces: "", loyer: "",
    charges: "0", depot_garantie: "", statut: "vacant",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.from("biens").select("*").eq("id", params.id).single().then(({ data }) => {
      if (data) {
        setForm({
          adresse: data.adresse ?? "", complement_adresse: data.complement_adresse ?? "",
          code_postal: data.code_postal ?? "", ville: data.ville ?? "",
          type: data.type ?? "appartement",
          surface: data.surface != null ? String(data.surface) : "",
          nb_pieces: data.nb_pieces != null ? String(data.nb_pieces) : "",
          loyer: data.loyer != null ? String(data.loyer) : "",
          charges: data.charges != null ? String(data.charges) : "0",
          depot_garantie: data.depot_garantie != null ? String(data.depot_garantie) : "",
          statut: data.statut ?? "vacant",
        });
      }
      setPageLoading(false);
    });
  }, [params.id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (Number(form.loyer) <= 0) { setError("Le loyer doit être un montant positif."); return; }
    if (form.charges && Number(form.charges) < 0) { setError("Les charges ne peuvent pas être négatives."); return; }
    if (form.surface && Number(form.surface) <= 0) { setError("La surface doit être un nombre positif."); return; }
    if (form.depot_garantie && Number(form.depot_garantie) < 0) { setError("Le dépôt de garantie ne peut pas être négatif."); return; }

    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase.from("biens").update({
      adresse: form.adresse, complement_adresse: form.complement_adresse || null,
      code_postal: form.code_postal, ville: form.ville, type: form.type,
      surface: form.surface ? Number(form.surface) : null,
      nb_pieces: form.nb_pieces ? Number(form.nb_pieces) : null,
      loyer: Number(form.loyer), charges: form.charges ? Number(form.charges) : 0,
      depot_garantie: form.depot_garantie ? Number(form.depot_garantie) : null,
      statut: form.statut,
    }).eq("id", params.id);
    if (updateError) { setError(updateError.message); setLoading(false); return; }
    router.push(`/biens/${params.id}`);
  }

  async function handleDelete() {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    setLoading(true);
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("biens").delete().eq("id", params.id);
    if (deleteError) { setError(deleteError.message); setLoading(false); return; }
    router.push("/biens");
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#2A9FD6]/30 border-t-[#2A9FD6] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href={`/biens/${params.id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour au bien
        </Link>
        <h1 className="text-2xl font-black text-gray-900">Modifier le bien</h1>
        <p className="text-gray-500 mt-1 text-sm">Mettez à jour les informations de votre bien.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {error && (
          <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6">
          <h2 className={sectionClass}>Localisation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="adresse">Adresse *</label>
              <input id="adresse" name="adresse" type="text" required value={form.adresse} onChange={handleChange} className={inputClass} placeholder="12 rue de la Paix" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="complement_adresse">Complément d&apos;adresse</label>
              <input id="complement_adresse" name="complement_adresse" type="text" value={form.complement_adresse} onChange={handleChange} className={inputClass} placeholder="Appartement 3B" />
            </div>
            <div>
              <label className={labelClass} htmlFor="code_postal">Code postal *</label>
              <input id="code_postal" name="code_postal" type="text" required value={form.code_postal} onChange={handleChange} className={inputClass} placeholder="75001" />
            </div>
            <div>
              <label className={labelClass} htmlFor="ville">Ville *</label>
              <input id="ville" name="ville" type="text" required value={form.ville} onChange={handleChange} className={inputClass} placeholder="Paris" />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6">
          <h2 className={sectionClass}>Caractéristiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} htmlFor="type">Type *</label>
              <select id="type" name="type" required value={form.type} onChange={handleChange} className={inputClass}>
                <option value="appartement">Appartement</option>
                <option value="maison">Maison</option>
                <option value="studio">Studio</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="statut">Statut</label>
              <select id="statut" name="statut" value={form.statut} onChange={handleChange} className={inputClass}>
                <option value="vacant">Vacant</option>
                <option value="loue">Loué</option>
                <option value="travaux">Travaux</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="surface">Surface (m²)</label>
              <input id="surface" name="surface" type="number" min="0" value={form.surface} onChange={handleChange} className={inputClass} placeholder="50" />
            </div>
            <div>
              <label className={labelClass} htmlFor="nb_pieces">Nombre de pièces</label>
              <input id="nb_pieces" name="nb_pieces" type="number" min="0" value={form.nb_pieces} onChange={handleChange} className={inputClass} placeholder="3" />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6">
          <h2 className={sectionClass}>Finances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} htmlFor="loyer">Loyer hors charges (€) *</label>
              <input id="loyer" name="loyer" type="number" min="0" required value={form.loyer} onChange={handleChange} className={inputClass} placeholder="800" />
            </div>
            <div>
              <label className={labelClass} htmlFor="charges">Charges (€)</label>
              <input id="charges" name="charges" type="number" min="0" value={form.charges} onChange={handleChange} className={inputClass} placeholder="0" />
            </div>
            <div>
              <label className={labelClass} htmlFor="depot_garantie">Dépôt de garantie (€)</label>
              <input id="depot_garantie" name="depot_garantie" type="number" min="0" value={form.depot_garantie} onChange={handleChange} className={inputClass} placeholder="1600" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25">
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
          <Link href={`/biens/${params.id}`} className="text-sm text-gray-500 hover:text-gray-600 transition-colors">
            Annuler
          </Link>
        </div>
      </form>

      {/* Danger zone */}
      <div className="mt-10 max-w-2xl border border-rose-200 bg-rose-500/5 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-rose-700 mb-2">Zone dangereuse</h3>
        <p className="text-sm text-gray-400 mb-5">
          La suppression de ce bien est irréversible. Toutes les données associées seront supprimées.
        </p>
        {deleteConfirm ? (
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleDelete} disabled={loading} className="bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
              {loading ? "Suppression..." : "Confirmer la suppression"}
            </button>
            <button type="button" onClick={() => setDeleteConfirm(false)} className="text-sm text-gray-500 hover:text-gray-600 transition-colors">
              Annuler
            </button>
          </div>
        ) : (
          <button type="button" onClick={handleDelete} className="text-sm font-semibold text-rose-700 hover:text-rose-800 transition-colors">
            Supprimer ce bien
          </button>
        )}
      </div>
    </div>
  );
}
