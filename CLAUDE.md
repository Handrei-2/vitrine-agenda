# Navalha & Estilo — Vitrine e Agendamento SPA

Aplicação web e mobile desenvolvida no formato **SPA (Single Page Application)** para agendamento online de serviços em barbearia. O sistema elimina o atrito de marcação de horários pelo WhatsApp, permitindo que clientes visualizem serviços e horários livres em tempo real, enquanto o proprietário gerencia a agenda completa e o catálogo por meio de uma área administrativa protegida.

---

## Framework Utilizado e Justificativa

- **Framework:** **React Native** (com **Expo** e **React Native Web**)
- **Armazenamento Local:** `@react-native-async-storage/async-storage`

### Por que o React Native foi escolhido?

1. **Navegação SPA Fluida:** A troca entre as seções (_Agendar_, _Consultar Horário_ e _Área Administrativa_) ocorre de forma instantânea por meio de gerenciamento de estado no cliente, sem recarregamento completo da página.
2. **Componentização e Reuso:** A interface foi dividida em componentes independentes e reutilizáveis (`Header`, `ServiceCard`, `TimeSlotGrid`), facilitando a manutenção e evitando repetição de código entre a vitrine pública e o painel de gestão.
3. **Reatividade de Dados:** Utilizando `Context API` integrada ao `AsyncStorage`, qualquer alteração — como a reserva ou o cancelamento de um horário — atualiza imediatamente o estado global e a disponibilidade na grade de horários, mantendo os dados persistidos localmente no navegador ou dispositivo.
4. **Multiplataforma:** O mesmo código-fonte executa nativamente em Android/iOS via Expo Go e diretamente no navegador por meio do Expo Web.

---

## Funcionalidades Principais

### Visão do Cliente (Acesso Público)

- **Vitrine de Serviços:** Exibição de cortes, combos, duração estimada e valores.
- **Grade Dinâmica de Horários:** Seleção de data (próximos 5 dias) com bloqueio automático de horários já reservados. Por privacidade, os horários indisponíveis exibem apenas o status _"Ocupado"_, sem expor dados de terceiros.
- **Agendamento Rápido:** Reserva feita diretamente com nome e WhatsApp, sem necessidade de cadastro prévio.
- **Consulta Privada:** Na aba _Consultar Horário_, o cliente informa seu número de WhatsApp para visualizar e cancelar apenas os próprios agendamentos, liberando o horário na grade imediatamente.

### Área do Proprietário (Acesso Restrito)

- **Acesso Discreto:** Disponível através do ícone de engrenagem (`⚙️`) no canto superior direito, protegido por autenticação.
- **Resumo Operacional:** Contagem de agendamentos ativos e cálculo automático da receita prevista.
- **Gestão da Agenda:** Visualização completa dos clientes agendados (nome, telefone, serviço e horário) com opção de cancelamento.
- **Gerenciamento de Catálogo:** Cadastro e exclusão de serviços refletidos instantaneamente na vitrine do cliente, além de botão para restaurar os dados iniciais de demonstração.

---

## Estrutura do Projeto

```text
vitrine-agenda/
├── App.js                          # Ponto de entrada e controle de navegação SPA
├── src/
│   ├── components/
│   │   ├── Header.js               # Cabeçalho, menu de navegação e acesso administrativo
│   │   ├── ServiceCard.js          # Card reutilizável de serviço (vitrine e catálogo)
│   │   └── TimeSlotGrid.js         # Grade interativa de horários livres e ocupados
│   ├── context/
│   │   └── AgendaContext.js        # Estado global, regras de negócio e AsyncStorage
│   ├── data/
│   │   └── seedData.js             # Dados iniciais (serviços, grade e agendamentos demo)
│   └── screens/
│       ├── VitrineScreen.js        # Fluxo principal de escolha e agendamento
│       ├── MeusHorariosScreen.js   # Consulta e cancelamento pelo WhatsApp do cliente
│       └── PainelDonoScreen.js     # Login e painel gerencial do proprietário
```
