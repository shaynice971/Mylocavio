import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Home, ChevronRight } from "lucide-react";

const statutLabels: Record<string, { label: string; classes: string }> = {
  loue: { label: "Loué", classes: "bg-emerald-50 text-emerald-600" },
  vacant: { label: "Vacant", classes: "bg-amber-50 text-amber-600" },
  travaux: { label: "Travaux", classes: "bg-gray-100 text-gray-500" },
};

export default async function BiensPage() {
  const supabase = await createClient();

  const { data: biens } = await supabase
    .from("biens")
    .select(`
      id, adresse, ville, code_postal, type, loyer, charges, statut,
      locataires ( id, prenom, nom, actif )
    `)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes biens</h1>
          <p className="text-gray-500 mt-1">Gérez vos propriétés en location.</p>
        </div>
        <Link
          href="/biens/nouveau"
          className="flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un bien
        </Link>
      </div>

      {!biens || biens.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Home className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-gray-700 font-medium text-lg">Aucun bien enregistré</h2>
          <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
            Ajoutez votre premier bien pour commencer à suivre vos locations et générer vos quittances.
          </p>
          <Link
            href="/biens/nouveau"
            className="mt-5 inline-flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter un bien
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Adresse</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Loyer CC</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Locataire</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Statut</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {biens.map((bien) => {
                const locatairesActifs = Array.isArray(bien.locataires)
                  ? bien.locataires.filter((l) => l.actif)
                  : [];
                const locataire = locatairesActifs[0];
                const s = statutLabels[bien.statut] ?? statutLabels.vacant;
                return (
                  <tr key={bien.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{bien.adresse}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{bien.code_postal} {bien.ville}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {(Number(bien.loyer) + Number(bien.charges ?? 0)).toLocaleString("fr-FR")} €
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {locataire ? `${locataire.prenom} ${locataire.nom}` : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${s.classes}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/biens/${bien.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#2A9FD6] hover:text-[#238bbf] font-medium"
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
