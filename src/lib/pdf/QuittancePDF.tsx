import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { numberToWords } from "./numberToWords";
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
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: BRAND_BLUE,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    textAlign: "center",
    color: GRAY,
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GRAY,
    marginVertical: 14,
  },
  sectionLabel: {
    fontSize: 8,
    color: BRAND_BLUE,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    gap: 0,
  },
  col: {
    flex: 1,
  },
  name: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: DARK,
  },
  text: {
    fontSize: 10,
    color: DARK,
  },
  grayText: {
    fontSize: 9,
    color: GRAY,
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
    paddingVertical: 5,
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
  bodyBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 4,
    padding: 14,
    marginVertical: 16,
  },
  bodyText: {
    fontSize: 10,
    color: DARK,
    lineHeight: 1.7,
  },
  footer: {
    marginTop: 24,
  },
  footerRight: {
    textAlign: "right",
    fontSize: 10,
    color: DARK,
    marginBottom: 6,
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

// La colonne "mois" est de type `date` en base : Supabase/PostgREST renvoie
// donc toujours une date complète "AAAA-MM-JJ" (jour conventionnellement à 01),
// jamais juste "AAAA-MM". On gère quand même ce second format par sécurité.
function parseMoisDate(dateStr: string): Date {
  return new Date(dateStr.length <= 7 ? dateStr + "-01" : dateStr);
}

function formatMois(dateStr: string): string {
  const d = parseMoisDate(dateStr);
  return MOIS_FR[d.getUTCMonth()] + " " + d.getUTCFullYear();
}

function premierJour(dateStr: string): string {
  const d = parseMoisDate(dateStr);
  return "1er " + MOIS_FR[d.getUTCMonth()] + " " + d.getUTCFullYear();
}

function dernierJour(dateStr: string): string {
  const d = parseMoisDate(dateStr);
  const last = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
  return last.getUTCDate() + " " + MOIS_FR[last.getUTCMonth()] + " " + last.getUTCFullYear();
}

function formatEur(n: number): string {
  return n.toFixed(2).replace(".", ",") + " €";
}

function formatDateFr(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });
}

export interface QuittanceData {
  mois: string; // "2026-06"
  loyer: number;
  charges: number;
  total: number;
  bailleur: {
    prenom: string;
    nom: string;
    telephone?: string | null;
  };
  locataire: {
    prenom: string;
    nom: string;
  };
  bien: {
    adresse: string;
    complement_adresse?: string | null;
    code_postal: string;
    ville: string;
  };
}

export function QuittancePDF({ data }: { data: QuittanceData }) {
  const moisLabel = formatMois(data.mois);
  const bailleurNom = `${data.bailleur.prenom} ${data.bailleur.nom}`.toUpperCase();
  const locataireName = `${data.locataire.prenom} ${data.locataire.nom}`;
  const totalEnLettres = numberToWords(data.total);

  const adresseLigne1 = data.bien.adresse;
  const adresseLigne2 = data.bien.complement_adresse
    ? data.bien.complement_adresse
    : null;
  const adresseLigne3 = `${data.bien.code_postal} ${data.bien.ville}`;

  const today = new Date();
  const dateDuJour = formatDateFr(today);

  return (
    <Document
      title={`Quittance de loyer - ${moisLabel}`}
      author={bailleurNom}
      language="fr"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.title}>QUITTANCE DE LOYER</Text>
        <Text style={styles.subtitle}>Période : {moisLabel}</Text>

        <View style={styles.divider} />

        {/* Bailleur / Locataire */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>Bailleur</Text>
            <Text style={styles.name}>{bailleurNom}</Text>
            {data.bailleur.telephone ? (
              <Text style={styles.grayText}>{data.bailleur.telephone}</Text>
            ) : null}
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>Locataire</Text>
            <Text style={styles.name}>{locataireName.toUpperCase()}</Text>
            <Text style={styles.grayText}>{adresseLigne1}</Text>
            {adresseLigne2 ? (
              <Text style={styles.grayText}>{adresseLigne2}</Text>
            ) : null}
            <Text style={styles.grayText}>{adresseLigne3}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Détail du paiement */}
        <Text style={styles.sectionLabel}>Détail du paiement</Text>

        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Loyer hors charges</Text>
          <Text style={styles.tableValue}>{formatEur(data.loyer)}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>Provisions pour charges</Text>
          <Text style={styles.tableValue}>{formatEur(data.charges)}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total réglé</Text>
          <Text style={styles.totalValue}>{formatEur(data.total)}</Text>
        </View>

        <View style={{ marginTop: 8 }}>
          <Text style={styles.grayText}>
            Période : du {premierJour(data.mois)} au {dernierJour(data.mois)}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Corps de la quittance */}
        <View style={styles.bodyBox}>
          <Text style={styles.bodyText}>
            Je soussigné(e), {bailleurNom}, bailleur du logement désigné ci-dessus,
            déclare avoir reçu de {locataireName} la somme de {totalEnLettres} ({formatEur(data.total)})
            au titre du loyer et des charges du mois de {moisLabel}, et lui en donne
            quittance, sous réserve de tous mes droits.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerRight}>Fait le {dateDuJour}</Text>
          <Text style={styles.footerRight}>
            Signature du bailleur : ____________________
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.footerNote}>
          Cette quittance annule tous les reçus qui auraient pu être établis précédemment
          pour la même période. Elle ne vaut que pour la période indiquée.
        </Text>
        <Text style={styles.footerNote}>{LEGAL_TEMPLATES_REFERENCE_TEXT}</Text>
      </Page>
    </Document>
  );
}
