import Link from "next/link";
import Logo from "@/components/Logo";
import { Check, ArrowRight, Shield, FileText, Bell, TrendingUp, ClipboardList, Home } from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────────────── */

const features = [
  {
    icon: FileText,
    title: "Quittances PDF automatiques",
    desc: "Générées en un clic, conformes au décret du 26 août 1987. Envoyez-les directement par email.",
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-700",
  },
  {
    icon: FileText,
    title: "Baux réglementaires",
    desc: "Bail vide, meublé, mobilité. Mis à jour loi ALUR, prêts à signer en quelques minutes.",
    color: "from-violet-500/20 to-violet-600/5",
    iconColor: "text-violet-700",
  },
  {
    icon: Bell,
    title: "Relances loyers impayés",
    desc: "Suivez les retards en temps réel. Envoyez des relances professionnelles en un clic.",
    color: "from-rose-500/20 to-rose-600/5",
    iconColor: "text-rose-700",
  },
  {
    icon: TrendingUp,
    title: "Révision IRL annuelle",
    desc: "Calculez le nouveau loyer selon l'Indice de Référence des Loyers INSEE automatiquement.",
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-700",
  },
  {
    icon: ClipboardList,
    title: "États des lieux guidés",
    desc: "Pièce par pièce, entrée et sortie. PDF généré et archivé automatiquement.",
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-700",
  },
  {
    icon: Shield,
    title: "Conformité RGPD",
    desc: "Données chiffrées, hébergées en France. Accès sécurisé, sauvegarde quotidienne.",
    color: "from-cyan-500/20 to-cyan-600/5",
    iconColor: "text-cyan-700",
  },
];

const plans = [
  {
    name: "Starter",
    price: "0",
    desc: "Pour découvrir sans risque",
    features: ["1 bien géré", "Tableau de bord", "Quittances PDF", "Support communauté"],
    cta: "Commencer gratuitement",
    href: "/inscription",
    highlight: false,
  },
  {
    name: "Pro",
    price: "9",
    desc: "Pour les propriétaires actifs",
    features: [
      "3 biens gérés",
      "Tout Starter inclus",
      "Baux PDF conformes",
      "Relances loyers impayés",
      "Révision IRL automatique",
      "États des lieux PDF",
    ],
    cta: "Choisir Pro",
    href: "/inscription",
    highlight: true,
    badge: "Le plus populaire",
  },
  {
    name: "Expert",
    price: "19",
    desc: "Pour les multi-propriétaires",
    features: [
      "5 biens gérés",
      "Tout Pro inclus",
      "Avenants et congés",
      "Support prioritaire email",
      "Export comptable (bientôt)",
    ],
    cta: "Choisir Expert",
    href: "/inscription",
    highlight: false,
  },
];

const testimonials = [
  {
    initials: "MD",
    name: "Marie D.",
    role: "Propriétaire · 2 appartements · Lyon",
    quote: "Je louais depuis 3 ans avec des modèles Word. Depuis MyLocavio, mes quittances sont conformes, mes baux à jour. Je n'aurais pas dû attendre si longtemps.",
  },
  {
    initials: "TR",
    name: "Thomas R.",
    role: "Primo-bailleur · 1 studio · Paris",
    quote: "Je ne savais même pas ce qu'était l'indice IRL. MyLocavio me l'explique et calcule tout. Exactement ce qu'il me fallait pour ma première location.",
  },
  {
    initials: "SM",
    name: "Sophie M.",
    role: "Propriétaire · 3 logements · Bordeaux",
    quote: "Rentila était trop complexe. MyLocavio est pensé pour les vrais gens, pas pour les professionnels de l'immobilier. C'est toute la différence.",
  },
];

