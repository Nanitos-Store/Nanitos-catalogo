'use client';

import { useState } from 'react';
import { exportarCsv } from '@/app/admin/acciones';

export default function BotonExportarCsv({ tabla }: { tabla: 'clientes' | 'pedidos' }) {
  const [exportando, setExportando] = useState(false);

  const exportar = async () => {
    setExportando(true);
    const csv = await exportarCsv(tabla);
    setExportando(false);
    if (!csv) return;
    const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nanitos-${tabla}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportar}
      disabled={exportando}
      className="rounded-full bg-verde px-5 py-2.5 font-bold text-white disabled:opacity-60"
    >
      {exportando ? 'Exportando…' : '⬇️ Exportar CSV'}
    </button>
  );
}
