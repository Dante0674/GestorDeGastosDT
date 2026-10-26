import { ScrollView, Text, StyleSheet } from 'react-native';
import TarjetaGasto from './TarjetaGasto';

// Recibimos onEliminarGasto y onEditarGasto desde la pantalla principal
export default function ListaGastos({ gastos, onEliminarGasto, onEditarGasto }) {
  if (gastos.length === 0) {
    return (
      <Text style={styles.vacio}>
        Todavía no hay gastos registrados.
      </Text>
    );
  }

  return (
    <ScrollView>
      {gastos.map((gasto) => (
        <TarjetaGasto
          key={gasto.id}
          gasto={gasto}
          // Le pasamos la función para que la tarjeta pueda borrar y editar
          onEliminar={() => onEliminarGasto(gasto.id)}
          onEditar={() => onEditarGasto(gasto)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  vacio: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777777',
  },
});