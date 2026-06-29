"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  FileText,
  FolderOpen,
  Bell,
  Settings,
  X,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/biens", label: "Mes biens", icon: Home },
  { href: "/quittances", label: "Quittances", icon: FileText },
  { href: "/documents", label: "Baux & Documents", icon: FolderOpen },
  { href: "/relances", label: "Relances", icon: Bell },
  { href: "/parametres", label: "Paramètres", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-gray-100">
        <span className="text-xl font-bold text-[#2A9FD6]">MyLocavio</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#2A9FD6]/10 text-[#2A9FD6]"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">© 2025 MyLocavio</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between bg-white border-b border-gray-200 px-4 h-14">
        <span className="text-lg font-bold text-[#2A9FD6]">MyLocavio</span>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
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
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-20">
        <SidebarContent />
      </aside>
    </>
  );
}
