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

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: IconChart },
  { href: "/biens", label: "Mes biens", icon: IconHome },
  { href: "/quittances", label: "Quittances", icon: IconDocument },
  { href: "/documents", label: "Baux & Documents", icon: IconFolder },
  { href: "/etats-des-lieux", label: "États des lieux", icon: IconClipboard },
  { href: "/relances", label: "Relances", icon: IconBell },
];

const bottomLinks = [
  { href: "/parametres", label: "Parametres", icon: IconSettings },
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
    <div className="flex flex-col h-full py-6 px-4">
      <div className="mb-10 px-2">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#2A9FD6]/10 text-[#2A9FD6]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive ? "text-[#2A9FD6]" : "text-gray-400"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-1">
        {bottomLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#2A9FD6]/10 text-[#2A9FD6]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0",
                  isActive ? "text-[#2A9FD6]" : "text-gray-400"
                )}
              />
              {label}
            </Link>
          );
        })}
        <div className="px-4 pt-4 border-t border-gray-100 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12L11.204 3.045a1.125 1.125 0 011.591 0L21.75 12M4.5 9.75V19.5a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-4.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v4.5a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V9.75" />
            </svg>
            Accueil
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Déconnexion
          </button>
          <p className="text-xs text-gray-400 px-4 pt-2">&copy; 2026 MyLocavio</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-white border-b border-gray-100 px-4 h-14">
        <Logo />
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

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-64 z-50 bg-white shadow-xl transform transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 rounded text-gray-400 hover:text-gray-600"
          aria-label="Fermer le menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-20">
        <SidebarContent />
      </aside>
    </>
  );
}
