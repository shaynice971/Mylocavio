"use server";

import { createClient } from "@/lib/supabase/server";

export async function genererQuittancesDuMois(): Promise<{ count: number }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  // Récupérer tous les locataires actifs avec leur bien
  const { data: locataires } = await supabase
    .from("locataires")
    .select("id, bien_id, biens ( loyer, charges )")
    .eq("user_id", user.id)
    .eq("actif", true);

  if (!locataires || locataires.length === 0) return { count: 0 };

  // Premier jour du mois courant
  const now = new Date();
  const mois = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

  const quittances = locataires.map((loc) => {
    const bien = Array.isArray(loc.biens) ? loc.biens[0] : loc.biens;
    const loyer = Number(bien?.loyer ?? 0);
    const charges = Number(bien?.charges ?? 0);
    return {
      user_id: user.id,
      bien_id: loc.bien_id,
      locataire_id: loc.id,
      mois,
      loyer,
      charges,
      statut: "generee",
    };
  });

  const { data: inserted } = await supabase
    .from("quittances")
    .upsert(quittances, {
      // Doit correspondre exactement à la contrainte unique(locataire_id, mois) du schéma
      // (supabase/schema.sql) : PostgREST rejette tout onConflict qui ne matche aucune
      // contrainte unique existante.
      onConflict: "locataire_id,mois",
      ignoreDuplicates: true,
    })
    .select("id");

  return { count: inserted?.length ?? 0 };
}
