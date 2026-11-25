import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ServiceCard({
  servico,
  selecionado,
  onSelect,
  onRemover,
}) {
  return (
    <TouchableOpacity
      style={[styles.card, selecionado && styles.cardSelecionado]}
      onPress={() => onSelect && onSelect(servico)}
      activeOpacity={onSelect ? 0.8 : 1}
    >
      <View style={styles.info}>
        <Text style={styles.nome}>{servico.nome}</Text>
        <Text style={styles.descricao}>{servico.descricao}</Text>
        <Text style={styles.duracao}>{servico.duracao} min</Text>
      </View>

      <View style={styles.direita}>
        <Text style={styles.preco}>
          R$ {servico.preco.toFixed(2).replace(".", ",")}
        </Text>

        {selecionado && (
          <View style={styles.badge}>
            <Text style={styles.badgeTexto}>Selecionado</Text>
          </View>
        )}

        {onRemover && (
          <TouchableOpacity
            style={styles.botaoRemover}
            onPress={() => onRemover(servico.id)}
          >
            <Text style={styles.textoRemover}>Excluir</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#18181B",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "#27272A",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSelecionado: {
    borderColor: "#D97706",
    backgroundColor: "#271E12",
  },
  info: {
    flex: 1,
    paddingRight: 10,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F4F4F5",
  },
  descricao: {
    fontSize: 13,
    color: "#A1A1AA",
    marginTop: 3,
  },
  duracao: {
    fontSize: 12,
    color: "#D97706",
    fontWeight: "600",
    marginTop: 6,
  },
  direita: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  preco: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F4F4F5",
  },
  badge: {
    marginTop: 6,
    backgroundColor: "#D97706",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  botaoRemover: {
    marginTop: 8,
    backgroundColor: "#3F1D1D",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  textoRemover: {
    fontSize: 12,
    color: "#FCA5A5",
    fontWeight: "600",
  },
});
