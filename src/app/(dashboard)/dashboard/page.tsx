import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import IconHome from "@/components/icons/IconHome";
import IconDocument from "@/components/icons/IconDocument";
import IconChart from "@/components/icons/IconChart";
import IconBell from "@/components/icons/IconBell";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  trend?: string;
}

function StatCard({ title, value, icon: Icon, iconBg, iconColor, trend }: StatCardProps) {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-3xl font-bold text-[#1a1a1a] mt-1.5">{value}</p>
            {trend && <p className="text-xs text-gray-400 mt-1">{trend}</p>}
          </div>
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const prenom =
    (user?.user_metadata?.prenom as string | undefined) ??
    user?.email?.split("@")[0] ??
    "vous";

  const [
    { count: nbBiens },
    { data: biensLoyes },
    { count: nbQuittances },
    { count: nbRelances },
  ] = await Promise.all([
    supabase.from("biens").select("*", { count: "exact", head: true }),
    supabase.from("biens").select("loyer, charges").eq("statut", "loue"),
    supabase.from("quittances").select("*", { count: "exact", head: true }),
    supabase.from("relances").select("*", { count: "exact", head: true }).eq("statut", "en_retard"),
  ]);

  const totalLoyers = (biensLoyes ?? []).reduce(
    (sum, b) => sum + Number(b.loyer) + Number(b.charges ?? 0),
    0
  );

  const moisActuel = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">
          Bonjour, {prenom}
        </h1>
        <p className="text-gray-500 mt-1 text-sm capitalize">
          Tableau de bord · {moisActuel}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Biens gérés"
          value={nbBiens ?? 0}
          icon={IconHome}
          iconBg="bg-[#2A9FD6]/10"
          iconColor="text-[#2A9FD6]"
        />
        <StatCard
          title="Loyers du mois"
          value={`${totalLoyers.toLocaleString("fr-FR")} €`}
          icon={IconChart}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          trend="Biens loués uniquement"
        />
        <StatCard
          title="Quittances générées"
          value={nbQuittances ?? 0}
          icon={IconDocument}
          iconBg="bg-violet-50"
          iconColor="text-violet-600"
        />
        <StatCard
          title="Loyers en retard"
          value={nbRelances ?? 0}
          icon={IconBell}
          iconBg={nbRelances ? "bg-rose-50" : "bg-gray-50"}
          iconColor={nbRelances ? "text-rose-500" : "text-gray-400"}
        />
      </div>

      {(nbBiens ?? 0) === 0 && (
        <Card className="mt-8 border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-14 h-14 bg-[#2A9FD6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <IconHome className="w-7 h-7 text-[#2A9FD6]" />
            </div>
            <h2 className="text-[#1a1a1a] font-semibold text-lg">Commencez par ajouter un bien</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
              Ajoutez votre premier bien pour commencer à gérer vos locations.
            </p>
            <Link
              href="/biens/nouveau"
              className="inline-block mt-6 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Ajouter un bien
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
