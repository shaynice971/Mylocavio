import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

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

function formatDateFr(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getUTCDate();
  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre",
  ];
  return `${day} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function formatEur(n: number): string {
  return n.toFixed(2).replace(".", ",") + " €";
}

export interface BailPDFProps {
  bail: {
    type: string;
    date_debut: string;
    date_fin: string | null;
    loyer: number;
    charges: number;
    depot_garantie: number | null;
  };
  bien: {
    adresse: string;
    complement_adresse?: string;
    code_postal: string;
    ville: string;
    type: string;
    surface: number | null;
    nb_pieces: number | null;
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
  };
}

function getSubtitle(type: string): string {
  if (type === "meuble") return "Logement meublé — Loi n°89-462 du 6 juillet 1989";
  if (type === "mobilite") return "Bail mobilité — Loi ELAN du 23 novembre 2018";
  return "Logement vide — Loi n°89-462 du 6 juillet 1989";
}

function getDureeInfo(type: string, dateFin: string | null): { duree: string; renouvellement: string | null } {
  if (dateFin) {
    return {
      duree: `Du ${formatDateFr("2000-01-01")} au ${formatDateFr(dateFin)}`,
      renouvellement: null,
    };
  }
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

  const adresse = [
    bien.adresse,
    bien.complement_adresse,
    `${bien.code_postal} ${bien.ville}`,
  ]
    .filter(Boolean)
    .join(", ");

  const dureeInfo = getDureeInfo(bail.type, bail.date_fin);
  const dateDebut = formatDateFr(bail.date_debut);

  return (
    <Document title="Contrat de location" author={bailleurNom} language="fr">
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>CONTRAT DE LOCATION</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {/* 1. Parties */}
        <Text style={styles.sectionHeader}>1. Parties au contrat</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Bailleur</Text>
            <Text style={[styles.value, styles.bold]}>{bailleurNom}</Text>
            {bailleur.telephone ? (
              <Text style={styles.value}>{bailleur.telephone}</Text>
            ) : null}
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Locataire</Text>
            <Text style={[styles.value, styles.bold]}>{locataireNom}</Text>
            {locataire.email ? (
              <Text style={styles.value}>{locataire.email}</Text>
            ) : null}
            {locataire.telephone ? (
              <Text style={styles.value}>{locataire.telephone}</Text>
            ) : null}
          </View>
        </View>

        {/* 2. Logement */}
        <Text style={styles.sectionHeader}>2. Désignation du logement</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Adresse</Text>
          <Text style={styles.tableValue}>{adresse}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Type de logement</Text>
          <Text style={styles.tableValue}>{bien.type}</Text>
        </View>
        {bien.surface ? (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Surface habitable</Text>
            <Text style={styles.tableValue}>{bien.surface} m²</Text>
          </View>
        ) : null}
        {bien.nb_pieces ? (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Nombre de pièces</Text>
            <Text style={styles.tableValue}>{bien.nb_pieces}</Text>
          </View>
        ) : null}

        {/* 3. Durée */}
        <Text style={styles.sectionHeader}>3. Durée du bail</Text>
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
          <Text style={[styles.value, { marginTop: 4, color: GRAY, fontSize: 9 }]}>
            {dureeInfo.renouvellement}
          </Text>
        ) : null}

        {/* 4. Conditions financières */}
        <Text style={styles.sectionHeader}>4. Conditions financières</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Loyer mensuel hors charges</Text>
          <Text style={styles.tableValue}>{formatEur(bail.loyer)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Provisions sur charges</Text>
          <Text style={styles.tableValue}>{formatEur(bail.charges)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Loyer mensuel total</Text>
          <Text style={styles.totalValue}>{formatEur(total)}</Text>
        </View>
        <View style={[styles.tableRow, { marginTop: 6 }]}>
          <Text style={styles.tableLabel}>Dépôt de garantie</Text>
          <Text style={styles.tableValue}>
            {bail.depot_garantie ? formatEur(bail.depot_garantie) : "Non exigé"}
          </Text>
        </View>
        <Text style={[styles.value, { marginTop: 6, color: GRAY, fontSize: 9 }]}>
          Le loyer est payable mensuellement, le 1er de chaque mois.
        </Text>

        {/* 5. Obligations bailleur */}
        <Text style={styles.sectionHeader}>5. Obligations du bailleur</Text>
        <Text style={styles.paragraph}>
          Le bailleur s&apos;engage à délivrer un logement décent, à assurer la jouissance
          paisible du logement et à entretenir les locaux en état de servir à l&apos;usage prévu.
        </Text>

        {/* 6. Obligations locataire */}
        <Text style={styles.sectionHeader}>6. Obligations du locataire</Text>
        <Text style={styles.paragraph}>
          Le locataire s&apos;engage à payer le loyer et les charges aux termes convenus,
          à user paisiblement des locaux loués et à répondre des dégradations qui
          surviendraient de son fait.
        </Text>

        {/* 7. Signatures */}
        <Text style={styles.sectionHeader}>7. Signatures</Text>
        <View style={styles.signaturesRow}>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureTitle}>Le bailleur</Text>
            <Text style={styles.signatureName}>{bailleurNom}</Text>
            <Text style={styles.signatureLine}>Lu et approuvé</Text>
            <Text style={styles.signatureLine}>____________________</Text>
            <Text style={styles.signatureLine}>Fait le : ___________</Text>
          </View>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureTitle}>Le locataire</Text>
            <Text style={styles.signatureName}>{locataireNom}</Text>
            <Text style={styles.signatureLine}>Lu et approuvé</Text>
            <Text style={styles.signatureLine}>____________________</Text>
            <Text style={styles.signatureLine}>Fait le : ___________</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.footerNote}>
          Contrat établi en deux exemplaires originaux, un pour chaque partie.
        </Text>
      </Page>
    </Document>
  );
}
