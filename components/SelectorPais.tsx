'use client';

import { useEffect, useState } from 'react';
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

/** Barra de primera visita: "¿Desde dónde nos visitas?" */
export function BarraPais({ paisActual }: { paisActual: Pais | null }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

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
    } else {
      setVisible(true);
    }
  }, [paisActual, router]);

  if (!visible || paisActual) return null;

  const elegir = (pais: Pais) => {
    guardarPais(pais);
    setVisible(false);
    router.refresh();
  };

  return (
    <div className="bg-amarillo/95 text-tinta">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-4 py-2 text-sm font-semibold">
        <span>¿Desde dónde nos visitas?</span>
        <button
          onClick={() => elegir('BO')}
          className="rounded-full bg-white px-4 py-1.5 shadow-sm hover:bg-celeste hover:text-white"
        >
          🇧🇴 Bolivia
        </button>
        <button
          onClick={() => elegir('AR')}
          className="rounded-full bg-white px-4 py-1.5 shadow-sm hover:bg-celeste hover:text-white"
        >
          🇦🇷 Argentina
        </button>
      </div>
    </div>
  );
}

/** Conmutador compacto siempre accesible en el header. */
export function ConmutadorPais({ paisActual }: { paisActual: Pais | null }) {
  const router = useRouter();
  const cambiar = (pais: Pais) => {
    guardarPais(pais);
    router.refresh();
  };
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/80 p-1 text-xs font-bold shadow-inner">
      {(['BO', 'AR'] as Pais[]).map((p) => (
        <button
          key={p}
          onClick={() => cambiar(p)}
          aria-pressed={paisActual === p}
          className={`rounded-full px-2 py-1 ${
            paisActual === p ? 'bg-celeste text-white' : 'text-tinta/70 hover:bg-celeste/10'
          }`}
        >
          {p === 'BO' ? '🇧🇴 BO' : '🇦🇷 AR'}
        </button>
      ))}
    </div>
  );
}
