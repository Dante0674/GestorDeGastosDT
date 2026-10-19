import { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

// 1. Importamos eliminarGasto junto con los otros métodos
import {
  cargarGastos,
  agregarGasto,
  eliminarGasto,
} from '../controllers/GastosController';

import FormularioGasto from '../components/FormularioGasto';
import ListaGastos from '../components/ListaGastos';

export default function GastosScreen() {
  const [gastos, setGastos] = useState([]);

  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function iniciar() {
      try {
        const datos = await cargarGastos();
        setGastos(datos);
      } catch (error) {
        Alert.alert(
          'Error',
          'No se pudieron cargar los gastos.'
        );
      } finally {
        setCargando(false);
      }
    }

    iniciar();
  }, []);

  // 2. Calculamos el total sumando los montos
  const totalGastado = gastos.reduce((acumulador, gasto) => acumulador + gasto.monto, 0);

  const manejarAgregar = async () => {
    if (guardando || cargando) {
      return;
    }

    try {
      setGuardando(true);

      const nuevosGastos = await agregarGasto(
        gastos,
        descripcion,
        monto,
        categoria
      );

      setGastos(nuevosGastos);

      setDescripcion('');
      setMonto('');
      setCategoria('');
    } catch (error) {
      Alert.alert(
        'No se pudo agregar el gasto',
        error.message || 'Ocurrió un error inesperado.'
      );
    } finally {
      setGuardando(false);
    }
  };

  // 3. Función para manejar la eliminación
  const manejarEliminar = async (id) => {
    try {
      const nuevosGastos = await eliminarGasto(gastos, id);
      setGastos(nuevosGastos);
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el gasto.');
    }
  };

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color="#53745B" />
        <Text style={styles.textoCargando}>
          Cargando gastos...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis gastos</Text>

      <Text style={styles.subtitulo}>
        Registro de gastos personales
      </Text>

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
        deshabilitado={guardando}
      />

      {/* 5. Le pasamos la función manejarEliminar a la lista */}
      <ListaGastos gastos={gastos} onEliminar={manejarEliminar} />
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
  // Estilos para el recuadro del Total
  contenedorTotal: {
    backgroundColor: '#53745B',
    padding: 16,
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