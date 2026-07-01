import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions générales d'utilisation" };

export default function CguPage() {
  return (
    <article className="prose prose-sm max-w-none">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Conditions générales d&apos;utilisation</h1>
      <p className="text-gray-400 text-sm mb-10">Dernière mise à jour : à compléter</p>

      <div className="mb-8 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">
        <strong>À compléter :</strong> ce document est un cadre générique. Les conditions tarifaires
        (Starter/Pro/Expert), les modalités de résiliation et l&apos;identité de l&apos;éditeur
        doivent être vérifiées et complétées avant publication.
      </div>

      <section className="space-y-3 text-sm text-gray-600 leading-relaxed">
        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">1. Objet</h2>
        <p>
          Les présentes conditions générales d&apos;utilisation (CGU) régissent l&apos;accès et
          l&apos;utilisation du service MyLocavio, destiné à assister les propriétaires bailleurs
          particuliers dans la gestion de leurs locations.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">2. Inscription et compte</h2>
        <p>
          L&apos;utilisation de MyLocavio nécessite la création d&apos;un compte associé à une
          adresse e-mail valide. L&apos;utilisateur est responsable de la confidentialité de ses
          identifiants et de toute activité effectuée depuis son compte.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">3. Description du service</h2>
        <p>
          MyLocavio permet notamment de : suivre ses biens loués, générer des quittances de loyer,
          générer des baux (vide, meublé, mobilité), suivre les retards de paiement, générer des
          états des lieux, et calculer la révision annuelle du loyer (IRL).
        </p>
        <p>
          Les documents générés (quittances, baux, états des lieux) sont produits à partir des
          informations saisies par l&apos;utilisateur. L&apos;exactitude de ces informations et leur
          conformité à la situation réelle relèvent de la responsabilité de l&apos;utilisateur.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">4. Tarifs et abonnement</h2>
        <p>
          MyLocavio propose un plan gratuit limité et des plans payants offrant des fonctionnalités
          et un nombre de biens gérés plus étendus. [À COMPLÉTER : détail des plans, modalités de
          facturation et de paiement une fois l&apos;intégration de paiement effective].
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">5. Résiliation</h2>
        <p>
          L&apos;utilisateur peut résilier son abonnement à tout moment depuis la page Paramètres.
          La résiliation prend effet à la fin de la période déjà payée. L&apos;utilisateur peut
          demander la suppression complète de son compte et de ses données à tout moment.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">6. Limitation de responsabilité</h2>
        <p>
          MyLocavio est un outil d&apos;assistance et ne se substitue pas à un conseil juridique.
          L&apos;éditeur ne saurait être tenu responsable des conséquences d&apos;une utilisation
          non conforme du service ou d&apos;une erreur de saisie par l&apos;utilisateur.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">7. Modification des CGU</h2>
        <p>
          MyLocavio se réserve le droit de modifier les présentes CGU. Les utilisateurs seront
          informés de toute modification substantielle.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">8. Droit applicable</h2>
        <p>Les présentes CGU sont soumises au droit français.</p>
      </section>
    </article>
  );
}
