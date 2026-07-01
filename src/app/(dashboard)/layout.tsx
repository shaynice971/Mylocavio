import Sidebar from "@/components/Sidebar";

// Pages du tableau de bord : données propres à l'utilisateur connecté,
// ne doivent jamais être générées statiquement ni mises en cache entre utilisateurs.
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
