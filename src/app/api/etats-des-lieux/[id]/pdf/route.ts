export const runtime = "nodejs";

import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import type { ReactElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { EtatDesLieuxPDF, type EtatDesLieuxPDFProps } from "@/lib/pdf/EtatDesLieuxPDF";
import type { DocumentProps } from "@react-pdf/renderer";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Non authentifié", { status: 401 });
  }

  const { data: etat, error } = await supabase
    .from("etats_des_lieux")
    .select(
      `
      id, type, date_etat, observations, pieces, user_id,
      biens ( adresse, code_postal, ville, type, surface ),
      locataires ( prenom, nom )
    `
    )
    .eq("id", id)
    .single();

  if (error || !etat) {
    return new Response("État des lieux introuvable", { status: 404 });
  }

  if (etat.user_id !== user.id) {
    return new Response("Accès interdit", { status: 403 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("prenom, nom")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return new Response("Profil bailleur introuvable", { status: 404 });
  }

  const bien = Array.isArray(etat.biens) ? etat.biens[0] : etat.biens;
  const locataire = Array.isArray(etat.locataires) ? etat.locataires[0] : etat.locataires;

  if (!bien) {
    return new Response("Données incomplètes", { status: 422 });
  }

  const props: EtatDesLieuxPDFProps = {
    etat: {
      type: etat.type,
      date_etat: etat.date_etat,
      observations: etat.observations ?? undefined,
    },
    bien: {
      adresse: bien.adresse,
      code_postal: bien.code_postal,
      ville: bien.ville,
      type: bien.type,
      surface: bien.surface ?? undefined,
    },
    locataire: locataire
      ? { prenom: locataire.prenom, nom: locataire.nom }
      : null,
    bailleur: {
      prenom: profile.prenom ?? "",
      nom: profile.nom ?? "",
    },
    pieces: Array.isArray(etat.pieces) ? (etat.pieces as { nom: string; etat: string; observations?: string }[]) : [],
  };

  const pdfBuffer = await renderToBuffer(
    createElement(EtatDesLieuxPDF, props) as ReactElement<DocumentProps>
  );

  const filename = `etat-des-lieux-${etat.type}-${etat.date_etat}.pdf`;

  return new Response(pdfBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
