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
  onEditar,     // Función para guardar la edición
  modoEdicion,  // Booleano (true/false) para saber si estamos editando
  deshabilitado,
  onLimpiar,   // Función para limpiar el formulario
}) {
  return (
    <View style={styles.formulario}>
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor="#333333"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.input}
        placeholder="Monto"
        placeholderTextColor="#333333"
        value={monto}
        onChangeText={setMonto}
        keyboardType="decimal-pad"
      />

         
      {/* Desplegable de categorías con Picker */}
      <View style={styles.contenedorPicker}>
        <Picker
          selectedValue={categoria}
          onValueChange={(itemValue) => setCategoria(itemValue)}
          style={styles.picker}
          enabled={!deshabilitado} // <-- Un detalle del profe para que no se toque al guardar
        >
          {/* Agregamos esta opción como texto de ayuda (no seleccionable) */}
          <Picker.Item 
            label="Seleccionar categoría" 
            value="" 
            enabled={false} 
          />

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
      {/*Botón de limpiar */}
      {(descripcion.length > 0 || monto.length > 0 || categoria !== '') && !modoEdicion && (
        <Pressable onPress={onLimpiar} style={styles.botonLimpiar}>
          <Text style={styles.textoLimpiar}>Limpiar formulario</Text>
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
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 7,
    marginBottom: 10, // <-- Este margen es el que separa las cajas
    fontSize: 15,
  },
  boton: {
    backgroundColor: '#53745B',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5, // Un poquito de aire arriba del botón
  },
  botonModoEdicion: {
    backgroundColor: '#E67E22', // Color naranja
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  
  // SOLO ESTOS DOS ESTILOS DEL PICKER
  contenedorPicker: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginBottom: 6, // <-- El MISMO margen que los inputs para que queden parejos
    width: '100%',
  },
  picker: {
    height: 55, // <-- Altura similar a los inputs
    width: '100%',
    color: '#333333',
    paddingHorizontal: 0, 
    marginHorizontal: 0,
  },
    // Estilos para el botón de limpiar
  botonLimpiar: {
    marginTop: 15,
    alignItems: 'center',
  },
  textoLimpiar: {
    color: '#E74C3C', // Color rojo para que se note que borra
    fontSize: 14,
    fontWeight: '600',
  },
});