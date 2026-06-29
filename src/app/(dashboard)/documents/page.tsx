import { FolderOpen, FileText, Download, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

interface DocumentCardProps {
  title: string;
  description: string;
}

function DocumentCard({ title, description }: DocumentCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-start gap-4 hover:border-[#2A9FD6]/30 transition-colors group">
      <div className="p-2.5 bg-[#2A9FD6]/10 rounded-lg shrink-0">
        <FileText className="w-5 h-5 text-[#2A9FD6]" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        className="shrink-0 p-1.5 text-gray-300 hover:text-[#2A9FD6] transition-colors"
        aria-label="Télécharger"
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}

const modeles = [
  {
    title: "Avenant au bail",
    description: "Modification ou ajout de clauses au bail existant",
  },
  {
    title: "Congé bailleur",
    description: "Lettre de congé délivré au locataire pour vente ou reprise",
  },
  {
    title: "Congé locataire",
    description: "Lettre de congé envoyée par le locataire au bailleur",
  },
  {
    title: "État des lieux",
    description: "Modèle d'état des lieux d'entrée et de sortie",
  },
];

function typeBailLabel(type: string): string {
  if (type === "meuble") return "Meublé";
  if (type === "mobilite") return "Mobilité";
  return "Vide";
}

interface BailRow {
  id: string;
  type: string;
  date_debut: string;
  biens: { adresse: string; ville: string } | { adresse: string; ville: string }[] | null;
  locataires: { prenom: string; nom: string } | { prenom: string; nom: string }[] | null;
}

export default async function DocumentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let baux: BailRow[] = [];

  if (user) {
    const { data } = await supabase
      .from("baux")
      .select(
        `id, type, date_debut,
         biens ( adresse, ville ),
         locataires ( prenom, nom )`
      )
      .eq("user_id", user.id)
      .order("date_debut", { ascending: false });

    baux = (data as BailRow[]) ?? [];
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Baux &amp; Documents</h1>
          <p className="text-gray-500 mt-1">
            Accédez à vos contrats de bail et modèles de documents juridiques.
          </p>
        </div>
        <Link
          href="/baux/nouveau"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A9FD6] text-white text-sm font-medium rounded-lg hover:bg-[#2A9FD6]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Créer un nouveau bail
        </Link>
      </div>

      {/* Baux en cours */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-[#2A9FD6]" />
          Baux en cours
        </h2>

        {baux.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucun bail actif pour le moment.</p>
            <p className="text-gray-400 text-xs mt-1">
              Les baux apparaîtront ici une fois vos biens configurés.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Bien</th>
                  <th className="text-left px-4 py-3 font-medium">Locataire</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Début</th>
                  <th className="text-right px-4 py-3 font-medium">Contrat</th>
                </tr>
              </thead>
              <tbody>
                {baux.map((bail) => {
                  const bien = Array.isArray(bail.biens)
                    ? bail.biens[0]
                    : bail.biens;
                  const locataire = Array.isArray(bail.locataires)
                    ? bail.locataires[0]
                    : bail.locataires;

                  return (
                    <tr
                      key={bail.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-900">
                        {bien ? `${bien.adresse}, ${bien.ville}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {locataire
                          ? `${locataire.prenom} ${locataire.nom}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#2A9FD6]/10 text-[#2A9FD6]">
                          {typeBailLabel(bail.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(bail.date_debut).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/api/baux/${bail.id}/pdf`}
                          className="inline-flex items-center gap-1.5 text-[#2A9FD6] hover:text-[#2A9FD6]/80 font-medium text-xs transition-colors"
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
      </section>

      {/* Modèles de documents */}
      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#2A9FD6]" />
          Modèles de documents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {modeles.map((doc) => (
            <DocumentCard key={doc.title} {...doc} />
          ))}
        </div>
      </section>
    </div>
  );
}
