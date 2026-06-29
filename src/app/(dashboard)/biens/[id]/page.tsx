"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home, User, FileText, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "informations" | "quittances" | "documents";

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "informations", label: "Informations", icon: Home },
  { id: "quittances", label: "Quittances", icon: FileText },
  { id: "documents", label: "Documents", icon: FolderOpen },
];

export default function BienDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [activeTab, setActiveTab] = useState<Tab>("informations");

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/biens"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux biens
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Détail du bien</h1>
        <p className="text-gray-500 text-sm mt-1">ID : {params.id}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors",
              activeTab === id
                ? "border-[#2A9FD6] text-[#2A9FD6]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "informations" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="w-4 h-4 text-[#2A9FD6]" />
              Informations du bien
            </h2>
            <dl className="space-y-3 text-sm">
              {[
                ["Adresse", "—"],
                ["Type", "—"],
                ["Surface", "—"],
                ["Loyer CC", "—"],
                ["Charges", "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#2A9FD6]" />
              Locataire
            </h2>
            <dl className="space-y-3 text-sm">
              {[
                ["Nom", "—"],
                ["Email", "—"],
                ["Téléphone", "—"],
                ["Date d'entrée", "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-gray-500">{label}</dt>
                  <dd className="font-medium text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}

      {activeTab === "quittances" && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucune quittance pour ce bien.</p>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <FolderOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Aucun document pour ce bien.</p>
        </div>
      )}
    </div>
  );
}
