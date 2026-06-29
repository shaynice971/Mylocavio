const units = [
  "", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize",
  "dix-sept", "dix-huit", "dix-neuf",
];

const tens = [
  "", "dix", "vingt", "trente", "quarante", "cinquante", "soixante",
  "soixante", "quatre-vingt", "quatre-vingt",
];

function belowHundred(n: number): string {
  if (n < 20) return units[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  if (t === 7) {
    // 70–79: soixante-dix...
    if (u === 1) return "soixante et onze";
    return "soixante-" + units[10 + u];
  }
  if (t === 9) {
    // 90–99: quatre-vingt-dix...
    return "quatre-vingt-" + units[10 + u];
  }
  if (t === 8) {
    // 80–89: quatre-vingts or quatre-vingt-X
    if (u === 0) return "quatre-vingts";
    return "quatre-vingt-" + units[u];
  }
  if (u === 0) return tens[t];
  if (u === 1) return tens[t] + " et un";
  return tens[t] + "-" + units[u];
}

function belowThousand(n: number): string {
  if (n < 100) return belowHundred(n);
  const h = Math.floor(n / 100);
  const r = n % 100;
  const hundredStr = h === 1 ? "cent" : units[h] + " cent";
  if (r === 0) return h === 1 ? "cent" : units[h] + " cents";
  return hundredStr + " " + belowHundred(r);
}

function intToWords(n: number): string {
  if (n === 0) return "zéro";
  if (n < 0) return "moins " + intToWords(-n);
  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    const remainder = n % 1000;
    const thousandStr = thousands === 1 ? "mille" : belowThousand(thousands) + " mille";
    if (remainder === 0) return thousandStr;
    return thousandStr + " " + belowThousand(remainder);
  }
  return belowThousand(n);
}

/**
 * Converts a number (amount in euros) to French words.
 * Example: 850.50 → "huit cent cinquante euros et cinquante centimes"
 */
export function numberToWords(amount: number): string {
  const rounded = Math.round(amount * 100);
  const euros = Math.floor(rounded / 100);
  const cents = rounded % 100;

  const euroStr = intToWords(euros) + (euros > 1 ? " euros" : " euro");
  if (cents === 0) return euroStr;
  const centStr = intToWords(cents) + (cents > 1 ? " centimes" : " centime");
  return euroStr + " et " + centStr;
}
