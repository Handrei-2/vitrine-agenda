import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVICOS_INICIAIS, AGENDAMENTOS_INICIAIS } from "../data/seedData";

const AgendaContext = createContext();

const KEY_SERVICOS = "@vitrine_servicos_v1";
const KEY_AGENDAMENTOS = "@vitrine_agendamentos_v1";

export function AgendaProvider({ children }) {
  const [servicos, setServicos] = useState(SERVICOS_INICIAIS);
  const [agendamentos, setAgendamentos] = useState(AGENDAMENTOS_INICIAIS);
  const [donoLogado, setDonoLogado] = useState(false);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const servicosSalvos = await AsyncStorage.getItem(KEY_SERVICOS);
        const agendamentosSalvos = await AsyncStorage.getItem(KEY_AGENDAMENTOS);

        if (servicosSalvos) setServicos(JSON.parse(servicosSalvos));
        if (agendamentosSalvos) setAgendamentos(JSON.parse(agendamentosSalvos));
      } catch (e) {
        console.log("Erro ao carregar dados locais:", e);
      } finally {
        setCarregado(true);
      }
    }
    carregarDados();
  }, []);

  useEffect(() => {
    if (carregado) {
      AsyncStorage.setItem(KEY_SERVICOS, JSON.stringify(servicos));
    }
  }, [servicos, carregado]);

  useEffect(() => {
    if (carregado) {
      AsyncStorage.setItem(KEY_AGENDAMENTOS, JSON.stringify(agendamentos));
    }
  }, [agendamentos, carregado]);

  function loginDono(usuario, senha) {
    if (usuario.trim().toLowerCase() === "admin" && senha === "1234") {
      setDonoLogado(true);
      return { ok: true };
    }
    return { ok: false, erro: "Usuário ou senha incorretos." };
  }

  function logoutDono() {
    setDonoLogado(false);
  }

  function criarAgendamento({
    clienteNome,
    clienteTelefone,
    servicoId,
    data,
    horario,
  }) {
    const conflito = agendamentos.some(
      (ag) =>
        ag.data === data && ag.horario === horario && ag.status !== "Cancelado",
    );

    if (conflito) {
      return { ok: false, erro: "Este horário acabou de ser ocupado." };
    }

    const novo = {
      id: `ag-${Date.now()}`,
      clienteNome: clienteNome.trim(),
      clienteTelefone: clienteTelefone.replace(/\D/g, ""),
      servicoId,
      data,
      horario,
      status: "Confirmado",
    };

    setAgendamentos((prev) => [...prev, novo]);
    return { ok: true };
  }

  function cancelarAgendamento(id) {
    setAgendamentos((prev) =>
      prev.map((ag) => (ag.id === id ? { ...ag, status: "Cancelado" } : ag)),
    );
  }

  function adicionarServico({ nome, descricao, duracao, preco }) {
    const novo = {
      id: `srv-${Date.now()}`,
      nome: nome.trim(),
      descricao: descricao.trim(),
      duracao: Number(duracao),
      preco: Number(preco),
    };
    setServicos((prev) => [...prev, novo]);
  }

  function removerServico(id) {
    setServicos((prev) => prev.filter((srv) => srv.id !== id));
  }

  async function resetarDemonstracao() {
    setServicos(SERVICOS_INICIAIS);
    setAgendamentos(AGENDAMENTOS_INICIAIS);
    await AsyncStorage.setItem(KEY_SERVICOS, JSON.stringify(SERVICOS_INICIAIS));
    await AsyncStorage.setItem(
      KEY_AGENDAMENTOS,
      JSON.stringify(AGENDAMENTOS_INICIAIS),
    );
  }

  return (
    <AgendaContext.Provider
      value={{
        servicos,
        agendamentos,
        donoLogado,
        loginDono,
        logoutDono,
        criarAgendamento,
        cancelarAgendamento,
        adicionarServico,
        removerServico,
        resetarDemonstracao,
      }}
    >
      {children}
    </AgendaContext.Provider>
  );
}

export function useAgenda() {
  return useContext(AgendaContext);
}
