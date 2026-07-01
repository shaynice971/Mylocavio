import { Download, Plus, FileText, FolderOpen, ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const modeles = [
  { title: "Avenant au bail", description: "Modification ou ajout de clauses au bail existant" },
  { title: "Congé bailleur", description: "Lettre de congé délivré au locataire pour vente ou reprise" },
  { title: "Congé locataire", description: "Lettre de congé envoyée par le locataire au bailleur" },
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
  const { data: { user } } = await supabase.auth.getUser();

  let baux: BailRow[] = [];
  if (user) {
    const { data } = await supabase
      .from("baux")
      .select(`id, type, date_debut, biens ( adresse, ville ), locataires ( prenom, nom )`)
      .eq("user_id", user.id)
      .order("date_debut", { ascending: false });
    baux = (data as BailRow[]) ?? [];
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Baux &amp; Documents</h1>
          <p className="text-white/40 mt-1 text-sm">Accédez à vos contrats et modèles juridiques.</p>
        </div>
        <Link
          href="/baux/nouveau"
          className="inline-flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25"
        >
          <Plus className="w-4 h-4" />
          Créer un bail
        </Link>
      </div>

      {/* Baux */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          Baux en cours
        </h2>

        {baux.length === 0 ? (
          <div className="border border-white/8 bg-white/3 rounded-2xl p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#2A9FD6]/15 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-[#2A9FD6]" />
            </div>
            <p className="text-white/60 text-sm font-medium">Aucun bail actif pour le moment.</p>
            <p className="text-white/25 text-xs mt-1">Les baux apparaîtront ici une fois vos biens configurés.</p>
          </div>
        ) : (
          <div className="border border-white/8 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/3">
                  <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Bien</th>
                  <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Locataire</th>
                  <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Type</th>
                  <th className="text-left px-6 py-4 font-semibold text-white/30 text-xs tracking-wide uppercase">Début</th>
                  <th className="text-right px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {baux.map((bail) => {
                  const bien = Array.isArray(bail.biens) ? bail.biens[0] : bail.biens;
                  const locataire = Array.isArray(bail.locataires) ? bail.locataires[0] : bail.locataires;
                  return (
                    <tr key={bail.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{bien ? `${bien.adresse}, ${bien.ville}` : "—"}</td>
                      <td className="px-6 py-4 text-white/50">{locataire ? `${locataire.prenom} ${locataire.nom}` : "—"}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#2A9FD6]/15 text-[#2A9FD6] border border-[#2A9FD6]/20">
                          {typeBailLabel(bail.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/40 text-sm">{new Date(bail.date_debut).toLocaleDateString("fr-FR")}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/api/baux/${bail.id}/pdf`} target="_blank" className="inline-flex items-center gap-1.5 text-[#2A9FD6] hover:text-[#5bb8e8] font-semibold text-xs transition-colors">
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
      </section>

      {/* Modèles */}
      <section>
        <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Modèles de documents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {modeles.map((doc) => (
            <div key={doc.title} className="border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/15 rounded-xl p-5 flex items-start gap-3 transition-all">
              <div className="w-9 h-9 rounded-lg bg-[#2A9FD6]/15 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-[#2A9FD6]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm">{doc.title}</h3>
                <p className="text-white/30 text-xs mt-0.5">{doc.description}</p>
              </div>
            </div>
          ))}
          <Link href="/etats-des-lieux/nouveau" className="border border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/15 rounded-xl p-5 flex items-start gap-3 transition-all">
            <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
              <ClipboardList className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">État des lieux</h3>
              <p className="text-white/30 text-xs mt-0.5">Créer un état d&apos;entrée ou de sortie</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
