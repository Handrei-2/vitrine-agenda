import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useAgenda } from "../context/AgendaContext";
import { HORARIOS_GRADE } from "../data/seedData";
import ServiceCard from "../components/ServiceCard";
import TimeSlotGrid from "../components/TimeSlotGrid";

function gerarProximosDias(quantidade = 5) {
  const dias = [];
  const nomesSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  for (let i = 0; i < quantidade; i++) {
    const data = new Date();
    data.setDate(data.getDate() + i);
    const iso = data.toISOString().split("T")[0];
    const diaMes = `${String(data.getDate()).padStart(2, "0")}/${String(
      data.getMonth() + 1,
    ).padStart(2, "0")}`;
    const label = i === 0 ? "Hoje" : nomesSemana[data.getDay()];

    dias.push({ iso, diaMes, label });
  }
  return dias;
}

export default function VitrineScreen({ onAgendamentoConcluido }) {
  const { servicos, agendamentos, criarAgendamento } = useAgenda();
  const diasDisponiveis = useMemo(() => gerarProximosDias(5), []);

  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(
    diasDisponiveis[0].iso,
  );
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [feedback, setFeedback] = useState("");

  // Extrai apenas as strings de horário ("10:00", "14:00") sem expor dados do cliente
  const horariosOcupados = useMemo(() => {
    return agendamentos
      .filter((ag) => ag.data === dataSelecionada && ag.status !== "Cancelado")
      .map((ag) => ag.horario);
  }, [agendamentos, dataSelecionada]);

  function handleConfirmar() {
    if (!servicoSelecionado) {
      setFeedback("Selecione um serviço acima.");
      return;
    }
    if (!horarioSelecionado) {
      setFeedback("Escolha um horário livre.");
      return;
    }
    if (!nome.trim() || telefone.replace(/\D/g, "").length < 8) {
      setFeedback("Informe seu nome e um WhatsApp válido.");
      return;
    }

    const resultado = criarAgendamento({
      clienteNome: nome,
      clienteTelefone: telefone,
      servicoId: servicoSelecionado.id,
      data: dataSelecionada,
      horario: horarioSelecionado,
    });

    if (!resultado.ok) {
      setFeedback(resultado.erro);
      return;
    }

    const telSalvo = telefone.replace(/\D/g, "");
    setFeedback("");
    setHorarioSelecionado(null);
    setNome("");
    setTelefone("");

    Alert.alert("Horário Reservado!", "Seu agendamento foi confirmado.");
    if (onAgendamentoConcluido) onAgendamentoConcluido(telSalvo);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.secaoTitulo}>1. Escolha o serviço</Text>
      {servicos.map((srv) => (
        <ServiceCard
          key={srv.id}
          servico={srv}
          selecionado={servicoSelecionado?.id === srv.id}
          onSelect={(s) => {
            setServicoSelecionado(s);
            setFeedback("");
          }}
        />
      ))}

      <Text style={styles.secaoTitulo}>2. Selecione a data</Text>
      <View style={styles.diasRow}>
        {diasDisponiveis.map((d) => {
          const ativo = dataSelecionada === d.iso;
          return (
            <TouchableOpacity
              key={d.iso}
              style={[styles.diaCard, ativo && styles.diaCardAtivo]}
              onPress={() => {
                setDataSelecionada(d.iso);
                setHorarioSelecionado(null);
              }}
            >
              <Text style={[styles.diaLabel, ativo && styles.textoBranco]}>
                {d.label}
              </Text>
              <Text style={[styles.diaData, ativo && styles.textoBranco]}>
                {d.diaMes}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.secaoTitulo}>3. Horários disponíveis</Text>
      <TimeSlotGrid
        horarios={HORARIOS_GRADE}
        horariosOcupados={horariosOcupados}
        horarioSelecionado={horarioSelecionado}
        onSelectHorario={(h) => {
          setHorarioSelecionado(h);
          setFeedback("");
        }}
      />

      <Text style={styles.secaoTitulo}>4. Seus dados</Text>
      <View style={styles.formBox}>
        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor="#71717A"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Seu WhatsApp (com DDD)"
          placeholderTextColor="#71717A"
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />

        {servicoSelecionado && horarioSelecionado && (
          <View style={styles.resumo}>
            <Text style={styles.resumoTexto}>
              {servicoSelecionado.nome} •{" "}
              {dataSelecionada.split("-").reverse().join("/")} às{" "}
              {horarioSelecionado}
            </Text>
          </View>
        )}

        {feedback !== "" && <Text style={styles.erroTexto}>{feedback}</Text>}

        <TouchableOpacity
          style={styles.botaoConfirmar}
          onPress={handleConfirmar}
        >
          <Text style={styles.botaoConfirmarTexto}>Confirmar Horário</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F4F4F5",
    marginTop: 14,
    marginBottom: 10,
  },
  diasRow: {
    flexDirection: "row",
    gap: 8,
  },
  diaCard: {
    flex: 1,
    backgroundColor: "#18181B",
    borderWidth: 1.5,
    borderColor: "#27272A",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  diaCardAtivo: {
    backgroundColor: "#D97706",
    borderColor: "#F59E0B",
  },
  diaLabel: {
    fontSize: 12,
    color: "#A1A1AA",
    fontWeight: "600",
  },
  diaData: {
    fontSize: 14,
    color: "#F4F4F5",
    fontWeight: "bold",
    marginTop: 2,
  },
  textoBranco: {
    color: "#FFFFFF",
  },
  formBox: {
    backgroundColor: "#18181B",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  input: {
    backgroundColor: "#09090B",
    color: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#27272A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  resumo: {
    backgroundColor: "#271E12",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  resumoTexto: {
    color: "#FBBF24",
    fontSize: 13,
    fontWeight: "600",
  },
  erroTexto: {
    color: "#F87171",
    fontSize: 13,
    marginBottom: 10,
  },
  botaoConfirmar: {
    backgroundColor: "#D97706",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoConfirmarTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
