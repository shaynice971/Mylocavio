import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen bg-[#F7F9FC]">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
