import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import CustomDrawer from "../../../components/customDrawer";
import { AuthContext } from "../../../Context/AuthContext";
import { useDrawer } from "../../../Context/DrawerContext";

const { width } = Dimensions.get("window");

const TeacherHome: React.FC = () => {
  const { user, logout } = useContext(AuthContext) || {};
  const { closeDrawer } = useDrawer();
  const router = useRouter();
  const active = useSharedValue(false);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  return (
    <View style={{ flex: 1, backgroundColor: "#2D3748" }}>
      <CustomDrawer active={active} />

      <Animated.View
        style={[{ flex: 1, backgroundColor: "#F8FAFC" }, animatedStyle]}
      >
        <StatusBar barStyle="light-content" />

        {/* HERO SECTION */}
        <LinearGradient
          colors={["#2D3748", "#4A5568"]}
          style={styles.heroSection}
        >
          <View style={styles.header}>
            <Pressable onPress={() => (active.value = !active.value)}>
              <Ionicons name="menu" size={28} color="#FFF" />
            </Pressable>
            <Text style={styles.headerTitle}>Faculty Portal</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity>
                <Ionicons name="notifications" size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (logout) {
                    logout();
                    router.replace("/(auth)/who");
                  }
                }}
              >
                <Ionicons name="log-out-outline" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.greeting}>Welcome Back,</Text>
            <Text style={styles.userName}>{user?.name || "Professor"}</Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
              Role: {user?.role || "Teacher"}
            </Text>

            <BlurView intensity={30} tint="light" style={styles.timeCard}>
              <Text style={styles.timeText}>
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text style={styles.dateText}>
                {currentTime.toLocaleDateString([], {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </BlurView>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* STATS */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={32}
                color="#4F46E5"
              />
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Today's Classes</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="account-group"
                size={32}
                color="#F59E0B"
              />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Unread Queries</Text>
            </View>
          </View>

          {/* NEXT CLASS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Up Next</Text>
            <TouchableOpacity style={styles.classCard}>
              <View style={styles.classTimeBox}>
                <Text style={styles.classTimeMain}>14:00</Text>
                <Text style={styles.classTimeSub}>PM</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.classTitle}>Advanced Algorithms</Text>
                <Text style={styles.classRoom}>Room 402 • CS Department</Text>
              </View>
              <View style={styles.attendBadge}>
                <Text style={styles.attendText}>Live</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* RECENT NOTIFICATIONS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Updates</Text>
            <View style={styles.updateItem}>
              <View style={styles.updateIcon}>
                <Ionicons name="notifications" size={20} color="#4F46E5" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.updateTitle}>Exam Result Deadline</Text>
                <Text style={styles.updateDesc}>
                  Submit AI Course results by Friday.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {active.value && (
          <Pressable
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
  heroSection: {
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  heroContent: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  greeting: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
  },
  userName: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timeCard: {
    padding: 20,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    overflow: "hidden",
  },
  timeText: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  dateText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
  },
  classCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    gap: 15,
    elevation: 3,
  },
  classTimeBox: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 60,
  },
  classTimeMain: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  classTimeSub: {
    fontSize: 10,
    color: "#6B7280",
    textTransform: "uppercase",
  },
  classTitle: {
    fontWeight: "bold",
    color: "#1F2937",
    fontSize: 16,
  },
  classRoom: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  attendBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  attendText: {
    color: "#4F46E5",
    fontSize: 10,
    fontWeight: "bold",
  },
  updateItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 16,
    gap: 15,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  updateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  updateTitle: {
    fontWeight: "bold",
    color: "#1F2937",
  },
  updateDesc: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});

export default TeacherHome;
