import { COPY_LOGISTICA } from '@/lib/pais';
import type { Pais } from '@/lib/tipos';

/**
 * Bloque de logística por país. REGLA DURA: la web jamás afirma que Ñañitos
 * envía a Argentina; el visitante argentino ve la condición de retiro/pasero.
 */
export default function BloqueLogistica({
  pais,
  compacto = false,
}: {
  pais: Pais | null;
  compacto?: boolean;
}) {
  const paisEfectivo: Pais = pais ?? 'BO';
  return (
    <div
      className={`rounded-2xl border-l-4 ${
        paisEfectivo === 'AR' ? 'border-amarillo bg-amarillo/10' : 'border-verde bg-verde/10'
      } ${compacto ? 'p-3 text-sm' : 'p-4'}`}
    >
      <p className="mb-1 font-bold">
        {paisEfectivo === 'AR' ? '🇦🇷 Si nos visitas desde Argentina' : '🇧🇴 Envíos en Bolivia'}
      </p>
      <p className={compacto ? 'text-sm' : ''}>{COPY_LOGISTICA[paisEfectivo]}</p>
    </div>
  );
}
