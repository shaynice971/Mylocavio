"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Check, Bell, Settings, ShieldCheck } from "lucide-react";

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
  const [adresse, setAdresse] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [ville, setVille] = useState("");
  const [plan, setPlan] = useState<Plan>("gratuit");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deletionLoading, setDeletionLoading] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("prenom, nom, telephone, adresse, code_postal, ville, plan")
        .eq("id", user.id)
        .single();

      if (profile) {
        setPrenom(profile.prenom ?? "");
        setNom(profile.nom ?? "");
        setTelephone(profile.telephone ?? "");
        setAdresse(profile.adresse ?? "");
        setCodePostal(profile.code_postal ?? "");
        setVille(profile.ville ?? "");
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
      await supabase.from("profiles").update({
        prenom, nom, telephone,
        adresse: adresse || null, code_postal: codePostal || null, ville: ville || null,
      }).eq("id", user.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExport = async () => {
    setExporting(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setExporting(false); return; }

    const tables = ["biens", "locataires", "baux", "quittances", "relances", "etats_des_lieux"] as const;
    const results = await Promise.all(
      tables.map((table) => supabase.from(table).select("*").eq("user_id", user.id))
    );

    const exportData: Record<string, unknown> = {
      exporte_le: new Date().toISOString(),
      profil: { email: user.email, prenom, nom, telephone },
    };
    tables.forEach((table, i) => { exportData[table] = results[i].data ?? []; });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mylocavio-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm("Confirmez-vous votre demande de suppression définitive de compte ?")) return;
    setDeletionLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setDeletionLoading(false); return; }
    await supabase.from("account_deletion_requests").upsert(
      { user_id: user.id, email: user.email ?? "" },
      { onConflict: "user_id" }
    );
    setDeletionLoading(false);
    setDeletionRequested(true);
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
              <Settings className="w-4 h-4 text-[#1c7aa8]" />
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
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse (domicile)</Label>
                <Input id="adresse" type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="12 rue de la Paix" />
                <p className="text-xs text-gray-400">
                  Requise pour la désignation des parties sur vos contrats de bail générés.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code_postal_profil">Code postal</Label>
                  <Input id="code_postal_profil" type="text" value={codePostal} onChange={(e) => setCodePostal(e.target.value)} placeholder="75001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ville_profil">Ville</Label>
                  <Input id="ville_profil" type="text" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Paris" />
                </div>
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
              <button className="text-sm font-medium text-[#1c7aa8] hover:text-[#238bbf] transition-colors">
                Changer de plan
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.entries(planConfig) as [Plan, typeof planConfig[Plan]][]).map(([key, cfg]) => (
                <div
                  key={key}
                  className={cn(
                    "text-center py-2.5 px-3 rounded-xl text-xs font-medium border transition-colors",
                    key === plan ? "border-[#2A9FD6] text-[#1c7aa8] bg-[#2A9FD6]/5" : "border-gray-100 text-gray-400"
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
              <Bell className="w-4 h-4 text-[#1c7aa8]" />
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
                    <input type="checkbox" className="sr-only peer" defaultChecked aria-label={label} />
                    <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#2A9FD6] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#1c7aa8]" />
              <h2 className="font-semibold text-[#1a1a1a]">Mes données (RGPD)</h2>
            </div>
            <Separator className="mt-4" />
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#1a1a1a]">Exporter mes données</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Téléchargez un fichier JSON contenant l&apos;ensemble de vos données (biens,
                  locataires, baux, quittances, relances, états des lieux).
                </p>
              </div>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="shrink-0 border border-gray-200 hover:bg-gray-50 disabled:opacity-60 text-sm font-semibold text-gray-700 px-4 py-2 rounded-xl transition-colors"
              >
                {exporting ? "Préparation..." : "Exporter (JSON)"}
              </button>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm font-bold text-rose-700 mb-1">Zone dangereuse</p>
              <p className="text-xs text-gray-400 mb-4">
                La suppression de votre compte entraînera la suppression définitive de toutes vos
                données (biens, locataires, baux, quittances). Cette action est irréversible.
              </p>
              {deletionRequested ? (
                <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  Votre demande de suppression a bien été enregistrée. Elle sera traitée sous
                  quelques jours ouvrés ; vous pouvez continuer à utiliser votre compte d&apos;ici là.
                </p>
              ) : (
                <button
                  onClick={handleDeleteRequest}
                  disabled={deletionLoading}
                  className="text-sm font-semibold text-rose-700 hover:text-rose-800 disabled:opacity-60 transition-colors"
                >
                  {deletionLoading ? "Envoi..." : "Demander la suppression de mon compte"}
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
