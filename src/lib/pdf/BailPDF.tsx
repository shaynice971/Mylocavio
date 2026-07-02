import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { LEGAL_TEMPLATES_REFERENCE_TEXT } from "@/lib/legal-templates-version";

const BRAND_BLUE = "#2A9FD6";
const GRAY = "#6B7280";
const LIGHT_GRAY = "#E5E7EB";
const DARK = "#111827";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
    padding: 40,
    lineHeight: 1.5,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: BRAND_BLUE,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    color: GRAY,
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
    marginVertical: 10,
  },
  sectionHeader: {
    backgroundColor: BRAND_BLUE,
    color: "#FFFFFF",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 6,
    marginTop: 12,
  },
  row: {
    flexDirection: "row",
    gap: 0,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    color: GRAY,
    marginBottom: 1,
  },
  value: {
    fontSize: 10,
    color: DARK,
    marginBottom: 4,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  paragraph: {
    fontSize: 10,
    color: DARK,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 9,
    color: GRAY,
    fontStyle: "italic",
    marginTop: 2,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  tableLabel: {
    fontSize: 10,
    color: DARK,
  },
  tableValue: {
    fontSize: 10,
    color: DARK,
    textAlign: "right",
    maxWidth: "60%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: LIGHT_GRAY,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  totalValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  listItem: {
    flexDirection: "row",
    fontSize: 10,
    color: DARK,
    marginBottom: 3,
  },
  bullet: {
    width: 12,
    color: BRAND_BLUE,
  },
  signaturesRow: {
    flexDirection: "row",
    marginTop: 16,
  },
  signatureCol: {
    flex: 1,
    paddingRight: 16,
  },
  signatureTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 9,
    color: GRAY,
    marginBottom: 8,
  },
  signatureLine: {
    fontSize: 10,
    color: DARK,
    marginBottom: 8,
  },
  footerNote: {
    marginTop: 20,
    fontSize: 8,
    color: GRAY,
    textAlign: "center",
    fontStyle: "italic",
  },
});

