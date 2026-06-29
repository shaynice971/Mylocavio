import { Bell, Send } from "lucide-react";
import { cn } from "@/lib/utils";

type StatutRelance = "en_retard" | "relance" | "regle";

interface Relance {
  id: string;
  locataire: string;
  bien: string;
  montant: number;
  joursRetard: number;
  statut: StatutRelance;
}

const statuts: Record<StatutRelance, { label: string; classes: string }> = {
  en_retard: {
    label: "En retard",
    classes: "bg-rose-50 text-rose-600",
  },
  relance: {
    label: "Relancé",
    classes: "bg-amber-50 text-amber-600",
  },
  regle: {
    label: "Réglé",
    classes: "bg-emerald-50 text-emerald-600",
  },
};

const mockRelances: Relance[] = [];

export default function RelancesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Relances</h1>
        <p className="text-gray-500 mt-1">
          Suivez les retards de paiement et envoyez vos relances.
        </p>
      </div>

      {mockRelances.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-gray-700 font-medium text-lg">Aucun retard de paiement</h2>
          <p className="text-gray-400 text-sm mt-1">
            Tous vos loyers sont à jour. Revenez ici en cas de retard.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Locataire</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Bien</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Montant</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Retard</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Statut</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {mockRelances.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{r.locataire}</td>
                  <td className="px-6 py-4 text-gray-500">{r.bien}</td>
                  <td className="px-6 py-4 text-gray-900">{r.montant} €</td>
                  <td className="px-6 py-4 text-rose-600 font-medium">
                    {r.joursRetard} j
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-block px-2.5 py-1 rounded-full text-xs font-medium",
                        statuts[r.statut].classes
                      )}
                    >
                      {statuts[r.statut].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {r.statut !== "regle" && (
                      <button className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2A9FD6] hover:text-[#238bbf] transition-colors">
                        <Send className="w-3.5 h-3.5" />
                        Envoyer une relance
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
