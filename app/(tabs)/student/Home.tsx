import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";
import CustomDrawer from "../../../components/customDrawer";
import SmallSOSButton from "../../../components/SmallSOSButton";
import { AuthContext } from "../../../Context/AuthContext";
import { useDrawer } from "../../../Context/DrawerContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../../supabaseClient";
import { loadAttendance, calculateStats, AttendanceRecord } from "@/utils/attendanceService";
import { useFocusEffect } from "expo-router";

const { width } = Dimensions.get("window");

const StudentHome: React.FC = () => {
  const { user, logout } = useContext(AuthContext) || {};
  const { closeDrawer } = useDrawer();
  const router = useRouter();
  const active = useSharedValue(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ total: 0, taken: 0, missed: 0 });
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      setIsLoading(true);
      const savedData = await AsyncStorage.getItem("personal_timetable");
      if (!savedData) {
        setStats({ total: 0, taken: 0, missed: 0 });
        setTodaySchedule([]);
        return;
      }

      const personalCourses = JSON.parse(savedData);
      const now = new Date();
      const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const currentDay = DAYS[now.getDay() - 1] || DAYS[0];

      const filterStr = personalCourses
        .map((c: any) => `and(course_code.ilike.${c.course_code},batch_code.ilike.${c.batch_code})`)
        .join(",");

      const { data, error } = await supabase
        .from("timetables")
        .select("*")
        .eq("day", currentDay)
        .or(filterStr);

      if (error) throw error;

      const attendanceData = await loadAttendance();
      const newStats = calculateStats(data || [], attendanceData);
      
      setStats(newStats);
      setAttendance(attendanceData);
      setTodaySchedule(data || []);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchHomeData();
    }, [])
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { scale: active.value ? withTiming(0.85) : withTiming(1) },
        { translateX: active.value ? withSpring(240) : withTiming(0) },
      ],
      borderRadius: active.value ? withTiming(20) : withTiming(0),
    };
  });

  const getGreeting = (): string => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const quickStats = [
    { label: "Total Today", value: stats.total.toString(), icon: "book-outline", color: "#3B82F6" },
    { label: "Attended", value: stats.taken.toString(), icon: "checkmark-circle-outline", color: "#10B981" },
    { label: "Missed", value: stats.missed.toString(), icon: "alert-circle-outline", color: "#EF4444" },
    { label: "Tasks", value: "4", icon: "time-outline", color: "#F59E0B" },
  ];

  return (
    <View style={styles.container}>
      <CustomDrawer active={active} />

      <Animated.View
        style={[{ flex: 1, backgroundColor: "#fff" }, animatedStyle]}
      >
        <StatusBar barStyle="light-content" />

        <LinearGradient
          colors={["#2D3748", "#4A5568"]}
          style={styles.heroSection}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => (active.value = !active.value)}>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>UniMate</Text>
            <View style={styles.headerRight}>
              <SmallSOSButton />
              <TouchableOpacity>
                <Ionicons name="notifications" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (logout) {
                    logout();
                    router.replace("/(auth)/who");
                  }
                }}
              >
                <Ionicons name="log-out-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.heroContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>
                {user?.name || "Student Name"}
              </Text>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <Ionicons name="school-outline" size={15} color="#90CDF4" />
                <Text style={styles.infoText}>{user?.role || "Student"}</Text>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={15} color="#90CDF4" />
                <Text style={styles.infoText}>
                  {currentTime.toLocaleDateString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  •{" "}
                  {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {/* STATS SECTION */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statsContainer}>
            {quickStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIconBadge, { backgroundColor: stat.color + '10' }]}>
                  <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </View>
            ))}
          </Animated.View>

          {/* SCHEDULE SECTION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
              {/* <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>SYSTEM LIVE</Text>
              </View> */}
            </View>

            {isLoading ? (
              <ActivityIndicator color="#2D3748" style={{ marginTop: 40 }} />
            ) : todaySchedule.length > 0 ? (
              <View style={styles.timelineContainer}>
                {todaySchedule.map((item, index) => {
                  const isTaken = attendance[item.id] === 'taken';
                  const [endH, endM] = item.end_time.split(":").map(Number);
                  const endSeconds = endH * 3600 + endM * 60;
                  const [startH, startM] = item.start_time.split(":").map(Number);
                  const startSeconds = startH * 3600 + startM * 60;
                  const nowSeconds = new Date().getHours() * 3600 + new Date().getMinutes() * 60;
                  
                  const isFinished = nowSeconds > endSeconds;
                  const isMissed = nowSeconds > endSeconds + 1800; // 30 mins
                  const isOngoing = nowSeconds >= startSeconds && !isFinished;

                  return (
                    <Animated.View 
                      key={item.id || index} 
                      entering={FadeInDown.delay(200 + index * 100)}
                      style={styles.scheduleItem}
                    >
                      {/* Professional Activity Card */}
                      <View style={[
                        styles.activityCard, 
                        isOngoing && styles.ongoingCard,
                        isFinished && styles.finishedCard
                      ]}>
                        <View style={styles.cardMainContent}>
                          <View style={styles.subjectRow}>
                            <View style={styles.subjectContainer}>
                              <Text style={[styles.activitySubject, isFinished && styles.dimmedText]}>
                                {item.subject}
                              </Text>
                              {isTaken && (
                                <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ marginLeft: 6 }} />
                              )}
                            </View>

                            {!isTaken && (
                               <>
                                 {isMissed ? (
                                    <View style={styles.missedTag}>
                                      <Text style={styles.missedTagText}>MISSED</Text>
                                    </View>
                                 ) : isFinished ? (
                                    <View style={styles.unmarkedTag}>
                                      <Text style={styles.unmarkedTagText}>UNMARKED</Text>
                                    </View>
                                 ) : isOngoing ? (
                                    <View style={styles.ongoingBadge}>
                                      <Text style={styles.ongoingBadgeText}>IN PROGRESS</Text>
                                    </View>
                                 ) : null}
                               </>
                            )}
                          </View>
                          
                          <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                              <Ionicons name="location-outline" size={13} color="#64748b" />
                              <Text style={[styles.metaText, isFinished && styles.dimmedText]}>{item.room}</Text>
                            </View>
                            <View style={styles.metaItem}>
                              <Ionicons name="time-outline" size={13} color="#64748b" />
                              <Text style={[styles.metaText, isFinished && styles.dimmedText]}>
                                {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {isOngoing && <View style={styles.accentBar} />}
                      </View>
                    </Animated.View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={40} color="#CBD5E0" />
                <Text style={styles.emptyText}>No classes scheduled for today.</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {active.value && (
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            onPress={() => {
              active.value = false;
              closeDrawer();
            }}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D3748",
  },
  heroSection: {
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    position: "relative",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: -1,
  },
  heroContent: {
    marginTop: 10,
  },
  welcomeSection: {
    marginBottom: 15,
  },
  greeting: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  infoSection: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "500",
  },
  body: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F1F5F9",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 25,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    marginTop: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
  },
  liveText: {
    color: "#64748B",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  timelineContainer: {
    paddingLeft: 0,
  },
  scheduleItem: {
    marginBottom: 12,
  },
  activityCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
  },
  cardMainContent: {
    flex: 1,
  },
  subjectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  subjectContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  activitySubject: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  ongoingCard: {
    borderColor: "#3B82F6",
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  finishedCard: {
    backgroundColor: "#F8FAFC",
  },
  ongoingBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ongoingBadgeText: {
    color: "#2563EB",
    fontSize: 8,
    fontWeight: "900",
  },
  missedTag: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  missedTagText: {
    color: "#EF4444",
    fontSize: 8,
    fontWeight: "900",
  },
  unmarkedTag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  unmarkedTagText: {
    color: "#64748B",
    fontSize: 8,
    fontWeight: "800",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  dimmedText: {
    color: "#94A3B8",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#F8FAFC",
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
  },
  emptyText: {
    marginTop: 12,
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
  },
  accentBar: {
    width: 4,
    backgroundColor: "#3B82F6",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default StudentHome;
