"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GENERIC_SAVE_ERROR } from "@/lib/errors";
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
  const [chargesType, setChargesType] = useState<"provisions" | "forfait">("provisions");
  const [depotGarantie, setDepotGarantie] = useState("");
  const [dateDebut, setDateDebut] = useState(today);
  const [dateFin, setDateFin] = useState("");
  const [irlTrimestre, setIrlTrimestre] = useState("");
  const [irlValeur, setIrlValeur] = useState("");
  const [dernierLoyerPrecedent, setDernierLoyerPrecedent] = useState("");
  const [mandataireNom, setMandataireNom] = useState("");
  const [mandataireAdresse, setMandataireAdresse] = useState("");
  const [travauxBailleur, setTravauxBailleur] = useState("");
  const [travauxAmelioration, setTravauxAmelioration] = useState("");
  const [honorairesLocataire, setHonorairesLocataire] = useState("");
  const [honorairesBailleur, setHonorairesBailleur] = useState("");
  const [colocatairesSupplementaires, setColocatairesSupplementaires] = useState("");
  const [conditionsParticulieres, setConditionsParticulieres] = useState("");

  useEffect(() => {
    if (!dateDebut) return;
    const d = new Date(dateDebut);
    if (typeBail === "vide") setDateFin(toDateString(addYears(d, 3)));
    else if (typeBail === "meuble") setDateFin(toDateString(addYears(d, 1)));
    else setDateFin(toDateString(addMonths(d, dureesMobilite)));
  }, [typeBail, dateDebut, dureesMobilite]);

  // Le régime "forfait" de charges n'est légalement autorisé qu'en meublé ou
  // bail mobilité : un bail vide ne peut avoir que des provisions avec
  // régularisation annuelle (art. 23 loi du 6 juillet 1989).
  useEffect(() => {
    if (typeBail === "vide") setChargesType("provisions");
  }, [typeBail]);

  // Le bail mobilité (loi ELAN) n'admet légalement aucun dépôt de garantie.
  useEffect(() => {
    if (typeBail === "mobilite") setDepotGarantie("");
  }, [typeBail]);

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
    if (typeBail === "mobilite" && depotGarantie && Number(depotGarantie) > 0) {
      setError("Le bail mobilité n'admet légalement aucun dépôt de garantie.");
      return;
    }
    if (honorairesLocataire && honorairesBailleur && Number(honorairesLocataire) > Number(honorairesBailleur)) {
      setError("Les honoraires à la charge du locataire ne peuvent pas excéder ceux à la charge du bailleur.");
      return;
    }
    setLoading(true); setError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Vous devez être connecté."); setLoading(false); return; }
    const { error: insertError } = await supabase.from("baux").insert({
      user_id: user.id, bien_id: bienId, locataire_id: locataireId, type: typeBail,
      loyer: Number(loyer), charges: charges ? Number(charges) : 0,
      charges_type: chargesType,
      depot_garantie: depotGarantie ? Number(depotGarantie) : null,
      date_debut: dateDebut, date_fin: dateFin || null,
      mandataire_nom: mandataireNom || null,
      mandataire_adresse: mandataireAdresse || null,
      irl_trimestre_reference: irlTrimestre || null,
      irl_valeur_reference: irlValeur ? Number(irlValeur) : null,
      dernier_loyer_precedent: dernierLoyerPrecedent ? Number(dernierLoyerPrecedent) : null,
      travaux_bailleur: travauxBailleur || null,
      travaux_amelioration: travauxAmelioration || null,
      honoraires_locataire: honorairesLocataire ? Number(honorairesLocataire) : null,
      honoraires_bailleur: honorairesBailleur ? Number(honorairesBailleur) : null,
      colocataires_supplementaires: colocatairesSupplementaires || null,
      conditions_particulieres: conditionsParticulieres || null,
    });
    if (insertError) { setError(GENERIC_SAVE_ERROR); setLoading(false); return; }
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
              <label className={labelClass} htmlFor="bien_id">Bien *</label>
              <select id="bien_id" required value={bienId} onChange={(e) => setBienId(e.target.value)} className={inputClass}>
                <option value="">Sélectionner un bien</option>
                {biens.map((b) => (
                  <option key={b.id} value={b.id}>{b.adresse}, {b.ville}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="locataire_id">Locataire *</label>
              <select id="locataire_id" required value={locataireId} onChange={(e) => setLocataireId(e.target.value)} className={inputClass} disabled={!bienId}>
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
              <label className={labelClass} htmlFor="duree_mobilite">Durée (mois) *</label>
              <input id="duree_mobilite" type="number" min={1} max={10} required value={dureesMobilite} onChange={(e) => setDureesMobilite(Number(e.target.value))} className={inputClass} />
            </div>
          )}
        </div>

        {/* Étape 3 */}
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Étape 3 — Conditions financières</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} htmlFor="loyer_hc">Loyer mensuel HC (€) *</label>
              <input id="loyer_hc" type="number" min={0} required value={loyer} onChange={(e) => setLoyer(e.target.value)} className={inputClass} placeholder="800" />
            </div>
            <div>
              <label className={labelClass} htmlFor="charges">
                {chargesType === "forfait" ? "Charges forfaitaires (€)" : "Provisions sur charges (€)"}
              </label>
              <input id="charges" type="number" min={0} value={charges} onChange={(e) => setCharges(e.target.value)} className={inputClass} placeholder="0" />
            </div>
            <div>
              <label className={labelClass} htmlFor="charges_type">Régime des charges</label>
              <select
                id="charges_type"
                value={chargesType}
                onChange={(e) => setChargesType(e.target.value as "provisions" | "forfait")}
                disabled={typeBail === "vide"}
                className={inputClass}
              >
                <option value="provisions">Provisions avec régularisation annuelle</option>
                <option value="forfait">Forfait</option>
              </select>
              {typeBail === "vide" && (
                <p className="text-xs text-gray-400 mt-1">
                  Le régime forfaitaire n&apos;est pas autorisé pour un bail vide (réservé au meublé
                  et au bail mobilité) — seules les provisions avec régularisation sont possibles.
                </p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="depot_garantie">Dépôt de garantie (€)</label>
              <input
                id="depot_garantie" type="number" min={0} value={depotGarantie}
                onChange={(e) => setDepotGarantie(e.target.value)}
                disabled={typeBail === "mobilite"}
                className={inputClass} placeholder={typeBail === "mobilite" ? "Non applicable" : "1600"}
              />
              {typeBail === "mobilite" && (
                <p className="text-xs text-gray-400 mt-1">Le bail mobilité n&apos;admet légalement aucun dépôt de garantie.</p>
              )}
            </div>
            <div>
              <label className={labelClass} htmlFor="date_debut">Date de début *</label>
              <input id="date_debut" type="date" required value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="date_fin">
                Date de fin
                {typeBail !== "mobilite" && <span className="ml-1 text-gray-400 font-normal">(calculée automatiquement)</span>}
              </label>
              <input
                id="date_fin"
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                readOnly={typeBail !== "mobilite"}
                className={`${inputClass} ${typeBail !== "mobilite" ? "opacity-50 cursor-default" : ""}`}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="irl_trimestre">IRL — trimestre de référence</label>
              <input id="irl_trimestre" type="text" value={irlTrimestre} onChange={(e) => setIrlTrimestre(e.target.value)} className={inputClass} placeholder="2e trimestre 2026" />
            </div>
            <div>
              <label className={labelClass} htmlFor="irl_valeur">IRL — valeur de référence</label>
              <input id="irl_valeur" type="number" step="0.01" min={0} value={irlValeur} onChange={(e) => setIrlValeur(e.target.value)} className={inputClass} placeholder="145,23" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="dernier_loyer_precedent">
                Loyer versé par le précédent locataire (€)
                <span className="ml-1 text-gray-400 font-normal">— si relogement de moins de 18 mois</span>
              </label>
              <input id="dernier_loyer_precedent" type="number" min={0} value={dernierLoyerPrecedent} onChange={(e) => setDernierLoyerPrecedent(e.target.value)} className={inputClass} placeholder="Laisser vide si non applicable" />
            </div>
          </div>
        </div>

        {/* Étape 4 */}
        <div className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Étape 4 — Informations complémentaires (optionnel)</h2>
          <p className="text-xs text-gray-400 mb-4">
            À renseigner si applicable à votre situation : mandataire, travaux, colocation, honoraires d&apos;agence.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass} htmlFor="mandataire_nom">Mandataire du bailleur — nom</label>
              <input id="mandataire_nom" type="text" value={mandataireNom} onChange={(e) => setMandataireNom(e.target.value)} className={inputClass} placeholder="Agence Immobilière XYZ" />
            </div>
            <div>
              <label className={labelClass} htmlFor="mandataire_adresse">Mandataire du bailleur — adresse</label>
              <input id="mandataire_adresse" type="text" value={mandataireAdresse} onChange={(e) => setMandataireAdresse(e.target.value)} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="travaux_bailleur">Travaux effectués depuis le dernier contrat</label>
              <textarea id="travaux_bailleur" rows={2} value={travauxBailleur} onChange={(e) => setTravauxBailleur(e.target.value)} className={`${inputClass} resize-none`} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="travaux_amelioration">Travaux d&apos;amélioration décidés en cours de bail précédent</label>
              <textarea id="travaux_amelioration" rows={2} value={travauxAmelioration} onChange={(e) => setTravauxAmelioration(e.target.value)} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass} htmlFor="honoraires_bailleur">Honoraires à la charge du bailleur (€)</label>
              <input id="honoraires_bailleur" type="number" min={0} value={honorairesBailleur} onChange={(e) => setHonorairesBailleur(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass} htmlFor="honoraires_locataire">Honoraires à la charge du locataire (€)</label>
              <input id="honoraires_locataire" type="number" min={0} value={honorairesLocataire} onChange={(e) => setHonorairesLocataire(e.target.value)} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="colocataires_supplementaires">
                Colocataires solidaires additionnels
                <span className="ml-1 text-gray-400 font-normal">— si colocation</span>
              </label>
              <input id="colocataires_supplementaires" type="text" value={colocatairesSupplementaires} onChange={(e) => setColocatairesSupplementaires(e.target.value)} className={inputClass} placeholder="Prénom Nom, Prénom Nom..." />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass} htmlFor="conditions_particulieres">Autres conditions particulières</label>
              <textarea id="conditions_particulieres" rows={3} value={conditionsParticulieres} onChange={(e) => setConditionsParticulieres(e.target.value)} className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl">
          Vous restez seul responsable de l&apos;exactitude des informations saisies et de
          l&apos;adéquation de ce contrat à votre situation personnelle. En cas de doute, consultez un
          professionnel du droit. Voir les <Link href="/cgu" className="underline font-semibold">CGU</Link> pour le détail.
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
