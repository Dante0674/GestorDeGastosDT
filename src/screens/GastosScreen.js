import { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable, // Necesario para el botón de cancelar edición
  Modal,      // Para la ventanita de la clave
  TextInput,  // Para escribir la clave
} from 'react-native';

// Agregamos editarGasto a los imports
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
  const [categoria, setCategoria] = useState('');

  // Estado para guardar el ID del gasto que estamos editando
  const [gastoEnEdicion, setGastoEnEdicion] = useState(null);
  // Variable que nos dice si estamos editando o no
  const modoEdicion = gastoEnEdicion !== null;

  // Estados para manejar la clave secreta al eliminar
  const [modalVisible, setModalVisible] = useState(false);
  const [idParaEliminar, setIdParaEliminar] = useState(null);
  const [claveIngresada, setClaveIngresada] = useState('');
 
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

  // Calculamos el total sumando los montos
  const totalGastado = gastos.reduce((acumulador, gasto) => acumulador + gasto.monto, 0);

  // Cantidad total de gastos
  const cantidadGastos = gastos.length;

  // Buscamos el Gasto más alto
  const gastoMasAlto = gastos.length > 0 
    ? gastos.reduce((max, gasto) => (gasto.monto > max.monto ? gasto : max), gastos[0]) 
    : null;

  // Función que limpia el formulario y sale del modo edición
  const limpiarFormulario = () => {
    setDescripcion('');
    setMonto('');
    setCategoria('');
    setGastoEnEdicion(null); // Esto apaga el modo edición
  };

  const manejarAgregar = async () => {
    if (guardando || cargando) return;

    try {
      setGuardando(true);
      const nuevosGastos = await agregarGasto(gastos, descripcion, monto, categoria);
      setGastos(nuevosGastos);
      limpiarFormulario(); // Usamos la función para limpiar
    } catch (error) {
      Alert.alert('No se pudo agregar el gasto', error.message || 'Ocurrió un error inesperado.');
    } finally {
      setGuardando(false);
    }
  };

  // Cuando el usuario toca el lápiz, carga los datos al formulario
  const manejarEditar = (gasto) => {
    setGastoEnEdicion(gasto.id);
    setDescripcion(gasto.descripcion);
    setMonto(String(gasto.monto));
    setCategoria(gasto.categoria);
  };

  // Guardar los cambios hechos en el formulario
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

  // Abre la ventanita Modal en lugar del Alert normal
  const manejarEliminar = (id) => {
    if (guardando || cargando) return;
    setIdParaEliminar(id);
    setClaveIngresada('');
    setModalVisible(true);
  };

  // Verifica la clave y elimina el gasto
  const confirmarEliminacion = async () => {
    // Validamos la clave secreta
    if (claveIngresada !== '1234') {
      Alert.alert('Código incorrecto', 'La clave de seguridad es 1234.');
      return;
    }

    try {
      setGuardando(true);
      const nuevosGastos = await eliminarGasto(gastos, idParaEliminar);
      setGastos(nuevosGastos);
      if (gastoEnEdicion === idParaEliminar) limpiarFormulario(); // Si borramos el que estábamos editando, limpiamos todo
      setModalVisible(false); // Cerramos la ventanita
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el gasto.');
    } finally {
      setGuardando(false);
    }
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

      {/* Acá mostramos el cartel verde con el Total */}
      <View style={styles.contenedorTotal}>
        <Text style={styles.textoTotal}>Total gastado:</Text>
        <Text style={styles.montoTotal}>${totalGastado.toLocaleString('es-AR')}</Text>
      </View>

      {/* Mostramos Cartel con cantidad y gasto más alto */}
      <View style={styles.contenedorResumen}>
        <Text style={styles.textoResumen}>
          📊 Gastos registrados: <Text style={styles.textoNegrita}>{cantidadGastos}</Text>
        </Text>
        {gastoMasAlto && (
          <Text style={styles.textoResumen}>
            🏆 Gasto más alto: <Text style={styles.textoNegrita}>{gastoMasAlto.descripcion} (${gastoMasAlto.monto.toLocaleString('es-AR')})</Text>
          </Text>
        )}
      </View>

      <FormularioGasto
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        monto={monto}
        setMonto={setMonto}
        categoria={categoria}
        setCategoria={setCategoria}
        onAgregar={manejarAgregar}
        // Le pasamos las funciones y el estado de edición al formulario
        onEditar={manejarGuardarEdicion}
        modoEdicion={modoEdicion}
        deshabilitado={guardando}
        onLimpiar={limpiarFormulario}
      />

      {/* Botón de cancelar edición que solo aparece si estamos editando */}
      {modoEdicion && (
        <Pressable style={styles.botonCancelar} onPress={limpiarFormulario} disabled={guardando}>
          <Text style={styles.textoCancelar}>Cancelar edición</Text>
        </Pressable>
      )}

      {/* Le pasamos las funciones a la lista y le agregamos "Gasto" al final */}
      <ListaGastos 
        gastos={gastos} 
        onEliminarGasto={manejarEliminar} 
        onEditarGasto={manejarEditar} 
      />

      {/* VENTANA EMERGENTE PARA LA CLAVE SECRETA */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Código de seguridad</Text>
            <Text style={styles.modalTexto}>Ingresá la clave para eliminar este gasto:</Text>
            
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              secureTextEntry={true} // Para que aparezcan puntitos en vez de números
              value={claveIngresada}
              onChangeText={setClaveIngresada}
              placeholder="****"
              maxLength={4}
            />

            <View style={styles.modalBotones}>
              <Pressable
                style={[styles.modalBoton, styles.botonCancelarModal]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoBotonModal}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.modalBoton, styles.botonEliminarModal]}
                onPress={confirmarEliminacion}
              >
                <Text style={styles.textoBotonModal}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EF',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitulo: {
    fontSize: 15,
    color: '#777777',
    marginTop: 5,
    marginBottom: 5,
  },
  contenedorTotal: {
    backgroundColor: '#53745B',
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
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
  // Estilos para el botón de cancelar edición
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

  // ESTILOS DEL MODAL
  modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo oscuro semitransparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContenido: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  modalTexto: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 5,
  },
  modalBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalBoton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonCancelarModal: {
    backgroundColor: '#95a5a6', // Gris
  },
  botonEliminarModal: {
    backgroundColor: '#E74C3C', // Rojo
  },
  textoBotonModal: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  // Estilos para el resumen
  contenedorResumen: {
    backgroundColor: '#E7EFE8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
    gap: 4,
  },
  textoResumen: {
    fontSize: 11,
    color: '#333333',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textoNegrita: {
    fontWeight: 'bold',
    color: '#53745B',
  },
});