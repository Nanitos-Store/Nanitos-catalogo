'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { trackEvento } from '@/lib/meta';

export default function Buscador() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [texto, setTexto] = useState(searchParams.get('q') ?? '');

  const buscar = (e: React.FormEvent) => {
    e.preventDefault();
    const q = texto.trim();
    if (q) trackEvento('Search', { search_string: q });
    router.push(q ? `/catalogo?q=${encodeURIComponent(q)}` : '/catalogo');
  };

  return (
    <form onSubmit={buscar} role="search" className="flex w-full">
      <input
        type="search"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Busca peluches, mochilas, Labubu…"
        aria-label="Buscar productos"
        className="w-full rounded-l-full border border-tinta/15 bg-white px-4 py-2 text-sm outline-none focus:border-celeste"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="rounded-r-full bg-celeste px-4 text-white hover:bg-celeste/90"
      >
        🔍
      </button>
    </form>
  );
}
