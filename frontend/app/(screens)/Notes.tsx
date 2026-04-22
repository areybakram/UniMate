import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  Dimensions, 
  StatusBar,
  RefreshControl,
  ScrollView,
  Modal
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { RFValue } from 'react-native-responsive-fontsize';
import { AuthContext } from '@/Context/AuthContext';
import { supabase } from '@/supabaseClient';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');

const Notes = () => {
  const { user }: any = useContext(AuthContext);
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [courseFilter, setCourseFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const [activeFilter, setActiveFilter] = useState<'course' | 'timeline' | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('lecture_notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err: any) {
      console.error("Fetch Notes Error:", err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [fetchNotes])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchNotes();
  };

  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // Course Filter
    if (courseFilter !== 'all') {
      result = result.filter(n => n.course_id === courseFilter);
    }

    // Date Filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      result = result.filter(n => {
        const noteDate = new Date(n.lecture_date);
        
        if (dateFilter === 'today') {
          return noteDate >= startOfToday;
        }
        
        const diffDays = (now.getTime() - noteDate.getTime()) / (1000 * 3600 * 24);
        if (dateFilter === 'week') return diffDays < 7;
        if (dateFilter === 'month') return diffDays < 30;
        return true;
      });
    }

    return result;
  }, [notes, courseFilter, dateFilter]);

  const renderNoteItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View 
      entering={FadeInDown.delay(index * 50)}
      style={styles.noteCardContainer}
    >
      <TouchableOpacity 
        style={styles.noteCard}
        onPress={() => router.push({
          pathname: '/(screens)/LectureNotes',
          params: { savedNote: JSON.stringify(item) }
        })}
      >
        <View style={styles.noteCardContent}>
          <View style={styles.noteIconBox}>
            <MaterialCommunityIcons name="text-box-search-outline" size={22} color="#475569" />
          </View>
          <View style={styles.noteInfo}>
            <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
            <View style={styles.noteMeta}>
              <View style={styles.courseTag}>
                <Text style={styles.courseTagText}>{item.course_id}</Text>
              </View>
              <Text style={styles.dateText}>
                {new Date(item.lecture_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#cbd5e1" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <Animated.View entering={FadeInUp} style={styles.actionCard}>
        <View style={styles.actionTextContent}>
          <Text style={styles.actionTitle}>Lecture Intelligence</Text>
          <Text style={styles.actionSubtitle}>Record and synthesize your lectures with AI.</Text>
        </View>
        <TouchableOpacity 
          style={styles.recordActionBtn}
          onPress={() => router.push('/(screens)/LectureNotes')}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          <Text style={styles.recordActionText}>New Note</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.filterSection}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Course</Text>
          <TouchableOpacity 
            style={styles.pickerWrapper}
            onPress={() => setActiveFilter('course')}
          >
            <Text style={styles.pickerValue} numberOfLines={1}>
              {courseFilter === 'all' ? 'All Subjects' : courseFilter}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Timeline</Text>
          <TouchableOpacity 
            style={styles.pickerWrapper}
            onPress={() => setActiveFilter('timeline')}
          >
            <Text style={styles.pickerValue} numberOfLines={1}>
              {dateFilter === 'all' ? 'All Time' : 
               dateFilter === 'today' ? 'Today' : 
               dateFilter === 'week' ? 'This Week' : 'This Month'}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Archive</Text>
        <Text style={styles.listCount}>{filteredNotes.length} Found</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Academic Notes</Text>
        <MaterialCommunityIcons name="shield-check-outline" size={20} color="#64748b" />
      </View>

      <FlatList
        data={filteredNotes}
        renderItem={renderNoteItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#2563eb" />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyView}>
              <MaterialCommunityIcons name="note-text-outline" size={48} color="#e2e8f0" />
              <Text style={styles.emptyText}>No results match your filters</Text>
            </View>
          ) : (
            <ActivityIndicator size="small" color="#94a3b8" style={{ marginTop: 50 }} />
          )
        }
      />

      {/* Filter Selection Modal */}
      <Modal
        visible={activeFilter !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveFilter(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setActiveFilter(null)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {activeFilter === 'course' ? 'Select Course' : 'Select Timeline'}
              </Text>
              <TouchableOpacity onPress={() => setActiveFilter(null)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {activeFilter === 'course' ? (
                <>
                  <TouchableOpacity 
                    style={[styles.optionItem, courseFilter === 'all' && styles.optionItemActive]}
                    onPress={() => { setCourseFilter('all'); setActiveFilter(null); }}
                  >
                    <Text style={[styles.optionText, courseFilter === 'all' && styles.optionTextActive]}>All Subjects</Text>
                    {courseFilter === 'all' && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                  </TouchableOpacity>
                  {user?.timetable_data?.map((c: any, i: number) => (
                    <TouchableOpacity 
                      key={i}
                      style={[styles.optionItem, courseFilter === c.course_code && styles.optionItemActive]}
                      onPress={() => { setCourseFilter(c.course_code); setActiveFilter(null); }}
                    >
                      <Text style={[styles.optionText, courseFilter === c.course_code && styles.optionTextActive]}>
                        {c.course_code} - {c.subject}
                      </Text>
                      {courseFilter === c.course_code && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity 
                    style={[styles.optionItem, courseFilter === 'Others' && styles.optionItemActive]}
                    onPress={() => { setCourseFilter('Others'); setActiveFilter(null); }}
                  >
                    <Text style={[styles.optionText, courseFilter === 'Others' && styles.optionTextActive]}>Others</Text>
                    {courseFilter === 'Others' && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {[
                    { label: 'All Time', value: 'all' },
                    { label: 'Today', value: 'today' },
                    { label: 'This Week', value: 'week' },
                    { label: 'This Month', value: 'month' },
                  ].map((opt) => (
                    <TouchableOpacity 
                      key={opt.value}
                      style={[styles.optionItem, dateFilter === opt.value && styles.optionItemActive]}
                      onPress={() => { setDateFilter(opt.value); setActiveFilter(null); }}
                    >
                      <Text style={[styles.optionText, dateFilter === opt.value && styles.optionTextActive]}>{opt.label}</Text>
                      {dateFilter === opt.value && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topBar: { 
    paddingTop: 60, 
    paddingBottom: 15, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backBtn: { marginRight: 15 },
  topBarTitle: { color: '#0f172a', fontSize: RFValue(18), fontWeight: '900', letterSpacing: -0.5, flex: 1 },
  
  scrollContent: { paddingBottom: 40 },
  headerContent: { padding: 25 },
  
  actionCard: { 
    backgroundColor: '#f8fafc', 
    borderRadius: 20, 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 25
  },
  actionTextContent: { flex: 1 },
  actionTitle: { fontSize: RFValue(15), fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  actionSubtitle: { fontSize: RFValue(11), color: '#64748b' },
  recordActionBtn: { 
    backgroundColor: '#0f172a', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 12,
    gap: 6
  },
  recordActionText: { color: '#fff', fontWeight: '700', fontSize: RFValue(11) },
  
  filterSection: { flexDirection: 'row', gap: 12, marginBottom: 25 },
  filterGroup: { flex: 1 },
  filterLabel: { fontSize: RFValue(10), fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6, marginLeft: 4 },
  pickerWrapper: { 
    backgroundColor: '#f8fafc', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#f1f5f9', 
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between'
  },
  pickerValue: { fontSize: RFValue(11), color: '#1e293b', fontWeight: '600', flex: 1 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: RFValue(16), fontWeight: '800', color: '#0f172a' },
  optionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  optionItemActive: { backgroundColor: '#f0f7ff', marginHorizontal: -24, paddingHorizontal: 24 },
  optionText: { fontSize: RFValue(13), color: '#475569', fontWeight: '500' },
  optionTextActive: { color: '#2563eb', fontWeight: '700' },
  
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  listTitle: { fontSize: RFValue(13), fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: 1 },
  listCount: { fontSize: RFValue(11), color: '#94a3b8', fontWeight: '600' },
  
  noteCardContainer: { paddingHorizontal: 25, marginBottom: 10 },
  noteCard: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#f1f5f9',
  },
  noteCardContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  noteIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  noteInfo: { flex: 1 },
  noteTitle: { fontSize: RFValue(13), fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  noteMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  courseTag: { backgroundColor: '#f1f5f9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  courseTagText: { fontSize: RFValue(9), fontWeight: '800', color: '#64748b' },
  dateText: { fontSize: RFValue(10), color: '#94a3b8', fontWeight: '500' },
  
  emptyView: { alignItems: 'center', marginTop: 40, padding: 40 },
  emptyText: { fontSize: RFValue(14), fontWeight: '600', color: '#94a3b8', marginTop: 12 },
});

export default Notes;