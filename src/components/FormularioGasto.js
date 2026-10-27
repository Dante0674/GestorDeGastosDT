// Importamos Picker
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

// Agregamos onEditar y modoEdicion a las propiedades que recibe
export default function FormularioGasto({
  descripcion,
  setDescripcion,
  monto,
  setMonto,
  categoria,
  setCategoria,
  onAgregar,
  onEditar,     // <-- NUEVO: función para guardar la edición
  modoEdicion,  // <-- NUEVO: booleano (true/false) para saber si estamos editando
  deshabilitado,
}) {
  return (
    <View style={styles.formulario}>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.input}
        placeholder="Monto"
        value={monto}
        onChangeText={setMonto}
        keyboardType="decimal-pad"
      />

            {/* Título para las categorías */}
      <Text style={styles.tituloCategoria}>Categoría:</Text>

      {/* Desplegable de categorías con Picker */}
      <View style={styles.contenedorPicker}>
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Alimentación" value="Alimentación" />
          <Picker.Item label="Transporte" value="Transporte" />
          <Picker.Item label="Entretenimiento" value="Entretenimiento" />
          <Picker.Item label="Salud" value="Salud" />
          <Picker.Item label="Otros" value="Otros" />
        </Picker>
      </View>

      {/* Lógica del botón: Si estamos en modo edición, muestra "Guardar cambios", sino "Agregar gasto" */}
      {modoEdicion ? (
        <Pressable
          style={[
            styles.boton,
            styles.botonModoEdicion, // Estilo naranja para diferenciar
            deshabilitado && styles.botonDeshabilitado,
          ]}
          onPress={onEditar}
          disabled={deshabilitado}
        >
          <Text style={styles.textoBoton}>Guardar cambios</Text>
        </Pressable>
      ) : (
        <Pressable
          style={[
            styles.boton,
            deshabilitado && styles.botonDeshabilitado,
          ]}
          onPress={onAgregar}
          disabled={deshabilitado}
        >
          <Text style={styles.textoBoton}>Agregar gasto</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  formulario: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 7,
    marginBottom: 10,
    fontSize: 15,
  },
  boton: {
    backgroundColor: '#53745B',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  // Nuevo estilo para cuando el botón dice "Guardar cambios"
  botonModoEdicion: {
    backgroundColor: '#E67E22', // Color naranja
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tituloCategoria: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555555',
    marginBottom: 3,
    marginTop: 5,
  },
  contenedorCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
     contenedorPicker: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginBottom: 15,
    // Le quitamos el overflow: 'hidden' para que el texto no se corte
  },
  picker: {
    height: 55, // Un poquito más alto para que la letra respire
    width: '100%',
    color: '#333333',
  },
});