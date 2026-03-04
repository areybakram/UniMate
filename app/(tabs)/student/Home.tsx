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

const StudentHome: React.FC = () => {
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

  const getGreeting = (): string => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const quickStats = [
    { label: "Classes Today", value: "3", icon: "📚", color: "#3B82F6" },
    { label: "Attendance", value: "87%", icon: "✅", color: "#10B981" },
    { label: "Tasks Due", value: "4", icon: "⏰", color: "#F59E0B" },
    { label: "CGPA", value: "3.45", icon: "🎯", color: "#8B5CF6" },
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
          <View style={styles.statsGrid}>
            {quickStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <View style={styles.activityCard}>
              <View
                style={[styles.indicator, { backgroundColor: "#3B82F6" }]}
              />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Database Systems Lab</Text>
                <Text style={styles.activityTime}>09:00 AM - 11:00 AM</Text>
                <Text style={styles.activityLoc}>📍 Lab 4, CS Block</Text>
              </View>
            </View>
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
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
  },
  activityCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  indicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  activityTime: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  activityLoc: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});

export default StudentHome;
