import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-[#2A9FD6]">MyLocavio</span>
          <div className="flex items-center gap-3">
            <Link
              href="/connexion"
              className="text-sm font-medium text-gray-600 hover:text-[#2A9FD6] px-4 py-2 rounded-lg transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/inscription"
              className="text-sm font-medium bg-[#2A9FD6] hover:bg-[#238bbf] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#2A9FD6] text-sm font-medium px-4 py-1.5 rounded-full mb-8">
            🏠 Gestion locative simplifiée
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Gérez vos locations<br />
            <span className="text-[#2A9FD6]">sans prise de tête</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            MyLocavio est l&apos;outil pensé pour les propriétaires bailleurs qui gèrent 1 à 5 logements seuls.
            Quittances, baux, relances — tout en quelques clics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center bg-[#2A9FD6] hover:bg-[#238bbf] text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
            >
              Commencer gratuitement →
            </Link>
            <button className="inline-flex items-center justify-center border border-gray-300 hover:border-[#2A9FD6] hover:text-[#2A9FD6] text-gray-700 font-semibold px-8 py-4 rounded-xl text-base transition-colors">
              Voir une démo
            </button>
          </div>
          <p className="text-sm text-gray-400">
            Rejoint par +200 propriétaires bailleurs · Aucune carte bancaire requise
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Tout ce dont vous avez besoin
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "📄",
                title: "Quittances automatiques",
                desc: "Générez vos quittances PDF conformes loi ALUR en un clic",
              },
              {
                icon: "📋",
                title: "Baux conformes",
                desc: "Bail vide 3 ans, meublé 1 an, mobilité — tous conformes et prêts à signer",
              },
              {
                icon: "🔔",
                title: "Relances intelligentes",
                desc: "Suivez les impayés et envoyez des relances depuis votre tableau de bord",
              },
              {
                icon: "🏠",
                title: "Multi-biens",
                desc: "Gérez jusqu'à 5 logements depuis un seul espace",
              },
              {
                icon: "📊",
                title: "Tableau de bord",
                desc: "Visualisez vos loyers, dépôts de garantie et revenus en temps réel",
              },
              {
                icon: "🔒",
                title: "Données sécurisées",
                desc: "Vos données sont chiffrées et hébergées en Europe",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-sm transition-shadow"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Des tarifs clairs, sans surprise
            </h2>
          </div>
          <p className="text-center text-gray-500 mb-14">
            Commencez gratuitement, évoluez selon vos besoins
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Starter */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Starter</h3>
              <p className="text-sm text-gray-500 mb-4">Pour débuter</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                0€<span className="text-base font-normal text-gray-500">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["1 bien", "Quittances PDF", "Tableau de bord"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-[#2A9FD6]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="block text-center border border-gray-300 hover:border-[#2A9FD6] hover:text-[#2A9FD6] text-gray-700 font-medium py-3 rounded-xl text-sm transition-colors"
              >
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro — highlighted */}
            <div className="border-2 border-[#2A9FD6] rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#2A9FD6] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                  ★ Le plus populaire
                </span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">Pro</h3>
              <p className="text-sm text-gray-500 mb-4">Pour les propriétaires actifs</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                9€<span className="text-base font-normal text-gray-500">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "3 biens",
                  "Tout Starter +",
                  "Baux PDF conformes",
                  "Relances loyers",
                  "Révision IRL",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-[#2A9FD6]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="block text-center bg-[#2A9FD6] hover:bg-[#238bbf] text-white font-medium py-3 rounded-xl text-sm transition-colors"
              >
                Commencer avec Pro
              </Link>
            </div>

            {/* Expert */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <h3 className="font-bold text-gray-900 text-lg mb-1">Expert</h3>
              <p className="text-sm text-gray-500 mb-4">Pour les multi-propriétaires</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                19€<span className="text-base font-normal text-gray-500">/mois</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "5 biens",
                  "Tout Pro +",
                  "Documents (avenants, congés, EDL)",
                  "Support prioritaire",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-[#2A9FD6]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="block text-center border border-gray-300 hover:border-[#2A9FD6] hover:text-[#2A9FD6] text-gray-700 font-medium py-3 rounded-xl text-sm transition-colors"
              >
                Commencer avec Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#F8FAFC] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Ils nous font confiance
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Marie D.",
                role: "Propriétaire, Lyon",
                quote:
                  "J'ai gagné des heures chaque mois. Les quittances se génèrent toutes seules, les baux sont conformes. Je recommande à tous les propriétaires !",
              },
              {
                name: "Thomas R.",
                role: "Bailleur, Paris",
                quote:
                  "Enfin un outil simple pour gérer mes 3 appartements. Fini les tablettes Excel et les modèles Word bricolés.",
              },
              {
                name: "Sophie M.",
                role: "Propriétaire, Bordeaux",
                quote:
                  "La gestion des relances m'a sauvé la mise. En 2 clics, mon locataire reçoit un rappel professionnel.",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="text-gray-600 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-[#2A9FD6] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à simplifier votre gestion locative ?
          </h2>
          <p className="text-blue-100 mb-10 text-lg">
            Rejoignez +200 propriétaires qui font confiance à MyLocavio
          </p>
          <Link
            href="/inscription"
            className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-[#2A9FD6] font-semibold px-8 py-4 rounded-xl text-base transition-colors"
          >
            Créer mon compte gratuit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-xl font-bold text-white">MyLocavio</span>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/connexion" className="hover:text-white transition-colors">
              Connexion
            </Link>
            <Link href="/inscription" className="hover:text-white transition-colors">
              Inscription
            </Link>
            <a href="mailto:contact@mylocavio.fr" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 MyLocavio · Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}
