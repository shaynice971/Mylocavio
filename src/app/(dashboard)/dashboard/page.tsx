import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Home, TrendingUp, FileText, Bell, Plus, ArrowRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  iconBg: string;
  trend?: string;
}

function StatCard({ title, value, icon: Icon, color, iconBg, trend }: StatCardProps) {
  return (
    <div className="border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm rounded-2xl p-6 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-black mt-2 ${color}`}>{value}</p>
          {trend && <p className="text-gray-400 text-xs mt-1">{trend}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
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
        <h1 className="text-2xl font-black text-gray-900">
          Bonjour, <span className="text-[#1c7aa8]">{prenom}</span>
        </h1>
        <p className="text-gray-500 mt-1 text-sm capitalize">{moisActuel}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Biens gérés"
          value={nbBiens ?? 0}
          icon={Home}
          color="text-[#1c7aa8]"
          iconBg="bg-[#2A9FD6]/15"
        />
        <StatCard
          title="Loyers du mois"
          value={`${totalLoyers.toLocaleString("fr-FR")} €`}
          icon={TrendingUp}
          color="text-emerald-700"
          iconBg="bg-emerald-50"
          trend="Biens loués uniquement"
        />
        <StatCard
          title="Quittances générées"
          value={nbQuittances ?? 0}
          icon={FileText}
          color="text-violet-700"
          iconBg="bg-violet-50"
        />
        <StatCard
          title="Loyers en retard"
          value={nbRelances ?? 0}
          icon={Bell}
          color={nbRelances ? "text-rose-700" : "text-gray-300"}
          iconBg={nbRelances ? "bg-rose-50" : "bg-gray-50"}
        />
      </div>

      {(nbBiens ?? 0) === 0 ? (
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#2A9FD6]/15 flex items-center justify-center mx-auto mb-5">
            <Home className="w-8 h-8 text-[#1c7aa8]" />
          </div>
          <h2 className="text-gray-900 font-bold text-xl">Commencez par ajouter un bien</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
            Ajoutez votre premier logement pour commencer à suivre vos locations.
          </p>
          <Link
            href="/biens/nouveau"
            className="inline-flex items-center gap-2 mt-8 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25"
          >
            <Plus className="w-4 h-4" />
            Ajouter un bien
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Générer les quittances", desc: "Créez les quittances du mois en un clic", href: "/quittances", color: "text-violet-700", bg: "bg-violet-500/10" },
            { title: "Voir les relances", desc: "Suivez les loyers en retard", href: "/relances", color: "text-rose-700", bg: "bg-rose-500/10" },
            { title: "Ajouter un bien", desc: "Enregistrez un nouveau logement", href: "/biens/nouveau", color: "text-[#1c7aa8]", bg: "bg-[#2A9FD6]/10" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm rounded-2xl p-6 transition-all flex items-center justify-between"
            >
              <div>
                <div className={`inline-block px-2 py-0.5 rounded-md ${action.bg} mb-3`}>
                  <span className={`text-xs font-bold ${action.color}`}>Action rapide</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm">{action.title}</h3>
                <p className="text-gray-400 text-xs mt-1">{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
