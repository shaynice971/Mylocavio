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

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">7. Limitation de responsabilité relative aux documents générés</h2>
        <p>
          Mylocavio met à disposition des outils permettant de générer des documents (baux, états
          des lieux, quittances) sur la base de modèles conformes à la réglementation en vigueur au
          jour de leur publication sur la plateforme (notamment le décret n°2015-587 du 29 mai 2015
          et la loi n°89-462 du 6 juillet 1989).
        </p>
        <p>
          L&apos;utilisateur reste seul responsable de l&apos;exactitude des informations qu&apos;il
          renseigne, de l&apos;adéquation du type de document généré à sa situation personnelle, et du
          respect de ses obligations légales en tant que bailleur.
        </p>
        <p>
          Mylocavio s&apos;efforce de maintenir ses modèles à jour des évolutions légales et
          réglementaires, sans garantir l&apos;exhaustivité ou l&apos;adéquation des documents générés à
          chaque situation particulière. Il est recommandé à l&apos;utilisateur, en cas de doute ou
          de situation complexe, de recourir à un professionnel du droit.
        </p>
        <p>
          Mylocavio ne saurait être tenu responsable des conséquences directes ou indirectes
          résultant d&apos;une utilisation inappropriée des documents générés, d&apos;une erreur de
          saisie de l&apos;utilisateur, ou d&apos;une évolution législative postérieure à la génération
          du document.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">8. Modification des CGU</h2>
        <p>
          MyLocavio se réserve le droit de modifier les présentes CGU. Les utilisateurs seront
          informés de toute modification substantielle.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">9. Droit applicable</h2>
        <p>Les présentes CGU sont soumises au droit français.</p>
      </section>
    </article>
  );
}
