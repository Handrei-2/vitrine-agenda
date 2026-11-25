export const hojeISO = () => new Date().toISOString().split("T")[0];

export const SERVICOS_INICIAIS = [
  {
    id: "srv-1",
    nome: "Corte Degradê",
    descricao: "Acabamento na navalha, lavagem e finalização.",
    duracao: 40,
    preco: 45.0,
  },
  {
    id: "srv-2",
    nome: "Barba Terapia",
    descricao: "Toalha quente, alinhamento e hidratação com óleo.",
    duracao: 30,
    preco: 35.0,
  },
  {
    id: "srv-3",
    nome: "Combo Corte + Barba",
    descricao: "Pacote completo com desconto especial.",
    duracao: 60,
    preco: 70.0,
  },
  {
    id: "srv-4",
    nome: "Sobrancelha na Navalha",
    descricao: "Alinhamento natural rápido.",
    duracao: 15,
    preco: 15.0,
  },
];

export const AGENDAMENTOS_INICIAIS = [
  {
    id: "ag-1",
    clienteNome: "Lucas Andrade",
    clienteTelefone: "88999123456",
    servicoId: "srv-1",
    data: hojeISO(),
    horario: "10:00",
    status: "Confirmado",
  },
  {
    id: "ag-2",
    clienteNome: "Mateus Silva",
    clienteTelefone: "88988451122",
    servicoId: "srv-3",
    data: hojeISO(),
    horario: "14:00",
    status: "Confirmado",
  },
];

export const HORARIOS_GRADE = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];
