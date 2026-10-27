// Importamos Pressable para poder crear los botones
import { View, Text, StyleSheet, Pressable } from 'react-native';

// Recibimos "onEliminar" y "onEditar" desde la lista
export default function TarjetaGasto({ gasto, onEliminar, onEditar }) {
  return (
    <View style={styles.tarjeta}>
      
      {/* Lado izquierdo: Toda la información del gasto */}
      <View style={styles.infoIzquierda}>
        <Text style={styles.descripcion}>
          {gasto.descripcion}
        </Text>

        <Text style={styles.categoria}>
          {gasto.categoria}
        </Text>

        <Text style={styles.monto}>
          ${gasto.monto.toLocaleString('es-AR')}
        </Text>
      </View>

      {/* Lado derecho: Los botones uno arriba del otro */}
      <View style={styles.acciones}>
        
        {/* Botón de editar (lápiz) */}
        <Pressable onPress={onEditar} style={styles.botonAccion}>
          <Text style={{ fontSize: 16 }}>✏️</Text>
        </Pressable>

        {/* Botón de eliminar (tachito) */}
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
    marginBottom: 8,
    flexDirection: 'row', // Pone la info y los botones en la misma fila
    justifyContent: 'space-between', // Separa la info de los botones
    alignItems: 'center',
    marginHorizontal: 5,
  },
  
  // Estilo para el contenedor de la izquierda
  infoIzquierda: {
    flex: 1, // Hace que ocupe todo el espacio disponible
    marginRight: 15, // Le da un respiro para no chocar con los botones
  },
  descripcion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
    categoria: {
    fontSize: 16, // <-- Mismo tamaño que la descripción (antes era 13)
    fontWeight: '600', // <-- Misma negrita que la descripción
    color: '#333333', // <-- Le dejamos el gris para que no compita con el título, o si querés lo cambias a '#333333'
    marginTop: 5,
  },
  monto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#53745B',
    marginTop: 6,
  },

  // Estilo para el contenedor de los botones de la derecha
  acciones: {
    alignItems: 'center', // Centra los botones
    gap: 10, // Separación vertical entre el lápiz y el tachito
  },
  
  // Estilo para cada botón
  botonAccion: {
    padding: 5,
  },
});