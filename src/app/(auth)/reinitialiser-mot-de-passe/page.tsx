"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all";

export default function ReinitialiserMotDePassePage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }
    if (password.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.updateUser({ password });
    if (authError) { setError("Une erreur est survenue. Le lien est peut-être expiré."); setLoading(false); return; }
    router.push("/dashboard");
  };

  return (
    <div className="border border-white/8 bg-white/3 backdrop-blur-sm rounded-2xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Nouveau mot de passe</h1>
        <p className="text-white/40 text-sm mt-1">Choisissez un nouveau mot de passe sécurisé</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/50 mb-1.5">Nouveau mot de passe *</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/50 mb-1.5">Confirmer le mot de passe *</label>
          <input id="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputClass} />
        </div>
        {error && (
          <div className="px-4 py-3 bg-rose-500/15 border border-rose-500/20 text-rose-400 text-sm rounded-xl">{error}</div>
        )}
        <button type="submit" disabled={loading} className="w-full bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25">
          {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
        </button>
      </form>
    </div>
  );
}
