export default function Range(start = 0, stop = 1, step = 1) {
  // Manejar el caso de un solo parámetro: range(stop)
  if (typeof stop === 'undefined') {
    stop = start;
    start = 0;
  }

  // Verificar la dirección y los valores de inicio y fin
  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return []; // Retorna un array vacío si no hay valores que generar
  }

  const result = [];
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i);
  }

  return result;
}
