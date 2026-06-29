"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Home, User, FileText, FolderOpen } from "lucide-react";
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

export default function BienDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<Tab>("informations");
  const [bien, setBien] = useState<Record<string, unknown> | null>(null);
  const [locataire, setLocataire] = useState<Record<string, unknown> | null>(null);
  const [quittances, setQuittances] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
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
    load();
  }, [params.id]);

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
        <h1 className="text-2xl font-bold text-gray-900">{String(bien.adresse)}</h1>
        <p className="text-gray-500 text-sm mt-1">{String(bien.code_postal)} {String(bien.ville)}</p>
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
              <p className="text-sm text-gray-400">Aucun locataire actif.</p>
            )}
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
