import { createClient } from "@/lib/supabase/server";
import { Bell } from "lucide-react";
import RelanceButton from "./RelanceButton";

function moisFr(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

const statutConfig: Record<string, { label: string; classes: string }> = {
  en_retard: { label: "En retard", classes: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  relance: { label: "Relancé", classes: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  regle: { label: "Réglé", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
};

export default async function RelancesPage() {
  const supabase = await createClient();
  const { data: relances } = await supabase
    .from("relances")
    .select(`id, montant, mois, nb_jours_retard, statut, biens ( adresse ), locataires ( prenom, nom )`)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Relances</h1>
        <p className="text-white/40 mt-1 text-sm">Suivez les retards de paiement et envoyez vos relances.</p>
      </div>

      {!relances || relances.length === 0 ? (
        <div className="border border-white/8 bg-white/3 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#2A9FD6]/15 flex items-center justify-center mx-auto mb-5">
            <Bell className="w-7 h-7 text-[#2A9FD6]" />
          </div>
          <h2 className="text-white font-bold text-lg">Aucun retard de paiement</h2>
          <p className="text-white/35 text-sm mt-2">Tous vos loyers sont à jour.</p>
        </div>
      ) : (
        <div className="border border-white/8 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Locataire</th>
                <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Bien</th>
                <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Mois</th>
                <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Montant</th>
                <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Retard</th>
                <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Statut</th>
                <th className="w-24" />
              </tr>
            </thead>
            <tbody>
              {relances.map((r) => {
                const s = statutConfig[r.statut] ?? statutConfig.en_retard;
                const bien = Array.isArray(r.biens) ? r.biens[0] : r.biens;
                const loc = Array.isArray(r.locataires) ? r.locataires[0] : r.locataires;
                return (
                  <tr key={r.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{loc ? `${loc.prenom} ${loc.nom}` : "—"}</td>
                    <td className="px-6 py-4 text-white/40 text-sm">{bien?.adresse ?? "—"}</td>
                    <td className="px-6 py-4 text-white/50 capitalize text-sm">{moisFr(r.mois)}</td>
                    <td className="px-6 py-4 font-bold text-white">{Number(r.montant).toLocaleString("fr-FR")} €</td>
                    <td className="px-6 py-4">
                      <span className="text-rose-400 font-bold text-sm">{r.nb_jours_retard} j</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${s.classes}`}>
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
