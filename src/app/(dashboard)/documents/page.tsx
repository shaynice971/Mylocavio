import { FolderOpen, FileText, Download } from "lucide-react";

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
      <button className="shrink-0 p-1.5 text-gray-300 hover:text-[#2A9FD6] transition-colors" aria-label="Télécharger">
        <Download className="w-4 h-4" />
      </button>
    </div>
  );
}

const bailModeles = [
  {
    title: "Bail de location vide",
    description: "Contrat de location pour logement non meublé (loi Alur)",
  },
  {
    title: "Bail de location meublée",
    description: "Contrat de location pour logement meublé",
  },
  {
    title: "Bail mobilité",
    description: "Contrat court terme (1 à 10 mois) pour logement meublé",
  },
  {
    title: "Avenant au bail",
    description: "Modification ou ajout de clauses au bail existant",
  },
  {
    title: "Congé pour vente",
    description: "Lettre de congé délivré au locataire pour vente du logement",
  },
  {
    title: "Congé pour reprise",
    description: "Lettre de congé délivré au locataire pour reprise personnelle",
  },
];

export default function DocumentsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Baux & Documents</h1>
        <p className="text-gray-500 mt-1">
          Accédez à vos modèles de documents juridiques.
        </p>
      </div>

      <section className="mb-8">
        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-[#2A9FD6]" />
          Baux en cours
        </h2>
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucun bail actif pour le moment.</p>
          <p className="text-gray-400 text-xs mt-1">
            Les baux apparaîtront ici une fois vos biens configurés.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#2A9FD6]" />
          Modèles de documents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {bailModeles.map((doc) => (
            <DocumentCard key={doc.title} {...doc} />
          ))}
        </div>
      </section>
    </div>
  );
}
