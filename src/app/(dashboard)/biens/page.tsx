import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import IconHome from "@/components/icons/IconHome";
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
import { Plus, ChevronRight } from "lucide-react";

const statutConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  loue: { label: "Loué", variant: "default" },
  vacant: { label: "Vacant", variant: "secondary" },
  travaux: { label: "Travaux", variant: "outline" },
};

export default async function BiensPage() {
  const supabase = await createClient();

  const { data: biens } = await supabase
    .from("biens")
    .select(`id, adresse, ville, code_postal, type, loyer, charges, statut, locataires ( id, prenom, nom, actif )`)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Mes biens</h1>
          <p className="text-gray-500 mt-1 text-sm">Gérez vos propriétés en location.</p>
        </div>
        <Link
          href="/biens/nouveau"
          className="inline-flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un bien
        </Link>
      </div>

      {!biens || biens.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-14 h-14 bg-[#2A9FD6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconHome className="w-7 h-7 text-[#2A9FD6]" />
            </div>
            <h2 className="text-[#1a1a1a] font-semibold text-lg">Aucun bien enregistré</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
              Ajoutez votre premier bien pour commencer à suivre vos locations et générer vos quittances.
            </p>
            <Link
              href="/biens/nouveau"
              className="mt-6 inline-flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter un bien
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F7F9FC] hover:bg-[#F7F9FC]">
                <TableHead className="font-semibold text-gray-600 pl-6">Adresse</TableHead>
                <TableHead className="font-semibold text-gray-600">Loyer CC</TableHead>
                <TableHead className="font-semibold text-gray-600">Locataire</TableHead>
                <TableHead className="font-semibold text-gray-600">Statut</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {biens.map((bien) => {
                const locatairesActifs = Array.isArray(bien.locataires)
                  ? bien.locataires.filter((l) => l.actif)
                  : [];
                const locataire = locatairesActifs[0];
                const s = statutConfig[bien.statut] ?? statutConfig.vacant;
                return (
                  <TableRow key={bien.id} className="hover:bg-gray-50/60 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <p className="font-medium text-[#1a1a1a]">{bien.adresse}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{bien.code_postal} {bien.ville}</p>
                    </TableCell>
                    <TableCell className="font-semibold text-[#1a1a1a]">
                      {(Number(bien.loyer) + Number(bien.charges ?? 0)).toLocaleString("fr-FR")} €
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {locataire
                        ? `${locataire.prenom} ${locataire.nom}`
                        : <span className="text-gray-300 text-xs">Aucun locataire</span>}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={s.variant}
                        className={
                          s.variant === "default"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50"
                            : s.variant === "secondary"
                            ? "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-50"
                        }
                      >
                        {s.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Link
                        href={`/biens/${bien.id}`}
                        className="inline-flex items-center gap-1 text-xs text-[#2A9FD6] hover:text-[#238bbf] font-medium"
                      >
                        Voir <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
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
