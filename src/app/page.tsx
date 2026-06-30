import Link from "next/link";
import Logo from "@/components/Logo";
import IconDocument from "@/components/icons/IconDocument";
import IconBell from "@/components/icons/IconBell";
import IconChart from "@/components/icons/IconChart";
import IconClipboard from "@/components/icons/IconClipboard";
import IconShield from "@/components/icons/IconShield";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

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
    icon: <IconDocument className="w-5 h-5 text-[#2A9FD6]" />,
    title: "Quittances PDF automatiques",
    desc: "Générées chaque mois en un clic, conformes au décret du 26 août 1987. Envoyez-les par email directement.",
  },
  {
    icon: <IconDocument className="w-5 h-5 text-[#2A9FD6]" />,
    title: "Baux réglementaires",
    desc: "Bail vide, meublé, mobilité. Tous mis à jour selon la loi ALUR et prêts à être signés.",
  },
  {
    icon: <IconBell className="w-5 h-5 text-[#2A9FD6]" />,
    title: "Relances loyers impayés",
    desc: "Suivez les retards en temps réel et envoyez des relances professionnelles en un clic.",
  },
  {
    icon: <IconChart className="w-5 h-5 text-[#2A9FD6]" />,
    title: "Révision IRL annuelle",
    desc: "Calculez automatiquement le nouveau loyer selon l'Indice de Référence des Loyers INSEE.",
  },
  {
    icon: <IconClipboard className="w-5 h-5 text-[#2A9FD6]" />,
    title: "États des lieux guidés",
    desc: "Créez des états des lieux d'entrée et de sortie complets, pièce par pièce, PDF inclus.",
  },
  {
    icon: <IconShield className="w-5 h-5 text-[#2A9FD6]" />,
    title: "Conformité RGPD & sécurité",
    desc: "Données chiffrées et hébergées en France. Accès sécurisé, sauvegarde automatique quotidienne.",
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
    desc: "Vos données vous appartiennent. Exportez ou supprimez à tout moment.",
  },
  {
    title: "Hébergement France",
    desc: "Données stockées sur des serveurs français certifiés ISO 27001",
  },
  {
    title: "Paiement sécurisé",
    desc: "Transactions traitées par Stripe, leader mondial du paiement en ligne",
  },
];

