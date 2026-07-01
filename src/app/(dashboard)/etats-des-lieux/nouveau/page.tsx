"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";

interface Bien { id: string; adresse: string; ville: string }
interface Locataire { id: string; prenom: string; nom: string; bien_id: string }
interface Piece { nom: string; etat: string; observations: string }

const DEFAULT_PIECES: Piece[] = [
  { nom: "Entrée", etat: "Bon état", observations: "" },
  { nom: "Séjour", etat: "Bon état", observations: "" },
  { nom: "Cuisine", etat: "Bon état", observations: "" },
  { nom: "Chambre 1", etat: "Bon état", observations: "" },
  { nom: "Salle de bain", etat: "Bon état", observations: "" },
  { nom: "WC", etat: "Bon état", observations: "" },
];
const DEFAULT_COUNT = DEFAULT_PIECES.length;
const ETAT_OPTIONS = ["Très bon état", "Bon état", "État d'usage", "Mauvais état"];

const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed";

export default function NouvelEtatDesLieuxPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(1);
  const [biens, setBiens] = useState<Bien[]>([]);
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const [bienId, setBienId] = useState("");
  const [locataireId, setLocataireId] = useState("");
  const [type, setType] = useState<"entree" | "sortie">("entree");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [pieces, setPieces] = useState<Piece[]>(DEFAULT_PIECES.map((p) => ({ ...p })));
  const [observations, setObservations] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("biens").select("id, adresse, ville").eq("user_id", user.id).order("adresse");
      setBiens((data as Bien[]) ?? []);
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!bienId) { setLocataires([]); setLocataireId(""); return; }
    async function load() {
      const { data } = await supabase.from("locataires").select("id, prenom, nom, bien_id").eq("bien_id", bienId);
      setLocataires((data as Locataire[]) ?? []);
      setLocataireId("");
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bienId]);

  const filteredLocataires = locataires.filter((l) => l.bien_id === bienId);

  function updatePiece(index: number, field: keyof Piece, value: string) {
    setPieces((prev) => { const next = [...prev]; next[index] = { ...next[index], [field]: value }; return next; });
  }

  async function handleSubmit() {
    setLoading(true); setError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");
      const { error: insertError } = await supabase.from("etats_des_lieux").insert({
        user_id: user.id, bien_id: bienId, locataire_id: locataireId || null,
        type, date_etat: date,
        pieces: pieces.map((p) => ({ nom: p.nom, etat: p.etat, observations: p.observations || undefined })),
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
    <div className="max-w-2xl">
      <Link href="/documents" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-600 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" />
        Retour aux documents
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Nouvel état des lieux</h1>
        <p className="text-gray-500 mt-1 text-sm">Créez un état des lieux d&apos;entrée ou de sortie.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              s === step ? "bg-[#2A9FD6] text-white" : s < step ? "bg-[#2A9FD6]/20 text-[#1c7aa8]" : "bg-gray-50 text-gray-400"
            }`}>
              {s}
            </div>
            {s < 3 && <div className={`h-px w-8 transition-colors ${s < step ? "bg-[#2A9FD6]" : "bg-gray-50"}`} />}
          </div>
        ))}
        <span className="ml-2 text-sm text-gray-500">
          {step === 1 && "Informations générales"}
          {step === 2 && "Pièces et état"}
          {step === 3 && "Observations & Validation"}
        </span>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">{error}</div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Bien immobilier</label>
            <select value={bienId} onChange={(e) => setBienId(e.target.value)} className={inputClass}>
              <option value="">Sélectionner un bien…</option>
              {biens.map((b) => <option key={b.id} value={b.id}>{b.adresse}, {b.ville}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Locataire</label>
            <select value={locataireId} onChange={(e) => setLocataireId(e.target.value)} disabled={!bienId} className={inputClass}>
              <option value="">Sélectionner un locataire… (optionnel)</option>
              {filteredLocataires.map((l) => <option key={l.id} value={l.id}>{l.prenom} {l.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-3">Type d&apos;état des lieux</label>
            <div className="grid grid-cols-2 gap-3">
              {(["entree", "sortie"] as const).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`border-2 rounded-xl p-4 text-left transition-all ${type === t ? "border-[#2A9FD6] bg-[#2A9FD6]/10" : "border-gray-200 hover:border-gray-200 bg-white"}`}
                >
                  <div className="text-2xl mb-1">{t === "entree" ? "🔑" : "🚪"}</div>
                  <div className={`text-sm font-semibold ${type === t ? "text-[#1c7aa8]" : "text-gray-900"}`}>{t === "entree" ? "Entrée" : "Sortie"}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t === "entree" ? "État des lieux d'entrée" : "État des lieux de sortie"}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Date de l&apos;état des lieux</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => { if (!bienId) { setError("Veuillez sélectionner un bien."); return; } setError(""); setStep(2); }}
              className="px-6 py-2.5 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Pièces et état</h2>
            <p className="text-sm text-gray-400">Renseignez l&apos;état de chaque pièce du logement.</p>
          </div>
          <div className="space-y-3">
            {pieces.map((piece, i) => (
              <div key={i} className="border border-gray-200 bg-white rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <input type="text" value={piece.nom} onChange={(e) => updatePiece(i, "nom", e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all"
                  />
                  {i >= DEFAULT_COUNT && (
                    <button onClick={() => setPieces((p) => p.filter((_, idx) => idx !== i))}
                      className="text-rose-700 hover:text-rose-800 transition-colors text-xs font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">État général</label>
                  <select value={piece.etat} onChange={(e) => updatePiece(i, "etat", e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 transition-all">
                    {ETAT_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Observations (optionnel)</label>
                  <textarea value={piece.observations} onChange={(e) => updatePiece(i, "observations", e.target.value)} rows={2}
                    placeholder="Ex : légère trace sur le mur nord…"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 transition-all resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setPieces((p) => [...p, { nom: "Nouvelle pièce", etat: "Bon état", observations: "" }])}
            className="flex items-center gap-2 text-sm text-[#1c7aa8] hover:text-[#145d80] font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter une pièce
          </button>
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(1)} className="px-6 py-2.5 border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-200 text-sm font-semibold rounded-xl transition-all">← Retour</button>
            <button onClick={() => { setError(""); setStep(3); }} className="px-6 py-2.5 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25">Suivant →</button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1.5">Observations générales (optionnel)</label>
            <textarea value={observations} onChange={(e) => setObservations(e.target.value)} rows={4}
              placeholder="Remarques générales sur l'état du logement…"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 transition-all resize-none"
            />
          </div>
          {/* Recap */}
          <div className="border border-gray-200 bg-white rounded-xl p-4 space-y-2 text-sm">
            <h3 className="font-bold text-gray-500 uppercase tracking-wider text-xs mb-3">Récapitulatif</h3>
            {[
              ["Type", type === "entree" ? "Entrée" : "Sortie"],
              ["Date", new Date(date).toLocaleDateString("fr-FR")],
              ["Bien", selectedBien ? `${selectedBien.adresse}, ${selectedBien.ville}` : "—"],
              ["Locataire", selectedLocataire ? `${selectedLocataire.prenom} ${selectedLocataire.nom}` : "—"],
              ["Pièces", `${pieces.length} pièce(s)`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(2)} className="px-6 py-2.5 border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-200 text-sm font-semibold rounded-xl transition-all">← Retour</button>
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25 disabled:opacity-60">
              {loading ? "Enregistrement…" : "Créer l'état des lieux"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
