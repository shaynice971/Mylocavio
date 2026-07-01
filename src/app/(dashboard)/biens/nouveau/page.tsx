"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GENERIC_SAVE_ERROR } from "@/lib/errors";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all";
const labelClass = "block text-sm font-medium text-gray-500 mb-1.5";

export default function NouveauBienPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    adresse: "",
    complement_adresse: "",
    code_postal: "",
    ville: "",
    type: "appartement",
    surface: "",
    nb_pieces: "",
    loyer: "",
    charges: "0",
    depot_garantie: "",
    statut: "vacant",
  });

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
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Vous devez être connecté.");
      setLoading(false);
      return;
    }

    const payload = {
      user_id: user.id,
      adresse: form.adresse,
      complement_adresse: form.complement_adresse || null,
      code_postal: form.code_postal,
      ville: form.ville,
      type: form.type,
      surface: form.surface ? Number(form.surface) : null,
      nb_pieces: form.nb_pieces ? Number(form.nb_pieces) : null,
      loyer: Number(form.loyer),
      charges: form.charges ? Number(form.charges) : 0,
      depot_garantie: form.depot_garantie ? Number(form.depot_garantie) : null,
      statut: form.statut,
    };

    const { data, error: insertError } = await supabase
      .from("biens")
      .insert(payload)
      .select("id")
      .single();

    if (insertError || !data) {
      setError(GENERIC_SAVE_ERROR);
      setLoading(false);
      return;
    }

    router.push(`/biens/${data.id}`);
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/biens" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-600 mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour aux biens
        </Link>
        <h1 className="text-2xl font-black text-gray-900">Ajouter un bien</h1>
        <p className="text-gray-500 mt-1 text-sm">Renseignez les informations de votre logement.</p>
      </div>

      <form onSubmit={handleSubmit} className="border border-gray-200 bg-white shadow-sm rounded-2xl p-8 max-w-2xl">
        {error && (
          <div className="mb-6 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">Localisation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="adresse">Adresse *</label>
            <input id="adresse" name="adresse" type="text" required value={form.adresse} onChange={handleChange} className={inputClass} placeholder="12 rue de la Paix" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="complement_adresse">Complément d&apos;adresse</label>
            <input id="complement_adresse" name="complement_adresse" type="text" value={form.complement_adresse} onChange={handleChange} className={inputClass} placeholder="Bâtiment B, appartement 3" />
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

        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">Caractéristiques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
            <input id="surface" name="surface" type="number" min="0" value={form.surface} onChange={handleChange} className={inputClass} placeholder="45" />
          </div>
          <div>
            <label className={labelClass} htmlFor="nb_pieces">Nombre de pièces</label>
            <input id="nb_pieces" name="nb_pieces" type="number" min="0" value={form.nb_pieces} onChange={handleChange} className={inputClass} placeholder="2" />
          </div>
        </div>

        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">Finances</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-50 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25"
          >
            {loading ? "Enregistrement..." : "Ajouter le bien"}
          </button>
          <Link href="/biens" className="text-sm text-gray-400 hover:text-gray-500 transition-colors">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
