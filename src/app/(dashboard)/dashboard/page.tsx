import { createClient } from "@/lib/supabase/server";
import { Home, FileText, TrendingUp, AlertCircle } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const prenom =
    (user?.user_metadata?.prenom as string | undefined) ??
    user?.email?.split("@")[0] ??
    "vous";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bonjour, {prenom} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Voici un aperçu de votre activité locative.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Nombre de biens"
          value={0}
          icon={Home}
          color="bg-[#2A9FD6]"
        />
        <StatCard
          title="Loyers du mois"
          value="0 €"
          icon={TrendingUp}
          color="bg-emerald-500"
        />
        <StatCard
          title="Quittances générées"
          value={0}
          icon={FileText}
          color="bg-violet-500"
        />
        <StatCard
          title="Loyers en retard"
          value={0}
          icon={AlertCircle}
          color="bg-rose-500"
        />
      </div>

      <div className="mt-10 bg-white rounded-xl border border-gray-100 p-8 text-center">
        <Home className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h2 className="text-gray-700 font-medium">Commencez par ajouter un bien</h2>
        <p className="text-gray-400 text-sm mt-1">
          Ajoutez votre premier bien pour commencer à gérer vos locations.
        </p>
        <a
          href="/biens"
          className="inline-block mt-4 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Ajouter un bien
        </a>
      </div>
    </div>
  );
}
