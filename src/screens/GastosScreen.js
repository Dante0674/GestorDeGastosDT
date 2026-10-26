import { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable, // <-- NUEVO: Necesario para el botón de cancelar edición
} from 'react-native';

// 1. Agregamos editarGasto a los imports
import {
  cargarGastos,
  agregarGasto,
  eliminarGasto,
  editarGasto, 
} from '../controllers/GastosController';

import FormularioGasto from '../components/FormularioGasto';
import ListaGastos from '../components/ListaGastos';

export default function GastosScreen() {
  const [gastos, setGastos] = useState([]);

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('Alimentación');

  // <-- NUEVO: Estado para guardar el ID del gasto que estamos editando
  const [gastoEnEdicion, setGastoEnEdicion] = useState(null);
  // Variable que nos dice si estamos editando o no
  const modoEdicion = gastoEnEdicion !== null;

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function iniciar() {
      try {
        const datos = await cargarGastos();
        setGastos(datos);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar los gastos.');
      } finally {
        setCargando(false);
      }
    }
    iniciar();
  }, []);

  // 2. Calculamos el total sumando los montos
  const totalGastado = gastos.reduce((acumulador, gasto) => acumulador + gasto.monto, 0);

  // <-- NUEVO: Función que limpia el formulario y sale del modo edición
  const limpiarFormulario = () => {
    setDescripcion('');
    setMonto('');
    setCategoria('Alimentación');
    setGastoEnEdicion(null); // Esto apaga el modo edición
  };

  const manejarAgregar = async () => {
    if (guardando || cargando) return;

    try {
      setGuardando(true);
      const nuevosGastos = await agregarGasto(gastos, descripcion, monto, categoria);
      setGastos(nuevosGastos);
      limpiarFormulario(); // Usamos la función nueva para limpiar
    } catch (error) {
      Alert.alert('No se pudo agregar el gasto', error.message || 'Ocurrió un error inesperado.');
    } finally {
      setGuardando(false);
    }
  };

  // <-- NUEVO: Cuando el usuario toca el lápiz, carga los datos al formulario
  const manejarEditar = (gasto) => {
    setGastoEnEdicion(gasto.id);
    setDescripcion(gasto.descripcion);
    setMonto(String(gasto.monto));
    setCategoria(gasto.categoria);
  };

  // <-- NUEVO: Guardar los cambios hechos en el formulario
  const manejarGuardarEdicion = async () => {
    if (guardando || cargando || gastoEnEdicion === null) return;

    try {
      setGuardando(true);
      const nuevosGastos = await editarGasto(gastos, gastoEnEdicion, descripcion, monto, categoria);
      setGastos(nuevosGastos);
      limpiarFormulario();
    } catch (error) {
      Alert.alert('No se pudieron guardar los cambios', error.message || 'Ocurrió un error inesperado.');
    } finally {
      setGuardando(false);
    }
  };

  // <-- MODIFICADO: Ahora te pregunta antes de borrar (como el profe)
  const manejarEliminar = (id) => {
    if (guardando || cargando) return;

    Alert.alert(
      'Eliminar gasto',
      '¿Estás seguro de que querés eliminar este gasto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setGuardando(true);
              const nuevosGastos = await eliminarGasto(gastos, id);
              setGastos(nuevosGastos);
              if (gastoEnEdicion === id) limpiarFormulario(); // Si borramos el que estábamos editando, limpiamos todo
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el gasto.');
            } finally {
              setGuardando(false);
            }
          },
        },
      ]
    );
  };

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#53745B" />
        <Text style={styles.textoCargando}>Cargando gastos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis gastos</Text>
      <Text style={styles.subtitulo}>Registro de gastos personales</Text>

      {/* 4. Acá mostramos el cartel verde con el Total */}
      <View style={styles.contenedorTotal}>
        <Text style={styles.textoTotal}>Total gastado:</Text>
        <Text style={styles.montoTotal}>${totalGastado.toLocaleString('es-AR')}</Text>
      </View>

      <FormularioGasto
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        monto={monto}
        setMonto={setMonto}
        categoria={categoria}
        setCategoria={setCategoria}
        onAgregar={manejarAgregar}
        // <-- NUEVO: Le pasamos las funciones y el estado de edición al formulario
        onEditar={manejarGuardarEdicion}
        modoEdicion={modoEdicion}
        deshabilitado={guardando}
      />

      {/* <-- NUEVO: Botón de cancelar edición (solo aparece si estamos editando) */}
      {modoEdicion && (
        <Pressable style={styles.botonCancelar} onPress={limpiarFormulario} disabled={guardando}>
          <Text style={styles.textoCancelar}>Cancelar edición</Text>
        </Pressable>
      )}

      {/* 5. Le pasamos las funciones a la lista (Nota: les agregamos "Gasto" al final) */}
      <ListaGastos 
        gastos={gastos} 
        onEliminarGasto={manejarEliminar} 
        onEditarGasto={manejarEditar} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EF',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitulo: {
    fontSize: 15,
    color: '#777777',
    marginTop: 5,
    marginBottom: 20,
  },
  contenedorTotal: {
    backgroundColor: '#53745B',
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  textoTotal: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  montoTotal: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  // <-- NUEVO: Estilos para el botón de cancelar edición
  botonCancelar: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  textoCancelar: {
    color: '#777777',
    fontWeight: '600',
  },
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F4EF',
  },
  textoCargando: {
    marginTop: 12,
    color: '#777777',
  },
});