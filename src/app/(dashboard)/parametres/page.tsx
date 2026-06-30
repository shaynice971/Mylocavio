"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import IconSettings from "@/components/icons/IconSettings";
import { cn } from "@/lib/utils";

type Plan = "gratuit" | "essentiel" | "pro" | "expert";

const planLabels: Record<Plan, string> = {
  gratuit: "Gratuit",
  essentiel: "Essentiel",
  pro: "Pro",
  expert: "Expert",
};

const planColors: Record<Plan, string> = {
  gratuit: "bg-gray-100 text-gray-600",
  essentiel: "bg-blue-50 text-blue-700",
  pro: "bg-violet-50 text-violet-700",
  expert: "bg-amber-50 text-amber-700",
};

export default function ParametresPage() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [plan, setPlan] = useState<Plan>("gratuit");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("prenom, nom, telephone, plan")
        .eq("id", user.id)
        .single();

      if (profile) {
        setPrenom(profile.prenom ?? "");
        setNom(profile.nom ?? "");
        setTelephone(profile.telephone ?? "");
        setPlan((profile.plan as Plan) ?? "gratuit");
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("profiles")
        .update({ prenom, nom, telephone })
        .eq("id", user.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  if (loading) {
    return <div className="text-gray-400 text-sm p-8">Chargement...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Parametres</h1>
        <p className="text-gray-500 mt-1">Gerez votre profil et votre abonnement.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* Profil */}
        <section className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="font-semibold text-[#1a1a1a] mb-6 flex items-center gap-2">
            <IconSettings className="w-4 h-4 text-[#2A9FD6]" />
            Mon profil
          </h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Prenom</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Jean"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Dupont"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Adresse e-mail</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2.5 border border-gray-100 rounded-lg text-sm bg-[#F7F9FC] text-gray-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className={labelClass}>Telephone</label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+33 6 00 00 00 00"
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              {saved && (
                <span className="text-sm text-emerald-600 font-medium">
                  Modifications enregistrees !
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Abonnement */}
        <section className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="font-semibold text-[#1a1a1a] mb-6">
            Mon abonnement
          </h2>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500">Plan actuel</p>
              <span className={cn("inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold", planColors[plan])}>
                {planLabels[plan]}
              </span>
            </div>
            <button className="text-sm font-medium text-[#2A9FD6] hover:text-[#238bbf] transition-colors">
              Changer de plan
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.entries(planLabels) as [Plan, string][]).map(([key, label]) => (
              <div
                key={key}
                className={cn(
                  "text-center py-2.5 px-3 rounded-lg text-xs font-medium border",
                  key === plan
                    ? "border-[#2A9FD6] text-[#2A9FD6] bg-[#2A9FD6]/5"
                    : "border-gray-100 text-gray-400"
                )}
              >
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="font-semibold text-[#1a1a1a] mb-6">
            Notifications
          </h2>
          <div className="space-y-5">
            {[
              { id: "quittances", label: "Rappel de generation des quittances", description: "Recevoir un rappel le 1er de chaque mois" },
              { id: "retards", label: "Alertes de retard de paiement", description: "Etre notifie quand un loyer est en retard" },
              { id: "relances", label: "Confirmations de relance", description: "Recevoir une copie des relances envoyees" },
            ].map(({ id, label, description }) => (
              <div key={id} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#2A9FD6] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
