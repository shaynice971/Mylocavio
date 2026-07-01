"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "mylocavio_cookie_notice_ack";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[100] border-t border-gray-200 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-gray-600 flex-1">
          MyLocavio n&apos;utilise que des cookies strictement nécessaires au fonctionnement du
          service (authentification, sécurité de session). Aucun cookie publicitaire ou de mesure
          d&apos;audience tiers n&apos;est déposé. En savoir plus dans notre{" "}
          <Link href="/confidentialite" className="text-[#1c7aa8] hover:text-[#238bbf] font-semibold underline">
            politique de confidentialité
          </Link>
          .
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 bg-[#2A9FD6] hover:bg-[#238bbf] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          J&apos;ai compris
        </button>
      </div>
    </div>
  );
}
