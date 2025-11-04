import React, { createContext, useMemo, useState } from 'react';

export const ContextoTema = createContext();

export function ProveedorTema({ children }) {
  const [oscuro, setOscuro] = useState(false);

  const paleta = useMemo(() => ({
    fondo: oscuro ? '#111' : '#fff',
    tarjeta: oscuro ? '#1f1f1f' : '#eee',
    texto: oscuro ? '#fff' : '#000',
    borde: oscuro ? '#555' : '#ccc',
    placeholder: oscuro ? '#aaa' : '#555',
    primario: oscuro ? '#8ab4ff' : '#2563eb',
    peligro: '#ff5b5b',
  }), [oscuro]);

  return (
    <ContextoTema.Provider value={{ oscuro, setOscuro, paleta }}>
      {children}
    </ContextoTema.Provider>
  );
}
