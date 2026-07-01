"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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

const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all";
const labelClass = "block text-sm font-medium text-white/50 mb-1.5";

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
      const { data: locData } = await supabase.from("locataires").select("*").eq("bien_id", params.id).eq("actif", true).maybeSingle();
      setLocataire(locData);
      const { data: qData } = await supabase.from("quittances").select("*").eq("bien_id", params.id).order("mois", { ascending: false });
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
    if (error) { setLocError(error.message); setLocLoading(false); return; }
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
        <p className="text-white/40 text-sm">Bien introuvable.</p>
        <Link href="/biens" className="text-[#2A9FD6] text-sm mt-2 inline-block hover:text-[#5bb8e8] transition-colors">
          ← Retour aux biens
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/biens" className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour aux biens
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">{String(bien.adresse)}</h1>
            <p className="text-white/40 text-sm mt-1">{String(bien.code_postal)} {String(bien.ville)}</p>
          </div>
          <Link
            href={`/biens/${params.id}/modifier`}
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 px-3 py-2 rounded-xl transition-all"
          >
            <Pencil className="w-4 h-4" />
            Modifier
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/8 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all",
              activeTab === id
                ? "border-[#2A9FD6] text-[#2A9FD6]"
                : "border-transparent text-white/40 hover:text-white/70"
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
          <div className="border border-white/8 bg-white/3 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2A9FD6]/15 flex items-center justify-center">
                <Home className="w-3.5 h-3.5 text-[#2A9FD6]" />
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
                <div key={label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                  <dt className="text-white/40">{label}</dt>
                  <dd className="font-medium text-white">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Locataire */}
          <div className="border border-white/8 bg-white/3 rounded-2xl p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-violet-400" />
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
                  <div key={label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                    <dt className="text-white/40">{label}</dt>
                    <dd className="font-medium text-white">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div>
                <p className="text-sm text-white/30 mb-4">Aucun locataire actif.</p>
                {!showLocataireForm ? (
                  <button
                    onClick={() => setShowLocataireForm(true)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2A9FD6] hover:text-[#5bb8e8] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un locataire
                  </button>
                ) : (
                  <form onSubmit={handleLocataireSubmit} className="space-y-3">
                    {locError && (
                      <div className="px-3 py-2 bg-rose-500/15 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                        {locError}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Prénom *</label>
                        <input type="text" required value={locForm.prenom} onChange={(e) => setLocForm((p) => ({ ...p, prenom: e.target.value }))} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Nom *</label>
                        <input type="text" required value={locForm.nom} onChange={(e) => setLocForm((p) => ({ ...p, nom: e.target.value }))} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Email</label>
                      <input type="email" value={locForm.email} onChange={(e) => setLocForm((p) => ({ ...p, email: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Téléphone</label>
                      <input type="tel" value={locForm.telephone} onChange={(e) => setLocForm((p) => ({ ...p, telephone: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Date d&apos;entrée *</label>
                      <input type="date" required value={locForm.date_entree} onChange={(e) => setLocForm((p) => ({ ...p, date_entree: e.target.value }))} className={inputClass} />
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <button type="submit" disabled={locLoading} className="bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                        {locLoading ? "Enregistrement..." : "Ajouter"}
                      </button>
                      <button type="button" onClick={() => { setShowLocataireForm(false); setLocError(null); }} className="text-sm text-white/40 hover:text-white/70 transition-colors">
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
              className="border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/15 rounded-2xl p-5 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/15 rounded-xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">Révision annuelle du loyer (IRL)</p>
                  <p className="text-xs text-white/35 mt-0.5">Recalculez le loyer selon l&apos;indice INSEE</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-[#2A9FD6] group-hover:text-[#5bb8e8] transition-colors">
                Calculer →
              </span>
            </Link>
          </div>
        </div>
      )}

      {activeTab === "quittances" && (
        <div className="border border-white/8 rounded-2xl overflow-hidden">
          {quittances.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/15 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-violet-400" />
              </div>
              <p className="text-white/40 text-sm">Aucune quittance pour ce bien.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/3">
                  <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Mois</th>
                  <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Montant</th>
                  <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Statut</th>
                  <th className="w-20" />
                </tr>
              </thead>
              <tbody>
                {quittances.map((q) => (
                  <tr key={String(q.id)} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 text-white/60 capitalize">
                      {new Date(String(q.mois)).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">{Number(q.total).toLocaleString("fr-FR")} €</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                        {String(q.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a href={`/api/quittances/${q.id}/pdf`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#2A9FD6] hover:text-[#5bb8e8] font-semibold transition-colors">
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
        <div className="border border-white/8 bg-white/3 rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-6 h-6 text-white/20" />
          </div>
          <p className="text-white/40 text-sm">Aucun document pour ce bien.</p>
        </div>
      )}
    </div>
  );
}
