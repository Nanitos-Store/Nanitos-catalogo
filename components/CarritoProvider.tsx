'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { ItemCarrito, Modalidad } from '@/lib/tipos';

const STORAGE_CARRITO = 'nanitos_carrito';

interface ContextoCarrito {
  items: ItemCarrito[];
  abierto: boolean;
  abrir: () => void;
  cerrar: () => void;
  agregar: (item: Omit<ItemCarrito, 'cantidad'>) => void;
  quitar: (productoId: string) => void;
  cambiarModalidad: (productoId: string, modalidad: Modalidad) => void;
  cambiarCantidad: (productoId: string, cantidad: number) => void;
  vaciar: () => void;
}

const Contexto = createContext<ContextoCarrito | null>(null);

export function useCarrito() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return ctx;
}

export default function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    try {
      const crudo = localStorage.getItem(STORAGE_CARRITO);
      if (crudo) setItems(JSON.parse(crudo));
    } catch {
      // localStorage puede no estar disponible
    }
    setHidratado(true);
  }, []);

  useEffect(() => {
    if (!hidratado) return;
    try {
      localStorage.setItem(STORAGE_CARRITO, JSON.stringify(items));
    } catch {
      // localStorage puede no estar disponible
    }
  }, [items, hidratado]);

  // Suma en segundo plano: NO abre la hoja del carrito para no interrumpir
  // la navegación. El contador del header refleja el cambio.
  const agregar = useCallback((item: Omit<ItemCarrito, 'cantidad'>) => {
    setItems((previos) => {
      const existente = previos.find((i) => i.productoId === item.productoId);
      if (existente) {
        return previos.map((i) =>
          i.productoId === item.productoId
            ? { ...i, cantidad: Math.min(99, i.cantidad + 1) }
            : i
        );
      }
      return [...previos, { ...item, cantidad: 1 }];
    });
  }, []);

  const quitar = useCallback((productoId: string) => {
    setItems((previos) => previos.filter((i) => i.productoId !== productoId));
  }, []);

  const cambiarModalidad = useCallback((productoId: string, modalidad: Modalidad) => {
    setItems((previos) =>
      previos.map((i) => (i.productoId === productoId ? { ...i, modalidad } : i))
    );
  }, []);

  const cambiarCantidad = useCallback((productoId: string, cantidad: number) => {
    setItems((previos) =>
      previos.map((i) =>
        i.productoId === productoId
          ? { ...i, cantidad: Math.max(1, Math.min(99, cantidad)) }
          : i
      )
    );
  }, []);

  const vaciar = useCallback(() => setItems([]), []);

  return (
    <Contexto.Provider
      value={{
        items,
        abierto,
        abrir: () => setAbierto(true),
        cerrar: () => setAbierto(false),
        agregar,
        quitar,
        cambiarModalidad,
        cambiarCantidad,
        vaciar,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}
