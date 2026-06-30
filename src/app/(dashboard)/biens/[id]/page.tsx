"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Home, User, FileText, FolderOpen, Pencil, Plus, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "informations" | "quittances" | "documents";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "informations", label: "Informations", icon: Home },
  { id: "quittances", label: "Quittances", icon: FileText },
  { id: "documents", label: "Documents", icon: FolderOpen },
];

const typeLabels: Record<string, string> = {
  appartement: "Appartement",
  maison: "Maison",
  studio: "Studio",
  autre: "Autre",
};

const inputClass =
  "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

export default function BienDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("informations");
  const [bien, setBien] = useState<Record<string, unknown> | null>(null);
  const [locataire, setLocataire] = useState<Record<string, unknown> | null>(null);
  const [quittances, setQuittances] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  // Ajout locataire
  const [showLocataireForm, setShowLocataireForm] = useState(false);
  const [locForm, setLocForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    date_entree: "",
  });
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  async function loadData() {
    const supabase = createClient();
    const { data: bienData } = await supabase
      .from("biens")
      .select("*")
      .eq("id", params.id)
      .single();
    setBien(bienData);

    if (bienData) {
      const { data: locData } = await supabase
        .from("locataires")
        .select("*")
        .eq("bien_id", params.id)
        .eq("actif", true)
        .maybeSingle();
      setLocataire(locData);

      const { data: qData } = await supabase
        .from("quittances")
        .select("*")
        .eq("bien_id", params.id)
        .order("mois", { ascending: false });
      setQuittances(qData ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function handleLocataireSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocLoading(true);
    setLocError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLocError("Vous devez être connecté.");
      setLocLoading(false);
      return;
    }

    const { error } = await supabase.from("locataires").insert({
      bien_id: params.id,
      user_id: user.id,
      prenom: locForm.prenom,
      nom: locForm.nom,
      email: locForm.email || null,
      telephone: locForm.telephone || null,
      date_entree: locForm.date_entree,
      actif: true,
    });

    if (error) {
      setLocError(error.message);
      setLocLoading(false);
      return;
    }

    setShowLocataireForm(false);
    setLocForm({ prenom: "", nom: "", email: "", telephone: "", date_entree: "" });
    setLocLoading(false);
    router.refresh();
    // Reload local data
    await loadData();
  }

  if (loading) {
    return <div className="text-gray-400 text-sm p-8">Chargement...</div>;
  }

  if (!bien) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Bien introuvable.</p>
        <Link href="/biens" className="text-[#2A9FD6] text-sm mt-2 inline-block">
          ← Retour aux biens
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/biens"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux biens
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{String(bien.adresse)}</h1>
            <p className="text-gray-500 text-sm mt-1">{String(bien.code_postal)} {String(bien.ville)}</p>
          </div>
          <Link
            href={`/biens/${params.id}/modifier`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Modifier
          </Link>
        </div>
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
              activeTab === id
                ? "border-[#2A9FD6] text-[#2A9FD6]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "informations" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="w-4 h-4 text-[#2A9FD6]" />
              Informations du bien
            </h2>
            <dl className="space-y-3 text-sm">
              {[
                ["Type", typeLabels[String(bien.type)] ?? String(bien.type)],
                ["Surface", bien.surface ? `${bien.surface} m²` : "—"],
                ["Nombre de pièces", bien.nb_pieces ? String(bien.nb_pieces) : "—"],
                ["Loyer HC", `${Number(bien.loyer).toLocaleString("fr-FR")} €`],
                ["Charges", `${Number(bien.charges ?? 0).toLocaleString("fr-FR")} €`],
                ["Dépôt de garantie", bien.depot_garantie ? `${Number(bien.depot_garantie).toLocaleString("fr-FR")} €` : "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#2A9FD6]" />
              Locataire
            </h2>
            {locataire ? (
              <dl className="space-y-3 text-sm">
                {([
                  ["Nom", `${locataire.prenom} ${locataire.nom}`],
                  ["Email", locataire.email ?? "—"],
                  ["Téléphone", locataire.telephone ?? "—"],
                  ["Date d'entrée", new Date(String(locataire.date_entree)).toLocaleDateString("fr-FR")],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-medium text-gray-900">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div>
                <p className="text-sm text-gray-400 mb-4">Aucun locataire actif.</p>
                {!showLocataireForm ? (
                  <button
                    onClick={() => setShowLocataireForm(true)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2A9FD6] hover:text-[#238bbf] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un locataire
                  </button>
                ) : (
                  <form onSubmit={handleLocataireSubmit} className="space-y-3">
                    {locError && (
                      <div className="px-3 py-2 bg-rose-50 text-rose-600 text-xs rounded-lg">
                        {locError}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Prénom *</label>
                        <input
                          type="text"
                          required
                          value={locForm.prenom}
                          onChange={(e) => setLocForm((p) => ({ ...p, prenom: e.target.value }))}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Nom *</label>
                        <input
                          type="text"
                          required
                          value={locForm.nom}
                          onChange={(e) => setLocForm((p) => ({ ...p, nom: e.target.value }))}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input
                        type="email"
                        value={locForm.email}
                        onChange={(e) => setLocForm((p) => ({ ...p, email: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Téléphone</label>
                      <input
                        type="tel"
                        value={locForm.telephone}
                        onChange={(e) => setLocForm((p) => ({ ...p, telephone: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Date d&apos;entrée *</label>
                      <input
                        type="date"
                        required
                        value={locForm.date_entree}
                        onChange={(e) => setLocForm((p) => ({ ...p, date_entree: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={locLoading}
                        className="bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        {locLoading ? "Enregistrement..." : "Ajouter"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowLocataireForm(false); setLocError(null); }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
          {/* IRL card */}
          <div className="lg:col-span-2">
            <Link
              href={`/biens/${params.id}/revision-irl`}
              className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-sm transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#2A9FD6]/10 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#2A9FD6]" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#1a1a1a]">Révision annuelle du loyer (IRL)</p>
                  <p className="text-xs text-gray-500 mt-0.5">Recalculez le loyer selon l&apos;indice INSEE</p>
                </div>
              </div>
              <span className="text-sm font-medium text-[#2A9FD6] group-hover:text-[#238bbf] transition-colors">
                Calculer →
              </span>
            </Link>
          </div>
        </div>
      )}

      {activeTab === "quittances" && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {quittances.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Aucune quittance pour ce bien.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Mois</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Montant</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Statut</th>
                </tr>
              </thead>
              <tbody>
                {quittances.map((q) => (
                  <tr key={String(q.id)} className="border-b border-gray-50">
                    <td className="px-6 py-4 text-gray-700 capitalize">
                      {new Date(String(q.mois)).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{Number(q.total).toLocaleString("fr-FR")} €</td>
                    <td className="px-6 py-4 text-gray-500">{String(q.statut)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <FolderOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucun document pour ce bien.</p>
        </div>
      )}
    </div>
  );
}
