import {
  obtenerGastos,
  guardarGastos,
} from '../repositories/GastosRepository';

import {
  crearGasto,
  validarGasto,
} from '../models/Gasto';

export async function cargarGastos() {
  return await obtenerGastos();
}

export async function agregarGasto(gastosActuales, descripcion, monto, categoria) {
  const error = validarGasto(descripcion, monto, categoria);
  if (error) throw new Error(error);

  const nuevoGasto = crearGasto(descripcion, monto, categoria);
  const nuevosGastos = [...gastosActuales, nuevoGasto];

  await guardarGastos(nuevosGastos);
  return nuevosGastos;
}

export async function eliminarGasto(gastosActuales, idGasto) {
  const nuevosGastos = gastosActuales.filter((gasto) => gasto.id !== idGasto);
  await guardarGastos(nuevosGastos);
  return nuevosGastos;
}

// Función nueva para editar
export async function editarGasto(gastosActuales, idGasto, descripcion, monto, categoria) {
  const error = validarGasto(descripcion, monto, categoria);
  if (error) throw new Error(error);

  const nuevosGastos = gastosActuales.map((gasto) => {
    if (gasto.id === idGasto) {
      return { ...gasto, descripcion, monto: Number(monto), categoria };
    }
    return gasto;
  });

  await guardarGastos(nuevosGastos);
  return nuevosGastos;
}