
// Importamos Pressable para poder crear el botón de eliminar
import { View, Text, StyleSheet, Pressable } from 'react-native';

// Recibimos "onEliminar" desde la lista
export default function TarjetaGasto({ gasto, onEliminar }) {
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

      {/* Envolvemos el monto y el botón en un View para que queden juntos a la derecha */}
      <View style={styles.derecha}>
        <Text style={styles.monto}>
          ${gasto.monto.toLocaleString('es-AR')}
        </Text>
        
        {/* Botón con el emoji de tachito que ejecuta la función de eliminar */}
        <Pressable onPress={onEliminar} style={styles.botonEliminar}>
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
  // Estilo para alinear el monto y el tachito en la misma fila
  derecha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Espacio entre el monto y el tachito
  },
  monto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#53745B',
  },
  // Un poco de espacio alrededor del tachito para que sea más fácil de tocar
  botonEliminar: {
    padding: 5,
  },
});