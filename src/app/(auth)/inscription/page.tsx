"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { friendlyAuthError } from "@/lib/errors";
import { MailCheck } from "lucide-react";

const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all";

export default function InscriptionPage() {
  const router = useRouter();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationRequise, setConfirmationRequise] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { prenom, nom } } });
    if (authError) { setError(friendlyAuthError(authError.message)); setLoading(false); return; }
    // Si la confirmation d'email est activée sur le projet Supabase, signUp ne
    // renvoie pas de session active : on informe l'utilisateur plutôt que de
    // le rediriger vers un dashboard qui le renverrait aussitôt vers /connexion.
    if (!data.session) {
      setConfirmationRequise(true);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  if (confirmationRequise) {
    return (
      <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#2A9FD6]/15 flex items-center justify-center mx-auto mb-5">
          <MailCheck className="w-7 h-7 text-[#2A9FD6]" />
        </div>
        <h1 className="text-xl font-black text-gray-900">Vérifiez votre boîte mail</h1>
        <p className="text-gray-500 text-sm mt-2">
          Un e-mail de confirmation vous a été envoyé à <strong>{email}</strong>. Cliquez sur le
          lien qu&apos;il contient pour activer votre compte, puis connectez-vous.
        </p>
        <Link
          href="/connexion"
          className="inline-flex items-center gap-2 mt-6 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all"
        >
          Aller à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 bg-white shadow-sm backdrop-blur-sm rounded-2xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Créer un compte</h1>
        <p className="text-gray-500 text-sm mt-1">Rejoignez MyLocavio gratuitement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-gray-500 mb-1.5">Prénom *</label>
            <input id="prenom" type="text" required value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Jean" className={inputClass} />
          </div>
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-500 mb-1.5">Nom *</label>
            <input id="nom" type="text" required value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Dupont" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-1.5">Adresse e-mail *</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" className={inputClass} />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-500 mb-1.5">Mot de passe *</label>
          <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 caractères" className={inputClass} />
        </div>

        {error && (
          <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">{error}</div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25 mt-2"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Déjà un compte ?{" "}
        <Link href="/connexion" className="text-[#2A9FD6] font-semibold hover:text-[#5bb8e8] transition-colors">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
