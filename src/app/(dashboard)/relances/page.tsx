import { createClient } from "@/lib/supabase/server";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import RelanceButton from "./RelanceButton";

const statuts: Record<string, { label: string; classes: string }> = {
  en_retard: { label: "En retard", classes: "bg-rose-50 text-rose-600" },
  relance: { label: "Relancé", classes: "bg-amber-50 text-amber-600" },
  regle: { label: "Réglé", classes: "bg-emerald-50 text-emerald-600" },
};

function moisFr(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export default async function RelancesPage() {
  const supabase = await createClient();

  const { data: relances } = await supabase
    .from("relances")
    .select(`
      id, montant, mois, nb_jours_retard, statut,
      biens ( adresse ),
      locataires ( prenom, nom )
    `)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Relances</h1>
        <p className="text-gray-500 mt-1">
          Suivez les retards de paiement et envoyez vos relances.
        </p>
      </div>

      {!relances || relances.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-gray-700 font-medium text-lg">Aucun retard de paiement</h2>
          <p className="text-gray-400 text-sm mt-1">
            Tous vos loyers sont à jour. Revenez ici en cas de retard.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Locataire</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Bien</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Mois</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Montant</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Retard</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Statut</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {relances.map((r) => {
                const s = statuts[r.statut] ?? statuts.en_retard;
                const bien = Array.isArray(r.biens) ? r.biens[0] : r.biens;
                const loc = Array.isArray(r.locataires) ? r.locataires[0] : r.locataires;
                return (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {loc ? `${loc.prenom} ${loc.nom}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{bien?.adresse ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-700 capitalize">{moisFr(r.mois)}</td>
                    <td className="px-6 py-4 text-gray-900">{Number(r.montant).toLocaleString("fr-FR")} €</td>
                    <td className="px-6 py-4 text-rose-600 font-medium">{r.nb_jours_retard} j</td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-block px-2.5 py-1 rounded-full text-xs font-medium", s.classes)}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.statut !== "regle" && r.statut !== "relance" && (
                        <RelanceButton relanceId={r.id} />
                      )}
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
