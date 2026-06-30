import { createClient } from "@/lib/supabase/server";
import IconDocument from "@/components/icons/IconDocument";
import GenererButton from "./GenererButton";

const statutLabels: Record<string, { label: string; classes: string }> = {
  generee: { label: "Generee", classes: "bg-blue-50 text-blue-600" },
  envoyee: { label: "Envoyee", classes: "bg-amber-50 text-amber-600" },
  payee: { label: "Payee", classes: "bg-emerald-50 text-emerald-600" },
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
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Quittances</h1>
          <p className="text-gray-500 mt-1">Gerez et envoyez vos quittances de loyer.</p>
        </div>
        <GenererButton />
      </div>

      {!quittances || quittances.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-14 h-14 bg-[#2A9FD6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <IconDocument className="w-7 h-7 text-[#2A9FD6]" />
          </div>
          <h2 className="text-[#1a1a1a] font-semibold text-lg">Aucune quittance</h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
            Ajoutez des biens et des locataires pour generer vos premieres quittances.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-gray-100">
                <th className="text-left px-6 py-4 font-medium text-gray-500">Bien</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Mois</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Locataire</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Montant</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Statut</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {quittances.map((q) => {
                const s = statutLabels[q.statut] ?? statutLabels.generee;
                const bien = Array.isArray(q.biens) ? q.biens[0] : q.biens;
                const loc = Array.isArray(q.locataires) ? q.locataires[0] : q.locataires;
                return (
                  <tr key={q.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#1a1a1a]">
                      {bien?.adresse ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">
                      {moisFr(q.mois)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {loc ? `${loc.prenom} ${loc.nom}` : "—"}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#1a1a1a]">
                      {Number(q.total).toLocaleString("fr-FR")} €
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${s.classes}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`/api/quittances/${q.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#2A9FD6] hover:text-[#238bbf] font-medium"
                      >
                        Telecharger
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
