import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
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
import { supabase } from "../../../supabaseClient";

interface Incident {
  id: string;
  created_at: string;
  resolved_at: string;
  status: string;
  profiles: {
    name: string;
  };
}

const { width } = Dimensions.get("window");

const GuardHome: React.FC = () => {
  const { user } = useContext(AuthContext) || {};
  const { closeDrawer } = useDrawer();
  const active = useSharedValue(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pendingCount, setPendingCount] = useState(0);
  const [resolvedMonthCount, setResolvedMonthCount] = useState(0);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    
    fetchStats();
    fetchRecentIncidents();

    const subscription = supabase
      .channel("guard_home_updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "security_alerts" },
        () => {
          fetchStats();
          fetchRecentIncidents();
        }
      )
      .subscribe();

    return () => {
      clearInterval(timer);
      subscription.unsubscribe();
    };
  }, []);

  const fetchStats = async () => {
    try {
      // 1. Pending Alerts
      const { count: pending, error: pError } = await supabase
        .from("security_alerts")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      if (pError) throw pError;
      setPendingCount(pending || 0);

      // 2. Resolved this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: resolved, error: rError } = await supabase
        .from("security_alerts")
        .select("*", { count: "exact", head: true })
        .eq("status", "resolved")
        .gte("resolved_at", startOfMonth.toISOString());

      if (rError) throw rError;
      setResolvedMonthCount(resolved || 0);

    } catch (error) {
      console.error("Error fetching guard stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchRecentIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from("security_alerts")
        .select(`
          id,
          created_at,
          resolved_at,
          status,
          profiles:user_id (name)
        `)
        .eq("status", "resolved")
        .order("resolved_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentIncidents(data as any || []);
    } catch (error) {
      console.error("Error fetching recent incidents:", error);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const then = new Date(dateStr);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    return then.toLocaleDateString();
  };

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
    <View style={{ flex: 1, backgroundColor: "#0C1C3A" }}>
      <CustomDrawer active={active} />

      <Animated.View style={[{ flex: 1, backgroundColor: "#F8FAFC" }, animatedStyle]}>
        <StatusBar barStyle="light-content" />

        {/* HERO SECTION */}
        <LinearGradient
          colors={["#0C1C3A", "#1E3A8A"]}
          style={styles.heroSection}
        >
          <View style={styles.header}>
            <Pressable onPress={() => (active.value = !active.value)}>
              <Ionicons name="menu" size={28} color="#FFF" />
            </Pressable>
            <Text style={styles.headerTitle}>Guard Dashboard</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.greeting}>Good Day, Officer</Text>
            <Text style={styles.userName}>{user?.name || "Campus Security"}</Text>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>Role: {user?.role || "Guard"}</Text>
            
            <BlurView intensity={30} tint="light" style={styles.timeCard}>
               <Text style={styles.timeText}>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
               </Text>
               <Text style={styles.dateText}>
                 {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
               </Text>
            </BlurView>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* STATS */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="alert-decagram" size={32} color="#EF4444" />
              <Text style={styles.statValue}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Active Alerts</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons name="shield-check" size={32} color="#10B981" />
              <Text style={styles.statValue}>{resolvedMonthCount}</Text>
              <Text style={styles.statLabel}>Patrols Done</Text>
            </View>
          </View>

          {/* RECENT ALERTS PREVIEW */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Incidents (Resolved)</Text>
            {recentIncidents.length > 0 ? (
              recentIncidents.map((incident) => (
                <TouchableOpacity key={incident.id} style={styles.alertItem}>
                  <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.alertTitle}>Emergency Resolved</Text>
                    <Text style={styles.alertTime}>
                      {getTimeAgo(incident.resolved_at)} • Student {incident.profiles?.name || "Unknown"}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyIncidents}>
                <Text style={styles.emptyText}>No recent resolved incidents.</Text>
              </View>
            )}
          </View>
          
          {/* SHIFT INFO */}
          <View style={styles.section}>
             <Text style={styles.sectionTitle}>Shift Information</Text>
             <BlurView intensity={40} style={styles.infoCard}>
                <Ionicons name="time-outline" size={24} color="#1E3A8A" />
                <View>
                   <Text style={styles.infoLabel}>Current Shift</Text>
                   <Text style={styles.infoValue}>Morning (08:00 - 16:00)</Text>
                </View>
             </BlurView>
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
  headerTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  heroContent: {
    paddingHorizontal: 20,
    alignItems: 'center'
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
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden'
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
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    elevation: 2,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  alertTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  alertTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 138, 0.05)',
    padding: 16,
    borderRadius: 16,
    gap: 15,
    overflow: 'hidden'
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoValue: {
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  emptyIncidents: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 14,
  }
});

export default GuardHome;
