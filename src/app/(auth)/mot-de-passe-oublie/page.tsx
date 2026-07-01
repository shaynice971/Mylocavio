"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reinitialiser-mot-de-passe",
    });
    if (authError) { setError("Une erreur est survenue. Veuillez réessayer."); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="border border-gray-200 bg-white shadow-sm backdrop-blur-sm rounded-2xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Mot de passe oublié</h1>
        <p className="text-gray-500 text-sm mt-1">Entrez votre email pour recevoir un lien de réinitialisation</p>
      </div>

      {success ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7 text-emerald-700" />
          </div>
          <div>
            <p className="text-gray-900 font-semibold">Email envoyé !</p>
            <p className="text-gray-500 text-sm mt-1">Vérifiez votre boîte mail. Si vous ne recevez pas l&apos;email, vérifiez vos spams.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-1.5">Adresse e-mail</label>
            <input
              id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.fr"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all"
            />
          </div>
          {error && (
            <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">{error}</div>
          )}
          <button type="submit" disabled={loading} className="w-full bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25">
            {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-400 mt-6">
        <Link href="/connexion" className="inline-flex items-center gap-1.5 text-[#2A9FD6] hover:text-[#5bb8e8] transition-colors font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
