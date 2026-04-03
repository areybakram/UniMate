import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import SecurityButton from "../../components/SecurityButton";

const EmergencyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#F8FAFC", "#E2E8F0", "#CBD5E1"]}
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
          <Text style={styles.infoTitle}>Emergency Protocol</Text>
          <View style={styles.infoRow}>
            <View style={styles.dot} />
            <Text style={styles.infoText}>
              Live location shared with campus guards
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.dot} />
            <Text style={styles.infoText}>
              Identity verified for quick identification
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.dot} />
            <Text style={styles.infoText}>
              Immediate dispatch of security personnel
            </Text>
          </View>
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
    fontSize: 34,
    fontWeight: "900",
    color: "#1E293B",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#991B1B",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
  },
  infoText: {
    fontSize: 14,
    color: "#475569",
    fontWeight: "500",
    flex: 1,
  },
});

export default EmergencyScreen;
