import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TimeSlotGrid({
  horarios,
  horariosOcupados,
  horarioSelecionado,
  onSelectHorario,
}) {
  return (
    <View style={styles.grid}>
      {horarios.map((hora) => {
        const ocupado = horariosOcupados.includes(hora);
        const selecionado = horarioSelecionado === hora;

        return (
          <TouchableOpacity
            key={hora}
            disabled={ocupado}
            onPress={() => onSelectHorario(hora)}
            style={[
              styles.slot,
              ocupado && styles.slotOcupado,
              selecionado && styles.slotSelecionado,
            ]}
          >
            <Text
              style={[
                styles.textoHora,
                ocupado && styles.textoOcupado,
                selecionado && styles.textoSelecionado,
              ]}
            >
              {hora}
            </Text>
            <Text style={styles.statusTexto}>
              {ocupado ? "Ocupado" : selecionado ? "Escolhido" : "Livre"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  slot: {
    width: "31%",
    backgroundColor: "#18181B",
    borderWidth: 1.5,
    borderColor: "#27272A",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  slotOcupado: {
    backgroundColor: "#121214",
    borderColor: "#1F1F23",
    opacity: 0.55,
  },
  slotSelecionado: {
    backgroundColor: "#D97706",
    borderColor: "#F59E0B",
  },
  textoHora: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#F4F4F5",
  },
  textoOcupado: {
    color: "#71717A",
    textDecorationLine: "line-through",
  },
  textoSelecionado: {
    color: "#FFFFFF",
  },
  statusTexto: {
    fontSize: 11,
    color: "#A1A1AA",
    marginTop: 2,
  },
});
