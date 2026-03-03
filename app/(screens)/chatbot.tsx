import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../Context/AuthContext";

export default function Chatbot() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Redirect to role selection if no user is logged in
    if (!user) {
      router.replace("/(auth)/who");
    }
  }, [user]);

  if (!user) return null;

  return (
    <LinearGradient colors={["#F8FAFC", "#E2E8F0"]} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>UniMate AI</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <BlurView intensity={40} tint="light" style={styles.card}>
            <View style={styles.iconWrapper}>
              <Ionicons name="chatbubbles-outline" size={48} color="#60A5FA" />
            </View>
            <Text style={styles.title}>AI Chatbot Coming Soon</Text>
            <Text style={styles.subtitle}>
              We're building an intelligent campus assistant to help you with
              your queries. Stay tuned!
            </Text>
          </BlurView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  card: {
    width: "100%",
    borderRadius: 32,
    padding: 40,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    overflow: "hidden",
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
  },
});
