import { createClient } from "@/lib/supabase/server";
import IconBell from "@/components/icons/IconBell";
import { cn } from "@/lib/utils";
import RelanceButton from "./RelanceButton";

const statuts: Record<string, { label: string; classes: string }> = {
  en_retard: { label: "En retard", classes: "bg-rose-50 text-rose-600" },
  relance: { label: "Relance", classes: "bg-amber-50 text-amber-600" },
  regle: { label: "Regle", classes: "bg-emerald-50 text-emerald-600" },
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
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Relances</h1>
        <p className="text-gray-500 mt-1">
          Suivez les retards de paiement et envoyez vos relances.
        </p>
      </div>

      {!relances || relances.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-14 h-14 bg-[#2A9FD6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <IconBell className="w-7 h-7 text-[#2A9FD6]" />
          </div>
          <h2 className="text-[#1a1a1a] font-semibold text-lg">Aucun retard de paiement</h2>
          <p className="text-gray-400 text-sm mt-2">
            Tous vos loyers sont a jour. Revenez ici en cas de retard.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-gray-100">
                <th className="text-left px-6 py-4 font-medium text-gray-500">Locataire</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Bien</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Mois</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Montant</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Retard</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Statut</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {relances.map((r) => {
                const s = statuts[r.statut] ?? statuts.en_retard;
                const bien = Array.isArray(r.biens) ? r.biens[0] : r.biens;
                const loc = Array.isArray(r.locataires) ? r.locataires[0] : r.locataires;
                return (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-[#1a1a1a]">
                      {loc ? `${loc.prenom} ${loc.nom}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{bien?.adresse ?? "—"}</td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{moisFr(r.mois)}</td>
                    <td className="px-6 py-4 font-medium text-[#1a1a1a]">{Number(r.montant).toLocaleString("fr-FR")} €</td>
                    <td className="px-6 py-4 text-rose-500 font-medium">{r.nb_jours_retard} j</td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-medium", s.classes)}>
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
