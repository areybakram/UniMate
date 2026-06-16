import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
import DropdownModal from "@/components/DropdownModal";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type FilterMode = "all" | "free" | "occupied";

interface RoomStatus {
  room: string;
  status: "free" | "occupied";
  course_code?: string;
  subject?: string;
  teacher_name?: string;
  batch_code?: string;
  class_dept?: string;
}

function getBlock(room: string): string {
  const match = room.match(/^([A-Za-z]+)/);
  return match ? match[1].toUpperCase() : "Other";
}

function isBlockHeader(room: string): boolean {
  return room.endsWith(" Block");
}

const FreeSlots = () => {
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [selectedTime, setSelectedTime] = useState("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [roomData, setRoomData] = useState<RoomStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");

  const [dayModalVisible, setDayModalVisible] = useState(false);
  const [timeModalVisible, setTimeModalVisible] = useState(false);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await apiClient.get("/timetable/time-slots");
        setTimeSlots(response.data);
        if (response.data.length > 0) {
          setSelectedTime(response.data[0]);
        }
      } catch (err) {
        console.error("Error fetching time slots:", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchTimeSlots();
  }, []);

  useEffect(() => {
    if (!selectedTime) return;
    const fetchRoomStatus = async () => {
      setLoading(true);
      try {
        const response = await apiClient.post("/timetable/room-status", {
          day: selectedDay,
          time: selectedTime,
        });
        setRoomData(response.data);
      } catch (err) {
        console.error("Error fetching room status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoomStatus();
  }, [selectedDay, selectedTime]);

  const freeCount = useMemo(() => roomData.filter(r => r.status === "free").length, [roomData]);
  const occupiedCount = useMemo(() => roomData.filter(r => r.status === "occupied").length, [roomData]);

  const filteredData = useMemo(() => {
    if (filter === "all") return roomData;
    return roomData.filter(r => r.status === filter);
  }, [roomData, filter]);

  const groupedData = useMemo(() => {
    const groups: Record<string, { header: RoomStatus | null; rooms: RoomStatus[] }> = {};
    for (const item of filteredData) {
      if (isBlockHeader(item.room)) {
        const block = getBlock(item.room);
        if (!groups[block]) groups[block] = { header: null, rooms: [] };
        groups[block].header = item;
      } else {
        const block = getBlock(item.room);
        if (!groups[block]) groups[block] = { header: null, rooms: [] };
        groups[block].rooms.push(item);
      }
    }
    const sorted = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    return sorted.map(([, group]) => group);
  }, [filteredData]);

  const sections = useMemo(() => {
    const items: { type: "header" | "room"; data: any }[] = [];
    for (const group of groupedData) {
      if (group.header) {
        items.push({ type: "header", data: group.header });
      }
      for (const room of group.rooms) {
        items.push({ type: "room", data: room });
      }
    }
    return items;
  }, [groupedData]);

  if (initialLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0f3550" />
        <Text style={styles.loaderText}>Loading time slots...</Text>
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
          <Text style={styles.headerTitle}>Room Status</Text>
        </View>
      </LinearGradient>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setDayModalVisible(true)}
        >
          <Ionicons name="calendar-outline" size={18} color="#3b82f6" />
          <Text style={styles.pickerText}>{selectedDay}</Text>
          <Ionicons name="chevron-down" size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setTimeModalVisible(true)}
        >
          <Ionicons name="time-outline" size={18} color="#3b82f6" />
          <Text style={styles.pickerText}>{selectedTime}</Text>
          <Ionicons name="chevron-down" size={16} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{roomData.length}</Text>
          <Text style={styles.summaryLabel}>Total Rooms</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: "#22c55e" }]}>{freeCount}</Text>
          <Text style={styles.summaryLabel}>Free</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: "#ef4444" }]}>{occupiedCount}</Text>
          <Text style={styles.summaryLabel}>Occupied</Text>
        </View>
      </View>

      <View style={styles.filterRow}>
        {(["all", "free", "occupied"] as FilterMode[]).map(mode => (
          <TouchableOpacity
            key={mode}
            style={[styles.filterBtn, filter === mode && styles.filterBtnActive]}
            onPress={() => setFilter(mode)}
          >
            <Text style={[styles.filterText, filter === mode && styles.filterTextActive]}>
              {mode === "all" ? "All" : mode === "free" ? "Free Only" : "Occupied"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(_, idx) => idx.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            if (item.type === "header") {
              const d = item.data as RoomStatus;
              return (
                <View style={styles.blockHeader}>
                  <Ionicons name="business" size={18} color="#64748b" />
                  <Text style={styles.blockHeaderText}>{d.room}</Text>
                </View>
              );
            }
            const d = item.data as RoomStatus;
            const isFree = d.status === "free";
            return (
              <View
                style={[
                  styles.roomCard,
                  isFree ? styles.freeCard : styles.occupiedCard,
                ]}
              >
                <View style={styles.roomCardLeft}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isFree ? "#22c55e" : "#ef4444" },
                    ]}
                  />
                  <Text style={styles.roomName}>{d.room}</Text>
                </View>
                {isFree ? (
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeBadgeText}>Free</Text>
                  </View>
                ) : (
                  <View style={styles.occupiedInfo}>
                    <Text style={styles.classText} numberOfLines={1}>
                      {d.subject}
                    </Text>
                    <Text style={styles.classSubText} numberOfLines={1}>
                      {d.course_code} · {d.batch_code}
                    </Text>
                    <Text style={styles.classSubText} numberOfLines={1}>
                      {d.teacher_name}
                    </Text>
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: "center" }}>
              <Ionicons name="search-outline" size={48} color="#cbd5e1" />
              <Text style={{ color: "#94a3b8", marginTop: 12, fontSize: 15 }}>
                No rooms match the selected filter.
              </Text>
            </View>
          }
        />
      )}

      <DropdownModal
        visible={dayModalVisible}
        onClose={() => setDayModalVisible(false)}
        onSelect={(day) => setSelectedDay(day)}
        options={DAYS}
        selectedValue={selectedDay}
        title="Select Day"
      />

      <DropdownModal
        visible={timeModalVisible}
        onClose={() => setTimeModalVisible(false)}
        onSelect={(time) => setSelectedTime(time)}
        options={timeSlots}
        selectedValue={selectedTime}
        title="Select Time"
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
  controls: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 12,
  },
  pickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  pickerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 12,
  },
  summaryItem: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1e293b",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    marginTop: 2,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 10,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  filterBtnActive: {
    backgroundColor: "#3b82f6",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
  },
  filterTextActive: {
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    marginTop: 6,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 4,
  },
  blockHeaderText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
  },
  roomCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: "#fff",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  freeCard: { borderLeftWidth: 3, borderLeftColor: "#22c55e" },
  occupiedCard: { borderLeftWidth: 3, borderLeftColor: "#ef4444" },
  roomCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 80,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  roomName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
  },
  freeBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  freeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#166534",
  },
  occupiedInfo: {
    flex: 1,
    marginLeft: 8,
  },
  classText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1e293b",
  },
  classSubText: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafb",
  },
  loaderText: { marginTop: 10, fontSize: 16, color: "#0f3550" },
});
