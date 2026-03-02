import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import SecurityButton from "../../components/SecurityButton";

const EmergencyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#FEF2F2", "#FEE2E2", "#FECACA"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Emergency Center</Text>
          <Text style={styles.subtitle}>
            One-tap assistance for your safety on campus.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <SecurityButton />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What happens when I press SOS?</Text>
          <Text style={styles.infoText}>
            • Your live location is sent directly to campus guards.{"\n"}
            • Guards will receive your name and phone number.{"\n"}
            • Assistance will be dispatched to your location immediately.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#991B1B",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#9F1239",
    textAlign: "center",
    marginTop: 12,
    opacity: 0.8,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "#7F1D1D",
    lineHeight: 22,
  },
});

export default EmergencyScreen;