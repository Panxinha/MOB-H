export function obtenerSaludoPorHora() {
  const h = new Date().getHours();
  if (h < 12) return '¡Buenos días';
  if (h < 19) return '¡Buenas tardes';
  return '¡Buenas noches';
}

export function normalizarCategoria(texto) {
  if (!texto) return 'General';
  const t = texto.trim().toLowerCase();
  if (t.includes('pierna') || t.includes('glúte')) return 'Piernas y Glúteos';
  if (t.includes('superior') || t.includes('pecho') || t.includes('espalda') || t.includes('brazo')) return 'Tren superior';
  if (t.includes('core') || t.includes('abd') || t.includes('cardio')) return 'Core y Cardio';
  if (t.includes('full')) return 'Full Body';
  return 'General';
}