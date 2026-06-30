import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Download } from "lucide-react";
import IconClipboard from "@/components/icons/IconClipboard";

interface EtatRow {
  id: string;
  type: string;
  date_etat: string;
  biens: { adresse: string; ville: string } | { adresse: string; ville: string }[] | null;
  locataires: { prenom: string; nom: string } | { prenom: string; nom: string }[] | null;
}

function TypeBadge({ type }: { type: string }) {
  const isEntree = type === "entree";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        isEntree
          ? "bg-green-50 text-green-700"
          : "bg-orange-50 text-orange-700"
      }`}
    >
      {isEntree ? "Entrée" : "Sortie"}
    </span>
  );
}

export default async function EtatsDesLieuxPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let etats: EtatRow[] = [];

  if (user) {
    const { data } = await supabase
      .from("etats_des_lieux")
      .select(
        `id, type, date_etat,
         biens ( adresse, ville ),
         locataires ( prenom, nom )`
      )
      .eq("user_id", user.id)
      .order("date_etat", { ascending: false });

    etats = (data as EtatRow[]) ?? [];
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">États des lieux</h1>
          <p className="text-gray-500 mt-1">
            Gérez vos états des lieux d&apos;entrée et de sortie.
          </p>
        </div>
        <Link
          href="/etats-des-lieux/nouveau"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel état des lieux
        </Link>
      </div>

      {etats.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <div className="w-14 h-14 bg-[#2A9FD6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <IconClipboard className="w-7 h-7 text-[#2A9FD6]" />
          </div>
          <p className="text-gray-600 text-sm font-medium">Aucun état des lieux pour le moment.</p>
          <p className="text-gray-400 text-xs mt-1 mb-6">
            Créez votre premier état des lieux d&apos;entrée ou de sortie.
          </p>
          <Link
            href="/etats-des-lieux/nouveau"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer un état des lieux
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F7F9FC] border-b border-gray-100">
                <th className="text-left px-6 py-4 font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Bien</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Locataire</th>
                <th className="text-left px-6 py-4 font-medium text-gray-500">Type</th>
                <th className="text-right px-6 py-4 font-medium text-gray-500">Document</th>
              </tr>
            </thead>
            <tbody>
              {etats.map((etat) => {
                const bien = Array.isArray(etat.biens) ? etat.biens[0] : etat.biens;
                const locataire = Array.isArray(etat.locataires) ? etat.locataires[0] : etat.locataires;

                return (
                  <tr
                    key={etat.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-[#1a1a1a]">
                      {new Date(etat.date_etat).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {bien ? `${bien.adresse}, ${bien.ville}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {locataire ? `${locataire.prenom} ${locataire.nom}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <TypeBadge type={etat.type} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/api/etats-des-lieux/${etat.id}/pdf`}
                        className="inline-flex items-center gap-1.5 text-[#2A9FD6] hover:text-[#238bbf] font-medium text-xs transition-colors"
                        target="_blank"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Télécharger PDF
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
