"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import IconHome from "@/components/icons/IconHome";
import IconDocument from "@/components/icons/IconDocument";
import IconBell from "@/components/icons/IconBell";
import IconSettings from "@/components/icons/IconSettings";
import IconFolder from "@/components/icons/IconFolder";
import IconChart from "@/components/icons/IconChart";
import IconClipboard from "@/components/icons/IconClipboard";
import { Home, LogOut } from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: IconChart },
  { href: "/biens", label: "Mes biens", icon: IconHome },
  { href: "/quittances", label: "Quittances", icon: IconDocument },
  { href: "/documents", label: "Baux & Documents", icon: IconFolder },
  { href: "/etats-des-lieux", label: "États des lieux", icon: IconClipboard },
  { href: "/relances", label: "Relances", icon: IconBell },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-3">
      <div className="mb-8 px-3">
        <Logo dark />
      </div>

      <nav className="flex-1 space-y-0.5">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-[#2A9FD6]/15 text-[#1c7aa8] shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#1c7aa8]" : "text-gray-400")} />
              {label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2A9FD6]" />}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-0.5 pt-4 border-t border-gray-100">
        <Link
          href="/parametres"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
            pathname === "/parametres"
              ? "bg-[#2A9FD6]/15 text-[#1c7aa8]"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          )}
        >
          <IconSettings className={cn("w-4 h-4 shrink-0", pathname === "/parametres" ? "text-[#1c7aa8]" : "text-gray-400")} />
          Paramètres
        </Link>

        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
        >
          <Home className="w-4 h-4 shrink-0 text-gray-400" />
          Accueil
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-700/70 hover:bg-rose-500/10 hover:text-rose-700 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Déconnexion
        </button>

        <div className="px-3 pt-4">
          <p className="text-gray-300 text-xs">&copy; 2026 MyLocavio</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-gray-50 border-b border-gray-100 px-4 h-14">
        <Logo dark />
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-50"
          aria-label="Ouvrir le menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={cn(
        "lg:hidden fixed top-0 left-0 h-full w-64 z-50 bg-gray-50 border-r border-gray-100 transform transition-transform duration-200",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-50"
          aria-label="Fermer le menu"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 h-full w-64 bg-gray-50 border-r border-gray-100 z-20">
        <SidebarContent />
      </aside>
    </>
  );
}
