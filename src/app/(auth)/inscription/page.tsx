"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all";

export default function InscriptionPage() {
  const router = useRouter();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({ email, password, options: { data: { prenom, nom } } });
    if (authError) { setError(authError.message); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="border border-white/8 bg-white/3 backdrop-blur-sm rounded-2xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Créer un compte</h1>
        <p className="text-white/40 text-sm mt-1">Rejoignez MyLocavio gratuitement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-white/50 mb-1.5">Prénom *</label>
            <input id="prenom" type="text" required value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Jean" className={inputClass} />
          </div>
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-white/50 mb-1.5">Nom *</label>
            <input id="nom" type="text" required value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Dupont" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/50 mb-1.5">Adresse e-mail *</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" className={inputClass} />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/50 mb-1.5">Mot de passe *</label>
          <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 caractères" className={inputClass} />
        </div>

        {error && (
          <div className="px-4 py-3 bg-rose-500/15 border border-rose-500/20 text-rose-400 text-sm rounded-xl">{error}</div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25 mt-2"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="text-center text-sm text-white/35 mt-6">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="text-[#2A9FD6] font-semibold hover:text-[#5bb8e8] transition-colors">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
