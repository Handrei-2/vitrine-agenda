import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Header({ abaAtiva, setAbaAtiva }) {
  const abasCliente = [
    { id: "vitrine", label: "Agendar" },
    { id: "meus-horarios", label: "Consultar Horário" },
  ];

  const emModoDono = abaAtiva === "dono";

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <View>
          <Text style={styles.titulo}>Navalha & Estilo</Text>
          <Text style={styles.subtitulo}>
            {emModoDono ? "Área Administrativa" : "Agendamento Online"}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.botaoEngrenagem, emModoDono && styles.engrenagemAtiva]}
          onPress={() => setAbaAtiva(emModoDono ? "vitrine" : "dono")}
          activeOpacity={0.7}
        >
          <Text style={styles.iconeEngrenagem}>{emModoDono ? "✕" : "⚙️"}</Text>
        </TouchableOpacity>
      </View>

      {!emModoDono && (
        <View style={styles.menu}>
          {abasCliente.map((aba) => {
            const ativa = abaAtiva === aba.id;
            return (
              <TouchableOpacity
                key={aba.id}
                style={[styles.botaoAba, ativa && styles.botaoAbaAtiva]}
                onPress={() => setAbaAtiva(aba.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.textoAba, ativa && styles.textoAbaAtiva]}>
                  {aba.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#18181B",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#27272A",
  },
  topo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F4F4F5",
  },
  subtitulo: {
    fontSize: 13,
    color: "#A1A1AA",
    marginTop: 2,
  },
  botaoEngrenagem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#27272A",
    justifyContent: "center",
    alignItems: "center",
  },
  engrenagemAtiva: {
    backgroundColor: "#3F1D1D",
  },
  iconeEngrenagem: {
    fontSize: 16,
    color: "#F4F4F5",
  },
  menu: {
    flexDirection: "row",
    backgroundColor: "#09090B",
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  botaoAba: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 7,
    alignItems: "center",
  },
  botaoAbaAtiva: {
    backgroundColor: "#D97706",
  },
  textoAba: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A1A1AA",
  },
  textoAbaAtiva: {
    color: "#FFFFFF",
  },
});
