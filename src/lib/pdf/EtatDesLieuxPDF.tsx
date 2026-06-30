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
  pieceBox: {
    borderWidth: 1,
    borderColor: LIGHT_GRAY,
    borderRadius: 4,
    padding: 8,
    marginBottom: 6,
  },
  pieceName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    marginBottom: 3,
  },
  etatBadge: {
    fontSize: 8,
    color: BRAND_BLUE,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  pieceObs: {
    fontSize: 9,
    color: GRAY,
    fontStyle: "italic",
  },
  obsBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 4,
    padding: 10,
    marginTop: 4,
  },
  obsText: {
    fontSize: 10,
    color: DARK,
    lineHeight: 1.6,
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

export interface EtatDesLieuxPDFProps {
  etat: { type: string; date_etat: string; observations?: string }
  bien: { adresse: string; code_postal: string; ville: string; type: string; surface?: number }
  locataire: { prenom: string; nom: string } | null
  bailleur: { prenom: string; nom: string }
  pieces: { nom: string; etat: string; observations?: string }[]
}

function typeLabel(type: string): string {
  return type === "entree" ? "D'ENTRÉE" : "DE SORTIE";
}

export function EtatDesLieuxPDF({ etat, bien, locataire, bailleur, pieces }: EtatDesLieuxPDFProps) {
  const typeStr = typeLabel(etat.type);
  const bailleurNom = `${bailleur.prenom} ${bailleur.nom}`;
  const locataireNom = locataire ? `${locataire.prenom} ${locataire.nom}` : "—";
  const adresse = `${bien.adresse}, ${bien.code_postal} ${bien.ville}`;

  return (
    <Document title={`État des lieux ${typeStr.toLowerCase()} — ${adresse}`} author={bailleurNom} language="fr">
      <Page size="A4" style={styles.page}>
        {/* Title */}
        <Text style={styles.title}>ÉTAT DES LIEUX {typeStr}</Text>
        <Text style={styles.subtitle}>
          {etat.type === "entree" ? "Entrée dans les lieux" : "Sortie des lieux"} — {formatDateFr(etat.date_etat)}
        </Text>

        {/* 1. Parties */}
        <Text style={styles.sectionHeader}>1. Parties</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Bailleur</Text>
            <Text style={[styles.value, styles.bold]}>{bailleurNom}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Locataire</Text>
            <Text style={[styles.value, styles.bold]}>{locataireNom}</Text>
          </View>
        </View>

        {/* 2. Logement */}
        <Text style={styles.sectionHeader}>2. Logement</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Adresse</Text>
          <Text style={styles.tableValue}>{adresse}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Type</Text>
          <Text style={styles.tableValue}>{bien.type}</Text>
        </View>
        {bien.surface ? (
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Surface habitable</Text>
            <Text style={styles.tableValue}>{bien.surface} m²</Text>
          </View>
        ) : null}

        {/* 3. État des pièces */}
        <Text style={styles.sectionHeader}>3. État des pièces</Text>
        {pieces.map((piece, i) => (
          <View key={i} style={styles.pieceBox}>
            <Text style={styles.pieceName}>{piece.nom}</Text>
            <Text style={styles.etatBadge}>{piece.etat}</Text>
            {piece.observations ? (
              <Text style={styles.pieceObs}>{piece.observations}</Text>
            ) : null}
          </View>
        ))}

        {/* 4. Observations générales */}
        {etat.observations ? (
          <>
            <Text style={styles.sectionHeader}>4. Observations générales</Text>
            <View style={styles.obsBox}>
              <Text style={styles.obsText}>{etat.observations}</Text>
            </View>
          </>
        ) : null}

        {/* 5. Signatures */}
        <Text style={styles.sectionHeader}>{etat.observations ? "5." : "4."} Signatures</Text>
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
          Le présent état des lieux a été établi contradictoirement entre les parties.
        </Text>
      </Page>
    </Document>
  );
}
