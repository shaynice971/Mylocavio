"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";

interface Bien {
  id: string;
  adresse: string;
  ville: string;
}

interface Locataire {
  id: string;
  prenom: string;
  nom: string;
  bien_id: string;
}

interface Piece {
  nom: string;
  etat: string;
  observations: string;
}

const DEFAULT_PIECES: Piece[] = [
  { nom: "Entrée", etat: "Bon état", observations: "" },
  { nom: "Séjour", etat: "Bon état", observations: "" },
  { nom: "Cuisine", etat: "Bon état", observations: "" },
  { nom: "Chambre 1", etat: "Bon état", observations: "" },
  { nom: "Salle de bain", etat: "Bon état", observations: "" },
  { nom: "WC", etat: "Bon état", observations: "" },
];

const DEFAULT_COUNT = DEFAULT_PIECES.length;

const ETAT_OPTIONS = [
  "Très bon état",
  "Bon état",
  "État d'usage",
  "Mauvais état",
];

export default function NouvelEtatDesLieuxPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [biens, setBiens] = useState<Bien[]>([]);
  const [locataires, setLocataires] = useState<Locataire[]>([]);

  // Step 1 fields
  const [bienId, setBienId] = useState("");
  const [locataireId, setLocataireId] = useState("");
  const [type, setType] = useState<"entree" | "sortie">("entree");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Step 2 fields
  const [pieces, setPieces] = useState<Piece[]>(DEFAULT_PIECES.map((p) => ({ ...p })));

  // Step 3 fields
  const [observations, setObservations] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("biens")
        .select("id, adresse, ville")
        .eq("user_id", user.id)
        .order("adresse");
      setBiens((data as Bien[]) ?? []);
    }
    load();
  }, [supabase]);

  useEffect(() => {
    if (!bienId) {
      setLocataires([]);
      setLocataireId("");
      return;
    }
    async function load() {
      const { data } = await supabase
        .from("locataires")
        .select("id, prenom, nom, bien_id")
        .eq("bien_id", bienId);
      setLocataires((data as Locataire[]) ?? []);
      setLocataireId("");
    }
    load();
  }, [bienId, supabase]);

  const filteredLocataires = locataires.filter((l) => l.bien_id === bienId);

  function updatePiece(index: number, field: keyof Piece, value: string) {
    setPieces((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addPiece() {
    setPieces((prev) => [...prev, { nom: "Nouvelle pièce", etat: "Bon état", observations: "" }]);
  }

  function removePiece(index: number) {
    setPieces((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error: insertError } = await supabase.from("etats_des_lieux").insert({
        user_id: user.id,
        bien_id: bienId,
        locataire_id: locataireId || null,
        type,
        date_etat: date,
        pieces: pieces.map((p) => ({
          nom: p.nom,
          etat: p.etat,
          observations: p.observations || undefined,
        })),
        observations: observations || null,
      });

      if (insertError) throw insertError;

      router.push("/documents");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  const selectedBien = biens.find((b) => b.id === bienId);
  const selectedLocataire = filteredLocataires.find((l) => l.id === locataireId);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        href="/documents"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour aux documents
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Nouvel état des lieux</h1>
        <p className="text-gray-500 mt-1">Créez un état des lieux d&apos;entrée ou de sortie.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                s === step
                  ? "bg-[#2A9FD6] text-white"
                  : s < step
                  ? "bg-[#2A9FD6]/20 text-[#2A9FD6]"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className={`h-px w-8 ${s < step ? "bg-[#2A9FD6]" : "bg-gray-200"}`} />}
          </div>
        ))}
        <span className="ml-2 text-sm text-gray-500">
          {step === 1 && "Informations générales"}
          {step === 2 && "Pièces et état"}
          {step === 3 && "Observations & Validation"}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
              Bien immobilier
            </label>
            <select
              value={bienId}
              onChange={(e) => setBienId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent"
            >
              <option value="">Sélectionner un bien…</option>
              {biens.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.adresse}, {b.ville}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
              Locataire
            </label>
            <select
              value={locataireId}
              onChange={(e) => setLocataireId(e.target.value)}
              disabled={!bienId}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Sélectionner un locataire… (optionnel)</option>
              {filteredLocataires.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.prenom} {l.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-3">
              Type d&apos;état des lieux
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["entree", "sortie"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`border-2 rounded-xl p-4 text-left transition-colors ${
                    type === t
                      ? "border-[#2A9FD6] bg-[#2A9FD6]/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{t === "entree" ? "🔑" : "🚪"}</div>
                  <div className={`text-sm font-semibold ${type === t ? "text-[#2A9FD6]" : "text-[#1a1a1a]"}`}>
                    {t === "entree" ? "Entrée" : "Sortie"}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {t === "entree" ? "État des lieux d'entrée" : "État des lieux de sortie"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
              Date de l&apos;état des lieux
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                if (!bienId) { setError("Veuillez sélectionner un bien."); return; }
                setError("");
                setStep(2);
              }}
              className="px-6 py-2.5 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-semibold text-[#1a1a1a]">Pièces et état</h2>
          <p className="text-sm text-gray-500">Renseignez l&apos;état de chaque pièce du logement.</p>

          <div className="space-y-4">
            {pieces.map((piece, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={piece.nom}
                    onChange={(e) => updatePiece(i, "nom", e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent"
                  />
                  {i >= DEFAULT_COUNT && (
                    <button
                      onClick={() => removePiece(i)}
                      className="text-red-400 hover:text-red-600 transition-colors text-xs font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Supprimer
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">État général</label>
                  <select
                    value={piece.etat}
                    onChange={(e) => updatePiece(i, "etat", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent"
                  >
                    {ETAT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Observations (optionnel)</label>
                  <textarea
                    value={piece.observations}
                    onChange={(e) => updatePiece(i, "observations", e.target.value)}
                    rows={2}
                    placeholder="Ex : légère trace sur le mur nord…"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent resize-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addPiece}
            className="flex items-center gap-2 text-sm text-[#2A9FD6] hover:text-[#238bbf] font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter une pièce
          </button>

          <div className="pt-2 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Retour
            </button>
            <button
              onClick={() => { setError(""); setStep(3); }}
              className="px-6 py-2.5 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1a1a1a] mb-1.5">
              Observations générales (optionnel)
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={4}
              placeholder="Remarques générales sur l'état du logement…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A9FD6] focus:border-transparent resize-none"
            />
          </div>

          {/* Summary */}
          <div className="bg-[#F7F9FC] rounded-xl p-4 space-y-2 text-sm">
            <h3 className="font-semibold text-[#1a1a1a] mb-3">Récapitulatif</h3>
            <div className="flex justify-between text-gray-600">
              <span>Type</span>
              <span className="font-medium text-[#1a1a1a]">
                {type === "entree" ? "Entrée" : "Sortie"}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Date</span>
              <span className="font-medium text-[#1a1a1a]">
                {new Date(date).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Bien</span>
              <span className="font-medium text-[#1a1a1a]">
                {selectedBien ? `${selectedBien.adresse}, ${selectedBien.ville}` : "—"}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Locataire</span>
              <span className="font-medium text-[#1a1a1a]">
                {selectedLocataire ? `${selectedLocataire.prenom} ${selectedLocataire.nom}` : "—"}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Pièces</span>
              <span className="font-medium text-[#1a1a1a]">{pieces.length} pièce(s)</span>
            </div>
          </div>

          <div className="pt-2 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Retour
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Enregistrement…" : "Créer l'état des lieux"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
