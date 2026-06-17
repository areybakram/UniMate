import DropdownModal from "@/components/DropdownModal";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "../../../utils/apiClient";

const { width } = Dimensions.get("window");

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

  const freePercent = roomData.length > 0 ? Math.round((freeCount / roomData.length) * 100) : 0;

  if (initialLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loaderText}>Loading schedule data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTitleGroup}>
            <Text style={styles.headerTitle}>Room Availability</Text>
            <Text style={styles.headerSubtitle}>Real-time occupancy status</Text>
          </View>
        </View>

        {/* Time Picker */}
        <View style={styles.timePickerContainer}>
          <Text style={styles.sectionLabel}>TIME SLOT</Text>
          <TouchableOpacity
            style={styles.timePickerButton}
            onPress={() => setTimeModalVisible(true)}
            activeOpacity={0.75}
          >
            <View style={styles.timePickerLeft}>
              <Ionicons name="time-outline" size={15} color="#94a3b8" />
              <Text style={styles.timePickerText}>{selectedTime || "Select time"}</Text>
            </View>
            <Ionicons name="chevron-down" size={14} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Day Selector */}
        <View>
          <Text style={[styles.sectionLabel, { paddingHorizontal: 20, marginBottom: 10 }]}>DAY</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daySelector}
          >
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedDay(day)}
                style={[styles.dayButton, selectedDay === day && styles.activeDayButton]}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayText, selectedDay === day && styles.activeDayText]}>
                  {day.substring(0, 3).toUpperCase()}
                </Text>
                {selectedDay === day && <View style={styles.dayActiveIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>

      {/* Body */}
      <View style={styles.body}>

        {/* Stats Bar */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{roomData.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#3b82f6" }]}>{freeCount}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#3b82f6" }]}>{occupiedCount}</Text>
            <Text style={styles.statLabel}>Occupied</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#3b82f6" }]}>{freePercent}%</Text>
            <Text style={styles.statLabel}>Free Rate</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {(["all", "free", "occupied"] as FilterMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[styles.filterTab, filter === mode && styles.filterTabActive]}
              onPress={() => setFilter(mode)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.filterDot,
                  {
                    backgroundColor:
                      mode === "free" ? "#10b981" : mode === "occupied" ? "#f43f5e" : "#64748b",
                  },
                  filter === mode && { opacity: 1 },
                  filter !== mode && { opacity: 0.4 },
                ]}
              />
              <Text style={[styles.filterTabText, filter === mode && styles.filterTabTextActive]}>
                {mode === "all" ? "All Rooms" : mode === "free" ? "Available" : "Occupied"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Room List */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loaderText}>Fetching room data...</Text>
          </View>
        ) : sections.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="search-outline" size={32} color="#475569" />
            </View>
            <Text style={styles.emptyTitle}>No Rooms Found</Text>
            <Text style={styles.emptySubtitle}>
              No rooms match the current filter criteria.
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.listMeta}>
              <Text style={styles.listMetaText}>
                {filteredData.length} {filteredData.length === 1 ? "room" : "rooms"}
              </Text>
              <View style={styles.listMetaDivider} />
              <Text style={styles.listMetaText}>{selectedDay}</Text>
            </View>

            {sections.map((item, idx) => {
              if (item.type === "header") {
                const d = item.data as RoomStatus;
                return (
                  <View key={`h-${idx}`} style={styles.blockHeader}>
                    <View style={styles.blockHeaderAccent} />
                    <Text style={styles.blockHeaderText}>{d.room.replace(" Block", "").toUpperCase()} BLOCK</Text>
                    <View style={styles.blockHeaderLine} />
                  </View>
                );
              }

              const d = item.data as RoomStatus;
              const isFree = d.status === "free";

              return (
                <View
                  key={`r-${idx}`}
                  style={[styles.roomCard, isFree ? styles.freeCard : styles.occupiedCard]}
                >
                  {/* Status Strip */}
                  <View style={[styles.statusStrip, { backgroundColor: isFree ? "#10b981" : "#f43f5e" }]} />

                  <View style={styles.roomCardContent}>
                    {/* Left: Room info */}
                    <View style={styles.roomInfo}>
                      <Text style={styles.roomName}>{d.room}</Text>
                      <Text style={styles.roomBlockLabel}>{getBlock(d.room)} Block</Text>
                    </View>

                    {/* Right: Status badge */}
                    <View style={styles.roomCardRight}>
                      {isFree ? (
                        <View style={styles.availableBadge}>
                          <View style={styles.availableDot} />
                          <Text style={styles.availableBadgeText}>Available</Text>
                        </View>
                      ) : (
                        <View style={styles.occupiedInfo}>
                          <View style={styles.inUseBadge}>
                            <Text style={styles.inUseBadgeText}>In Use</Text>
                          </View>
                          {d.subject ? (
                            <Text style={styles.subjectLabel} numberOfLines={1}>
                              {d.subject}
                            </Text>
                          ) : null}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}

            <View style={{ height: 48 }} />
          </ScrollView>
        )}
      </View>

      <DropdownModal
        visible={timeModalVisible}
        onClose={() => setTimeModalVisible(false)}
        onSelect={(time) => setSelectedTime(time)}
        options={timeSlots}
        selectedValue={selectedTime}
        title="Select Time Slot"
      />
    </View>
  );
};

export default FreeSlots;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },

  // ─── Header ───────────────────────────────────────────────
  header: {
    paddingTop: Platform.OS === "android" ? 44 : 24,
    paddingBottom: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 14,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f8fafc",
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
    letterSpacing: 0.1,
  },

  // ─── Time picker ──────────────────────────────────────────
  timePickerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  timePickerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  timePickerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e2e8f0",
  },

  // ─── Day selector ─────────────────────────────────────────
  daySelector: {
    paddingHorizontal: 20,
    gap: 8,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    gap: 5,
  },
  activeDayButton: {
    backgroundColor: "rgba(59,130,246,0.2)",
    borderColor: "rgba(59,130,246,0.5)",
  },
  dayText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 0.8,
  },
  activeDayText: {
    color: "#93c5fd",
  },
  dayActiveIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#3b82f6",
  },

  // ─── Body ─────────────────────────────────────────────────
  body: {
    flex: 1,
    marginTop: 8,
  },

  // ─── Stats bar ────────────────────────────────────────────
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94a3b8",
    marginTop: 3,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 4,
  },

  // ─── Filter tabs ──────────────────────────────────────────
  filterRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  filterTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  filterTabActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    letterSpacing: 0.1,
  },
  filterTabTextActive: {
    color: "#1d4ed8",
  },

  // ─── List meta ────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  listMetaText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    letterSpacing: 0.2,
  },
  listMetaDivider: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
  },

  // ─── Block header ─────────────────────────────────────────
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  blockHeaderAccent: {
    width: 3,
    height: 14,
    borderRadius: 2,
    backgroundColor: "#3b82f6",
  },
  blockHeaderText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
    letterSpacing: 1.4,
  },
  blockHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },

  // ─── Room card ────────────────────────────────────────────
  roomCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 8,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  freeCard: {
    borderColor: "#d1fae5",
  },
  occupiedCard: {
    borderColor: "#fce7ea",
  },
  statusStrip: {
    width: 3,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  roomCardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: 0.1,
  },
  roomBlockLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94a3b8",
    marginTop: 3,
  },
  roomCardRight: {
    alignItems: "flex-end",
    marginLeft: 12,
  },

  // Free badge
  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  availableBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#065f46",
    letterSpacing: 0.1,
  },

  // Occupied badge
  occupiedInfo: {
    alignItems: "flex-end",
    gap: 4,
    maxWidth: width * 0.38,
  },
  inUseBadge: {
    backgroundColor: "#fff1f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fecdd3",
  },
  inUseBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9f1239",
    letterSpacing: 0.1,
  },
  subjectLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "500",
  },

  // ─── Loader ───────────────────────────────────────────────
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    gap: 12,
  },
  loaderText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
    letterSpacing: 0.1,
  },

  // ─── Empty state ──────────────────────────────────────────
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#334155",
    letterSpacing: 0.1,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
  },
});
