"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GENERIC_SAVE_ERROR } from "@/lib/errors";
import Link from "next/link";
import { ArrowLeft, Home, User, FileText, FolderOpen, Pencil, Plus, TrendingUp, Download } from "lucide-react";
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

const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all";
const labelClass = "block text-sm font-medium text-gray-500 mb-1.5";

export default function BienDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("informations");
  const [bien, setBien] = useState<Record<string, unknown> | null>(null);
  const [locataire, setLocataire] = useState<Record<string, unknown> | null>(null);
  const [quittances, setQuittances] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const [showLocataireForm, setShowLocataireForm] = useState(false);
  const [locForm, setLocForm] = useState({ prenom: "", nom: "", email: "", telephone: "", date_entree: "" });
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  async function loadData() {
    const supabase = createClient();
    const { data: bienData } = await supabase.from("biens").select("*").eq("id", params.id).single();
    setBien(bienData);
    if (bienData) {
      const [{ data: locData }, { data: qData }] = await Promise.all([
        supabase.from("locataires").select("*").eq("bien_id", params.id).eq("actif", true).maybeSingle(),
        supabase.from("quittances").select("*").eq("bien_id", params.id).order("mois", { ascending: false }),
      ]);
      setLocataire(locData);
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
    if (!user) { setLocError("Vous devez être connecté."); setLocLoading(false); return; }
    const { error } = await supabase.from("locataires").insert({
      bien_id: params.id, user_id: user.id,
      prenom: locForm.prenom, nom: locForm.nom,
      email: locForm.email || null, telephone: locForm.telephone || null,
      date_entree: locForm.date_entree, actif: true,
    });
    if (error) { setLocError(GENERIC_SAVE_ERROR); setLocLoading(false); return; }
    setShowLocataireForm(false);
    setLocForm({ prenom: "", nom: "", email: "", telephone: "", date_entree: "" });
    setLocLoading(false);
    router.refresh();
    await loadData();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#2A9FD6]/30 border-t-[#2A9FD6] rounded-full animate-spin" />
      </div>
    );
  }

  if (!bien) {
    return (
      <div className="text-center p-12">
        <p className="text-gray-500 text-sm">Bien introuvable.</p>
        <Link href="/biens" className="text-[#1c7aa8] text-sm mt-2 inline-block hover:text-[#145d80] transition-colors">
          ← Retour aux biens
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/biens" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour aux biens
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">{String(bien.adresse)}</h1>
            <p className="text-gray-500 text-sm mt-1">{String(bien.code_postal)} {String(bien.ville)}</p>
          </div>
          <Link
            href={`/biens/${params.id}/modifier`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-200 px-3 py-2 rounded-xl transition-all"
          >
            <Pencil className="w-4 h-4" />
            Modifier
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all",
              activeTab === id
                ? "border-[#2A9FD6] text-[#1c7aa8]"
                : "border-transparent text-gray-500 hover:text-gray-600"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "informations" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Bien info */}
          <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2A9FD6]/15 flex items-center justify-center">
                <Home className="w-3.5 h-3.5 text-[#1c7aa8]" />
              </div>
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
                <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Locataire */}
          <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-violet-700" />
              </div>
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
                  <div key={label} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
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
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1c7aa8] hover:text-[#145d80] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un locataire
                  </button>
                ) : (
                  <form onSubmit={handleLocataireSubmit} className="space-y-3">
                    {locError && (
                      <div className="px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                        {locError}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass} htmlFor="loc_prenom">Prénom *</label>
                        <input id="loc_prenom" type="text" required value={locForm.prenom} onChange={(e) => setLocForm((p) => ({ ...p, prenom: e.target.value }))} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="loc_nom">Nom *</label>
                        <input id="loc_nom" type="text" required value={locForm.nom} onChange={(e) => setLocForm((p) => ({ ...p, nom: e.target.value }))} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="loc_email">Email</label>
                      <input id="loc_email" type="email" value={locForm.email} onChange={(e) => setLocForm((p) => ({ ...p, email: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="loc_telephone">Téléphone</label>
                      <input id="loc_telephone" type="tel" value={locForm.telephone} onChange={(e) => setLocForm((p) => ({ ...p, telephone: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="loc_date_entree">Date d&apos;entrée *</label>
                      <input id="loc_date_entree" type="date" required value={locForm.date_entree} onChange={(e) => setLocForm((p) => ({ ...p, date_entree: e.target.value }))} className={inputClass} />
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <button type="submit" disabled={locLoading} className="bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                        {locLoading ? "Enregistrement..." : "Ajouter"}
                      </button>
                      <button type="button" onClick={() => { setShowLocataireForm(false); setLocError(null); }} className="text-sm text-gray-500 hover:text-gray-600 transition-colors">
                        Annuler
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* IRL */}
          <div className="lg:col-span-2">
            <Link
              href={`/biens/${params.id}/revision-irl`}
              className="border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm rounded-2xl p-5 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Révision annuelle du loyer (IRL)</p>
                  <p className="text-xs text-gray-400 mt-0.5">Recalculez le loyer selon l&apos;indice INSEE</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#1c7aa8] group-hover:text-[#145d80] transition-colors">
                Calculer →
              </span>
            </Link>
          </div>
        </div>
      )}

      {activeTab === "quittances" && (
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          {quittances.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-violet-700" />
              </div>
              <p className="text-gray-500 text-sm">Aucune quittance pour ce bien.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-white">
                  <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Mois</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Montant</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Statut</th>
                  <th className="w-20" />
                </tr>
              </thead>
              <tbody>
                {quittances.map((q) => (
                  <tr key={String(q.id)} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 capitalize">
                      {new Date(String(q.mois)).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{Number(q.total).toLocaleString("fr-FR")} €</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {String(q.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a href={`/api/quittances/${q.id}/pdf`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#1c7aa8] hover:text-[#145d80] font-semibold transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "documents" && (
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-gray-500 text-sm">Aucun document pour ce bien.</p>
        </div>
      )}
    </div>
  );
}
