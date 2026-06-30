import Link from "next/link";
import Logo from "@/components/Logo";
import IconDocument from "@/components/icons/IconDocument";
import IconBell from "@/components/icons/IconBell";
import IconChart from "@/components/icons/IconChart";
import IconClipboard from "@/components/icons/IconClipboard";
import IconShield from "@/components/icons/IconShield";

export default function HomePage() {
  const faqItems = [
    {
      q: "MyLocavio est-il vraiment gratuit ?",
      a: "Oui, le plan Starter est gratuit sans limite de durée. Vous pouvez gérer un bien, créer vos quittances et accéder au tableau de bord sans jamais payer. Les plans payants débloquent des fonctionnalités avancées pour les propriétaires qui gèrent plusieurs logements.",
    },
    {
      q: "Les quittances générées sont-elles légalement valides ?",
      a: "Oui. MyLocavio génère des quittances conformes au décret du 26 août 1987 et à la loi ALUR. Elles contiennent toutes les mentions obligatoires : identité du bailleur et du locataire, adresse du bien, montant du loyer et des charges, période concernée.",
    },
    {
      q: "Puis-je utiliser MyLocavio si je loue pour la première fois ?",
      a: "C'est exactement pour vous que MyLocavio a été conçu. L'interface vous guide pas à pas, les termes juridiques sont expliqués simplement, et chaque document est pré-rempli au maximum. Pas besoin d'expérience préalable.",
    },
    {
      q: "Mes données sont-elles sécurisées ?",
      a: "Vos données sont chiffrées (TLS en transit, AES-256 au repos) et hébergées en France dans des datacenters certifiés. Nous sommes conformes au RGPD. Vous pouvez exporter ou supprimer vos données à tout moment.",
    },
    {
      q: "Quels types de baux puis-je créer ?",
      a: "MyLocavio génère trois types de contrats : le bail de location vide (3 ans, loi du 6 juillet 1989), le bail de location meublée (1 an) et le bail mobilité (1 à 10 mois, loi ELAN). Tous sont mis à jour selon la législation en vigueur.",
    },
    {
      q: "Comment fonctionne la révision annuelle du loyer ?",
      a: "Chaque année, vous pouvez réviser le loyer selon l'Indice de Référence des Loyers (IRL) publié par l'INSEE. MyLocavio calcule automatiquement le nouveau montant : vous saisissez l'IRL de référence et l'IRL actuel, l'outil fait le reste et met à jour votre dossier.",
    },
    {
      q: "Puis-je annuler mon abonnement à tout moment ?",
      a: "Oui, sans engagement et sans pénalité. Vous pouvez résilier depuis votre espace Paramètres en un clic. Votre compte reste actif jusqu'à la fin de la période payée, puis passe automatiquement sur le plan Gratuit.",
    },
    {
      q: "Comment sont gérés les loyers impayés ?",
      a: "Le module Relances vous permet de suivre les retards de paiement et d'envoyer des rappels professionnels par email à votre locataire. Chaque relance est horodatée et archivée dans votre dossier — utile en cas de litige.",
    },
    {
      q: "MyLocavio remplace-t-il un avocat ou un notaire ?",
      a: "Non. MyLocavio est un outil de gestion qui automatise les tâches administratives courantes. Pour des situations complexes (litige, congé pour vente, colocation), nous recommandons de consulter un professionnel du droit.",
    },
    {
      q: "Est-ce que MyLocavio fonctionne sur mobile ?",
      a: "Oui, l'interface est entièrement responsive et fonctionne sur smartphone et tablette. Générez une quittance, consultez vos loyers ou envoyez une relance depuis votre téléphone, où que vous soyez.",
    },
  ];

  const features = [
    {
      icon: <IconDocument className="w-6 h-6 text-[#2A9FD6]" />,
      title: "Quittances PDF automatiques",
      desc: "Générées chaque mois en un clic, conformes au décret du 26 août 1987. Envoyez-les par email directement depuis l'application.",
    },
    {
      icon: <IconDocument className="w-6 h-6 text-[#2A9FD6]" />,
      title: "Baux réglementaires",
      desc: "Bail vide (3 ans), meublé (1 an), bail mobilité (1-10 mois). Tous mis à jour selon la loi ALUR et prêts à être signés.",
    },
    {
      icon: <IconBell className="w-6 h-6 text-[#2A9FD6]" />,
      title: "Relances loyers impayés",
      desc: "Suivez les retards en temps réel et envoyez des relances professionnelles en un clic. Gardez une trace de chaque échange.",
    },
    {
      icon: <IconChart className="w-6 h-6 text-[#2A9FD6]" />,
      title: "Révision IRL annuelle",
      desc: "Calculez automatiquement le nouveau loyer selon l'Indice de Référence des Loyers publié par l'INSEE. Restez dans la légalité.",
    },
    {
      icon: <IconClipboard className="w-6 h-6 text-[#2A9FD6]" />,
      title: "États des lieux guidés",
      desc: "Créez des états des lieux d'entrée et de sortie complets, pièce par pièce. PDF généré et archivé automatiquement.",
    },
    {
      icon: <IconShield className="w-6 h-6 text-[#2A9FD6]" />,
      title: "Conformité RGPD & sécurité",
      desc: "Données chiffrées et hébergées en France. Accès sécurisé par authentification. Sauvegarde automatique quotidienne.",
    },
  ];

  const starterFeatures = [
    "1 bien géré",
    "Tableau de bord",
    "Quittances PDF",
    "Support communauté",
  ];

  const proFeatures = [
    "3 biens gérés",
    "Tout Starter inclus",
    "Baux PDF conformes (vide, meublé, mobilité)",
    "Relances loyers impayés",
    "Révision IRL automatique",
    "États des lieux PDF",
  ];

  const expertFeatures = [
    "5 biens gérés",
    "Tout Pro inclus",
    "Avenants et congés",
    "Support prioritaire par email",
    "Export comptable (bientôt)",
  ];

  const testimonials = [
    {
      initials: "MD",
      name: "Marie D.",
      role: "Propriétaire, Lyon · 2 appartements",
      quote:
        "Je louais depuis 3 ans avec des modèles Word téléchargés en ligne. Depuis MyLocavio, mes quittances sont conformes, mes baux sont à jour. Je n'aurais pas dû attendre si longtemps.",
    },
    {
      initials: "TR",
      name: "Thomas R.",
      role: "Primo-bailleur, Paris · 1 studio",
      quote:
        "Honnêtement, je ne savais même pas ce qu'était l'indice IRL. MyLocavio me l'explique et calcule tout. Exactement ce qu'il me fallait pour ma première location.",
    },
    {
      initials: "SM",
      name: "Sophie M.",
      role: "Propriétaire, Bordeaux · 3 logements",
      quote:
        "Rentila était trop complexe pour moi. MyLocavio est pensé pour les vrais gens, pas pour les professionnels de l'immobilier. C'est la différence.",
    },
  ];

  const securityItems = [
    {
      title: "Conforme loi ALUR",
      desc: "Tous les documents générés respectent la législation française en vigueur",
    },
    {
      title: "RGPD compliant",
      desc: "Vos données appartiennent uniquement à vous. Exportez ou supprimez à tout moment.",
    },
    {
      title: "Hébergement France",
      desc: "Données stockées sur des serveurs situés en France, certifiés ISO 27001",
    },
    {
      title: "Paiement sécurisé",
      desc: "Transactions traitées par Stripe, leader mondial du paiement en ligne sécurisé",
    },
  ];

  const avatars = ["MD", "TR", "SM", "JL", "AB"];

  const footerProduit = [
    "Dashboard",
    "Mes biens",
    "Quittances",
    "Baux",
    "États des lieux",
  ];

  const footerRessources = [
    { label: "Centre d'aide", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Guide ALUR", href: "#" },
    { label: "Contact", href: "#" },
  ];

  const footerLegal = [
    { label: "Mentions légales", href: "#" },
    { label: "Politique de confidentialité", href: "#" },
    { label: "CGU", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a1a1a]">
      {/* ─── NAVBAR ─────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Logo />

          {/* Center nav — hidden on mobile */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#fonctionnalites" className="hover:text-[#1a1a1a] transition-colors">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="hover:text-[#1a1a1a] transition-colors">
              Tarifs
            </a>
            <a href="#faq" className="hover:text-[#1a1a1a] transition-colors">
              FAQ
            </a>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <Link
              href="/connexion"
              className="text-sm font-medium text-gray-600 hover:text-[#1a1a1a] transition-colors hidden md:inline"
            >
              Se connecter
            </Link>
            <Link
              href="/inscription"
              className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-lg px-5 py-2 text-sm font-medium transition-colors"
            >
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ───────────────────────────────────── */}
      <section className="py-28 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          {/* Pill badge */}
          <span className="inline-block border border-[#2A9FD6]/30 bg-[#2A9FD6]/5 text-[#2A9FD6] text-xs font-medium px-4 py-1.5 rounded-full">
            Le logiciel de gestion locative pour les propriétaires indépendants
          </span>

          {/* H1 */}
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.15] text-[#1a1a1a] mt-6">
            Gérez vos locations{" "}
            <span className="text-[#2A9FD6]">
              sans stress,
              <br />
              sans agence.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mt-6 leading-relaxed">
            MyLocavio guide les primo-bailleurs pas à pas : quittances PDF, baux conformes ALUR,
            relances automatiques. Tout ce qu&apos;il faut pour louer sereinement dès le premier
            logement.
          </p>

          {/* CTA row */}
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <Link
              href="/inscription"
              className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-xl px-8 py-4 text-base font-semibold shadow-lg shadow-orange-200 transition-colors"
            >
              Commencer gratuitement
            </Link>
            <button className="border-2 border-gray-200 text-gray-600 hover:border-[#2A9FD6] hover:text-[#2A9FD6] rounded-xl px-8 py-4 text-base font-medium transition-colors">
              Voir une démonstration
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex gap-8 justify-center flex-wrap text-sm text-gray-400">
            <span className="flex items-center gap-2">
              {/* Shield icon */}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Données hébergées en France
            </span>
            <span className="flex items-center gap-2">
              {/* Check icon */}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Conforme loi ALUR
            </span>
            <span className="flex items-center gap-2">
              {/* Star icon */}
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              +200 propriétaires satisfaits
            </span>
            <span className="flex items-center gap-2">
              {/* Lock icon */}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Gratuit sans carte bancaire
            </span>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAR ───────────────────────── */}
      <section className="py-8 bg-[#F7F9FC] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 text-center">
          <p className="text-sm text-gray-400">
            Rejoignez des propriétaires qui ont simplifié leur gestion locative
          </p>
          <div className="flex items-center gap-3">
            {/* Overlapping avatars */}
            <div className="flex -space-x-2">
              {avatars.map((initials) => (
                <div
                  key={initials}
                  className="w-10 h-10 rounded-full bg-[#2A9FD6] text-white font-bold text-sm flex items-center justify-center ring-2 ring-white"
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-[#1a1a1a] font-semibold text-sm">+200 propriétaires</span>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────── */}
      <section id="fonctionnalites" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-[#2A9FD6] text-xs font-semibold tracking-widest uppercase">
              Simple par conception
            </p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mt-3">
              Opérationnel en moins de 5 minutes
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Pas de formation. Pas de manuel. MyLocavio vous guide à chaque étape.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                n: "01",
                title: "Créez votre compte",
                desc: "Inscription en 2 minutes, aucune information bancaire requise. Commencez immédiatement.",
              },
              {
                n: "02",
                title: "Ajoutez vos biens et locataires",
                desc: "Renseignez votre logement et votre locataire en quelques champs. MyLocavio pré-remplit ce qu'il peut.",
              },
              {
                n: "03",
                title: "Gérez au quotidien",
                desc: "Quittances générées automatiquement, baux prêts à signer, relances en un clic. Votre temps retrouvé.",
              },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <p className="text-8xl font-black text-[#2A9FD6]/10 leading-none">{step.n}</p>
                <h3 className="text-xl font-bold text-[#1a1a1a] mt-2">{step.title}</h3>
                <p className="text-gray-500 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ──────────────────────────── */}
      <section className="py-24 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-[#2A9FD6] text-xs font-semibold tracking-widest uppercase">
              Fonctionnalités
            </p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mt-3">
              Tout ce qu&apos;un bailleur indépendant doit avoir
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#2A9FD6]/10 rounded-xl flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#1a1a1a]">{f.title}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ────────────────────────────────── */}
      <section id="tarifs" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-[#2A9FD6] text-xs font-semibold tracking-widest uppercase">
              Tarification
            </p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mt-3">
              Des tarifs honnêtes, sans surprise
            </h2>
            <p className="text-gray-500 mt-4">
              Commencez gratuitement, évoluez selon vos besoins. Résiliez quand vous voulez.
            </p>
            {/* Static toggle */}
            <div className="mt-6 inline-flex items-center bg-gray-100 rounded-lg p-1 text-sm">
              <span className="px-4 py-1.5 bg-white rounded-md font-medium text-[#1a1a1a] shadow-sm">
                Mensuel
              </span>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Starter</h3>
              <p className="text-sm text-gray-500 mt-1">Pour découvrir MyLocavio</p>
              <p className="mt-6">
                <span className="text-5xl font-black text-[#1a1a1a]">0</span>
                <span className="text-gray-400 ml-1">€/mois</span>
              </p>
              <ul className="mt-8 space-y-3">
                {starterFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="mt-8 block text-center border-2 border-gray-200 text-gray-600 hover:border-[#2A9FD6] hover:text-[#2A9FD6] transition-colors w-full py-3 rounded-xl font-medium text-sm"
              >
                Commencer gratuitement
              </Link>
            </div>

            {/* Pro — dark highlighted */}
            <div className="bg-[#1a1a1a] rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  Le plus populaire
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">Pro</h3>
              <p className="text-sm text-gray-400 mt-1">Pour les propriétaires actifs</p>
              <p className="mt-6">
                <span className="text-5xl font-black text-white">9</span>
                <span className="text-gray-400 ml-1">€/mois</span>
              </p>
              <ul className="mt-8 space-y-3">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="mt-8 block text-center bg-[#FF6B35] hover:bg-[#e55a2b] text-white w-full py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                Choisir Pro
              </Link>
            </div>

            {/* Expert */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-[#1a1a1a]">Expert</h3>
              <p className="text-sm text-gray-500 mt-1">Pour les multi-propriétaires</p>
              <p className="mt-6">
                <span className="text-5xl font-black text-[#1a1a1a]">19</span>
                <span className="text-gray-400 ml-1">€/mois</span>
              </p>
              <ul className="mt-8 space-y-3">
                {expertFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="mt-8 block text-center border-2 border-gray-200 text-gray-700 hover:border-[#2A9FD6] hover:text-[#2A9FD6] transition-colors w-full py-3 rounded-xl font-medium text-sm"
              >
                Choisir Expert
              </Link>
            </div>
          </div>

          <p className="text-sm text-gray-400 text-center mt-6">
            Tous les plans incluent 30 jours d&apos;essai gratuit. Paiement sécurisé par Stripe.
          </p>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────── */}
      <section className="py-24 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-[#1a1a1a]">
              Ils ont simplifié leur gestion locative
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-8 shadow-sm">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="italic text-gray-600 leading-relaxed mt-4">
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

      {/* ─── FAQ ────────────────────────────────────── */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#1a1a1a]">Questions fréquentes</h2>
            <p className="text-gray-500 mt-4">
              Tout ce que vous devez savoir avant de commencer
            </p>
          </div>

          <div className="max-w-3xl mx-auto mt-14">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border-b border-gray-100 py-6">
                <p className="font-semibold text-[#1a1a1a]">{item.q}</p>
                <p className="text-gray-500 mt-3 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECURITY SECTION ───────────────────────── */}
      <section className="py-20 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1a1a1a]">
              Conformité et sécurité au cœur de MyLocavio
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {securityItems.map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 bg-[#2A9FD6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconShield className="w-6 h-6 text-[#2A9FD6]" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] text-sm">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────── */}
      <section className="py-24 bg-[#2A9FD6]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white">
            Commencez à gérer vos locations sereinement
          </h2>
          <p className="text-white/80 text-lg mt-4">
            Rejoignez +200 propriétaires qui font confiance à MyLocavio. Gratuit pour commencer.
          </p>
          <Link
            href="/inscription"
            className="mt-10 inline-flex items-center justify-center bg-white text-[#2A9FD6] font-bold px-10 py-4 rounded-xl text-lg hover:bg-gray-50 transition-colors"
          >
            Créer mon compte gratuit
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────── */}
      <footer className="bg-[#1a1a1a] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Col 1 — Brand */}
            <div>
              <Logo className="[&_span]:text-white" />
              <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                Le logiciel de gestion locative pour les propriétaires indépendants.
              </p>
              <p className="text-gray-500 text-sm mt-4">&copy; 2026 MyLocavio</p>
            </div>

            {/* Col 2 — Produit */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Produit</h4>
              <ul className="space-y-3">
                {footerProduit.map((label) => (
                  <li key={label}>
                    <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Ressources */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Ressources</h4>
              <ul className="space-y-3">
                {footerRessources.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Légal */}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">Légal</h4>
              <ul className="space-y-3">
                {footerLegal.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-gray-400 text-sm hover:text-white transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-12">
            <p className="text-gray-500 text-sm text-center">
              Fait avec soin pour les propriétaires français
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
