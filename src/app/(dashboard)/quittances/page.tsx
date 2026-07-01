import { createClient } from "@/lib/supabase/server";
import { FileText, Download } from "lucide-react";
import GenererButton from "./GenererButton";

function moisFr(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

const statutConfig: Record<string, { label: string; classes: string }> = {
  generee: { label: "Générée", classes: "bg-blue-50 text-blue-700 border-blue-200" },
  envoyee: { label: "Envoyée", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  payee: { label: "Payée", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export default async function QuittancesPage() {
  const supabase = await createClient();
  const { data: quittances } = await supabase
    .from("quittances")
    .select(`id, mois, loyer, charges, total, statut, biens ( adresse, ville ), locataires ( prenom, nom )`)
    .order("mois", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Quittances</h1>
          <p className="text-gray-500 mt-1 text-sm">Gérez et envoyez vos quittances de loyer.</p>
        </div>
        <GenererButton />
      </div>

      {!quittances || quittances.length === 0 ? (
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-5">
            <FileText className="w-7 h-7 text-violet-700" />
          </div>
          <h2 className="text-gray-900 font-bold text-lg">Aucune quittance</h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
            Ajoutez des biens et des locataires pour générer vos premières quittances.
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Bien</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Mois</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Locataire</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Montant</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Statut</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {quittances.map((q) => {
                const bien = Array.isArray(q.biens) ? q.biens[0] : q.biens;
                const loc = Array.isArray(q.locataires) ? q.locataires[0] : q.locataires;
                const s = statutConfig[q.statut] ?? statutConfig.generee;
                return (
                  <tr key={q.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{bien?.adresse ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-500 capitalize text-sm">{moisFr(q.mois)}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{loc ? `${loc.prenom} ${loc.nom}` : "—"}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{Number(q.total).toLocaleString("fr-FR")} €</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${s.classes}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`/api/quittances/${q.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#2A9FD6] hover:text-[#5bb8e8] font-semibold transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
