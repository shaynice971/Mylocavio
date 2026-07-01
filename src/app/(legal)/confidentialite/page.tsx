import type { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function ConfidentialitePage() {
  return (
    <article className="prose prose-sm max-w-none">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Politique de confidentialité</h1>
      <p className="text-gray-400 text-sm mb-10">Dernière mise à jour : à compléter</p>

      <div className="mb-8 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">
        <strong>À compléter :</strong> les champs « [À COMPLÉTER] » (identité du responsable de
        traitement, contact DPO le cas échéant, durées de conservation exactes) doivent être
        renseignés avant la mise en ligne publique.
      </div>

      <section className="space-y-3 text-sm text-gray-600 leading-relaxed">
        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">1. Responsable du traitement</h2>
        <p>
          [À COMPLÉTER : nom / raison sociale de l&apos;éditeur] est responsable du traitement des
          données personnelles collectées via MyLocavio, au sens du Règlement Général sur la
          Protection des Données (RGPD).
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">2. Données collectées</h2>
        <ul className="list-disc pl-5">
          <li>Données de compte : prénom, nom, adresse e-mail, téléphone (facultatif), mot de passe (chiffré).</li>
          <li>Données de gestion locative saisies par l&apos;utilisateur : biens, locataires, baux, quittances, relances, états des lieux.</li>
          <li>Données techniques : cookies strictement nécessaires à l&apos;authentification et à la sécurité de session.</li>
        </ul>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">3. Finalités</h2>
        <p>
          Ces données sont traitées pour permettre la fourniture du service (gestion locative,
          génération de documents), la sécurité du compte, et la communication liée au service
          (confirmations, notifications).
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">4. Base légale</h2>
        <p>
          Le traitement repose sur l&apos;exécution du contrat liant l&apos;utilisateur à MyLocavio
          (fourniture du service souscrit) et, le cas échéant, sur le consentement ou l&apos;intérêt
          légitime pour les communications non essentielles.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">5. Hébergement et sécurité</h2>
        <p>
          Les données sont hébergées via Supabase, avec chiffrement en transit (TLS) et au repos,
          et protégées par des règles d&apos;accès (Row Level Security) garantissant qu&apos;un
          utilisateur ne peut accéder qu&apos;à ses propres données.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">6. Durée de conservation</h2>
        <p>
          Les données sont conservées pendant toute la durée d&apos;utilisation du compte, puis
          [À COMPLÉTER : durée précise, ex. 3 ans après la clôture du compte sauf obligation légale
          de conservation plus longue applicable aux documents locatifs].
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">7. Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification,
          d&apos;effacement, de portabilité et d&apos;opposition sur vos données. Vous pouvez
          exporter vos données ou demander la suppression de votre compte depuis la page
          Paramètres, ou en nous contactant via la page <a href="/contact">Contact</a>.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">8. Cookies</h2>
        <p>
          MyLocavio n&apos;utilise que des cookies strictement nécessaires au fonctionnement du
          service (session d&apos;authentification). Aucun cookie publicitaire ou de mesure
          d&apos;audience tiers n&apos;est déposé à ce jour.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">9. Contact</h2>
        <p>
          Pour toute question relative à vos données personnelles, contactez-nous via la page{" "}
          <a href="/contact">Contact</a>. [À COMPLÉTER : adresse e-mail dédiée si disponible].
        </p>
      </section>
    </article>
  );
}
