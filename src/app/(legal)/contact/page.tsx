"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContactPage() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [sujet, setSujet] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from("contact_messages").insert({
      user_id: user?.id ?? null,
      nom,
      email,
      sujet: sujet || null,
      message,
    });
    if (insertError) {
      setError("Une erreur est survenue lors de l'envoi. Merci de réessayer dans quelques instants.");
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-black text-gray-900">Message envoyé</h1>
        <p className="text-gray-500 text-sm mt-3">
          Merci, votre message a bien été transmis. Nous vous répondrons dans les meilleurs délais.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 mb-2">Contact</h1>
      <p className="text-gray-500 text-sm mb-8">
        Une question, un problème, une suggestion ? Écrivez-nous, nous vous répondrons rapidement.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {error && (
          <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">{error}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Nom *</label>
            <input
              type="text" required value={nom} onChange={(e) => setNom(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Email *</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">Sujet</label>
          <input
            type="text" value={sujet} onChange={(e) => setSujet(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1.5">Message *</label>
          <textarea
            required rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 transition-all resize-none"
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all"
        >
          {loading ? "Envoi..." : "Envoyer le message"}
        </button>
      </form>
    </div>
  );
}
