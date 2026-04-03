import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../../../utils/apiClient";

const FreeSlots = () => {
  const [sections, setSections] = useState<
    { key: string; day: string; table: number; slots: any[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreeSlots = async () => {
      try {
        const response = await apiClient.get("/timetable/free-slots");
        setSections(response.data);
      } catch (err) {
        console.error("Error fetching free slots from backend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFreeSlots();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0f3550" />
        <Text style={styles.loaderText}>Loading free slots...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#1e293b", "#334155"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Free Slots</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={sections}
        keyExtractor={(s) => s.key}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.dayBlock}>
            <Text style={styles.dayHeader}>
              {item.day} (Set {item.table + 1})
            </Text>

            {item.slots.map((slot: any, idx: number) => (
              <View
                key={idx}
                style={[
                  styles.slotCard,
                  slot.type === "free" ? styles.freeCard : styles.classCard,
                ]}
              >
                <Text style={styles.slotTitle}>
                  {slot.type === "free" ? "🟢 Free Slot" : "📘 " + slot.title}
                </Text>
                <Text style={styles.slotTime}>
                  ⏰ {slot.start} - {slot.end}
                </Text>
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <Text style={{ color: "#666" }}>
              No timetable data found (or all free slots were beyond 8:30).
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default FreeSlots;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafb" },
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dayBlock: {
    marginBottom: 22,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f3550",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#e3e8ee",
    paddingBottom: 6,
  },
  slotCard: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  classCard: { borderLeftWidth: 4, borderLeftColor: "#3b82f6" },
  freeCard: { borderLeftWidth: 4, borderLeftColor: "#22c55e" },
  slotTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#11324d",
  },
  slotTime: { fontSize: 13, color: "#64748b" },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafb",
  },
  loaderText: { marginTop: 10, fontSize: 16, color: "#0f3550" },
});
