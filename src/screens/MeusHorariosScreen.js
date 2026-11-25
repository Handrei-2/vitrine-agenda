import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useAgenda } from "../context/AgendaContext";

export default function MeusHorariosScreen({ telefoneInicial = "" }) {
  const { agendamentos, servicos, cancelarAgendamento } = useAgenda();
  const [telefoneBusca, setTelefoneBusca] = useState(telefoneInicial);

  const numerosLimpos = telefoneBusca.replace(/\D/g, "");

  // Só retorna resultados se o usuário digitou o número completo (mínimo 8 dígitos)
  const meusHorarios =
    numerosLimpos.length >= 8
      ? agendamentos.filter((ag) => ag.clienteTelefone === numerosLimpos)
      : [];

  function getNomeServico(servicoId) {
    const encontrado = servicos.find((s) => s.id === servicoId);
    return encontrado ? encontrado.nome : "Serviço";
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Consultar Meu Agendamento</Text>
      <Text style={styles.subtitulo}>
        Digite seu WhatsApp com DDD para visualizar ou cancelar seus horários.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: 88 99912-3456"
        placeholderTextColor="#71717A"
        keyboardType="phone-pad"
        value={telefoneBusca}
        onChangeText={setTelefoneBusca}
      />

      {numerosLimpos.length < 8 ? (
        <Text style={styles.aviso}>
          Por privacidade, seus horários aparecem somente após informar seu
          número.
        </Text>
      ) : meusHorarios.length === 0 ? (
        <Text style={styles.aviso}>
          Nenhum agendamento encontrado para este número.
        </Text>
      ) : (
        meusHorarios
          .slice()
          .reverse()
          .map((ag) => {
            const cancelado = ag.status === "Cancelado";
            return (
              <View key={ag.id} style={styles.card}>
                <View style={styles.linhaTopo}>
                  <Text style={styles.servico}>
                    {getNomeServico(ag.servicoId)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      cancelado
                        ? styles.badgeCancelado
                        : styles.badgeConfirmado,
                    ]}
                  >
                    <Text style={styles.statusTexto}>{ag.status}</Text>
                  </View>
                </View>

                <Text style={styles.detalhe}>
                  Data: {ag.data.split("-").reverse().join("/")} às {ag.horario}
                </Text>

                {!cancelado && (
                  <TouchableOpacity
                    style={styles.botaoCancelar}
                    onPress={() => cancelarAgendamento(ag.id)}
                  >
                    <Text style={styles.textoCancelar}>Cancelar Horário</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F4F4F5",
  },
  subtitulo: {
    fontSize: 13,
    color: "#A1A1AA",
    marginTop: 4,
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#18181B",
    color: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#27272A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    marginBottom: 14,
  },
  aviso: {
    color: "#71717A",
    textAlign: "center",
    marginTop: 24,
    fontSize: 13,
  },
  card: {
    backgroundColor: "#18181B",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  linhaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  servico: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F4F4F5",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeConfirmado: {
    backgroundColor: "#14532D",
  },
  badgeCancelado: {
    backgroundColor: "#450A0A",
  },
  statusTexto: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  detalhe: {
    fontSize: 13,
    color: "#A1A1AA",
    marginTop: 2,
  },
  botaoCancelar: {
    marginTop: 10,
    backgroundColor: "#27272A",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  textoCancelar: {
    color: "#FCA5A5",
    fontWeight: "600",
    fontSize: 13,
  },
});