const faqItems = [
  { q: "MyLocavio est-il vraiment gratuit ?", a: "Oui, le plan Starter est gratuit sans limite de durée. Gérez un bien, créez vos quittances et accédez au tableau de bord sans jamais payer." },
  { q: "Les quittances sont-elles légalement valides ?", a: "Oui. Conformes au décret du 26 août 1987 et à la loi ALUR. Toutes les mentions obligatoires sont présentes." },
  { q: "Puis-je utiliser MyLocavio si je loue pour la première fois ?", a: "C'est exactement pour vous que MyLocavio a été conçu. L'interface vous guide pas à pas, sans expérience préalable nécessaire." },
  { q: "Mes données sont-elles sécurisées ?", a: "Vos données sont chiffrées (TLS + AES-256) et hébergées en France dans des datacenters certifiés ISO 27001. Conformité RGPD totale." },
  { q: "Quels types de baux puis-je créer ?", a: "Bail vide (3 ans), meublé (1 an), bail mobilité (1-10 mois, loi ELAN). Tous mis à jour selon la législation en vigueur." },
  { q: "Puis-je annuler à tout moment ?", a: "Oui, sans engagement. Résiliez depuis les Paramètres en un clic. Votre compte reste actif jusqu'à la fin de la période payée, puis passe sur le plan Gratuit." },
  { q: "Comment fonctionnent les relances ?", a: "Le module Relances suit les retards et vous permet d'envoyer des rappels professionnels par email. Chaque relance est horodatée et archivée." },
  { q: "MyLocavio fonctionne-t-il sur mobile ?", a: "Oui, l'interface est entièrement responsive — smartphone, tablette et desktop." },
];

