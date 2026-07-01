"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError("Email ou mot de passe incorrect."); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="border border-gray-200 bg-white shadow-sm backdrop-blur-sm rounded-2xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Connexion</h1>
        <p className="text-gray-500 text-sm mt-1">Connectez-vous à votre espace propriétaire</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-1.5">
            Adresse e-mail
          </label>
          <input
            id="email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            className={inputClass}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-500">
              Mot de passe
            </label>
            <Link href="/mot-de-passe-oublie" className="text-xs text-[#1c7aa8] hover:text-[#145d80] transition-colors">
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            id="password" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
          />
        </div>

        {error && (
          <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25 mt-2"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-[#1c7aa8] font-semibold hover:text-[#145d80] transition-colors">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
