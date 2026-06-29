import { FileText, Plus, Filter } from "lucide-react";

export default function QuittancesPage() {
  const quittances: never[] = [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quittances</h1>
          <p className="text-gray-500 mt-1">Gérez et envoyez vos quittances de loyer.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Générer les quittances du mois
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <select className="bg-transparent outline-none text-gray-700">
            <option value="">Tous les biens</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500">
          <select className="bg-transparent outline-none text-gray-700">
            <option value="">Tous les mois</option>
            <option value="2025-06">Juin 2025</option>
            <option value="2025-05">Mai 2025</option>
            <option value="2025-04">Avril 2025</option>
          </select>
        </div>
      </div>

      {quittances.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-gray-700 font-medium text-lg">Aucune quittance</h2>
          <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
            Ajoutez des biens et des locataires pour générer vos premières quittances.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Bien</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Mois</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Locataire</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Montant</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Statut</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {quittances.map((_, i) => (
                <tr key={i} className="border-b border-gray-50" />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
