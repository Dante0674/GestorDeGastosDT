// Importamos Pressable para poder crear los botones
import { View, Text, StyleSheet, Pressable } from 'react-native';

// Recibimos "onEliminar" y "onEditar" desde la lista
export default function TarjetaGasto({ gasto, onEliminar, onEditar }) {
  return (
    <View style={styles.tarjeta}>
      <View>
        <Text style={styles.descripcion}>
          {gasto.descripcion}
        </Text>

        <Text style={styles.categoria}>
          {gasto.categoria}
        </Text>
      </View>

      {/* Contenedor de la derecha: monto y botones */}
      <View style={styles.derecha}>
        <Text style={styles.monto}>
          ${gasto.monto.toLocaleString('es-AR')}
        </Text>
        
        {/* Botón de editar (lápiz) que ejecuta la función onEditar */}
        <Pressable onPress={onEditar} style={styles.botonAccion}>
          <Text style={{ fontSize: 16 }}>✏️</Text>
        </Pressable>

        {/* Botón de eliminar (tachito) que ejecuta la función onEliminar */}
        <Pressable onPress={onEliminar} style={styles.botonAccion}>
          <Text style={{ fontSize: 16 }}>🗑️</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descripcion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  categoria: {
    fontSize: 13,
    color: '#777777',
    marginTop: 5,
  },
  // Estilo para alinear el monto y los botones en la misma fila
  derecha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Espacio entre el monto y los botones
  },
  monto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#53745B',
  },
  // Estilo para los botones (les dimos un poquito de padding para que sea fácil tocar)
  botonAccion: {
    padding: 5,
  },
});