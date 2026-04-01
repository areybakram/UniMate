import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { extractCoursesFromImage, ExtractedCourse } from "@/utils/geminiService";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  runOnJS,
  withTiming
} from "react-native-reanimated";
import { saveAttendance, loadAttendance, removeAttendance, AttendanceRecord, clearAllAttendance } from "@/utils/attendanceService";
import { supabase } from "../../../supabaseClient";
import DropdownModal from "@/components/DropdownModal";
import { scheduleClassReminders } from "@/utils/notificationService";

const { width } = Dimensions.get("window");

interface TimetableItem {
  id: string;
  subject: string;
  course_code: string;
  teacher_name: string;
  teacher_dept: string;
  day: string;
  start_time: string;
  end_time: string;
  room: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface ClassCardProps {
  item: TimetableItem;
  index: number;
  isToday: boolean;
  isTaken: boolean;
  onMarkTaken: (id: string) => void;
  onResetTaken: (id: string) => void;
  status: "ongoing" | "finished" | "upcoming" | null;
}

const ClassCard: React.FC<ClassCardProps> = ({ item, index, isToday, isTaken, onMarkTaken, onResetTaken, status }) => {
  const isOngoing = status === "ongoing";
  const isFinished = status === "finished";
  const translateX = useSharedValue(0);
  
  const panGesture = Gesture.Pan()
    .enabled(isToday)
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > 100 && !isTaken) {
        translateX.value = withSpring(0);
        runOnJS(onMarkTaken)(item.id);
      } else if (event.translationX < -100 && isTaken) {
        translateX.value = withSpring(0);
        runOnJS(onResetTaken)(item.id);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.swipeContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          entering={FadeInDown.delay(index * 100)}
          style={[
            styles.cardContainer, 
            isOngoing && styles.activeCard,
            isFinished && !isTaken && styles.finishedCard,
            animatedCardStyle
          ]}
        >
          <View style={styles.timeSection}>
            <Text style={[styles.startTime, (isFinished || isTaken) && styles.finishedText]}>
              {item.start_time.slice(0, 5)}
            </Text>
            <View style={styles.timeDivider} />
            <Text style={[styles.endTime, (isFinished || isTaken) && styles.finishedText]}>
              {item.end_time.slice(0, 5)}
            </Text>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.subjectRow}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.subjectText, (isFinished || isTaken) && styles.finishedText]}>
                  {item.subject}
                </Text>
                {isTaken && <Ionicons name="checkmark-circle" size={16} color="#10B981" />}
              </View>
              {isOngoing && !isTaken && (
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>ONGOING</Text>
                </View>
              )}
              {isFinished && !isTaken && (
                <View style={styles.finishedBadge}>
                  <Ionicons name="time-outline" size={12} color="#94a3b8" />
                  <Text style={styles.finishedBadgeText}>FINISHED</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.courseCode, (isFinished || isTaken) && { color: "#94a3b8" }]}>
              {item.course_code}
            </Text>
            
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="person" size={14} color="#64748b" />
                <Text style={styles.metaText}>{item.teacher_name}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="location" size={14} color="#64748b" />
                <Text style={styles.metaText}>Room: {item.room}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default function TimetableScreen() {
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() - 1] || DAYS[0]);
  const [classes, setClasses] = useState<TimetableItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [batchCode, setBatchCode] = useState("SP24-BCS-A");
  const [availableBatches, setAvailableBatches] = useState<string[]>([]);
  const [isBatchModalVisible, setIsBatchModalVisible] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [personalCourses, setPersonalCourses] = useState<ExtractedCourse[]>([]);
  const [unmatchedCourses, setUnmatchedCourses] = useState<ExtractedCourse[]>([]);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceRecord>({});

  const fetchAvailableBatches = async () => {
    try {
      const { data, error } = await supabase
        .from("timetables")
        .select("batch_code");
      
      if (error) throw error;
      
      const uniqueBatches = Array.from(
        new Set((data || []).map((item: any) => item.batch_code))
      ).sort() as string[];
      setAvailableBatches(uniqueBatches);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const fetchTimetable = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("timetables").select("*").eq("day", selectedDay);

      if (isPersonalized && personalCourses.length > 0) {
        const filterStr = personalCourses
          .map((c) => `and(course_code.ilike.${c.course_code},batch_code.ilike.${c.batch_code})`)
          .join(",");
        
        const { data: allPersonalData, error: allErr } = await supabase
          .from("timetables")
          .select("*")
          .or(filterStr);

        if (allErr) throw allErr;

        const foundCourseCodes = new Set(allPersonalData?.map((c: any) => c.course_code.toUpperCase()));
        const missing = personalCourses.filter(pc => !foundCourseCodes.has(pc.course_code.toUpperCase()));
        setUnmatchedCourses(missing);

        const dayClasses = allPersonalData?.filter((c: any) => c.day === selectedDay).sort((a: any, b: any) => 
          a.start_time.localeCompare(b.start_time)
        );
        setClasses(dayClasses || []);
      } else {
        const { data, error } = await query
          .eq("batch_code", batchCode)
          .order("start_time");

        if (error) throw error;
        setClasses(data || []);
      }

      // Re-sync notifications in background whenever timetable list changes significantly 
      if (isPersonalized && personalCourses.length > 0) {
          const filterStr = personalCourses
            .map((c) => `and(course_code.ilike.${c.course_code},batch_code.ilike.${c.batch_code})`)
            .join(",");
          const { data: fullData } = await supabase.from("timetables").select("*").or(filterStr);
          if (fullData) scheduleClassReminders(fullData);
      } else if (!isPersonalized) {
          const { data: batchData } = await supabase.from("timetables").select("*").eq("batch_code", batchCode);
          if (batchData) scheduleClassReminders(batchData);
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalizeToggle = async () => {
    if (personalCourses.length > 0) {
      setIsPersonalized(!isPersonalized);
    } else {
      await startPersonalizationFlow();
    }
  };

  const startPersonalizationFlow = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setIsAiProcessing(true);
      try {
        const extracted = await extractCoursesFromImage(result.assets[0].base64);
        if (extracted && extracted.length > 0) {
          setPersonalCourses(extracted);
          setIsPersonalized(true);
          await AsyncStorage.setItem("personal_timetable", JSON.stringify(extracted));
          alert(`Success! Successfully extracted ${extracted.length} courses.`);
        }
      } catch (error: any) {
        alert("Personalization Failed: " + error.message);
      } finally {
        setIsAiProcessing(false);
      }
    }
  };

  const loadPersonalizedData = async () => {
    const savedData = await AsyncStorage.getItem("personal_timetable");
    if (savedData) {
      setPersonalCourses(JSON.parse(savedData));
    }
  };

  const confirmDeletePersonal = () => {
    Alert.alert(
      "Delete Personalized Timetable?",
      "This will remove your custom schedule. You will need to upload your registration card again to restore it.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: resetToBatch }
      ]
    );
  };

  const resetToBatch = async () => {
    setIsPersonalized(false);
    setUnmatchedCourses([]);
    setPersonalCourses([]);
    await AsyncStorage.removeItem("personal_timetable");
    await clearAllAttendance();
    await refreshAttendance();
    if (availableBatches.length > 0) {
      setBatchCode(availableBatches[0]); // fallback to first available
    } else {
      setBatchCode("SP24-BCS-A"); 
    }
  };

  const refreshAttendance = async () => {
    const data = await loadAttendance();
    setAttendance(data);
  };

  useEffect(() => {
    fetchAvailableBatches();
    loadPersonalizedData();
    refreshAttendance();
  }, []);

  useEffect(() => {
    fetchTimetable();
  }, [selectedDay, batchCode]);

  const getClassStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const currentDay = DAYS[now.getDay() - 1] || DAYS[0];
    
    if (selectedDay !== currentDay) return null;

    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    
    const sTime = startH * 3600 + startM * 60;
    const eTime = endH * 3600 + endM * 60;
    
    if (currentTime >= sTime && currentTime <= eTime) return "ongoing";
    if (currentTime > eTime) return "finished";
    return "upcoming";
  };

  const handleMarkTaken = async (classId: string) => {
    await saveAttendance(classId, "taken");
    await refreshAttendance();
  };

  const handleResetTaken = async (classId: string) => {
    await removeAttendance(classId);
    await refreshAttendance();
  };

  const now = new Date();
  const currentDay = DAYS[now.getDay() - 1] || DAYS[0];
  const isToday = selectedDay === currentDay;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#1e293b", "#334155"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={() => !isPersonalized && setIsBatchModalVisible(true)}
            style={[styles.batchSelectorContainer, isPersonalized && { opacity: 0.95 }]}
            activeOpacity={isPersonalized ? 1 : 0.7}
          >
            <Text style={styles.welcomeText}>{isPersonalized ? "University" : "Select Batch"}</Text>
            <View style={styles.batchRow}>
              <Text style={styles.batchLabel}>{isPersonalized ? "Personal Schedule ✨" : batchCode}</Text>
              {!isPersonalized && <Ionicons name="chevron-down" size={20} color="#fff" style={{ marginTop: 4 }} />}
            </View>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              onPress={handlePersonalizeToggle} 
              onLongPress={personalCourses.length > 0 ? confirmDeletePersonal : undefined}
              style={[
                styles.calIcon,
                personalCourses.length > 0 && { backgroundColor: "rgba(59, 130, 246, 0.3)" }
              ]}
            >
              <Ionicons 
                name={isPersonalized ? "briefcase" : personalCourses.length > 0 ? "briefcase-outline" : "sparkles"} 
                size={22} 
                color={isPersonalized ? "#fff" : personalCourses.length > 0 ? "#fff" : "#fff"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daySelector}
        >
          {DAYS.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)}
              style={[
                styles.dayButton,
                selectedDay === day && styles.activeDayButton,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  selectedDay === day && styles.activeDayText,
                ]}
              >
                {day.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <View style={styles.content}>
        {isAiProcessing ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.processingText}>Gemini AI is analyzing your card...</Text>
          </View>
        ) : isLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
            {/* UNMATCHED COURSES WARNING */}
            {isPersonalized && unmatchedCourses.length > 0 && (
              <View style={styles.unmatchedBox}>
                <View style={styles.unmatchedHeader}>
                  <Ionicons name="warning-outline" size={18} color="#991b1b" />
                  <Text style={styles.unmatchedTitle}>Missing from Database</Text>
                </View>
                <Text style={styles.unmatchedSubtitle}>These courses were found on your card but aren't in our schedule system yet:</Text>
                {unmatchedCourses.map((course, idx) => (
                  <View key={idx} style={styles.unmatchedItem}>
                    <Text style={styles.unmatchedItemText}>{course.subject} ({course.course_code})</Text>
                    <Text style={styles.unmatchedBatch}>{course.batch_code}</Text>
                  </View>
                ))}
              </View>
            )}

            {classes.length > 0 ? (
              classes.map((item, index) => (
                <ClassCard 
                  key={item.id || `${item.course_code}-${index}`}
                  item={item}
                  index={index}
                  isToday={isToday}
                  isTaken={isToday && attendance[item.id] === 'taken'}
                  onMarkTaken={handleMarkTaken}
                  onResetTaken={handleResetTaken}
                  status={getClassStatus(item.start_time, item.end_time)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="cafe-outline" size={80} color="#e2e8f0" />
                <Text style={styles.emptyTitle}>Academic Break!</Text>
                <Text style={styles.emptySubtitle}>
                  No classes scheduled for {selectedDay}.
                </Text>
              </View>
            )}

            {/* RESET HINT / BUTTON */}
            {isPersonalized && (
              <TouchableOpacity 
                style={styles.resetPersonalBtn} 
                onPress={confirmDeletePersonal}
              >
                <Ionicons name="trash-outline" size={16} color="#94a3b8" />
                <Text style={styles.resetPersonalText}>Clear Personalized Timetable</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </View>

      <DropdownModal
        visible={isBatchModalVisible}
        onClose={() => setIsBatchModalVisible(false)}
        onSelect={(batch) => setBatchCode(batch)}
        options={availableBatches}
        selectedValue={batchCode}
        title="Select Batch Code"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  welcomeText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "500",
  },
  batchLabel: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },
  batchSelectorContainer: {
    flex: 1,
  },
  batchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  calIcon: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 10,
    borderRadius: 14,
  },
  resetIcon: {
    backgroundColor: "rgba(255,100,100,0.2)",
    padding: 10,
    borderRadius: 14,
  },
  processingText: {
    marginTop: 16,
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },
  unmatchedBox: {
    backgroundColor: "#fef2f2",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  unmatchedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  unmatchedTitle: {
    color: "#991b1b",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  unmatchedSubtitle: {
    color: "#b91c1c",
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 18,
  },
  unmatchedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.5)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  unmatchedItemText: {
    color: "#450a0a",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  unmatchedBatch: {
    color: "#7f1d1d",
    fontSize: 11,
    fontWeight: "700",
    backgroundColor: "#fee2e2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  daySelector: {
    paddingHorizontal: 20,
    gap: 12,
  },
  dayButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  activeDayButton: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  dayText: {
    color: "#94a3b8",
    fontWeight: "700",
    fontSize: 14,
  },
  activeDayText: {
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  cardContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 24,
    marginBottom: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  activeCard: {
    borderColor: "#3b82f6",
    backgroundColor: "#f0f9ff",
  },
  finishedCard: {
    backgroundColor: "#f8fafc",
    opacity: 0.7,
  },
  timeSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: "#f1f5f9",
    minWidth: 70,
  },
  startTime: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1e293b",
  },
  endTime: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  timeDivider: {
    width: 2,
    height: 12,
    backgroundColor: "#cbd5e1",
    marginVertical: 4,
    borderRadius: 1,
  },
  detailsSection: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: "center",
  },
  subjectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  subjectText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e293b",
  },
  courseCode: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    gap: 15,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22c55e",
  },
  liveText: {
    color: "#166534",
    fontSize: 10,
    fontWeight: "800",
  },
  missedCard: {
    opacity: 0.8,
    backgroundColor: "#fff5f5",
    borderColor: "#feb2b2",
  },
  finishedText: {
    color: "#94a3b8",
  },
  finishedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  finishedBadgeText: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: "800",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#475569",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
  },
  resetPersonalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 32,
    paddingVertical: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#e2e8f0",
    borderRadius: 20,
    backgroundColor: "rgba(241, 245, 249, 0.5)",
  },
  resetPersonalText: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "700",
  },
  swipeContainer: {
    position: "relative",
    marginBottom: 16,
  },
  swipeBackground: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "#10B981",
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
  swipeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  takenCard: {
    backgroundColor: "#ecfdf5",
    borderColor: "#10B981",
    opacity: 0.8,
  },
  takenBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d1fae5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  takenText: {
    color: "#065f46",
    fontSize: 10,
    fontWeight: "800",
  },
});
