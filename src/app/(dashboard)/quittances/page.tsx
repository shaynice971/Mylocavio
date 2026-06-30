import { createClient } from "@/lib/supabase/server";
import IconDocument from "@/components/icons/IconDocument";
import GenererButton from "./GenererButton";
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
import { Download } from "lucide-react";

function moisFr(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

const statutClasses: Record<string, string> = {
  generee: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50",
  envoyee: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50",
  payee: "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50",
};

const statutLabels: Record<string, string> = {
  generee: "Générée",
  envoyee: "Envoyée",
  payee: "Payée",
};

export default async function QuittancesPage() {
  const supabase = await createClient();

  const { data: quittances } = await supabase
    .from("quittances")
    .select(`id, mois, loyer, charges, total, statut, biens ( adresse, ville ), locataires ( prenom, nom )`)
    .order("mois", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Quittances</h1>
          <p className="text-gray-500 mt-1 text-sm">Gérez et envoyez vos quittances de loyer.</p>
        </div>
        <GenererButton />
      </div>

      {!quittances || quittances.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-14 h-14 bg-[#2A9FD6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconDocument className="w-7 h-7 text-[#2A9FD6]" />
            </div>
            <h2 className="text-[#1a1a1a] font-semibold text-lg">Aucune quittance</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
              Ajoutez des biens et des locataires pour générer vos premières quittances.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F7F9FC] hover:bg-[#F7F9FC]">
                <TableHead className="font-semibold text-gray-600 pl-6">Bien</TableHead>
                <TableHead className="font-semibold text-gray-600">Mois</TableHead>
                <TableHead className="font-semibold text-gray-600">Locataire</TableHead>
                <TableHead className="font-semibold text-gray-600">Montant</TableHead>
                <TableHead className="font-semibold text-gray-600">Statut</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {quittances.map((q) => {
                const bien = Array.isArray(q.biens) ? q.biens[0] : q.biens;
                const loc = Array.isArray(q.locataires) ? q.locataires[0] : q.locataires;
                return (
                  <TableRow key={q.id} className="hover:bg-gray-50/60 transition-colors">
                    <TableCell className="pl-6 py-4 font-medium text-[#1a1a1a]">
                      {bien?.adresse ?? "—"}
                    </TableCell>
                    <TableCell className="text-gray-600 capitalize text-sm">
                      {moisFr(q.mois)}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {loc ? `${loc.prenom} ${loc.nom}` : "—"}
                    </TableCell>
                    <TableCell className="font-semibold text-[#1a1a1a]">
                      {Number(q.total).toLocaleString("fr-FR")} €
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statutClasses[q.statut] ?? statutClasses.generee}>
                        {statutLabels[q.statut] ?? q.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <a
                        href={`/api/quittances/${q.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#2A9FD6] hover:text-[#238bbf] font-medium"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </a>
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
