import { createClient } from "@/lib/supabase/server";
import { FileText, Download } from "lucide-react";
import GenererButton from "./GenererButton";

function moisFr(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

const statutConfig: Record<string, { label: string; classes: string }> = {
  generee: { label: "Générée", classes: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  envoyee: { label: "Envoyée", classes: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  payee: { label: "Payée", classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
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
          <h1 className="text-2xl font-black text-white">Quittances</h1>
          <p className="text-white/40 mt-1 text-sm">Gérez et envoyez vos quittances de loyer.</p>
        </div>
        <GenererButton />
      </div>

      {!quittances || quittances.length === 0 ? (
        <div className="border border-white/8 bg-white/3 rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/15 flex items-center justify-center mx-auto mb-5">
            <FileText className="w-7 h-7 text-violet-400" />
          </div>
          <h2 className="text-white font-bold text-lg">Aucune quittance</h2>
          <p className="text-white/35 text-sm mt-2 max-w-xs mx-auto">
            Ajoutez des biens et des locataires pour générer vos premières quittances.
          </p>
        </div>
      ) : (
        <div className="border border-white/8 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Bien</th>
                <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Mois</th>
                <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Locataire</th>
                <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Montant</th>
                <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Statut</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {quittances.map((q) => {
                const bien = Array.isArray(q.biens) ? q.biens[0] : q.biens;
                const loc = Array.isArray(q.locataires) ? q.locataires[0] : q.locataires;
                const s = statutConfig[q.statut] ?? statutConfig.generee;
                return (
                  <tr key={q.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{bien?.adresse ?? "—"}</td>
                    <td className="px-6 py-4 text-white/50 capitalize text-sm">{moisFr(q.mois)}</td>
                    <td className="px-6 py-4 text-white/50 text-sm">{loc ? `${loc.prenom} ${loc.nom}` : "—"}</td>
                    <td className="px-6 py-4 font-bold text-white">{Number(q.total).toLocaleString("fr-FR")} €</td>
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
