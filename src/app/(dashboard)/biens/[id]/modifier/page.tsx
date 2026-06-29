"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const inputClass =
  "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

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

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("biens")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            adresse: data.adresse ?? "",
            complement_adresse: data.complement_adresse ?? "",
            code_postal: data.code_postal ?? "",
            ville: data.ville ?? "",
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
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("biens")
      .update({
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
      })
      .eq("id", params.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    router.push(`/biens/${params.id}`);
  }

  async function handleDelete() {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("biens")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      setError(deleteError.message);
      setLoading(false);
      return;
    }

    router.push("/biens");
  }

  if (pageLoading) {
    return <div className="text-gray-400 text-sm p-8">Chargement...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/biens/${params.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au bien
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Modifier le bien</h1>
        <p className="text-gray-500 mt-1">Mettez à jour les informations de votre bien.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 max-w-2xl">
        {error && (
          <div className="mb-4 px-4 py-3 bg-rose-50 text-rose-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Adresse *</label>
            <input
              name="adresse"
              type="text"
              required
              value={form.adresse}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Complément d&apos;adresse</label>
            <input
              name="complement_adresse"
              type="text"
              value={form.complement_adresse}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Code postal *</label>
            <input
              name="code_postal"
              type="text"
              required
              value={form.code_postal}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Ville *</label>
            <input
              name="ville"
              type="text"
              required
              value={form.ville}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Type *</label>
            <select
              name="type"
              required
              value={form.type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="appartement">Appartement</option>
              <option value="maison">Maison</option>
              <option value="studio">Studio</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Statut</label>
            <select
              name="statut"
              value={form.statut}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="vacant">Vacant</option>
              <option value="loue">Loué</option>
              <option value="travaux">Travaux</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Surface (m²)</label>
            <input
              name="surface"
              type="number"
              min="0"
              value={form.surface}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Nombre de pièces</label>
            <input
              name="nb_pieces"
              type="number"
              min="0"
              value={form.nb_pieces}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Loyer hors charges (€) *</label>
            <input
              name="loyer"
              type="number"
              min="0"
              required
              value={form.loyer}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Charges (€)</label>
            <input
              name="charges"
              type="number"
              min="0"
              value={form.charges}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Dépôt de garantie (€)</label>
            <input
              name="depot_garantie"
              type="number"
              min="0"
              value={form.depot_garantie}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
          <Link
            href={`/biens/${params.id}`}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Annuler
          </Link>
        </div>
      </form>

      <div className="mt-8 max-w-2xl">
        <div className="border border-rose-100 rounded-xl p-6 bg-rose-50/30">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Zone dangereuse</h3>
          <p className="text-sm text-gray-500 mb-4">
            La suppression de ce bien est irréversible. Toutes les données associées (locataires, quittances, documents) seront également supprimées.
          </p>
          {deleteConfirm ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {loading ? "Suppression..." : "Confirmer la suppression"}
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleDelete}
              className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
            >
              Supprimer ce bien
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
