import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Download, ClipboardList } from "lucide-react";

interface EtatRow {
  id: string;
  type: string;
  date_etat: string;
  biens: { adresse: string; ville: string } | { adresse: string; ville: string }[] | null;
  locataires: { prenom: string; nom: string } | { prenom: string; nom: string }[] | null;
}

export default async function EtatsDesLieuxPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let etats: EtatRow[] = [];
  if (user) {
    const { data } = await supabase
      .from("etats_des_lieux")
      .select(`id, type, date_etat, biens ( adresse, ville ), locataires ( prenom, nom )`)
      .eq("user_id", user.id)
      .order("date_etat", { ascending: false });
    etats = (data as EtatRow[]) ?? [];
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">États des lieux</h1>
          <p className="text-gray-500 mt-1 text-sm">Gérez vos états des lieux d&apos;entrée et de sortie.</p>
        </div>
        <Link
          href="/etats-des-lieux/nouveau"
          className="inline-flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25"
        >
          <Plus className="w-4 h-4" />
          Nouvel état des lieux
        </Link>
      </div>

      {etats.length === 0 ? (
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-5">
            <ClipboardList className="w-7 h-7 text-violet-700" />
          </div>
          <h2 className="text-gray-900 font-bold text-lg">Aucun état des lieux</h2>
          <p className="text-gray-400 text-sm mt-2 mb-8 max-w-xs mx-auto">
            Créez votre premier état des lieux d&apos;entrée ou de sortie.
          </p>
          <Link
            href="/etats-des-lieux/nouveau"
            className="inline-flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            Créer un état des lieux
          </Link>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-white">
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Date</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Bien</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Locataire</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-400 text-xs tracking-wide uppercase">Type</th>
                <th className="text-right px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {etats.map((etat) => {
                const bien = Array.isArray(etat.biens) ? etat.biens[0] : etat.biens;
                const locataire = Array.isArray(etat.locataires) ? etat.locataires[0] : etat.locataires;
                const isEntree = etat.type === "entree";
                return (
                  <tr key={etat.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{new Date(etat.date_etat).toLocaleDateString("fr-FR")}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{bien ? `${bien.adresse}, ${bien.ville}` : "—"}</td>
                    <td className="px-6 py-4 text-gray-500">{locataire ? `${locataire.prenom} ${locataire.nom}` : "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                        isEntree
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {isEntree ? "Entrée" : "Sortie"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/api/etats-des-lieux/${etat.id}/pdf`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-[#2A9FD6] hover:text-[#5bb8e8] font-semibold text-xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
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
