import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegalesPage() {
  return (
    <article className="prose prose-sm max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-a:text-[#1c7aa8]">
      <h1 className="text-3xl font-black text-gray-900 mb-2">Mentions légales</h1>
      <p className="text-gray-400 text-sm mb-10">Dernière mise à jour : à compléter</p>

      <div className="mb-8 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl">
        <strong>À compléter avant mise en ligne publique :</strong> les champs marqués
        « [À COMPLÉTER] » doivent être remplacés par les informations réelles de l&apos;éditeur
        du site. Une mention légale incomplète ou inexacte expose à un risque juridique.
      </div>

      <section className="space-y-2 text-sm text-gray-600 leading-relaxed">
        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">Éditeur du site</h2>
        <p>
          Le site MyLocavio est édité par [À COMPLÉTER : nom / raison sociale], [statut juridique —
          entreprise individuelle, auto-entrepreneur, SAS, etc.], immatriculé(e) sous le numéro SIRET
          [À COMPLÉTER], dont le siège est situé [À COMPLÉTER : adresse complète].
        </p>
        <p>
          Numéro de TVA intracommunautaire (le cas échéant) : [À COMPLÉTER].
        </p>
        <p>
          Directeur de la publication : [À COMPLÉTER : nom du responsable].
        </p>
        <p>
          Contact : voir la page <a href="/contact">Contact</a>.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
          (<a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a>).
        </p>
        <p>
          Les données applicatives (comptes, biens, baux, quittances) sont hébergées par Supabase
          via son infrastructure cloud. [À COMPLÉTER : préciser la région d&apos;hébergement des
          données choisie dans le projet Supabase, idéalement une région UE pour la conformité RGPD].
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des éléments du site MyLocavio (textes, logos, interface, code) est protégé
          par le droit de la propriété intellectuelle. Toute reproduction non autorisée est interdite.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">Responsabilité</h2>
        <p>
          MyLocavio est un outil d&apos;assistance à la gestion locative. Les documents générés
          (quittances, baux, états des lieux) sont fournis à titre indicatif et ne dispensent pas
          l&apos;utilisateur de vérifier leur conformité avec la réglementation en vigueur applicable
          à sa situation personnelle.
        </p>

        <h2 className="text-lg font-bold text-gray-900 mt-8 mb-2">Droit applicable</h2>
        <p>Les présentes mentions légales sont soumises au droit français.</p>
      </section>
    </article>
  );
}
