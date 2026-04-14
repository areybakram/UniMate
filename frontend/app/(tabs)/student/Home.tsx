import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
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
import { loadAttendance, calculateStats, AttendanceRecord, calculateOverallAttendanceRate, calculateWeeklyAttendanceTrends } from "@/utils/attendanceService";
import { useFocusEffect } from "expo-router";
import { useNotifications } from "../../../Context/NotificationContext";
import { registerForPushNotificationsAsync, scheduleClassReminders, scheduleTaskReminders } from "../../../utils/notificationService";
import { getTodayTasks, toggleTaskStatus, Task, getTasks, calculateWeeklyTaskStats } from "@/utils/taskService";
import { getUpcomingHolidays, Holiday } from "@/utils/holidayService";
import TaskCard from "@/components/TaskCard";
import AddTaskModal from "@/components/AddTaskModal";
import { LineChart, ProgressChart } from "react-native-chart-kit";

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
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [visibleTaskCount, setVisibleTaskCount] = useState(3);
  const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
  const { unreadCount } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [weeklyTaskData, setWeeklyTaskData] = useState<{ day: string; created: number; completed: number }[]>([]);
  const [weeklyAttendanceTrendData, setWeeklyAttendanceTrendData] = useState<{ day: string; scheduled: number; attended: number }[]>([]);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const tooltipContent: Record<string, string> = {
    tasks: "Tracks your productivity: 'Created' shows new tasks added, while 'Completed' tracks your progress over the last 7 days.",
    attendance: "Compares 'Scheduled' classes against 'Attended' ones. The ring shows your overall attendance rate.",
    holidays: "Shows all public and academic holidays for the current calendar month."
  };

  const refreshAnalytics = async (userId?: string) => {
    const [weeklyTasks, attendanceTrends, overAllAttendance, upcomingHolidays] = await Promise.all([
      calculateWeeklyTaskStats(userId),
      calculateWeeklyAttendanceTrends(userId),
      calculateOverallAttendanceRate(userId),
      getUpcomingHolidays()
    ]);
    setWeeklyTaskData(weeklyTasks);
    setWeeklyAttendanceTrendData(attendanceTrends);
    setHolidays(upcomingHolidays);
    setAttendanceRate(overAllAttendance);
  };

  const getRollingLabels = () => {
    const labels = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return labels;
  };

  const fetchHomeData = async (forceFresh = false) => {
    try {
      setIsLoading(true);

      // Use context data if available for instant UI
      const supaUser = user || (await (supabase.auth.getUser() as any)).data.user;
      if (!supaUser) return;

      // 1. Fetch Tasks & Holidays immediately (independent of timetable)
      const tasksData = await getTodayTasks(supaUser.id);
      setTodayTasks(tasksData);
      
      // Schedule Task Notifications globally across the app
      const allTasksData = await getTasks(supaUser.id);
      await scheduleTaskReminders(allTasksData);

      await refreshAnalytics(supaUser.id);

      // 2. Load Timetable from Profile (Context or DB)
      // If forceFresh is true, we ignore context and go to DB
      let personalCourses = !forceFresh ? (user as any)?.timetable_data || [] : [];
      
      if (personalCourses.length === 0 || forceFresh) {
        // Backup: Try fetching from DB once if context is thin or forced
        const { data: profileData } = await supabase
          .from("profiles")
          .select("timetable_data")
          .eq("id", supaUser.id)
          .single();
        personalCourses = profileData?.timetable_data || [];
      }

      // If still no courses, just return (Tasks/Holidays are already set)
      if (personalCourses.length === 0) {
        setStats({ total: 0, taken: 0, missed: 0 });
        setTodaySchedule([]);
        return;
      }

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

      const attendanceData = await loadAttendance(supaUser.id);
      const newStats = calculateStats(data || [], attendanceData);
      
      setStats(newStats);
      setAttendance(attendanceData);
      setTodaySchedule(data || []);

      // Schedule notifications for the full week
      const { data: fullTimetable, error: fullError } = await supabase
        .from("timetables")
        .select("*")
        .or(filterStr);
      
      if (!fullError && fullTimetable) {
        await scheduleClassReminders(fullTimetable);
      }
      
      // Always reset visible count when data is freshly fetched
      setVisibleTaskCount(3);
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchHomeData(true); // Force fresh fetch from DB
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Reset count on every refocus
      setVisibleTaskCount(3);
      if (user) {
        fetchHomeData();
      }
    }, [user])
  );

  // Auto-fetch when session is restored or profile updates
  useEffect(() => {
    if (user) {
      fetchHomeData();
    }
  }, [user]);

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
    { label: "Classes Today", value: stats.total.toString(), icon: "book-outline", color: "#3B82F6" },
    { label: "Attended", value: stats.taken.toString(), icon: "checkmark-circle-outline", color: "#10B981" },
    { label: "Missed", value: stats.missed.toString(), icon: "alert-circle-outline", color: "#EF4444" },
    { label: "Tasks Today", value: todayTasks.filter(t => t.status === 'todo').length.toString(), icon: "time-outline", color: "#F59E0B" },
  ];

  return (
    <View style={styles.container}>
      <CustomDrawer active={active} />

      <Animated.View
        style={[{ flex: 1, backgroundColor: "#fff" }, animatedStyle]}
      >
        <StatusBar barStyle="light-content" />

        <ScrollView 
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={["#3B82F6"]}
              tintColor="#3B82F6"
            />
          }
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
            if (isCloseToBottom && visibleTaskCount < todayTasks.length) {
              setVisibleTaskCount(prev => prev + 3);
            }
          }}
          scrollEventThrottle={16}
        >
          <LinearGradient
            colors={["#1e293b", "#334155"]}
            style={styles.heroSection}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => (active.value = !active.value)}>
                <Ionicons name="menu" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>UniMate</Text>
              <View style={styles.headerRight}>
                <SmallSOSButton />
                <TouchableOpacity 
                  onPress={() => router.push("/(screens)/notifications")}
                  style={styles.notificationBtn}
                >
                  <Ionicons name="notifications" size={24} color="#fff" />
                  {unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Text>
                    </View>
                  )}
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

          <View style={styles.body}>
          {/* STATS SECTION */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.statsContainer}>
            {quickStats.map((stat, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.statCard}
                onPress={() => stat.label.includes("Tasks") ? router.push("/(screens)/Tasks") : undefined}
                activeOpacity={stat.label.includes("Tasks") ? 0.7 : 1}
              >
                <View style={[styles.statIconBadge, { backgroundColor: stat.color + '10' }]}>
                  <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                </View>
                <View style={styles.statInfo}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* CAMPUS FEATURES SECTION */}
          <Animated.View entering={FadeInDown.delay(120)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Campus Hub</Text>
              <TouchableOpacity 
                style={[styles.debugBtn, { opacity: 0.5 }]} 
                onPress={async () => {
                  if (!user) return;
                  try {
                    const res = await fetch('http://172.16.7.33:5000/api/debug/mock-data', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ userId: user.id })
                    });
                    const data = await res.json();
                    if (data.success) Alert.alert("Success", "Mock data injected! Refresh to see changes.");
                  } catch (e) {
                    Alert.alert("Error", "Could not connect to backend");
                  }
                }}
              >
                <Ionicons name="bug-outline" size={14} color="#64748b" />
                <Text style={styles.debugText}>Mock Data</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.featuresGrid}>
              <TouchableOpacity 
                style={[styles.featureCard, { backgroundColor: '#4f46e5' }]} 
                onPress={() => router.push("/(screens)/StoryMode")}
              >
                <Ionicons name="play-circle" size={32} color="#fff" />
                <Text style={styles.featureLabel}>Semester Story</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.featureCard, { backgroundColor: '#1e293b' }]} 
                onPress={() => router.push("/(screens)/LostFoundFeed")}
              >
                <Ionicons name="search" size={32} color="#fff" />
                <Text style={styles.featureLabel}>Lost & Found</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.featureCard, { backgroundColor: '#059669' }]} 
                onPress={() => router.push("/(screens)/LendBorrowFeed")}
              >
                <Ionicons name="repeat" size={32} color="#fff" />
                <Text style={styles.featureLabel}>Lend & Borrow</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* WEEKLY ANALYTICS SECTION (Horizontal Cases) */}
          <Animated.View entering={FadeInDown.delay(150)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Weekly Overview</Text>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.insightsScrollContent}
            >
              {/* Box 1: Attendance Trends Chart + Circle */}
              <View style={[styles.insightCard, { width: width * 0.9, paddingRight: 0 }]}>
                <View style={styles.analyticsHeader}>
                  <Text style={styles.insightLabel}>Attendance</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginRight: 15 }}>
                     {/* Legends */}
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(148, 163, 184, 0.5)' }} />
                        <Text style={{ fontSize: 9, color: '#64748B' }}>Scheduled</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B82F6' }} />
                        <Text style={{ fontSize: 9, color: '#64748B' }}>Attended</Text>
                      </View>
                    </View>
                    {/* Icon at extreme right */}
                    <TouchableOpacity onPress={() => setActiveTooltip('attendance')}>
                      <Ionicons name="information-circle-outline" size={15} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <LineChart
                    data={{
                      labels: weeklyAttendanceTrendData.length > 0 
                        ? weeklyAttendanceTrendData.map(d => d.day) 
                        : getRollingLabels(),
                      datasets: [
                        { 
                          data: weeklyAttendanceTrendData.length > 0 ? weeklyAttendanceTrendData.map(d => d.scheduled || 0) : [0, 0, 0, 0, 0, 0, 0],
                          color: (opacity = 1) => `rgba(148, 163, 184, 0.5)`, 
                          strokeWidth: 2
                        },
                        { 
                          data: weeklyAttendanceTrendData.length > 0 ? weeklyAttendanceTrendData.map(d => d.attended || 0) : [0, 0, 0, 0, 0, 0, 0],
                          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, 
                          strokeWidth: 2
                        }
                      ],
                    }}
                    width={width * 0.55}
                    height={120}
                    chartConfig={{
                      backgroundColor: "#ffffff",
                      backgroundGradientFrom: "#ffffff",
                      backgroundGradientTo: "#ffffff",
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                      propsForLabels: { fontSize: 9, fontWeight: '700' }
                    }}
                    bezier
                    style={{ borderRadius: 12, paddingRight: 25, paddingBottom: 25 }}
                    withVerticalLines={false}
                    withHorizontalLines={true}
                  />
                  
                  {/* Attendance Ring inside Box 1 */}
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <ProgressChart
                      data={{
                        labels: ["Rate"],
                        data: [attendanceRate > 0 ? (attendanceRate > 1 ? 1 : attendanceRate) : 0.01]
                      }}
                      width={70}
                      height={70}
                      strokeWidth={5}
                      radius={24}
                      chartConfig={{
                        backgroundColor: "#ffffff",
                        backgroundGradientFrom: "#ffffff",
                        backgroundGradientTo: "#ffffff",
                        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                      }}
                      hideLegend={true}
                    />
                    <Text style={{ position: 'absolute', fontSize: 9, fontWeight: '800', color: '#10B981', bottom: 32 }}>
                      {Math.round((attendanceRate > 1 ? 1 : (attendanceRate || 0)) * 100)}%
                    </Text>
                    <Text style={{ fontSize: 7, color: '#64748B', marginTop: -5 }}>Overall Attendance</Text>
                  </View>
                </View>
              </View>

              {/* Box 2: Task Overview Chart */}
              <View style={[styles.insightCard, { width: width * 0.85 }]}>
                <View style={styles.analyticsHeader}>
                  <Text style={styles.insightLabel}>Task Overview</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {/* Legends */}
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#3B82F6' }} />
                        <Text style={{ fontSize: 9, color: '#64748B' }}>Created</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' }} />
                        <Text style={{ fontSize: 9, color: '#64748B' }}>Completed</Text>
                      </View>
                    </View>
                    {/* Icon at extreme right */}
                    <TouchableOpacity onPress={() => setActiveTooltip('tasks')}>
                      <Ionicons name="information-circle-outline" size={15} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </View>
                <LineChart
                  data={{
                    labels: weeklyTaskData.length > 0 
                      ? weeklyTaskData.map(d => d.day) 
                      : getRollingLabels(),
                    datasets: [
                      { 
                        data: weeklyTaskData.length > 0 ? weeklyTaskData.map(d => d.created || 0) : [0, 0, 0, 0, 0, 0, 0],
                        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, 
                        strokeWidth: 2
                      },
                      { 
                        data: weeklyTaskData.length > 0 ? weeklyTaskData.map(d => d.completed || 0) : [0, 0, 0, 0, 0, 0, 0],
                        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, 
                        strokeWidth: 2
                      }
                    ],
                  }}
                  width={width * 0.8}
                  height={120}
                  chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
                    style: { borderRadius: 12 },
                    propsForDots: { r: "3", strokeWidth: "1.5", stroke: "#3b82f6" },
                    propsForLabels: { fontSize: 9, fontWeight: '700' }
                  }}
                  bezier
                  style={{ borderRadius: 12, paddingRight: 35, paddingBottom: 25 }}
                  withVerticalLines={false}
                  withHorizontalLines={true}
                />
              </View>
            </ScrollView>
          </Animated.View>

          {/* UPCOMING HOLIDAYS SECTION */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <View style={styles.holidayCard}>
              <View style={[styles.holidayHeader, { justifyContent: 'space-between' }]}>
                <Text style={styles.holidayTitle}>Holidays this Month</Text>
                <TouchableOpacity onPress={() => setActiveTooltip('holidays')}>
                  <Ionicons name="information-circle-outline" size={16} color="#1E293B" />
                </TouchableOpacity>
              </View>

              <View style={styles.holidayList}>
                {holidays.length > 0 ? holidays.map((holiday, idx) => (
                  <View key={holiday.id} style={[styles.holidayItem, idx === 0 && styles.holidayItemActive]}>
                    <Text style={styles.holidayName} numberOfLines={1}>{holiday.name}</Text>
                    <View style={styles.holidayDateBadge}>
                      <Text style={styles.holidayDateText}>
                        {new Date(holiday.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </Text>
                    </View>
                  </View>
                )) : (
                  <View style={{ alignItems: 'center', padding: 10 }}>
                    <Text style={{ color: '#94A3B8', fontSize: 13 }}>No holidays this month</Text>
                  </View>
                )}
              </View>
            </View>
          </Animated.View>

          {/* SCHEDULE SECTION */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
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

          {/* TASKS SECTION */}
          <View style={[styles.section, { marginTop: -10 }]}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.sectionTitle}>Today's Tasks</Text>
                {todayTasks.filter(t => t.status === 'todo').length > 0 && (
                   <View style={styles.countBadge}>
                     <Text style={styles.countBadgeText}>{todayTasks.filter(t => t.status === 'todo').length}</Text>
                   </View>
                )}
              </View>
              <TouchableOpacity 
                style={styles.headerAddBtn}
                onPress={() => setIsAddTaskVisible(true)}
              >
                <Ionicons name="add-circle" size={10} color="#3B82F6" />
                <Text style={styles.addBtnText}>Add Task</Text>
              </TouchableOpacity>
            </View>

            {todayTasks.length > 0 ? (
              <View style={[styles.taskTodayList, styles.taskTodayBox]}>
                {todayTasks.slice(0, visibleTaskCount).map((task, index) => (
                  <TaskCard 
                    key={task.id} 
                    item={task} 
                    index={index} 
                    compact={true} 
                    onToggleStatus={async (id, status) => {
                      await toggleTaskStatus(id, status);
                      const updatedToday = await getTodayTasks();
                      setTodayTasks(updatedToday);
                      await refreshAnalytics();
                      const allTasks = await getTasks();
                      await scheduleTaskReminders(allTasks);
                    }}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="clipboard-outline" size={40} color="#CBD5E0" />
                <Text style={styles.emptyText}>Zero tasks due today. Relax!</Text>
              </View>
            )}
          </View>
          </View>
        </ScrollView>

        <AddTaskModal 
          visible={isAddTaskVisible}
          onClose={() => setIsAddTaskVisible(false)}
          onTaskAdded={fetchHomeData}
        />

        {/* Global Tooltip UI */}
        {activeTooltip && (
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={() => setActiveTooltip(null)}
            style={styles.tooltipOverlay}
          >
            <Animated.View 
              entering={FadeInDown.duration(300)}
              style={styles.tooltipBox}
            >
              <View style={styles.tooltipHeader}>
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <Text style={styles.tooltipTitle}>Quick Tip</Text>
              </View>
              <Text style={styles.tooltipText}>{tooltipContent[activeTooltip]}</Text>
              <TouchableOpacity 
                style={styles.tooltipCloseBtn}
                onPress={() => setActiveTooltip(null)}
              >
                <Text style={styles.tooltipCloseText}>Got it</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        )}

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
  notificationBtn: {
    position: "relative",
    padding: 2,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: "#2D3748",
  },
  badgeText: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "800",
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
    padding: 20,
    backgroundColor: "#F1F5F9",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 15,
    marginBottom: 25,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  featureCard: {
    flex: 1,
    height: 100,
    borderRadius: 20,
    padding: 15,
    justifyContent: 'space-between',
    elevation: 4,
  },
  featureLabel: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  debugBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  debugText: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
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
    fontSize: 18,
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
  headerAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
  },
  addBtnText: {
    fontSize: 7,
    fontWeight: "700",
    color: "#3B82F6",
  },
  taskTodayList: {
    marginTop: 5,
  },
  taskTodayBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  viewAllText: {
    fontSize: 13,
    color: "#3B82F6",
    fontWeight: "700",
  },
  countBadge: {
    backgroundColor: "#3B82F6",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  insightsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  insightCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 4,
  },
  attendancePercent: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },
  insightsScrollContent: {
    paddingRight: 20,
    gap: 16,
  },
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  analyticsBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  analyticsChartContainer: {
    marginBottom: 20,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  holidayCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
  },
  holidayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  holidayIconContainer: {
    backgroundColor: "#E0F2FE", // Cyan-ish background as in image
    padding: 6,
    borderRadius: 10,
  },
  holidayTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },
  holidayList: {
    gap: 8,
  },
  holidayItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10, // Consistent padding for all items
    borderRadius: 12,
  },
  holidayItemActive: {
    backgroundColor: "#F8FAFC",
  },
  holidayName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#475569",
    flex: 1, // Push date badge to the right
    marginRight: 10,
  },
  holidayDateBadge: {
    backgroundColor: "#CBD5E1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 95, // Consistent width for dates
    alignItems: 'center',
  },
  holidayDateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  tooltipOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 20,
  },
  tooltipBox: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  tooltipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  tooltipText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  tooltipCloseBtn: {
    marginTop: 20,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  tooltipCloseText: {
    color: '#3B82F6',
    fontWeight: '700',
    fontSize: 15,
  }
});

export default StudentHome;
