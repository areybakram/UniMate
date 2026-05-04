import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  TextInput,
  Modal
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AudioService } from '@/utils/audioService';
import { transcribeLecture, saveLectureNotes, LectureNotes as LectureNotesType } from '@/utils/geminiService';
import { router, useLocalSearchParams } from 'expo-router';
import { AuthContext } from '@/Context/AuthContext';
import { supabase } from '@/supabaseClient';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  withSequence,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');

export default function LectureNotesScreen() {
  const { user }: any = useContext(AuthContext);
  const params = useLocalSearchParams();
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState<LectureNotesType | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Form State
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [availableProfessors, setAvailableProfessors] = useState<string[]>([]);
  const [isLoadingProfs, setIsLoadingProfs] = useState(false);
  const [lectureDate, setLectureDate] = useState(new Date().toLocaleDateString());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showProfessorDropdown, setShowProfessorDropdown] = useState(false);

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setLectureDate(date.toLocaleDateString());
    }
  };

  // Animation values
  const pulse = useSharedValue(1);

  useEffect(() => {
    // If we are viewing a saved note
    if (params.savedNote) {
      const saved = JSON.parse(params.savedNote as string);
      setNotes({
        title: saved.title,
        overview: saved.overview,
        key_concepts: saved.key_concepts,
        sections: saved.sections,
        summary: saved.summary
      });
      setSelectedCourse(saved.course_id);
      setSelectedProfessor(saved.professor_name || '');
      setLectureDate(new Date(saved.lecture_date).toLocaleDateString());
    }
  }, [params.savedNote]);

  // Fetch Professors when course changes
  useEffect(() => {
    const fetchProfessors = async () => {
      if (!selectedCourse || selectedCourse === 'Others') {
        setAvailableProfessors([]);
        setSelectedProfessor('');
        return;
      }

      setIsLoadingProfs(true);
      try {
        const courseInfo = user?.timetable_data?.find((c: any) => c.course_code === selectedCourse);
        let courseProfs: string[] = [];

        if (courseInfo && (courseInfo.batch_code || courseInfo.batch)) {
          const batchCode = courseInfo.batch_code || courseInfo.batch;
          
          const { data: timetableData } = await supabase
            .from('timetables')
            .select('teacher_name')
            .ilike('course_code', selectedCourse)
            .ilike('batch_code', batchCode);

          if (timetableData && timetableData.length > 0) {
            courseProfs = Array.from(new Set(timetableData.map((t: any) => t.teacher_name).filter(Boolean)));
          }
        }

        setAvailableProfessors(courseProfs);
        
        if (courseProfs.length > 0 && !selectedProfessor) {
          setSelectedProfessor(courseProfs[0]);
        } else if (courseProfs.length === 0 && !selectedProfessor) {
          setSelectedProfessor('');
        }
      } catch (err) {
        console.error("Fetch Profs Error:", err);
      } finally {
        setIsLoadingProfs(false);
      }
    };

    fetchProfessors();
  }, [selectedCourse]);
  useEffect(() => {
    if (isRecording) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      pulse.value = withTiming(1);
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const animatedPulse = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.2], [1, 0.5], Extrapolate.CLAMP)
  }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleStartRecording = async () => {
    try {
      setNotes(null);
      setTimer(0);
      await AudioService.startRecording();
      setIsRecording(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not start recording');
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);
    try {
      const uri = await AudioService.stopRecording();
      if (!uri) throw new Error('No audio recorded');

      const base64 = await AudioService.uriToBase64(uri);
      const mimeType = Platform.OS === 'ios' ? 'audio/x-m4a' : 'audio/m4a';
      
      const result = await transcribeLecture(base64, mimeType);
      setNotes(result);
      
      // Auto-open save modal after transcription
      setShowSaveModal(true);
    } catch (err: any) {
      Alert.alert('Transcription Failed', err.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedCourse) {
      Alert.alert('Selection Required', 'Please select a course for these notes.');
      return;
    }
    
    setIsSaving(true);
    try {
      await saveLectureNotes({
        userId: user.id,
        courseId: selectedCourse,
        professorName: selectedProfessor,
        lectureDate: selectedDate.toISOString(),
        notesData: notes!
      });
      
      Alert.alert('Success', 'Notes saved to your cloud repository.');
      setShowSaveModal(false);
    } catch (err: any) {
      Alert.alert('Save Error', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (isProcessing) {
      return (
        <View style={styles.centerView}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.processingText}>Analyzing Lecture...</Text>
          <Text style={styles.subProcessingText}>This may take a minute depending on length.</Text>
        </View>
      );
    }

    if (notes) {
      return (
        <ScrollView style={styles.notesContainer} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(600)}>
            <View style={styles.notesHeader}>
              <View style={styles.badgeRow}>
                <View style={styles.courseBadge}>
                  <Text style={styles.courseBadgeText}>{selectedCourse || 'No Course Selected'}</Text>
                </View>
                {selectedProfessor ? (
                  <View style={[styles.courseBadge, { backgroundColor: '#f0fdf4' }]}>
                    <Text style={[styles.courseBadgeText, { color: '#166534' }]}>Prof. {selectedProfessor}</Text>
                  </View>
                ) : null}
                <View style={[styles.courseBadge, { backgroundColor: '#f8fafc' }]}>
                  <Text style={[styles.courseBadgeText, { color: '#64748b' }]}>{lectureDate}</Text>
                </View>
              </View>
              <Text style={styles.notesTitle}>{notes.title}</Text>
              <View style={styles.overviewCard}>
                <Text style={styles.sectionHeading}>Overview</Text>
                <Text style={styles.overviewText}>{notes.overview}</Text>
              </View>
            </View>

            <View style={styles.contentSection}>
              <Text style={styles.sectionHeading}>Key Concepts</Text>
              {notes.key_concepts.map((concept, index) => (
                <View key={index} style={styles.conceptItem}>
                  <Ionicons name="bookmark" size={14} color="#2563eb" />
                  <Text style={styles.conceptText}>{concept}</Text>
                </View>
              ))}
            </View>

            <View style={styles.contentSection}>
              <Text style={styles.sectionHeading}>Detailed Notes</Text>
              {notes.sections.map((section, index) => (
                <View key={index} style={styles.detailedSection}>
                  <Text style={styles.detailedHeading}>{section.heading}</Text>
                  <Text style={styles.detailedContent}>{section.content}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.contentSection, { marginBottom: 100 }]}>
              <Text style={styles.sectionHeading}>Summary</Text>
              <Text style={styles.summaryText}>{notes.summary}</Text>
            </View>
          </Animated.View>
        </ScrollView>
      );
    }

    return (
      <View style={styles.centerView}>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="microphone-outline" size={40} color="#64748b" />
          <Text style={styles.infoTitle}>Lecture Recorder</Text>
          <Text style={styles.infoDesc}>Record your professor's lecture and let AI generate structured notes for you.</Text>
          <TouchableOpacity 
            style={styles.historyBtn}
            onPress={() => router.push('/(screens)/Notes')}
          >
            <Ionicons name="time-outline" size={18} color="#2563eb" />
            <Text style={styles.historyBtnText}>View Archive</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Lecture Notes</Text>
        {notes && !params.savedNote ? (
          <TouchableOpacity onPress={() => setShowSaveModal(true)} style={styles.saveActionBtn}>
            <Ionicons name="save-outline" size={22} color="#fff" />
          </TouchableOpacity>
        ) : <View style={{ width: 40 }} />}
      </View>

      <View style={{ flex: 1 }}>
        {renderContent()}
      </View>

      {!notes && (
        <View style={styles.bottomControl}>
          {isRecording && (
            <View style={styles.timerContainer}>
              <View style={styles.redDot} />
              <Text style={styles.timerText}>{formatTime(timer)}</Text>
            </View>
          )}
          
          <View style={styles.recordButtonContainer}>
            {isRecording && <Animated.View style={[styles.pulseCircle, animatedPulse]} />}
            <TouchableOpacity 
              style={[styles.recordBtn, isRecording && styles.recordBtnActive]} 
              onPress={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isProcessing}
            >
              <Ionicons 
                name={isRecording ? "stop" : "mic"} 
                size={32} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.controlLabel}>
            {isRecording ? "Tap to Finish" : (isProcessing ? "Processing..." : "Tap to Record")}
          </Text>
        </View>
      )}

      {/* Save Modal */}
      <Modal
        visible={showSaveModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {showCourseDropdown ? (
              <View>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Course</Text>
                  <TouchableOpacity onPress={() => setShowCourseDropdown(false)}>
                    <Ionicons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
                  <TouchableOpacity 
                    style={[styles.optionItem, selectedCourse === '' && styles.optionItemActive]}
                    onPress={() => { setSelectedCourse(''); setShowCourseDropdown(false); }}
                  >
                    <Text style={[styles.optionText, selectedCourse === '' && styles.optionTextActive]}>Choose a course...</Text>
                    {selectedCourse === '' && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                  </TouchableOpacity>
                  {user?.timetable_data?.map((course: any, idx: number) => (
                    <TouchableOpacity 
                      key={idx}
                      style={[styles.optionItem, selectedCourse === course.course_code && styles.optionItemActive]}
                      onPress={() => { setSelectedCourse(course.course_code); setShowCourseDropdown(false); }}
                    >
                      <Text style={[styles.optionText, selectedCourse === course.course_code && styles.optionTextActive]}>
                        {course.course_code} - {course.subject}
                      </Text>
                      {selectedCourse === course.course_code && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity 
                    style={[styles.optionItem, selectedCourse === 'Others' && styles.optionItemActive]}
                    onPress={() => { setSelectedCourse('Others'); setShowCourseDropdown(false); }}
                  >
                    <Text style={[styles.optionText, selectedCourse === 'Others' && styles.optionTextActive]}>Others</Text>
                    {selectedCourse === 'Others' && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                  </TouchableOpacity>
                </ScrollView>
              </View>
            ) : showProfessorDropdown ? (
              <View>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Instructor</Text>
                  <TouchableOpacity onPress={() => setShowProfessorDropdown(false)}>
                    <Ionicons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
                  <TouchableOpacity 
                    style={[styles.optionItem, selectedProfessor === '' && styles.optionItemActive]}
                    onPress={() => { setSelectedProfessor(''); setShowProfessorDropdown(false); }}
                  >
                    <Text style={[styles.optionText, selectedProfessor === '' && styles.optionTextActive]}>Select Instructor</Text>
                    {selectedProfessor === '' && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                  </TouchableOpacity>
                  {availableProfessors.map((name, idx) => (
                    <TouchableOpacity 
                      key={idx}
                      style={[styles.optionItem, selectedProfessor === name && styles.optionItemActive]}
                      onPress={() => { setSelectedProfessor(name); setShowProfessorDropdown(false); }}
                    >
                      <Text style={[styles.optionText, selectedProfessor === name && styles.optionTextActive]}>{name}</Text>
                      {selectedProfessor === name && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity 
                    style={[styles.optionItem, selectedProfessor === 'Not Listed' && styles.optionItemActive]}
                    onPress={() => { setSelectedProfessor('Not Listed'); setShowProfessorDropdown(false); }}
                  >
                    <Text style={[styles.optionText, selectedProfessor === 'Not Listed' && styles.optionTextActive]}>Other Professor</Text>
                    {selectedProfessor === 'Not Listed' && <Ionicons name="checkmark" size={20} color="#2563eb" />}
                  </TouchableOpacity>
                </ScrollView>
              </View>
            ) : (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Save Lecture</Text>
                  <TouchableOpacity onPress={() => {
                    setShowSaveModal(false);
                    setShowCourseDropdown(false);
                    setShowProfessorDropdown(false);
                  }}>
                    <Ionicons name="close" size={24} color="#64748b" />
                  </TouchableOpacity>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Select Course</Text>
                  <TouchableOpacity 
                    style={styles.customPickerWrapper}
                    onPress={() => setShowCourseDropdown(true)}
                  >
                    <Text style={[styles.customPickerValue, !selectedCourse && { color: '#94a3b8' }]} numberOfLines={1}>
                      {selectedCourse ? selectedCourse : 'Choose a course...'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                {selectedCourse && selectedCourse !== 'Others' && (
                  <View style={styles.formGroup}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                      <Text style={[styles.label, { marginBottom: 0 }]}>Instructor</Text>
                      {isLoadingProfs && <ActivityIndicator size="small" color="#2563eb" />}
                    </View>
                    <TouchableOpacity 
                      style={styles.customPickerWrapper}
                      onPress={() => setShowProfessorDropdown(true)}
                    >
                      <Text style={[styles.customPickerValue, !selectedProfessor && { color: '#94a3b8' }]} numberOfLines={1}>
                        {selectedProfessor ? selectedProfessor : 'Select Instructor'}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color="#94a3b8" />
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Lecture Date</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                    <View pointerEvents="none">
                      <TextInput
                        style={[styles.textInput, { backgroundColor: '#f8fafc', color: '#64748b' }]}
                        value={lectureDate}
                        editable={false}
                      />
                    </View>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                    />
                  )}
                </View>

                <TouchableOpacity 
                  style={styles.finalSaveBtn}
                  onPress={handleSaveNotes}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                      <Text style={styles.finalSaveBtnText}>Save to Archive</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { 
    backgroundColor: '#1e293b', 
    paddingTop: 60, 
    paddingBottom: 20, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  backBtn: { width: 40 },
  saveActionBtn: { width: 40, alignItems: 'flex-end' },
  headerTitle: { color: '#fff', fontSize: RFValue(18), fontWeight: '700' },
  
  centerView: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  infoCard: { alignItems: 'center', backgroundColor: '#fff', padding: 30, borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  infoTitle: { fontSize: RFValue(18), fontWeight: '800', color: '#1e293b', marginTop: 16 },
  infoDesc: { fontSize: RFValue(13), color: '#64748b', textAlign: 'center', marginTop: 8, lineHeight: 20, marginBottom: 20 },
  historyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#f1f5f9', borderRadius: 12 },
  historyBtnText: { fontSize: RFValue(12), fontWeight: '700', color: '#2563eb' },
  
  processingText: { fontSize: RFValue(16), fontWeight: '700', color: '#1e293b', marginTop: 20 },
  subProcessingText: { fontSize: RFValue(12), color: '#64748b', marginTop: 8 },
  
  notesContainer: { flex: 1, padding: 25 },
  notesHeader: { marginBottom: 24 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  courseBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  courseBadgeText: { fontSize: RFValue(10), fontWeight: '800', color: '#475569' },
  notesTitle: { fontSize: RFValue(22), fontWeight: '900', color: '#1e293b', marginBottom: 16 },
  overviewCard: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: '#0f172a' },
  sectionHeading: { fontSize: RFValue(13), fontWeight: '800', color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  overviewText: { fontSize: RFValue(13), color: '#334155', lineHeight: 22 },
  
  contentSection: { marginTop: 24 },
  conceptItem: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#f1f5f9' },
  conceptText: { fontSize: RFValue(13), color: '#334155', fontWeight: '600' },
  
  detailedSection: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  detailedHeading: { fontSize: RFValue(14), fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  detailedContent: { fontSize: RFValue(13), color: '#475569', lineHeight: 22 },
  
  summaryText: { fontSize: RFValue(13), color: '#64748b', fontStyle: 'italic', lineHeight: 22 },

  bottomControl: { backgroundColor: '#fff', paddingBottom: 40, paddingTop: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15, backgroundColor: '#fff1f2', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#e11d48' },
  timerText: { fontSize: RFValue(14), fontWeight: '700', color: '#e11d48' },
  
  recordButtonContainer: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  pulseCircle: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(225, 29, 72, 0.2)' },
  recordBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  recordBtnActive: { backgroundColor: '#e11d48' },
  controlLabel: { fontSize: RFValue(11), fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: RFValue(18), fontWeight: '800', color: '#0f172a' },
  formGroup: { marginBottom: 20 },
  label: { fontSize: RFValue(11), fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },
  textInput: { borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 12, padding: 12, fontSize: RFValue(14), color: '#1e293b' },
  finalSaveBtn: { backgroundColor: '#0f172a', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16, marginTop: 10 },
  finalSaveBtnText: { color: '#fff', fontSize: RFValue(14), fontWeight: '700' },
  
  // Custom Dropdown Styles
  customPickerWrapper: { backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9', height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, justifyContent: 'space-between' },
  customPickerValue: { fontSize: RFValue(13), color: '#1e293b', fontWeight: '500', flex: 1 },
  optionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  optionItemActive: { backgroundColor: '#f0f7ff', marginHorizontal: -24, paddingHorizontal: 24 },
  optionText: { fontSize: RFValue(13), color: '#475569', fontWeight: '500' },
  optionTextActive: { color: '#2563eb', fontWeight: '700' },
});
