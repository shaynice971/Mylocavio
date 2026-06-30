import { createClient } from "@/lib/supabase/server";
import IconBell from "@/components/icons/IconBell";
import RelanceButton from "./RelanceButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function moisFr(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

const statutConfig: Record<string, { label: string; classes: string }> = {
  en_retard: { label: "En retard", classes: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-50" },
  relance: { label: "Relancé", classes: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-50" },
  regle: { label: "Réglé", classes: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50" },
};

export default async function RelancesPage() {
  const supabase = await createClient();

  const { data: relances } = await supabase
    .from("relances")
    .select(`id, montant, mois, nb_jours_retard, statut, biens ( adresse ), locataires ( prenom, nom )`)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Relances</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Suivez les retards de paiement et envoyez vos relances.
        </p>
      </div>

      {!relances || relances.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-14 h-14 bg-[#2A9FD6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconBell className="w-7 h-7 text-[#2A9FD6]" />
            </div>
            <h2 className="text-[#1a1a1a] font-semibold text-lg">Aucun retard de paiement</h2>
            <p className="text-gray-400 text-sm mt-2">
              Tous vos loyers sont à jour. Revenez ici en cas de retard.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F7F9FC] hover:bg-[#F7F9FC]">
                <TableHead className="font-semibold text-gray-600 pl-6">Locataire</TableHead>
                <TableHead className="font-semibold text-gray-600">Bien</TableHead>
                <TableHead className="font-semibold text-gray-600">Mois</TableHead>
                <TableHead className="font-semibold text-gray-600">Montant</TableHead>
                <TableHead className="font-semibold text-gray-600">Retard</TableHead>
                <TableHead className="font-semibold text-gray-600">Statut</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {relances.map((r) => {
                const s = statutConfig[r.statut] ?? statutConfig.en_retard;
                const bien = Array.isArray(r.biens) ? r.biens[0] : r.biens;
                const loc = Array.isArray(r.locataires) ? r.locataires[0] : r.locataires;
                return (
                  <TableRow key={r.id} className="hover:bg-gray-50/60 transition-colors">
                    <TableCell className="pl-6 py-4 font-medium text-[#1a1a1a]">
                      {loc ? `${loc.prenom} ${loc.nom}` : "—"}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">{bien?.adresse ?? "—"}</TableCell>
                    <TableCell className="text-gray-600 text-sm capitalize">{moisFr(r.mois)}</TableCell>
                    <TableCell className="font-semibold text-[#1a1a1a]">
                      {Number(r.montant).toLocaleString("fr-FR")} €
                    </TableCell>
                    <TableCell>
                      <span className="text-rose-500 font-semibold text-sm">{r.nb_jours_retard} j</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={s.classes}>
                        {s.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      {r.statut !== "regle" && r.statut !== "relance" && (
                        <RelanceButton relanceId={r.id} />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
