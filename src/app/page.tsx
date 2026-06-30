import Link from "next/link";
import Logo from "@/components/Logo";
import IconDocument from "@/components/icons/IconDocument";
import IconBell from "@/components/icons/IconBell";
import IconCheck from "@/components/icons/IconCheck";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Link
              href="/connexion"
              className="text-sm font-medium text-gray-500 hover:text-[#1a1a1a] transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/inscription"
              className="text-sm font-medium bg-[#2A9FD6] hover:bg-[#238bbf] text-white px-5 py-2 rounded-lg transition-colors"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <p className="uppercase tracking-widest text-[#2A9FD6] text-sm font-semibold mb-6">
            Gestion locative simplifiee
          </p>
          <h1 className="text-5xl font-bold leading-tight text-[#1a1a1a] max-w-3xl mx-auto">
            Gerez vos locations<br />comme un pro
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mt-6">
            MyLocavio centralise tout ce dont vous avez besoin pour louer sereinement — quittances, baux, relances. Sans agence, sans Excel.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center bg-[#2A9FD6] hover:bg-[#238bbf] text-white font-semibold px-8 py-3 rounded-lg text-base transition-colors"
            >
              Commencer gratuitement
            </Link>
            <button className="inline-flex items-center justify-center border border-[#2A9FD6] text-[#2A9FD6] font-semibold px-8 py-3 rounded-lg text-base hover:bg-[#2A9FD6]/5 transition-colors">
              Voir une demo
            </button>
          </div>
          <p className="mt-8 text-sm text-gray-400">
            Deja +200 proprietaires · Gratuit pour commencer · Donnees hebergees en France
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1a1a1a]">Tout ce dont vous avez besoin</h2>
            <p className="mt-3 text-base text-gray-500">Une plateforme pensee pour les bailleurs independants</p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-[#2A9FD6]/10 rounded-xl flex items-center justify-center mb-6">
                <IconDocument className="w-6 h-6 text-[#2A9FD6]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">Quittances PDF conformes</h3>
              <p className="text-base text-gray-500 leading-relaxed">
                Generees en un clic, conformes a la loi ALUR. Envoyez-les directement a votre locataire.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-[#2A9FD6]/10 rounded-xl flex items-center justify-center mb-6">
                <IconDocument className="w-6 h-6 text-[#2A9FD6]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">Baux reglementaires</h3>
              <p className="text-base text-gray-500 leading-relaxed">
                Bail vide 3 ans, meuble 1 an, bail mobilite. Tous conformes, prets a signer.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="w-12 h-12 bg-[#2A9FD6]/10 rounded-xl flex items-center justify-center mb-6">
                <IconBell className="w-6 h-6 text-[#2A9FD6]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">Relances automatisees</h3>
              <p className="text-base text-gray-500 leading-relaxed">
                Suivez les impayes et envoyez des relances professionnelles depuis votre tableau de bord.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1a1a1a]">Demarrez en 3 etapes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                n: "01",
                title: "Creez votre compte",
                desc: "Inscription en 2 minutes, aucune carte bancaire requise.",
              },
              {
                n: "02",
                title: "Ajoutez vos biens",
                desc: "Renseignez vos logements et vos locataires en quelques clics.",
              },
              {
                n: "03",
                title: "Gerez au quotidien",
                desc: "Quittances, baux, relances — tout depuis un seul endroit.",
              },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <p className="text-5xl font-bold text-[#2A9FD6] opacity-20 mb-4">{step.n}</p>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{step.title}</h3>
                <p className="text-base text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1a1a1a]">Des tarifs transparents</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Starter</h3>
              <p className="text-sm text-gray-500 mt-1">Pour commencer</p>
              <p className="mt-6 text-4xl font-bold text-[#1a1a1a]">
                0<span className="text-base font-normal text-gray-500">&euro;/mois</span>
              </p>
              <ul className="mt-8 space-y-3">
                {["1 bien", "Quittances PDF", "Tableau de bord", "Support communautaire"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <IconCheck className="w-4 h-4 text-[#2A9FD6] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="mt-8 block text-center border border-[#2A9FD6] text-[#2A9FD6] font-medium py-2.5 rounded-lg text-sm hover:bg-[#2A9FD6]/5 transition-colors"
              >
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-xl p-8 shadow-sm border-2 border-[#2A9FD6] relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#2A9FD6] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Le plus populaire
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a]">Pro</h3>
              <p className="text-sm text-gray-500 mt-1">Pour les proprietaires actifs</p>
              <p className="mt-6 text-4xl font-bold text-[#1a1a1a]">
                9<span className="text-base font-normal text-gray-500">&euro;/mois</span>
              </p>
              <ul className="mt-8 space-y-3">
                {["3 biens", "Tout Starter +", "Baux PDF", "Relances", "Revision IRL annuelle"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <IconCheck className="w-4 h-4 text-[#2A9FD6] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="mt-8 block text-center bg-[#2A9FD6] hover:bg-[#238bbf] text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                Commencer avec Pro
              </Link>
            </div>

            {/* Expert */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Expert</h3>
              <p className="text-sm text-gray-500 mt-1">Pour les multi-proprietaires</p>
              <p className="mt-6 text-4xl font-bold text-[#1a1a1a]">
                19<span className="text-base font-normal text-gray-500">&euro;/mois</span>
              </p>
              <ul className="mt-8 space-y-3">
                {["5 biens", "Tout Pro +", "Documents complets", "Support prioritaire"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <IconCheck className="w-4 h-4 text-[#2A9FD6] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="mt-8 block text-center border border-[#2A9FD6] text-[#2A9FD6] font-medium py-2.5 rounded-lg text-sm hover:bg-[#2A9FD6]/5 transition-colors"
              >
                Commencer avec Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1a1a1a]">Ils simplifient leur gestion</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                initials: "MD",
                name: "Marie D.",
                role: "Proprietaire a Lyon",
                quote:
                  "J'ai economise des heures chaque mois. Les quittances se generent seules, les baux sont conformes. Je recommande a tous les bailleurs independants.",
              },
              {
                initials: "TR",
                name: "Thomas R.",
                role: "Bailleur a Paris",
                quote:
                  "Fini les tablettes Excel et les modeles Word bricoles. Tout est centralise, professionnel, et ca prend 5 minutes.",
              },
              {
                initials: "SM",
                name: "Sophie M.",
                role: "Proprietaire a Bordeaux",
                quote:
                  "La gestion des relances m'a sauve la mise. Mon locataire recoit un rappel professionnel en deux clics.",
              },
            ].map((t) => (
              <div key={t.name} className="bg-[#F7F9FC] rounded-xl p-8">
                <p className="italic text-gray-600 text-base leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2A9FD6] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-[#1a1a1a] text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-[#2A9FD6]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Pret a gerer vos locations sereinement ?
          </h2>
          <p className="mt-4 text-white/80 text-base">
            Rejoignez +200 proprietaires qui font confiance a MyLocavio
          </p>
          <Link
            href="/inscription"
            className="mt-8 inline-flex items-center justify-center bg-white text-[#2A9FD6] font-semibold px-8 py-3 rounded-lg text-base hover:bg-gray-50 transition-colors"
          >
            Creer mon compte gratuit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xl font-bold text-white">mylocavio</span>
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
          <p className="text-sm text-gray-400">
            &copy; 2026 MyLocavio · Tous droits reserves
          </p>
        </div>
      </footer>
    </div>
  );
}
