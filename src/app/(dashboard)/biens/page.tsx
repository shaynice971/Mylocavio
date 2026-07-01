import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, ChevronRight, Home } from "lucide-react";

const statutConfig: Record<string, { label: string; classes: string }> = {
  loue: { label: "Loué", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  vacant: { label: "Vacant", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  travaux: { label: "Travaux", classes: "bg-gray-50 text-gray-500 border-gray-200" },
};

export default async function BiensPage() {
  const supabase = await createClient();
  const { data: biens } = await supabase
    .from("biens")
    .select(`id, adresse, ville, code_postal, type, loyer, charges, statut, locataires ( id, prenom, nom, actif )`)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Mes biens</h1>
          <p className="text-gray-500 mt-1 text-sm">Gérez vos propriétés en location.</p>
        </div>
        <Link
          href="/biens/nouveau"
          className="inline-flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25"
        >
          <Plus className="w-4 h-4" />
          Ajouter un bien
        </Link>
      </div>

      {!biens || biens.length === 0 ? (
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#2A9FD6]/15 flex items-center justify-center mx-auto mb-5">
            <Home className="w-7 h-7 text-[#1c7aa8]" />
          </div>
          <h2 className="text-gray-900 font-bold text-lg">Aucun bien enregistré</h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
            Ajoutez votre premier bien pour commencer à suivre vos locations et générer vos quittances.
          </p>
          <Link
            href="/biens/nouveau"
            className="inline-flex items-center gap-2 mt-8 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Ajouter un bien
          </Link>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Adresse</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Loyer CC</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Locataire</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Statut</th>
                <th className="w-16" />
              </tr>
            </thead>
            <tbody>
              {biens.map((bien) => {
                const locatairesActifs = Array.isArray(bien.locataires)
                  ? bien.locataires.filter((l) => l.actif)
                  : [];
                const locataire = locatairesActifs[0];
                const s = statutConfig[bien.statut] ?? statutConfig.vacant;
                return (
                  <tr key={bien.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{bien.adresse}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{bien.code_postal} {bien.ville}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {(Number(bien.loyer) + Number(bien.charges ?? 0)).toLocaleString("fr-FR")} €
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {locataire ? `${locataire.prenom} ${locataire.nom}` : <span className="text-gray-300">Aucun locataire</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${s.classes}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/biens/${bien.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#1c7aa8] hover:text-[#145d80] font-semibold transition-colors"
                      >
                        Voir <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
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
