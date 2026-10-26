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

      {/* Botones para elegir la categoría */}
      <View style={styles.contenedorCategorias}>
        {['Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Otros'].map((cat) => (
          <Pressable
            key={cat}
            style={[
              styles.botonCategoria,
              categoria === cat && styles.botonCategoriaActivo
            ]}
            onPress={() => setCategoria(cat)}
          >
            <Text style={[
              styles.textoCategoria,
              categoria === cat && styles.textoCategoriaActivo
            ]}>
              {cat}
            </Text>
          </Pressable>
        ))}
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
    marginBottom: 8,
    marginTop: 5,
  },
  contenedorCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  botonCategoria: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  botonCategoriaActivo: {
    backgroundColor: '#53745B',
    borderColor: '#53745B',
  },
  textoCategoria: {
    color: '#555555',
    fontSize: 10,
  },
  textoCategoriaActivo: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});