const MOIS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function formatDateFr(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getUTCDate();
  return `${day} ${MOIS_FR[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function formatEur(n: number): string {
  return n.toFixed(2).replace(".", ",") + " €";
}

// Affiche "Non applicable" plutôt qu'un champ vide suspect quand
// l'information n'a pas été renseignée ou ne concerne pas ce bail.
function naOr(value: string | number | null | undefined, suffix = ""): string {
  if (value === null || value === undefined || value === "") return "Non applicable";
  return `${value}${suffix}`;
}

const TYPE_HABITAT_LABEL: Record<string, string> = {
  individuel: "Habitat individuel",
  collectif: "Habitat collectif (immeuble)",
};

const REGIME_JURIDIQUE_LABEL: Record<string, string> = {
  copropriete: "Immeuble soumis au statut de la copropriété",
  monopropriete: "Immeuble non soumis au statut de la copropriété",
};

const CHAUFFAGE_LABEL: Record<string, string> = {
  individuel: "Individuel",
  collectif: "Collectif",
};

export interface BailPDFProps {
  bail: {
    type: string;
    date_debut: string;
    date_fin: string | null;
    loyer: number;
    charges: number;
    charges_type?: "provisions" | "forfait" | null;
    depot_garantie: number | null;
    mandataire_nom?: string | null;
    mandataire_adresse?: string | null;
    irl_trimestre_reference?: string | null;
    irl_valeur_reference?: number | null;
    dernier_loyer_precedent?: number | null;
    travaux_bailleur?: string | null;
    travaux_amelioration?: string | null;
    honoraires_locataire?: number | null;
    honoraires_bailleur?: number | null;
    colocataires_supplementaires?: string | null;
    conditions_particulieres?: string | null;
  };
  bien: {
    adresse: string;
    complement_adresse?: string;
    code_postal: string;
    ville: string;
    type: string;
    surface: number | null;
    nb_pieces: number | null;
    type_habitat?: string | null;
    regime_juridique?: string | null;
    dpe_classe?: string | null;
    annexes?: string | null;
    equipements?: string | null;
    equipements_communs?: string | null;
    chauffage_type?: string | null;
    eau_chaude_type?: string | null;
    acces_technologies?: string | null;
  };
  locataire: {
    prenom: string;
    nom: string;
    email?: string;
    telephone?: string;
    date_entree: string;
  };
  bailleur: {
    prenom: string;
    nom: string;
    telephone?: string;
    adresse?: string | null;
    code_postal?: string | null;
    ville?: string | null;
  };
}

function getSubtitle(type: string): string {
  if (type === "meuble") return "Logement meublé — Loi n°89-462 du 6 juillet 1989";
  if (type === "mobilite") return "Bail mobilité — Loi ELAN du 23 novembre 2018";
  return "Logement vide, résidence principale — Décret n°2015-587 du 29 mai 2015 et loi n°89-462 du 6 juillet 1989";
}

// N'est utilisé que lorsque bail.date_fin est absent (voir rendu ci-dessous) :
// la durée est alors déduite du type de bail plutôt que de dates explicites.
function getDureeInfo(type: string): { duree: string; renouvellement: string | null } {
  if (type === "meuble") {
    return { duree: "1 an", renouvellement: "Renouvellement tacite par périodes de 1 an" };
  }
  if (type === "mobilite") {
    return { duree: "1 à 10 mois", renouvellement: null };
  }
  return { duree: "3 ans", renouvellement: "Renouvellement tacite par périodes de 3 ans" };
}

export function BailPDF({ bail, bien, locataire, bailleur }: BailPDFProps) {
  const subtitle = getSubtitle(bail.type);
  const bailleurNom = `${bailleur.prenom} ${bailleur.nom}`;
  const locataireNom = `${locataire.prenom} ${locataire.nom}`;
  const total = bail.loyer + bail.charges;
  const estColocation = Boolean(bail.colocataires_supplementaires);
  const aMandataire = Boolean(bail.mandataire_nom);
  const aDesTravaux = Boolean(bail.travaux_bailleur || bail.travaux_amelioration);
  const aDesHonoraires = Boolean(bail.honoraires_locataire || bail.honoraires_bailleur);
  const estCopropriete = bien.regime_juridique === "copropriete";

  const adresseBien = [
    bien.adresse,
    bien.complement_adresse,
    `${bien.code_postal} ${bien.ville}`,
  ]
    .filter(Boolean)
    .join(", ");

  const adresseBailleur = bailleur.adresse
    ? [bailleur.adresse, bailleur.code_postal && bailleur.ville ? `${bailleur.code_postal} ${bailleur.ville}` : null]
        .filter(Boolean)
        .join(", ")
    : null;

  const dureeInfo = getDureeInfo(bail.type);
  const dateDebut = formatDateFr(bail.date_debut);

  return (
    <Document title="Contrat de location" author={bailleurNom} language="fr">
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>CONTRAT DE LOCATION</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {/* 1. Désignation des parties */}
        <Text style={styles.sectionHeader}>1. Désignation des parties</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Bailleur</Text>
            <Text style={[styles.value, styles.bold]}>{bailleurNom}</Text>
            <Text style={styles.value}>
              Domicile : {adresseBailleur ?? "Non renseigné"}
            </Text>
            {bailleur.telephone ? (
              <Text style={styles.value}>{bailleur.telephone}</Text>
            ) : null}
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Locataire{estColocation ? "s" : ""}</Text>
            <Text style={[styles.value, styles.bold]}>{locataireNom}</Text>
            {locataire.email ? (
              <Text style={styles.value}>{locataire.email}</Text>
            ) : null}
            {locataire.telephone ? (
              <Text style={styles.value}>{locataire.telephone}</Text>
            ) : null}
          </View>
        </View>
        <View style={{ marginTop: 4 }}>
          <Text style={styles.label}>Mandataire du bailleur</Text>
          {aMandataire ? (
            <>
              <Text style={styles.value}>{bail.mandataire_nom}</Text>
              <Text style={styles.value}>{naOr(bail.mandataire_adresse)}</Text>
            </>
          ) : (
            <Text style={styles.value}>Non applicable — le bailleur gère directement la location</Text>
          )}
        </View>
        {estColocation ? (
          <View style={{ marginTop: 4 }}>
            <Text style={styles.label}>Colocataires solidaires additionnels</Text>
            <Text style={styles.value}>{bail.colocataires_supplementaires}</Text>
          </View>
        ) : null}

        {/* 2. Objet du contrat */}
        <Text style={styles.sectionHeader}>2. Objet du contrat — désignation du logement</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Adresse</Text>
          <Text style={styles.tableValue}>{adresseBien}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Type de location</Text>
          <Text style={styles.tableValue}>Logement {bien.type} — résidence principale</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Type d&apos;habitat</Text>
          <Text style={styles.tableValue}>{bien.type_habitat ? TYPE_HABITAT_LABEL[bien.type_habitat] : "Non renseigné"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Régime juridique de l&apos;immeuble</Text>
          <Text style={styles.tableValue}>{bien.regime_juridique ? REGIME_JURIDIQUE_LABEL[bien.regime_juridique] : "Non renseigné"}</Text>
        </View>
        {bien.surface ? (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Surface habitable</Text>
            <Text style={styles.tableValue}>{bien.surface} m²</Text>
          </View>
        ) : null}
        {bien.nb_pieces ? (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Nombre de pièces principales</Text>
            <Text style={styles.tableValue}>{bien.nb_pieces}</Text>
          </View>
        ) : null}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Autres parties du logement (annexes)</Text>
          <Text style={styles.tableValue}>{naOr(bien.annexes)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Équipement du logement</Text>
          <Text style={styles.tableValue}>{naOr(bien.equipements)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Locaux et équipements à usage commun</Text>
          <Text style={styles.tableValue}>{estCopropriete ? naOr(bien.equipements_communs) : "Non applicable"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Chauffage</Text>
          <Text style={styles.tableValue}>{bien.chauffage_type ? CHAUFFAGE_LABEL[bien.chauffage_type] : "Non renseigné"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Production d&apos;eau chaude sanitaire</Text>
          <Text style={styles.tableValue}>{bien.eau_chaude_type ? CHAUFFAGE_LABEL[bien.eau_chaude_type] : "Non renseigné"}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Accès aux technologies de l&apos;information</Text>
          <Text style={styles.tableValue}>{naOr(bien.acces_technologies)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Diagnostic de performance énergétique (DPE)</Text>
          <Text style={styles.tableValue}>{bien.dpe_classe ? `Classe ${bien.dpe_classe}` : "Non renseigné"}</Text>
        </View>

        {/* 3. Durée */}
        <Text style={styles.sectionHeader}>3. Date de prise d&apos;effet et durée du contrat</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Date d&apos;entrée</Text>
          <Text style={styles.tableValue}>{dateDebut}</Text>
        </View>
        {bail.date_fin ? (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Date de fin</Text>
            <Text style={styles.tableValue}>{formatDateFr(bail.date_fin)}</Text>
          </View>
        ) : (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Durée</Text>
            <Text style={styles.tableValue}>{dureeInfo.duree}</Text>
          </View>
        )}
        {dureeInfo.renouvellement ? (
          <Text style={styles.noteText}>{dureeInfo.renouvellement}</Text>
        ) : null}
        {bail.type === "vide" ? (
          <Text style={styles.noteText}>
            Durée de 3 ans si le bailleur est une personne physique (ou une SCI familiale au sens
            de l&apos;article 13 de la loi du 6 juillet 1989), 6 ans si le bailleur est une
            personne morale.
          </Text>
        ) : null}

        {/* 4. Conditions financières */}
        <Text style={styles.sectionHeader}>4. Conditions financières</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Loyer mensuel hors charges</Text>
          <Text style={styles.tableValue}>{formatEur(bail.loyer)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>
            Charges ({bail.charges_type === "forfait" ? "forfait" : "provisions avec régularisation annuelle"})
          </Text>
          <Text style={styles.tableValue}>{formatEur(bail.charges)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Loyer mensuel total</Text>
          <Text style={styles.totalValue}>{formatEur(total)}</Text>
        </View>
        <Text style={styles.noteText}>Le loyer est payable mensuellement, le 1er de chaque mois.</Text>

        <View style={[styles.tableRow, { marginTop: 6 }]}>
          <Text style={styles.tableLabel}>Révision annuelle (indice de référence des loyers)</Text>
          <Text style={styles.tableValue}>
            {bail.irl_trimestre_reference
              ? `${bail.irl_trimestre_reference}${bail.irl_valeur_reference ? ` (${bail.irl_valeur_reference})` : ""}`
              : "Non renseigné"}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Loyer versé par le précédent locataire</Text>
          <Text style={styles.tableValue}>
            {bail.dernier_loyer_precedent ? formatEur(bail.dernier_loyer_precedent) : "Non applicable"}
          </Text>
        </View>
        <Text style={styles.noteText}>
          Mention obligatoire uniquement lorsque le logement a été reloué moins de 18 mois après le
          départ du précédent locataire (encadrement du loyer à la relocation en zone tendue).
        </Text>

        <View style={[styles.tableRow, { marginTop: 6 }]}>
          <Text style={styles.tableLabel}>Dépôt de garantie</Text>
          <Text style={styles.tableValue}>
            {bail.depot_garantie ? formatEur(bail.depot_garantie) : "Non exigé"}
          </Text>
        </View>

        {/* 5. Travaux */}
        <Text style={styles.sectionHeader}>5. Travaux</Text>
        {aDesTravaux ? (
          <>
            <Text style={styles.label}>Travaux effectués depuis le dernier contrat ou renouvellement</Text>
            <Text style={styles.value}>{naOr(bail.travaux_bailleur)}</Text>
            <Text style={[styles.label, { marginTop: 4 }]}>Travaux d&apos;amélioration décidés en cours de bail précédent</Text>
            <Text style={styles.value}>{naOr(bail.travaux_amelioration)}</Text>
          </>
        ) : (
          <Text style={styles.paragraph}>
            Non applicable — aucun travaux déclaré depuis le dernier contrat ou le dernier
            renouvellement.
          </Text>
        )}

        {/* 6. Garanties */}
        <Text style={styles.sectionHeader}>6. Garanties</Text>
        <Text style={styles.paragraph}>
          Le dépôt de garantie prévu à l&apos;article 4 ci-dessus est restitué dans un délai
          maximal d&apos;un mois à compter de la restitution des clés par le locataire si l&apos;état
          des lieux de sortie est conforme à l&apos;état des lieux d&apos;entrée, ou de deux mois si des
          retenues sont justifiées. Le dépôt de garantie ne produit pas intérêt au profit du
          locataire.
        </Text>

        <View style={styles.divider} />
      </Page>

      <Page size="A4" style={styles.page}>
        {/* 7. Clause de solidarité */}
        <Text style={styles.sectionHeader}>7. Clause de solidarité</Text>
        {estColocation ? (
          <Text style={styles.paragraph}>
            En cas de colocation, les locataires visés au présent contrat et leurs cautions
            respectives sont tenus solidairement du paiement du loyer, des charges et des
            réparations locatives. Conformément à l&apos;article 8-1 de la loi du 6 juillet 1989,
            la solidarité d&apos;un colocataire ayant donné congé (et de sa caution) prend fin à la
            date d&apos;effet du congé lorsqu&apos;un nouveau colocataire figure au bail à cette date, et
            au plus tard six mois après la date d&apos;effet du congé à défaut.
          </Text>
        ) : (
          <Text style={styles.paragraph}>
            Non applicable — le présent contrat ne comporte qu&apos;un seul locataire, hors situation
            de colocation.
          </Text>
        )}

        {/* 8. Clause résolutoire */}
        <Text style={styles.sectionHeader}>8. Clause résolutoire</Text>
        <Text style={styles.paragraph}>
          Le présent contrat sera résilié de plein droit, à défaut de paiement du loyer, des
          charges et du dépôt de garantie aux termes convenus, ou à défaut de souscription d&apos;une
          assurance contre les risques locatifs par le locataire, un mois après un commandement
          demeuré infructueux. Cette clause ne produit effet que dans les conditions prévues à
          l&apos;article 24 de la loi du 6 juillet 1989.
        </Text>

        {/* 9. Honoraires de location */}
        <Text style={styles.sectionHeader}>9. Honoraires de location</Text>
        {aDesHonoraires ? (
          <>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Part à la charge du bailleur</Text>
              <Text style={styles.tableValue}>{bail.honoraires_bailleur ? formatEur(bail.honoraires_bailleur) : "Non applicable"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Part à la charge du locataire</Text>
              <Text style={styles.tableValue}>{bail.honoraires_locataire ? formatEur(bail.honoraires_locataire) : "Non applicable"}</Text>
            </View>
            <Text style={styles.noteText}>
              Conformément à l&apos;article 5 de la loi du 6 juillet 1989, les honoraires à la charge
              du locataire (visite, dossier, rédaction du bail) ne peuvent excéder ceux à la charge
              du bailleur, dans la limite d&apos;un plafond par m² de surface habitable fixé par
              décret selon la zone géographique.
            </Text>
          </>
        ) : (
          <Text style={styles.paragraph}>
            Non applicable — aucun professionnel n&apos;est intervenu dans la conclusion de ce bail.
          </Text>
        )}

        {/* 10. Conditions particulières */}
        <Text style={styles.sectionHeader}>10. Autres conditions particulières</Text>
        <Text style={styles.paragraph}>{naOr(bail.conditions_particulieres, "")}</Text>

        {/* Annexes */}
        <Text style={styles.sectionHeader}>Annexes obligatoires jointes au présent contrat</Text>
        <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text>Notice d&apos;information relative aux droits et obligations des locataires et des bailleurs</Text></View>
        <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text>Dossier de diagnostic technique : diagnostic de performance énergétique (DPE), état des risques (naturels, miniers, technologiques), et, selon l&apos;ancienneté du logement, constat de risque d&apos;exposition au plomb, état de l&apos;installation intérieure d&apos;électricité et/ou de gaz</Text></View>
        <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text>Attestation d&apos;assurance habitation du locataire</Text></View>
        {estCopropriete ? (
          <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text>Extrait du règlement de copropriété concernant la destination de l&apos;immeuble et la jouissance des parties privatives et communes</Text></View>
        ) : null}
        <View style={styles.listItem}><Text style={styles.bullet}>•</Text><Text>État des lieux d&apos;entrée</Text></View>
        <Text style={styles.noteText}>
          Ces annexes ne sont pas générées automatiquement par MyLocavio (à l&apos;exception de
          l&apos;état des lieux, disponible dans le module dédié) : il appartient au bailleur de les
          réunir et de les joindre au présent contrat avant signature.
        </Text>

        {/* Signatures */}
        <Text style={styles.sectionHeader}>Signatures</Text>
        <View style={styles.signaturesRow}>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureTitle}>Le bailleur{aMandataire ? " (ou son mandataire)" : ""}</Text>
            <Text style={styles.signatureName}>{bailleurNom}</Text>
            <Text style={styles.signatureLine}>Lu et approuvé</Text>
            <Text style={styles.signatureLine}>____________________</Text>
            <Text style={styles.signatureLine}>Fait le : ___________</Text>
          </View>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureTitle}>Le{estColocation ? "s" : ""} locataire{estColocation ? "s" : ""}</Text>
            <Text style={styles.signatureName}>{locataireNom}</Text>
            <Text style={styles.signatureLine}>Lu et approuvé</Text>
            <Text style={styles.signatureLine}>____________________</Text>
            <Text style={styles.signatureLine}>Fait le : ___________</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.footerNote}>
          Contrat établi en autant d&apos;exemplaires originaux que de parties au contrat.
        </Text>
        <Text style={styles.footerNote}>{LEGAL_TEMPLATES_REFERENCE_TEXT}</Text>
      </Page>
    </Document>
  );
}
