import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import IconHome from "@/components/icons/IconHome";

const statutLabels: Record<string, { label: string; classes: string }> = {
  loue: { label: "Loue", classes: "bg-emerald-50 text-emerald-600" },
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
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Mes biens</h1>
          <p className="text-gray-500 mt-1">Gerez vos proprietes en location.</p>
        </div>
        <Link
          href="/biens/nouveau"
          className="inline-flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un bien
        </Link>
      </div>

      {!biens || biens.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-14 h-14 bg-[#2A9FD6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <IconHome className="w-7 h-7 text-[#2A9FD6]" />
          </div>
          <h2 className="text-[#1a1a1a] font-semibold text-lg">Aucun bien enregistre</h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
            Ajoutez votre premier bien pour commencer a suivre vos locations et generer vos quittances.
          </p>
          <Link
            href="/biens/nouveau"
            className="mt-6 inline-flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un bien
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-gray-100">
                <th className="text-left px-6 py-4 font-medium text-gray-500">Adresse</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Loyer CC</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Locataire</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Statut</th>
                <th className="px-6 py-4" />
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
                  <tr key={bien.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1a1a1a]">{bien.adresse}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{bien.code_postal} {bien.ville}</p>
                    </td>
                    <td className="px-6 py-4 text-[#1a1a1a] font-medium">
                      {(Number(bien.loyer) + Number(bien.charges ?? 0)).toLocaleString("fr-FR")} €
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {locataire ? `${locataire.prenom} ${locataire.nom}` : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${s.classes}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/biens/${bien.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#2A9FD6] hover:text-[#238bbf] font-medium"
                      >
                        Voir
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
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
