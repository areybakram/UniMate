import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function TaskDetails() {
  const router = useRouter();
  const { task } = useLocalSearchParams();
  
  if (!task) return null;
  const taskObj = typeof task === 'string' ? JSON.parse(task) : {};
  const isDone = taskObj.status === 'done';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString([], { 
        weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#1e293b", "#334155"]} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 20 }}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.mainCard}>
          <View style={styles.titleRow}>
             <View style={[styles.statusDot, { backgroundColor: isDone ? '#10B981' : '#F59E0B' }]} />
             <Text style={styles.title}>{taskObj.title}</Text>
          </View>
          
          <View style={[styles.badge, isDone ? styles.doneBadge : styles.todoBadge]}>
            <Text style={[styles.badgeText, isDone ? styles.doneBadgeText : styles.todoBadgeText]}>
               {isDone ? 'COMPLETED' : 'PENDING'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {taskObj.description || 'No additional description provided.'}
            </Text>
          </View>

          <View style={styles.timeSection}>
             <View style={styles.dateRow}>
                 <View style={styles.dateIconBox}>
                     <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                 </View>
                 <View>
                     <Text style={styles.dateLabel}>Start Time</Text>
                     <Text style={styles.dateValue}>{formatDate(taskObj.startDate)}</Text>
                 </View>
             </View>
          </View>

           <View style={styles.timeSection}>
             <View style={styles.dateRow}>
                 <View style={[styles.dateIconBox, { backgroundColor: '#fee2e2' }]}>
                     <Ionicons name="alarm-outline" size={20} color="#ef4444" />
                 </View>
                 <View>
                     <Text style={styles.dateLabel}>Deadline</Text>
                     <Text style={styles.dateValue}>{formatDate(taskObj.endDate)}</Text>
                 </View>
             </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center'
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { flex: 1 },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    minHeight: 250,
  },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginTop: 7, marginRight: 10 },
  title: { fontSize: 18, fontWeight: '800', color: '#1e293b', flex: 1 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 20 },
  todoBadge: { backgroundColor: '#fff7ed' },
  doneBadge: { backgroundColor: '#f0fdf4' },
  badgeText: { fontSize: 11, fontWeight: '800' },
  todoBadgeText: { color: '#c2410c' },
  doneBadgeText: { color: '#15803d' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  description: { fontSize: 14, color: '#334155', lineHeight: 20 },
  timeSection: { marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  dateLabel: { fontSize: 12, color: '#64748b', marginBottom: 2 },
  dateValue: { fontSize: 13, fontWeight: '600', color: '#1e293b' }
});
