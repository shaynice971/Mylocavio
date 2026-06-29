import { Plus, Home } from "lucide-react";

export default function BiensPage() {
  const biens: never[] = [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes biens</h1>
          <p className="text-gray-500 mt-1">Gérez vos propriétés en location.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Ajouter un bien
        </button>
      </div>

      {biens.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Home className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-gray-700 font-medium text-lg">Aucun bien enregistré</h2>
          <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
            Ajoutez votre premier bien pour commencer à suivre vos locations et générer vos quittances.
          </p>
          <button className="mt-5 inline-flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            Ajouter un bien
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Adresse</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Loyer</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Locataire</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Statut</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {biens.map((bien, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-medium">{String(i)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
