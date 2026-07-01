import Link from "next/link";
import Logo from "@/components/Logo";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <Logo dark />
        </div>
        <p className="text-[#2A9FD6] text-sm font-bold tracking-[0.2em] uppercase mb-3">Erreur 404</p>
        <h1 className="text-3xl font-black text-gray-900">Page introuvable</h1>
        <p className="text-gray-500 text-sm mt-3 leading-relaxed">
          La page que vous cherchez n&apos;existe pas ou a été déplacée. Vérifiez l&apos;adresse
          ou retournez à l&apos;accueil.
        </p>
        <div className="mt-8 flex gap-3 justify-center flex-wrap">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-bold px-6 py-3 rounded-xl transition-all"
          >
            <Home className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-6 py-3 rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Mon tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
