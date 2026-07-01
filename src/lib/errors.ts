const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "Invalid login credentials": "Email ou mot de passe incorrect.",
  "User already registered": "Un compte existe déjà avec cette adresse e-mail.",
  "Email not confirmed": "Veuillez confirmer votre adresse e-mail avant de vous connecter (vérifiez votre boîte mail).",
  "Password should be at least 6 characters": "Le mot de passe doit contenir au moins 6 caractères.",
  "Unable to validate email address: invalid format": "Adresse e-mail invalide.",
  "signup is disabled": "Les inscriptions sont temporairement désactivées.",
};

/** Traduit les messages d'erreur Supabase Auth en français, non techniques. */
export function friendlyAuthError(message: string): string {
  return AUTH_ERROR_MESSAGES[message] ?? "Une erreur est survenue. Veuillez réessayer.";
}

/** Message générique pour les erreurs base de données (jamais afficher le message technique brut). */
export const GENERIC_SAVE_ERROR = "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.";
export const GENERIC_DELETE_ERROR = "Une erreur est survenue lors de la suppression. Veuillez réessayer.";
