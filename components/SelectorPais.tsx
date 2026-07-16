'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { COOKIE_PAIS, esPais } from '@/lib/pais';
import type { Pais } from '@/lib/tipos';

function guardarPais(pais: Pais) {
  try {
    localStorage.setItem(COOKIE_PAIS, pais);
  } catch {
    // localStorage puede no estar disponible
  }
  document.cookie = `${COOKIE_PAIS}=${pais}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}

/**
 * Conmutador de país BO/AR del header. Absorbe la lógica de primera visita:
 * si no hay cookie pero sí localStorage, sincroniza y refresca.
 * Sin país elegido, ninguna bandera queda activa (la logística asume BO).
 */
export function ConmutadorPais({ paisActual }: { paisActual: Pais | null }) {
  const router = useRouter();

  useEffect(() => {
    if (paisActual) return;
    const guardado = (() => {
      try {
        return localStorage.getItem(COOKIE_PAIS);
      } catch {
        return null;
      }
    })();
    if (esPais(guardado)) {
      guardarPais(guardado);
      router.refresh();
    }
  }, [paisActual, router]);

  const cambiar = (pais: Pais) => {
    guardarPais(pais);
    router.refresh();
  };

  return (
    <div
      className="flex items-center gap-1 rounded-full bg-white/80 p-1 text-xs font-bold shadow-inner ring-1 ring-tinta/10"
      role="group"
      aria-label="¿Desde dónde nos visitas?"
    >
      {(['BO', 'AR'] as Pais[]).map((p) => (
        <button
          key={p}
          onClick={() => cambiar(p)}
          aria-pressed={paisActual === p}
          title={p === 'BO' ? 'Nos visitas desde Bolivia' : 'Nos visitas desde Argentina'}
          className={`rounded-full px-2 py-1 transition ${
            paisActual === p
              ? 'bg-celeste text-white'
              : paisActual
                ? 'text-tinta/50 hover:bg-celeste/10'
                : 'animate-pulse text-tinta/80 hover:bg-celeste/10'
          }`}
        >
          {p === 'BO' ? '🇧🇴 BO' : '🇦🇷 AR'}
        </button>
      ))}
    </div>
  );
}
