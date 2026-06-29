"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#2A9FD6]">MyLocavio</h1>
        <p className="text-gray-500 text-sm mt-1">Connectez-vous à votre espace</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.fr"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="text-[#2A9FD6] font-medium hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
