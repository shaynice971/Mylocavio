"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Check, Bell, Settings } from "lucide-react";

type Plan = "gratuit" | "essentiel" | "pro" | "expert";

const planConfig: Record<Plan, { label: string; classes: string }> = {
  gratuit: { label: "Gratuit", classes: "bg-gray-100 text-gray-600 border-gray-200" },
  essentiel: { label: "Essentiel", classes: "bg-blue-50 text-blue-700 border-blue-100" },
  pro: { label: "Pro", classes: "bg-violet-50 text-violet-700 border-violet-100" },
  expert: { label: "Expert", classes: "bg-amber-50 text-amber-700 border-amber-100" },
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
      await supabase.from("profiles").update({ prenom, nom, telephone }).eq("id", user.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return <div className="text-gray-400 text-sm p-8">Chargement...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Paramètres</h1>
        <p className="text-gray-500 mt-1 text-sm">Gérez votre profil et votre abonnement.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#2A9FD6]" />
              <h2 className="font-semibold text-[#1a1a1a]">Mon profil</h2>
            </div>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <Input id="prenom" type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Jean" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Dupont" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input id="email" type="email" value={email} disabled className="bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input id="telephone" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} placeholder="+33 6 00 00 00 00" />
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
                    <Check className="w-4 h-4" />
                    Modifications enregistrées
                  </span>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-0">
            <h2 className="font-semibold text-[#1a1a1a]">Mon abonnement</h2>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1.5">Plan actuel</p>
                <Badge variant="outline" className={cn("text-sm font-semibold px-3 py-1", planConfig[plan].classes)}>
                  {planConfig[plan].label}
                </Badge>
              </div>
              <button className="text-sm font-medium text-[#2A9FD6] hover:text-[#238bbf] transition-colors">
                Changer de plan
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.entries(planConfig) as [Plan, typeof planConfig[Plan]][]).map(([key, cfg]) => (
                <div
                  key={key}
                  className={cn(
                    "text-center py-2.5 px-3 rounded-xl text-xs font-medium border transition-colors",
                    key === plan ? "border-[#2A9FD6] text-[#2A9FD6] bg-[#2A9FD6]/5" : "border-gray-100 text-gray-400"
                  )}
                >
                  {cfg.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#2A9FD6]" />
              <h2 className="font-semibold text-[#1a1a1a]">Notifications</h2>
            </div>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              {[
                { id: "quittances", label: "Rappel de génération des quittances", description: "Recevoir un rappel le 1er de chaque mois" },
                { id: "retards", label: "Alertes de retard de paiement", description: "Être notifié quand un loyer est en retard" },
                { id: "relances", label: "Confirmations de relance", description: "Recevoir une copie des relances envoyées" },
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
