export const runtime = "nodejs";

import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import type { ReactElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { QuittancePDF, type QuittanceData } from "@/lib/pdf/QuittancePDF";
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

  // Fetch quittance with joins
  const { data: quittance, error } = await supabase
    .from("quittances")
    .select(
      `
      id, mois, loyer, charges, total, statut, locataire_id, user_id,
      biens ( adresse, complement_adresse, code_postal, ville, type ),
      locataires ( prenom, nom )
    `
    )
    .eq("id", id)
    .single();

  if (error || !quittance) {
    return new Response("Quittance introuvable", { status: 404 });
  }

  // Vérification explicite de propriété (défense en profondeur, en complément des policies RLS)
  if (quittance.user_id !== user.id) {
    return new Response("Accès non autorisé", { status: 403 });
  }

  // Fetch the bailleur profile (authenticated user)
  const { data: profile } = await supabase
    .from("profiles")
    .select("prenom, nom, telephone")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return new Response("Profil bailleur introuvable", { status: 404 });
  }

  const bien = Array.isArray(quittance.biens)
    ? quittance.biens[0]
    : quittance.biens;
  const locataire = Array.isArray(quittance.locataires)
    ? quittance.locataires[0]
    : quittance.locataires;

  if (!bien || !locataire) {
    return new Response("Données incomplètes", { status: 422 });
  }

  const data: QuittanceData = {
    mois: quittance.mois,
    loyer: Number(quittance.loyer),
    charges: Number(quittance.charges),
    total: Number(quittance.total),
    bailleur: {
      prenom: profile.prenom ?? "",
      nom: profile.nom ?? "",
      telephone: profile.telephone ?? null,
    },
    locataire: {
      prenom: locataire.prenom,
      nom: locataire.nom,
    },
    bien: {
      adresse: bien.adresse,
      complement_adresse: bien.complement_adresse ?? null,
      code_postal: bien.code_postal,
      ville: bien.ville,
    },
  };

  const pdfBuffer = await renderToBuffer(
    createElement(QuittancePDF, { data }) as ReactElement<DocumentProps>
  );

  const moisSlug = quittance.mois; // e.g. "2026-06"

  return new Response(pdfBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="quittance-${moisSlug}.pdf"`,
    },
  });
}
