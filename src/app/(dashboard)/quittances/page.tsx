import { createClient } from "@/lib/supabase/server";
import { FileText } from "lucide-react";
import GenererButton from "./GenererButton";

const statutLabels: Record<string, { label: string; classes: string }> = {
  generee: { label: "Générée", classes: "bg-blue-50 text-blue-600" },
  envoyee: { label: "Envoyée", classes: "bg-amber-50 text-amber-600" },
  payee: { label: "Payée", classes: "bg-emerald-50 text-emerald-600" },
};

function moisFr(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export default async function QuittancesPage() {
  const supabase = await createClient();

  const { data: quittances } = await supabase
    .from("quittances")
    .select(`
      id, mois, loyer, charges, total, statut,
      biens ( adresse, ville ),
      locataires ( prenom, nom )
    `)
    .order("mois", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quittances</h1>
          <p className="text-gray-500 mt-1">Gérez et envoyez vos quittances de loyer.</p>
        </div>
        <GenererButton />
      </div>

      {!quittances || quittances.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-gray-700 font-medium text-lg">Aucune quittance</h2>
          <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
            Ajoutez des biens et des locataires pour générer vos premières quittances.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Bien</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Mois</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Locataire</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Montant</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Statut</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {quittances.map((q) => {
                const s = statutLabels[q.statut] ?? statutLabels.generee;
                const bien = Array.isArray(q.biens) ? q.biens[0] : q.biens;
                const loc = Array.isArray(q.locataires) ? q.locataires[0] : q.locataires;
                return (
                  <tr key={q.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {bien?.adresse ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-700 capitalize">
                      {moisFr(q.mois)}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {loc ? `${loc.prenom} ${loc.nom}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {Number(q.total).toLocaleString("fr-FR")} €
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${s.classes}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs text-[#2A9FD6] hover:text-[#238bbf] font-medium">
                        Télécharger
                      </button>
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