/* ─── PAGE ─────────────────────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">

      {/* ── NAVBAR ────────────────────────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo dark />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#fonctionnalites" className="hover:text-gray-900 transition-colors">Fonctionnalités</a>
            <a href="#tarifs" className="hover:text-gray-900 transition-colors">Tarifs</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/connexion" className="hidden md:inline text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Se connecter
            </Link>
            <Link
              href="/inscription"
              className="bg-[#2A9FD6] hover:bg-[#238bbf] text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:shadow-lg hover:shadow-[#2A9FD6]/25"
            >
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#2A9FD6]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-32 right-0 w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-32 left-0 w-[300px] h-[300px] bg-[#FF6B35]/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 border border-gray-200 bg-gray-50 text-gray-500 text-xs font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2A9FD6] animate-pulse" />
            Logiciel de gestion locative pour propriétaires indépendants
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
            <span className="text-gray-900">Gérez vos locations</span>
            <br />
            <span className="bg-gradient-to-r from-[#2A9FD6] via-[#5bb8e8] to-[#FF6B35] bg-clip-text text-transparent">
              sans stress, sans agence.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mt-8 leading-relaxed">
            MyLocavio guide les primo-bailleurs pas à pas : quittances PDF, baux conformes ALUR,
            relances automatiques. Tout ce qu&apos;il faut pour louer sereinement dès le premier logement.
          </p>

          <div className="mt-12 flex gap-4 justify-center flex-wrap">
            <Link
              href="/inscription"
              className="group inline-flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-xl px-8 py-4 text-base font-bold transition-all hover:shadow-xl hover:shadow-[#FF6B35]/25 hover:-translate-y-0.5"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center gap-2 border border-gray-200 bg-gray-50 hover:bg-gray-50 text-gray-900 rounded-xl px-8 py-4 text-base font-medium transition-all"
            >
              Se connecter
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 justify-center">
            {["Données hébergées en France", "Conforme loi ALUR", "Gratuit sans carte bancaire"].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-gray-500">
                <Check className="w-4 h-4 text-[#1c7aa8]" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard preview mockup */}
        <div className="relative max-w-5xl mx-auto px-6 mt-20">
          <div className="relative rounded-2xl border border-gray-200 bg-gray-50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-gray-300/50">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-white">
              <div className="w-3 h-3 rounded-full bg-rose-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="ml-2 text-xs text-gray-300 font-mono">mylocavio.vercel.app/dashboard</span>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Biens gérés", value: "3", color: "text-[#1c7aa8]" },
                { label: "Loyers du mois", value: "2 400 €", color: "text-emerald-700" },
                { label: "Quittances", value: "12", color: "text-violet-700" },
                { label: "En retard", value: "0", color: "text-rose-700" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className="text-gray-500 text-xs font-medium">{s.label}</p>
                  <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
              {["12 rue de la Paix · Paris", "4 allée des Roses · Lyon", "28 bd Gambetta · Nantes"].map((addr) => (
                <div key={addr} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2A9FD6]/20 flex items-center justify-center shrink-0">
                    <Home className="w-4 h-4 text-[#1c7aa8]" />
                  </div>
                  <p className="text-gray-500 text-xs truncate">{addr}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Glow under mockup */}
          <div className="absolute inset-x-20 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2A9FD6]/40 to-transparent" />
        </div>
      </section>

      {/* ── SOCIAL PROOF ──────────────────────────────────────────── */}
      <div className="border-y border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-5">
          <div className="flex -space-x-2.5">
            {["MD", "TR", "SM", "JL", "AB"].map((i) => (
              <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2A9FD6] to-[#1a7aaa] text-white font-bold text-xs flex items-center justify-center ring-2 ring-white">
                {i}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">+200 propriétaires</span> ont simplifié leur gestion locative avec MyLocavio
          </p>
        </div>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-[#1c7aa8] text-xs font-bold tracking-[0.2em] uppercase">Simple par conception</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 leading-tight">
              Opérationnel en<br /><span className="text-gray-500">moins de 5 minutes</span>
            </h2>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "01", title: "Créez votre compte", desc: "Inscription en 2 minutes. Aucune carte bancaire requise. Commencez immédiatement sur le plan gratuit." },
              { n: "02", title: "Ajoutez vos biens", desc: "Renseignez votre logement et votre locataire en quelques champs. MyLocavio pré-remplit ce qu'il peut." },
              { n: "03", title: "Gérez au quotidien", desc: "Quittances automatiques, baux prêts à signer, relances en un clic. Votre temps retrouvé." },
            ].map((step, i) => (
              <div key={step.n} className="relative group">
                <div className="border border-gray-200 bg-white shadow-sm hover:bg-gray-50 rounded-2xl p-8 transition-all hover:border-gray-300">
                  <span className="text-[80px] font-black text-gray-200 leading-none block mb-4">{step.n}</span>
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="text-gray-500 mt-2 text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section id="fonctionnalites" className="py-28 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-[#1c7aa8] text-xs font-bold tracking-[0.2em] uppercase">Fonctionnalités</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 leading-tight">
              Tout ce qu&apos;un bailleur<br /><span className="text-gray-500">indépendant doit avoir</span>
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group relative border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm rounded-2xl p-7 transition-all"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5`}>
                    <Icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">{f.title}</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section id="tarifs" className="py-28 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-[#1c7aa8] text-xs font-bold tracking-[0.2em] uppercase">Tarification</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 leading-tight">
              Des tarifs honnêtes,<br /><span className="text-gray-500">sans surprise</span>
            </h2>
            <p className="text-gray-500 mt-4 text-sm">Commencez gratuitement. Résiliez quand vous voulez.</p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col transition-all ${
                  plan.highlight
                    ? "bg-gradient-to-b from-[#2A9FD6]/20 to-[#2A9FD6]/5 border-2 border-[#2A9FD6]/50 shadow-xl shadow-[#2A9FD6]/10"
                    : "border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[#FF6B35] text-white text-xs font-bold px-4 py-1.5 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{plan.desc}</p>
                  <div className="mt-6 flex items-end gap-1">
                    <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm mb-2">€/mois</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm text-gray-500">
                        <Check className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-[#1c7aa8]" : "text-emerald-500"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={plan.href}
                  className={`mt-8 block text-center w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    plan.highlight
                      ? "bg-[#2A9FD6] hover:bg-[#238bbf] text-white hover:shadow-lg hover:shadow-[#2A9FD6]/30"
                      : "border border-gray-200 bg-gray-50 hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-xs text-center mt-6">
            30 jours d&apos;essai gratuit sur tous les plans · Paiement sécurisé par Stripe
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-28 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#1c7aa8] text-xs font-bold tracking-[0.2em] uppercase">Témoignages</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4">
              Ils ont simplifié<br /><span className="text-gray-500">leur gestion locative</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 shadow-sm rounded-2xl p-7 transition-all">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2A9FD6] to-[#1a7aaa] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section id="faq" className="py-28 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#1c7aa8] text-xs font-bold tracking-[0.2em] uppercase">FAQ</p>
            <h2 className="text-4xl font-black text-gray-900 mt-4">Questions fréquentes</h2>
          </div>

          <div className="space-y-2">
            {faqItems.map((item, idx) => (
              <details
                key={idx}
                className="group border border-gray-200 bg-white shadow-sm open:border-gray-200 open:bg-gray-50 rounded-xl transition-all"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none font-semibold text-gray-900 text-sm gap-4">
                  <span>{item.q}</span>
                  <svg className="w-4 h-4 text-gray-400 shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECURITY ──────────────────────────────────────────────── */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "Conforme loi ALUR", desc: "Tous les documents respectent la législation française en vigueur" },
              { icon: Shield, title: "RGPD compliant", desc: "Vos données vous appartiennent. Exportez ou supprimez à tout moment." },
              { icon: Shield, title: "Hébergement France", desc: "Serveurs français certifiés ISO 27001" },
              { icon: Shield, title: "Paiement sécurisé", desc: "Transactions traitées par Stripe" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="border border-gray-200 bg-white shadow-sm rounded-2xl p-6 text-center">
                  <div className="w-10 h-10 rounded-xl bg-[#2A9FD6]/15 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-[#1c7aa8]" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                  <p className="text-gray-400 text-xs mt-2 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="py-28 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#2A9FD6]/10 rounded-3xl blur-3xl" />
            <div className="relative border border-gray-200 bg-white shadow-sm rounded-3xl p-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Commencez à gérer vos locations<br />
                <span className="bg-gradient-to-r from-[#2A9FD6] to-[#FF6B35] bg-clip-text text-transparent">
                  sereinement dès aujourd&apos;hui
                </span>
              </h2>
              <p className="text-gray-500 text-lg mt-5">
                Rejoignez +200 propriétaires. Gratuit pour commencer, sans carte bancaire.
              </p>
              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 mt-10 bg-[#FF6B35] hover:bg-[#e55a2b] text-white font-bold px-10 py-4 rounded-xl text-base transition-all hover:shadow-xl hover:shadow-[#FF6B35]/25 hover:-translate-y-0.5"
              >
                Créer mon compte gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-gray-300 text-xs mt-4">Gratuit · Sans engagement · Résiliation en 1 clic</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <Logo dark />
              <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                Le logiciel de gestion locative pour les propriétaires indépendants.
              </p>
              <p className="text-gray-300 text-xs mt-5">&copy; 2026 MyLocavio</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-5">Produit</h4>
              <ul className="space-y-3">
                {["Dashboard", "Mes biens", "Quittances", "Baux", "États des lieux"].map((l) => (
                  <li key={l}><a href="#" className="text-gray-400 text-sm hover:text-gray-900 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-5">Ressources</h4>
              <ul className="space-y-3">
                {[{ l: "Centre d'aide", h: "#" }, { l: "Blog", h: "#" }, { l: "Guide ALUR", h: "#" }, { l: "Contact", h: "/contact" }].map((i) => (
                  <li key={i.l}><a href={i.h} className="text-gray-400 text-sm hover:text-gray-900 transition-colors">{i.l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-5">Légal</h4>
              <ul className="space-y-3">
                {[{ l: "Mentions légales", h: "/mentions-legales" }, { l: "Politique de confidentialité", h: "/confidentialite" }, { l: "CGU", h: "/cgu" }].map((i) => (
                  <li key={i.l}><a href={i.h} className="text-gray-400 text-sm hover:text-gray-900 transition-colors">{i.l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8">
            <p className="text-gray-300 text-xs text-center">Fait avec soin pour les propriétaires français</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
