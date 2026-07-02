export const runtime = "nodejs";

import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import type { ReactElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { BailPDF, type BailPDFProps } from "@/lib/pdf/BailPDF";
import type { DocumentProps } from "@react-pdf/renderer";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Non authentifié", { status: 401 });
  }

  // Fetch bail with joins
  const { data: bail, error } = await supabase
    .from("baux")
    .select(
      `
      id, type, date_debut, date_fin, loyer, charges, depot_garantie, user_id, locataire_id, bien_id,
      charges_type, mandataire_nom, mandataire_adresse, irl_trimestre_reference, irl_valeur_reference,
      dernier_loyer_precedent, travaux_bailleur, travaux_amelioration, honoraires_locataire,
      honoraires_bailleur, colocataires_supplementaires, conditions_particulieres,
      biens ( adresse, complement_adresse, code_postal, ville, type, surface, nb_pieces,
        type_habitat, regime_juridique, dpe_classe, annexes, equipements, equipements_communs,
        chauffage_type, eau_chaude_type, acces_technologies ),
      locataires ( prenom, nom, email, telephone, date_entree )
    `
    )
    .eq("id", id)
    .single();

  if (error || !bail) {
    return new Response("Bail introuvable", { status: 404 });
  }

  // Verify ownership
  if (bail.user_id !== user.id) {
    return new Response("Accès non autorisé", { status: 403 });
  }

  // Fetch bailleur profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("prenom, nom, telephone, adresse, code_postal, ville")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return new Response("Profil bailleur introuvable", { status: 404 });
  }

  const bien = Array.isArray(bail.biens) ? bail.biens[0] : bail.biens;
  const locataire = Array.isArray(bail.locataires)
    ? bail.locataires[0]
    : bail.locataires;

  if (!bien || !locataire) {
    return new Response("Données incomplètes", { status: 422 });
  }

  const props: BailPDFProps = {
    bail: {
      type: bail.type,
      date_debut: bail.date_debut,
      date_fin: bail.date_fin ?? null,
      loyer: Number(bail.loyer),
      charges: Number(bail.charges),
      charges_type: bail.charges_type as "provisions" | "forfait" | null,
      depot_garantie: bail.depot_garantie ? Number(bail.depot_garantie) : null,
      mandataire_nom: bail.mandataire_nom ?? null,
      mandataire_adresse: bail.mandataire_adresse ?? null,
      irl_trimestre_reference: bail.irl_trimestre_reference ?? null,
      irl_valeur_reference: bail.irl_valeur_reference ? Number(bail.irl_valeur_reference) : null,
      dernier_loyer_precedent: bail.dernier_loyer_precedent ? Number(bail.dernier_loyer_precedent) : null,
      travaux_bailleur: bail.travaux_bailleur ?? null,
      travaux_amelioration: bail.travaux_amelioration ?? null,
      honoraires_locataire: bail.honoraires_locataire ? Number(bail.honoraires_locataire) : null,
      honoraires_bailleur: bail.honoraires_bailleur ? Number(bail.honoraires_bailleur) : null,
      colocataires_supplementaires: bail.colocataires_supplementaires ?? null,
      conditions_particulieres: bail.conditions_particulieres ?? null,
    },
    bien: {
      adresse: bien.adresse,
      complement_adresse: bien.complement_adresse ?? undefined,
      code_postal: bien.code_postal,
      ville: bien.ville,
      type: bien.type,
      surface: bien.surface ?? null,
      nb_pieces: bien.nb_pieces ?? null,
      type_habitat: bien.type_habitat ?? null,
      regime_juridique: bien.regime_juridique ?? null,
      dpe_classe: bien.dpe_classe ?? null,
      annexes: bien.annexes ?? null,
      equipements: bien.equipements ?? null,
      equipements_communs: bien.equipements_communs ?? null,
      chauffage_type: bien.chauffage_type ?? null,
      eau_chaude_type: bien.eau_chaude_type ?? null,
      acces_technologies: bien.acces_technologies ?? null,
    },
    locataire: {
      prenom: locataire.prenom,
      nom: locataire.nom,
      email: locataire.email ?? undefined,
      telephone: locataire.telephone ?? undefined,
      date_entree: locataire.date_entree,
    },
    bailleur: {
      prenom: profile.prenom ?? "",
      nom: profile.nom ?? "",
      telephone: profile.telephone ?? undefined,
      adresse: profile.adresse ?? null,
      code_postal: profile.code_postal ?? null,
      ville: profile.ville ?? null,
    },
  };

  const pdfBuffer = await renderToBuffer(
    createElement(BailPDF, props) as ReactElement<DocumentProps>
  );

  const filename = `bail-${bail.type}-${bail.date_debut}.pdf`;

  return new Response(pdfBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
