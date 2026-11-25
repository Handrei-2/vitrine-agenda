import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, StatusBar } from "react-native";
import { AgendaProvider } from "./src/context/AgendaContext";
import Header from "./src/components/Header";
import VitrineScreen from "./src/screens/VitrineScreen";
import MeusHorariosScreen from "./src/screens/MeusHorariosScreen";
import PainelDonoScreen from "./src/screens/PainelDonoScreen";

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState("vitrine");
  const [ultimoTelefone, setUltimoTelefone] = useState("");

  return (
    <AgendaProvider>
      <SafeAreaView style={styles.telaFundo}>
        <StatusBar barStyle="light-content" backgroundColor="#18181B" />
        <View style={styles.containerCentral}>
          <Header abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />

          {abaAtiva === "vitrine" && (
            <VitrineScreen
              onAgendamentoConcluido={(tel) => {
                setUltimoTelefone(tel);
                setAbaAtiva("meus-horarios");
              }}
            />
          )}
          {abaAtiva === "meus-horarios" && (
            <MeusHorariosScreen telefoneInicial={ultimoTelefone} />
          )}
          {abaAtiva === "dono" && <PainelDonoScreen />}
        </View>
      </SafeAreaView>
    </AgendaProvider>
  );
}

const styles = StyleSheet.create({
  telaFundo: {
    flex: 1,
    backgroundColor: "#09090B",
    alignItems: "center",
  },
  containerCentral: {
    flex: 1,
    width: "100%",
    maxWidth: 680,
    backgroundColor: "#09090B",
  },
});
