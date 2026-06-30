import { Download, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import IconDocument from "@/components/icons/IconDocument";
import IconFolder from "@/components/icons/IconFolder";
import IconClipboard from "@/components/icons/IconClipboard";

interface DocumentCardProps {
  title: string;
  description: string;
}

function DocumentCard({ title, description }: DocumentCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4 hover:shadow transition-shadow">
      <div className="w-10 h-10 bg-[#2A9FD6]/10 rounded-lg flex items-center justify-center shrink-0">
        <IconDocument className="w-5 h-5 text-[#2A9FD6]" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-[#1a1a1a] text-sm">{title}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        className="shrink-0 p-1.5 text-gray-300 hover:text-[#2A9FD6] transition-colors"
        aria-label="Telecharger"
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
    title: "Conge bailleur",
    description: "Lettre de conge delivre au locataire pour vente ou reprise",
  },
  {
    title: "Conge locataire",
    description: "Lettre de conge envoyee par le locataire au bailleur",
  },
];

function typeBailLabel(type: string): string {
  if (type === "meuble") return "Meuble";
  if (type === "mobilite") return "Mobilite";
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
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Baux &amp; Documents</h1>
          <p className="text-gray-500 mt-1">
            Accedez a vos contrats de bail et modeles de documents juridiques.
          </p>
        </div>
        <Link
          href="/baux/nouveau"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Creer un nouveau bail
        </Link>
      </div>

      {/* Baux en cours */}
      <section className="mb-8">
        <h2 className="text-base font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
          <IconFolder className="w-4 h-4 text-[#2A9FD6]" />
          Baux en cours
        </h2>

        {baux.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="w-14 h-14 bg-[#2A9FD6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <IconDocument className="w-7 h-7 text-[#2A9FD6]" />
            </div>
            <p className="text-gray-600 text-sm font-medium">Aucun bail actif pour le moment.</p>
            <p className="text-gray-400 text-xs mt-1">
              Les baux apparaitront ici une fois vos biens configures.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F7F9FC] border-b border-gray-100">
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Bien</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Locataire</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Type</th>
                  <th className="text-left px-6 py-4 font-medium text-gray-500">Debut</th>
                  <th className="text-right px-6 py-4 font-medium text-gray-500">Contrat</th>
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
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-[#1a1a1a] font-medium">
                        {bien ? `${bien.adresse}, ${bien.ville}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {locataire
                          ? `${locataire.prenom} ${locataire.nom}`
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2A9FD6]/10 text-[#2A9FD6]">
                          {typeBailLabel(bail.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(bail.date_debut).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/api/baux/${bail.id}/pdf`}
                          className="inline-flex items-center gap-1.5 text-[#2A9FD6] hover:text-[#238bbf] font-medium text-xs transition-colors"
                          target="_blank"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Telecharger PDF
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

      {/* Modeles de documents */}
      <section>
        <h2 className="text-base font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
          <IconDocument className="w-4 h-4 text-[#2A9FD6]" />
          Modeles de documents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {modeles.map((doc) => (
            <DocumentCard key={doc.title} {...doc} />
          ))}
          <Link href="/etats-des-lieux/nouveau" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4 hover:shadow transition-shadow h-full">
              <div className="w-10 h-10 bg-[#2A9FD6]/10 rounded-lg flex items-center justify-center shrink-0">
                <IconClipboard className="w-5 h-5 text-[#2A9FD6]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#1a1a1a] text-sm">État des lieux</h3>
                <p className="text-xs text-gray-500 mt-0.5">Créer un état des lieux d&apos;entrée ou de sortie</p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
