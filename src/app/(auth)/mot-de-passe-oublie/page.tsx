"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

    if (authError) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#2A9FD6]">MyLocavio</h1>
        <p className="text-gray-500 text-sm mt-1">Réinitialiser votre mot de passe</p>
      </div>

      {success ? (
        <div className="text-center space-y-4">
          <div className="text-green-600 bg-green-50 px-4 py-3 rounded-lg text-sm">
            Un email vous a été envoyé. Vérifiez votre boîte mail.
          </div>
          <p className="text-gray-500 text-sm">
            Si vous ne recevez pas l&apos;email dans quelques minutes, vérifiez vos spams.
          </p>
        </div>
      ) : (
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
            {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/connexion" className="text-[#2A9FD6] font-medium hover:underline">
          ← Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