const avatarInitials = ["MD", "TR", "SM", "JL", "AB"];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] antialiased">

      {/* ─── NAVBAR ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#fonctionnalites" className="hover:text-[#1a1a1a] transition-colors">Fonctionnalités</a>
            <a href="#tarifs" className="hover:text-[#1a1a1a] transition-colors">Tarifs</a>
            <a href="#faq" className="hover:text-[#1a1a1a] transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/connexion" className="hidden md:inline text-sm font-medium text-gray-600 hover:text-[#1a1a1a] transition-colors">
              Se connecter
            </Link>
            <Link href="/inscription" className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors">
              Essayer gratuitement
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(42,159,214,0.08),transparent)]" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Badge variant="outline" className="border-[#2A9FD6]/30 bg-[#2A9FD6]/5 text-[#2A9FD6] text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            Le logiciel de gestion locative pour les propriétaires indépendants
          </Badge>

          <h1 className="text-5xl md:text-[64px] font-bold leading-[1.1] tracking-tight text-[#1a1a1a] mt-4">
            Gérez vos locations{" "}
            <span className="text-[#2A9FD6]">sans stress,<br />sans agence.</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mt-6 leading-relaxed">
            MyLocavio guide les primo-bailleurs pas à pas : quittances PDF, baux conformes ALUR,
            relances automatiques. Tout ce qu&apos;il faut pour louer sereinement dès le premier logement.
          </p>

          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <Link
              href="/inscription"
              className="inline-flex items-center justify-center bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-xl px-8 py-4 text-base font-semibold shadow-lg shadow-orange-100 transition-all hover:-translate-y-0.5"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center justify-center border border-gray-200 text-gray-600 hover:border-[#2A9FD6] hover:text-[#2A9FD6] rounded-xl px-8 py-4 text-base font-medium transition-colors"
            >
              Se connecter
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap gap-6 justify-center text-sm text-gray-400">
            {[
              "Données hébergées en France",
              "Conforme loi ALUR",
              "Gratuit sans carte bancaire",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2A9FD6]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAR ───────────────────────────────────── */}
      <div className="bg-[#F7F9FC] border-y border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex -space-x-2.5">
            {avatarInitials.map((i) => (
              <div key={i} className="w-9 h-9 rounded-full bg-[#2A9FD6] text-white font-semibold text-xs flex items-center justify-center ring-2 ring-white">
                {i}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Rejoignez <span className="font-semibold text-[#1a1a1a]">+200 propriétaires</span> qui ont simplifié leur gestion locative
          </p>
        </div>
      </div>

      {/* ─── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="fonctionnalites" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-[#2A9FD6] text-xs font-semibold tracking-widest uppercase">Simple par conception</p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mt-3">Opérationnel en moins de 5 minutes</h2>
            <p className="text-gray-500 mt-4">Pas de formation. Pas de manuel. MyLocavio vous guide à chaque étape.</p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line desktop */}
            <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-[#2A9FD6]/20 via-[#2A9FD6]/40 to-[#2A9FD6]/20" />
            {[
              { n: "01", title: "Créez votre compte", desc: "Inscription en 2 minutes, aucune information bancaire requise. Commencez immédiatement." },
              { n: "02", title: "Ajoutez vos biens et locataires", desc: "Renseignez votre logement et votre locataire en quelques champs. MyLocavio pré-remplit ce qu'il peut." },
              { n: "03", title: "Gérez au quotidien", desc: "Quittances générées automatiquement, baux prêts à signer, relances en un clic. Votre temps retrouvé." },
            ].map((step) => (
              <div key={step.n} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-[#2A9FD6]/8 border border-[#2A9FD6]/15 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-black text-[#2A9FD6]">{step.n}</span>
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mt-5">{step.title}</h3>
                <p className="text-gray-500 mt-2 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES BENTO GRID ────────────────────────────────── */}
      <section className="py-28 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-[#2A9FD6] text-xs font-semibold tracking-widest uppercase">Fonctionnalités</p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mt-3">
              Tout ce qu&apos;un bailleur indépendant doit avoir
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Card
                key={f.title}
                className={`border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 bg-[#2A9FD6]/10 rounded-xl flex items-center justify-center mb-1">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a] text-base">{f.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ────────────────────────────────────────────── */}
      <section id="tarifs" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <p className="text-[#2A9FD6] text-xs font-semibold tracking-widest uppercase">Tarification</p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mt-3">Des tarifs honnêtes, sans surprise</h2>
            <p className="text-gray-500 mt-4">Commencez gratuitement, évoluez selon vos besoins. Résiliez quand vous voulez.</p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-4">
                <h3 className="text-lg font-bold text-[#1a1a1a]">Starter</h3>
                <p className="text-sm text-gray-500">Pour découvrir MyLocavio</p>
                <div className="pt-2">
                  <span className="text-5xl font-black text-[#1a1a1a]">0</span>
                  <span className="text-gray-400 ml-1.5 text-sm">€/mois</span>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-8">
                  {starterFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/inscription" className="block text-center border-2 border-gray-200 text-gray-600 hover:border-[#2A9FD6] hover:text-[#2A9FD6] transition-colors w-full py-3 rounded-xl font-medium text-sm">
                  Commencer gratuitement
                </Link>
              </CardContent>
            </Card>

            {/* Pro — highlighted */}
            <div className="bg-[#1a1a1a] rounded-2xl p-6 relative flex flex-col shadow-xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full border-0">
                  Le plus populaire
                </Badge>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">Pro</h3>
                <p className="text-sm text-gray-400 mt-0.5">Pour les propriétaires actifs</p>
                <div className="mt-4">
                  <span className="text-5xl font-black text-white">9</span>
                  <span className="text-gray-400 ml-1.5 text-sm">€/mois</span>
                </div>
              </div>
              <Separator className="bg-white/10 mb-6" />
              <ul className="space-y-3 flex-1">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/inscription" className="mt-8 block text-center bg-[#FF6B35] hover:bg-[#e55a2b] text-white w-full py-3 rounded-xl font-semibold text-sm transition-colors">
                Choisir Pro
              </Link>
            </div>

            {/* Expert */}
            <Card className="border border-gray-100 shadow-sm">
              <CardHeader className="pb-4">
                <h3 className="text-lg font-bold text-[#1a1a1a]">Expert</h3>
                <p className="text-sm text-gray-500">Pour les multi-propriétaires</p>
                <div className="pt-2">
                  <span className="text-5xl font-black text-[#1a1a1a]">19</span>
                  <span className="text-gray-400 ml-1.5 text-sm">€/mois</span>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <ul className="space-y-3 mb-8">
                  {expertFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/inscription" className="block text-center border-2 border-gray-200 text-gray-700 hover:border-[#2A9FD6] hover:text-[#2A9FD6] transition-colors w-full py-3 rounded-xl font-medium text-sm">
                  Choisir Expert
                </Link>
              </CardContent>
            </Card>
          </div>

          <p className="text-sm text-gray-400 text-center mt-6">
            Tous les plans incluent 30 jours d&apos;essai gratuit. Paiement sécurisé par Stripe.
          </p>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────────── */}
      <section className="py-28 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#2A9FD6] text-xs font-semibold tracking-widest uppercase">Témoignages</p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mt-3">Ils ont simplifié leur gestion locative</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                <CardContent className="pt-6">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 leading-relaxed text-sm italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2A9FD6] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {t.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a1a1a] text-sm">{t.name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ACCORDION ──────────────────────────────────────── */}
      <section id="faq" className="py-28 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[#2A9FD6] text-xs font-semibold tracking-widest uppercase">FAQ</p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mt-3">Questions fréquentes</h2>
            <p className="text-gray-500 mt-4">Tout ce que vous devez savoir avant de commencer.</p>
          </div>

          <div className="space-y-2">
            {faqItems.map((item, idx) => (
              <details
                key={idx}
                className="group border border-gray-100 rounded-xl shadow-sm open:border-[#2A9FD6]/30 open:bg-[#2A9FD6]/[0.02] transition-colors"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-semibold text-[#1a1a1a] text-sm">
                  {item.q}
                  <svg className="w-4 h-4 text-gray-400 shrink-0 ml-3 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-gray-500 text-sm leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECURITY ───────────────────────────────────────────── */}
      <section className="py-20 bg-[#F7F9FC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a1a1a]">Conformité et sécurité au cœur de MyLocavio</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {securityItems.map((item) => (
              <div key={item.title} className="text-center bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-11 h-11 bg-[#2A9FD6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <IconShield className="w-5 h-5 text-[#2A9FD6]" />
                </div>
                <h3 className="font-semibold text-[#1a1a1a] text-sm">{item.title}</h3>
                <p className="text-gray-500 text-xs mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────── */}
      <section className="py-28 bg-[#2A9FD6] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Commencez à gérer vos locations sereinement
          </h2>
          <p className="text-white/80 text-lg mt-4">
            Rejoignez +200 propriétaires qui font confiance à MyLocavio. Gratuit pour commencer, sans carte bancaire.
          </p>
          <Link
            href="/inscription"
            className="mt-10 inline-flex items-center justify-center bg-white text-[#2A9FD6] font-bold px-10 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all hover:-translate-y-0.5 shadow-xl shadow-black/10"
          >
            Créer mon compte gratuit
          </Link>
          <p className="text-white/60 text-sm mt-4">Gratuit · Sans engagement · Résiliation en 1 clic</p>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-[#111] text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <Logo />
              <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                Le logiciel de gestion locative pour les propriétaires indépendants.
              </p>
              <p className="text-gray-600 text-sm mt-4">&copy; 2026 MyLocavio</p>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-5">Produit</h4>
              <ul className="space-y-3">
                {["Dashboard", "Mes biens", "Quittances", "Baux", "États des lieux"].map((l) => (
                  <li key={l}><a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-5">Ressources</h4>
              <ul className="space-y-3">
                {[{ l: "Centre d'aide", h: "#" }, { l: "Blog", h: "#" }, { l: "Guide ALUR", h: "#" }, { l: "Contact", h: "#" }].map((i) => (
                  <li key={i.l}><a href={i.h} className="text-gray-400 text-sm hover:text-white transition-colors">{i.l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm mb-5">Légal</h4>
              <ul className="space-y-3">
                {[{ l: "Mentions légales", h: "#" }, { l: "Politique de confidentialité", h: "#" }, { l: "CGU", h: "#" }].map((i) => (
                  <li key={i.l}><a href={i.h} className="text-gray-400 text-sm hover:text-white transition-colors">{i.l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <Separator className="bg-white/5 mt-12 mb-8" />
          <p className="text-gray-600 text-sm text-center">Fait avec soin pour les propriétaires français</p>
        </div>
      </footer>
    </div>
  );
}
