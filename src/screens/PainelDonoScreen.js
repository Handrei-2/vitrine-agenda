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
import ServiceCard from "../components/ServiceCard";

export default function PainelDonoScreen() {
  const {
    donoLogado,
    loginDono,
    logoutDono,
    servicos,
    agendamentos,
    cancelarAgendamento,
    adicionarServico,
    removerServico,
    resetarDemonstracao,
  } = useAgenda();

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const [nomeSrv, setNomeSrv] = useState("");
  const [descricaoSrv, setDescricaoSrv] = useState("");
  const [duracaoSrv, setDuracaoSrv] = useState("");
  const [precoSrv, setPrecoSrv] = useState("");

  function handleLogin() {
    const res = loginDono(usuario, senha);
    if (!res.ok) {
      setErro(res.erro);
    } else {
      setUsuario("");
      setSenha("");
      setErro("");
    }
  }

  if (!donoLogado) {
    return (
      <View style={styles.loginContainer}>
        <View style={styles.loginBox}>
          <Text style={styles.loginTitulo}>Acesso do Proprietário</Text>
          <Text style={styles.loginSubtitulo}>
            Entre com suas credenciais para visualizar a agenda completa.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Usuário"
            placeholderTextColor="#71717A"
            autoCapitalize="none"
            value={usuario}
            onChangeText={setUsuario}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#71717A"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          {erro !== "" && <Text style={styles.erroTexto}>{erro}</Text>}

          <TouchableOpacity style={styles.botaoPrincipal} onPress={handleLogin}>
            <Text style={styles.botaoTexto}>Entrar</Text>
          </TouchableOpacity>

          <Text style={styles.dicaDemo}>Demo: admin • Senha: 1234</Text>
        </View>
      </View>
    );
  }

  const ativos = agendamentos.filter((a) => a.status === "Confirmado");
  const receita = ativos.reduce((acc, ag) => {
    const srv = servicos.find((s) => s.id === ag.servicoId);
    return acc + (srv ? srv.preco : 0);
  }, 0);

  function getNomeServico(id) {
    const srv = servicos.find((s) => s.id === id);
    return srv ? srv.nome : "Serviço";
  }

  function handleAddServico() {
    if (!nomeSrv.trim() || !duracaoSrv || !precoSrv) return;
    adicionarServico({
      nome: nomeSrv,
      descricao: descricaoSrv || "Atendimento padrão.",
      duracao: duracaoSrv,
      preco: precoSrv.replace(",", "."),
    });
    setNomeSrv("");
    setDescricaoSrv("");
    setDuracaoSrv("");
    setPrecoSrv("");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topoDono}>
        <Text style={styles.secaoTitulo}>Resumo da Barbearia</Text>
        <TouchableOpacity style={styles.botaoSair} onPress={logoutDono}>
          <Text style={styles.textoSair}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricasRow}>
        <View style={styles.metricaCard}>
          <Text style={styles.metricaValor}>{ativos.length}</Text>
          <Text style={styles.metricaLabel}>Horários Marcados</Text>
        </View>
        <View style={styles.metricaCard}>
          <Text style={styles.metricaValor}>
            R$ {receita.toFixed(2).replace(".", ",")}
          </Text>
          <Text style={styles.metricaLabel}>Faturamento Previsto</Text>
        </View>
      </View>

      <Text style={styles.secaoTitulo}>Agenda de Clientes</Text>
      {ativos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum horário marcado no momento.</Text>
      ) : (
        ativos.map((ag) => (
          <View key={ag.id} style={styles.agendaCard}>
            <View style={styles.agendaTopo}>
              <Text style={styles.agendaHora}>
                {ag.data.split("-").reverse().join("/")} às {ag.horario}
              </Text>
              <Text style={styles.agendaServico}>
                {getNomeServico(ag.servicoId)}
              </Text>
            </View>
            <Text style={styles.agendaCliente}>
              Cliente: {ag.clienteNome} • Tel: {ag.clienteTelefone}
            </Text>
            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={() => cancelarAgendamento(ag.id)}
            >
              <Text style={styles.textoCancelar}>Cancelar Agendamento</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      <Text style={styles.secaoTitulo}>Novo Serviço na Vitrine</Text>
      <View style={styles.formBox}>
        <TextInput
          style={styles.input}
          placeholder="Nome do serviço"
          placeholderTextColor="#71717A"
          value={nomeSrv}
          onChangeText={setNomeSrv}
        />
        <TextInput
          style={styles.input}
          placeholder="Descrição"
          placeholderTextColor="#71717A"
          value={descricaoSrv}
          onChangeText={setDescricaoSrv}
        />
        <View style={styles.linhaDupla}>
          <TextInput
            style={[styles.input, styles.metade]}
            placeholder="Duração (min)"
            placeholderTextColor="#71717A"
            keyboardType="numeric"
            value={duracaoSrv}
            onChangeText={setDuracaoSrv}
          />
          <TextInput
            style={[styles.input, styles.metade]}
            placeholder="Preço (R$)"
            placeholderTextColor="#71717A"
            keyboardType="numeric"
            value={precoSrv}
            onChangeText={setPrecoSrv}
          />
        </View>
        <TouchableOpacity
          style={styles.botaoPrincipal}
          onPress={handleAddServico}
        >
          <Text style={styles.botaoTexto}>Adicionar Serviço</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.secaoTitulo}>Serviços Cadastrados</Text>
      {servicos.map((srv) => (
        <ServiceCard
          key={srv.id}
          servico={srv}
          onRemover={(id) => removerServico(id)}
        />
      ))}

      <TouchableOpacity style={styles.botaoReset} onPress={resetarDemonstracao}>
        <Text style={styles.textoReset}>Restaurar Dados Iniciais</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  loginBox: {
    backgroundColor: "#18181B",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  loginTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F4F4F5",
    marginBottom: 4,
  },
  loginSubtitulo: {
    fontSize: 13,
    color: "#A1A1AA",
    marginBottom: 16,
  },
  dicaDemo: {
    color: "#71717A",
    fontSize: 12,
    textAlign: "center",
    marginTop: 14,
  },
  erroTexto: {
    color: "#F87171",
    fontSize: 13,
    marginBottom: 10,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  topoDono: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  botaoSair: {
    backgroundColor: "#27272A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  textoSair: {
    color: "#FCA5A5",
    fontSize: 12,
    fontWeight: "600",
  },
  metricasRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  metricaCard: {
    flex: 1,
    backgroundColor: "#18181B",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  metricaValor: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D97706",
  },
  metricaLabel: {
    fontSize: 12,
    color: "#A1A1AA",
    marginTop: 4,
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F4F4F5",
    marginTop: 10,
    marginBottom: 10,
  },
  vazio: {
    color: "#71717A",
    fontSize: 13,
    marginBottom: 10,
  },
  agendaCard: {
    backgroundColor: "#18181B",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#27272A",
  },
  agendaTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  agendaHora: {
    color: "#D97706",
    fontWeight: "bold",
    fontSize: 13,
  },
  agendaServico: {
    color: "#F4F4F5",
    fontWeight: "600",
    fontSize: 13,
  },
  agendaCliente: {
    color: "#A1A1AA",
    fontSize: 13,
  },
  botaoCancelar: {
    marginTop: 8,
    backgroundColor: "#27272A",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  textoCancelar: {
    color: "#FCA5A5",
    fontSize: 12,
    fontWeight: "600",
  },
  formBox: {
    backgroundColor: "#18181B",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27272A",
    marginBottom: 14,
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
  linhaDupla: {
    flexDirection: "row",
    gap: 10,
  },
  metade: {
    flex: 1,
  },
  botaoPrincipal: {
    backgroundColor: "#D97706",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  botaoReset: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#3F3F46",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoReset: {
    color: "#A1A1AA",
    fontSize: 13,
    fontWeight: "600",
  },
});
