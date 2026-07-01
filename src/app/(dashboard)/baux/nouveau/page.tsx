"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2A9FD6]/50 focus:border-[#2A9FD6]/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed";
const labelClass = "block text-sm font-medium text-gray-500 mb-1.5";

type Bien = { id: string; adresse: string; ville: string; loyer: number; charges: number; depot_garantie: number | null };
type Locataire = { id: string; prenom: string; nom: string };
type TypeBail = "vide" | "meuble" | "mobilite";

function addMonths(date: Date, months: number): Date {
  const d = new Date(date); d.setMonth(d.getMonth() + months); return d;
}
function addYears(date: Date, years: number): Date {
  const d = new Date(date); d.setFullYear(d.getFullYear() + years); return d;
}
function toDateString(d: Date): string { return d.toISOString().slice(0, 10); }

export default function NouveauBailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biens, setBiens] = useState<Bien[]>([]);
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const today = toDateString(new Date());
  const [bienId, setBienId] = useState("");
  const [locataireId, setLocataireId] = useState("");
  const [typeBail, setTypeBail] = useState<TypeBail>("vide");
  const [dureesMobilite, setDureesMobilite] = useState(1);
  const [loyer, setLoyer] = useState("");
  const [charges, setCharges] = useState("");
  const [depotGarantie, setDepotGarantie] = useState("");
  const [dateDebut, setDateDebut] = useState(today);
  const [dateFin, setDateFin] = useState("");

  useEffect(() => {
    if (!dateDebut) return;
    const d = new Date(dateDebut);
    if (typeBail === "vide") setDateFin(toDateString(addYears(d, 3)));
    else if (typeBail === "meuble") setDateFin(toDateString(addYears(d, 1)));
    else setDateFin(toDateString(addMonths(d, dureesMobilite)));
  }, [typeBail, dateDebut, dureesMobilite]);

  useEffect(() => {
    async function fetchBiens() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("biens").select("id, adresse, ville, loyer, charges, depot_garantie").eq("user_id", user.id).order("adresse");
      setBiens((data as Bien[]) ?? []);
    }
    fetchBiens();
  }, []);

  useEffect(() => {
    if (!bienId) { setLocataires([]); setLocataireId(""); return; }
    async function fetchLocataires() {
      const supabase = createClient();
      const { data } = await supabase.from("locataires").select("id, prenom, nom").eq("bien_id", bienId).eq("actif", true);
      setLocataires((data as Locataire[]) ?? []);
      setLocataireId("");
    }
    fetchLocataires();
    const bien = biens.find((b) => b.id === bienId);
    if (bien) { setLoyer(String(bien.loyer)); setCharges(String(bien.charges ?? 0)); setDepotGarantie(bien.depot_garantie ? String(bien.depot_garantie) : ""); }
  }, [bienId, biens]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bienId || !locataireId) { setError("Veuillez sélectionner un bien et un locataire."); return; }
    if (Number(loyer) <= 0) { setError("Le loyer doit être un montant positif."); return; }
    if (charges && Number(charges) < 0) { setError("Les charges ne peuvent pas être négatives."); return; }
    if (depotGarantie && Number(depotGarantie) < 0) { setError("Le dépôt de garantie ne peut pas être négatif."); return; }
    if (dateFin && dateFin <= dateDebut) { setError("La date de fin doit être postérieure à la date de début."); return; }
    if (typeBail === "mobilite" && (dureesMobilite < 1 || dureesMobilite > 10)) {
      setError("La durée d'un bail mobilité doit être comprise entre 1 et 10 mois.");
      return;
    }
    setLoading(true); setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Vous devez être connecté."); setLoading(false); return; }
    const { error: insertError } = await supabase.from("baux").insert({
      user_id: user.id, bien_id: bienId, locataire_id: locataireId, type: typeBail,
      loyer: Number(loyer), charges: charges ? Number(charges) : 0,
      depot_garantie: depotGarantie ? Number(depotGarantie) : null,
      date_debut: dateDebut, date_fin: dateFin || null,
    });
    if (insertError) { setError(insertError.message); setLoading(false); return; }
    router.push("/documents");
  }

  const typeOptions: { value: TypeBail; label: string; description: string }[] = [
    { value: "vide", label: "Bail vide", description: "Durée 3 ans, renouvellement tacite" },
    { value: "meuble", label: "Bail meublé", description: "Durée 1 an, renouvellement tacite" },
    { value: "mobilite", label: "Bail mobilité", description: "Durée 1 à 10 mois, non renouvelable" },
  ];

  return (
    <div>
      <div className="mb-8">
        <Link href="/documents" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour aux documents
        </Link>
        <h1 className="text-2xl font-black text-gray-900">Créer un nouveau bail</h1>
        <p className="text-gray-500 mt-1 text-sm">Renseignez les informations du contrat de bail.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="px-4 py-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">{error}</div>
        )}

        {/* Étape 1 */}
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            Étape 1 — Bien &amp; Locataire
          </h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Bien *</label>
              <select required value={bienId} onChange={(e) => setBienId(e.target.value)} className={inputClass}>
                <option value="">Sélectionner un bien</option>
                {biens.map((b) => (
                  <option key={b.id} value={b.id}>{b.adresse}, {b.ville}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Locataire *</label>
              <select required value={locataireId} onChange={(e) => setLocataireId(e.target.value)} className={inputClass} disabled={!bienId}>
                <option value="">
                  {bienId ? (locataires.length === 0 ? "Aucun locataire actif pour ce bien" : "Sélectionner un locataire") : "Sélectionnez d'abord un bien"}
                </option>
                {locataires.map((l) => (
                  <option key={l.id} value={l.id}>{l.prenom} {l.nom}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Étape 2 */}
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Étape 2 — Type de bail</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {typeOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex flex-col gap-1 border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  typeBail === opt.value
                    ? "border-[#2A9FD6] bg-[#2A9FD6]/10"
                    : "border-gray-200 hover:border-gray-200 bg-white"
                }`}
              >
                <input type="radio" name="type_bail" value={opt.value} checked={typeBail === opt.value} onChange={() => setTypeBail(opt.value)} className="sr-only" />
                <span className="font-semibold text-sm text-gray-900">{opt.label}</span>
                <span className="text-xs text-gray-400">{opt.description}</span>
              </label>
            ))}
          </div>
          {typeBail === "mobilite" && (
            <div className="mt-4 max-w-xs">
              <label className={labelClass}>Durée (mois) *</label>
              <input type="number" min={1} max={10} required value={dureesMobilite} onChange={(e) => setDureesMobilite(Number(e.target.value))} className={inputClass} />
            </div>
          )}
        </div>

        {/* Étape 3 */}
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Étape 3 — Conditions financières</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Loyer mensuel HC (€) *</label>
              <input type="number" min={0} required value={loyer} onChange={(e) => setLoyer(e.target.value)} className={inputClass} placeholder="800" />
            </div>
            <div>
              <label className={labelClass}>Provisions sur charges (€)</label>
              <input type="number" min={0} value={charges} onChange={(e) => setCharges(e.target.value)} className={inputClass} placeholder="0" />
            </div>
            <div>
              <label className={labelClass}>Dépôt de garantie (€)</label>
              <input type="number" min={0} value={depotGarantie} onChange={(e) => setDepotGarantie(e.target.value)} className={inputClass} placeholder="1600" />
            </div>
            <div>
              <label className={labelClass}>Date de début *</label>
              <input type="date" required value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>
                Date de fin
                {typeBail !== "mobilite" && <span className="ml-1 text-gray-400 font-normal">(calculée automatiquement)</span>}
              </label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                readOnly={typeBail !== "mobilite"}
                className={`${inputClass} ${typeBail !== "mobilite" ? "opacity-50 cursor-default" : ""}`}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading} className="bg-[#2A9FD6] hover:bg-[#238bbf] disabled:opacity-60 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25">
            {loading ? "Enregistrement..." : "Créer le bail"}
          </button>
          <Link href="/documents" className="text-sm text-gray-500 hover:text-gray-600 transition-colors">Annuler</Link>
        </div>
      </form>
    </div>
  );
}
