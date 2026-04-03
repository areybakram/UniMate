import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../Context/AuthContext';
import { extractCoursesFromImage, ExtractedCourse } from '../../utils/geminiService';
import { supabase } from '../../supabaseClient';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function EnrollmentScreen() {
  const router = useRouter();
  const { user, updateProfile }: any = useContext(AuthContext) || {};
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedCourses, setExtractedCourses] = useState<ExtractedCourse[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const isTeacher = user?.role === 'teacher';

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to upload your document.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setImage(result.assets[0].uri);
      processImage(result.assets[0].base64);
    }
  };

  const processImage = async (base64: string) => {
    setIsProcessing(true);
    try {
      const results = await extractCoursesFromImage(base64, user?.role || 'student');
      setExtractedCourses(results);
    } catch (error: any) {
      Alert.alert('Extraction Failed', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeItem = (index: number) => {
    setExtractedCourses(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = async () => {
    if (extractedCourses.length === 0) {
      Alert.alert('Empty List', 'Please upload or extract some courses first.');
      return;
    }

    setIsSaving(true);
    try {
      // Sync with Supabase profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ timetable_data: extractedCourses })
        .eq('id', user.id);

      if (error) throw error;

      // Update local context
      await updateProfile?.({ timetable_data: extractedCourses });

      Alert.alert('Success', 'Your academic profile has been synchronized.', [
        { text: 'Awesome', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Save Error', error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#1e293b', '#334155']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Academic Enrollment</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          {isTeacher 
            ? "Sync your teaching schedule with the master timetable using Gemini AI."
            : "Upload your registration card to personalize your university experience."}
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {!image && !isProcessing && (
          <Animated.View entering={FadeInUp} style={styles.uploadContainer}>
            <TouchableOpacity style={styles.uploadCard} onPress={pickImage}>
              <View style={styles.uploadIconCircle}>
                <Ionicons name="cloud-upload-outline" size={40} color="#3b82f6" />
              </View>
              <Text style={styles.uploadTitle}>Magic Enroll</Text>
              <Text style={styles.uploadDesc}>
                {isTeacher 
                  ? "Upload Course Offering or Timetable Image" 
                  : "Upload Registration Card ScreenShot"}
              </Text>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={14} color="#3b82f6" />
                <Text style={styles.aiBadgeText}>Powered by Gemini Flash 1.5</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {isProcessing && (
          <View style={styles.processingIndicator}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.processingText}>Gemini is analyzing your document...</Text>
            <Text style={styles.subProcessingText}>This usually takes 3-5 seconds</Text>
          </View>
        )}

        {extractedCourses.length > 0 && !isProcessing && (
          <View style={{ flex: 1 }}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewTitle}>Detected Courses ({extractedCourses.length})</Text>
              <TouchableOpacity onPress={() => { setImage(null); setExtractedCourses([]); }}>
                <Text style={styles.reUploadText}>Re-upload</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            >
              {extractedCourses.map((course, index) => (
                <Animated.View 
                  key={index} 
                  entering={FadeInDown.delay(index * 100)}
                  layout={Layout.springify()}
                  style={styles.courseCard}
                >
                  <View style={styles.courseCardMain}>
                    <View style={styles.courseIcon}>
                      <Text style={styles.courseIconText}>{course.course_code.substring(0, 3)}</Text>
                    </View>
                    <View style={styles.courseDetails}>
                      <Text style={styles.courseName} numberOfLines={1}>{course.subject}</Text>
                      <View style={styles.courseMeta}>
                        <View style={styles.metaBadge}>
                          <Text style={styles.metaBadgeText}>{course.course_code}</Text>
                        </View>
                        <View style={[styles.metaBadge, { backgroundColor: '#F0F9FF' }]}>
                          <Text style={[styles.metaBadgeText, { color: '#0369A1' }]}>
                            {course.batch_code || course.batch}
                          </Text>
                        </View>
                        {isTeacher && course.department && (
                          <View style={[styles.metaBadge, { backgroundColor: '#F0FDF4' }]}>
                            <Text style={[styles.metaBadgeText, { color: '#166534' }]}>{course.department}</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity 
                    onPress={() => removeItem(index)}
                    style={styles.removeBtn}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.confirmBtn}
                onPress={handleConfirm}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.confirmBtnText}>Confirm & Sync Schedule</Text>
                  </>
                )}
              </TouchableOpacity>
              <Text style={styles.footerNote}>
                Syncing will automatically populate your dashboard timeline.
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    paddingLeft: 55,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadCard: {
    width: '100%',
    padding: 40,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  uploadIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  uploadDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 25,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3B82F6',
  },
  processingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  subProcessingText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 5,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  reUploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  listContent: {
    paddingBottom: 20,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  courseCardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  courseIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseIconText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  courseDetails: {
    flex: 1,
  },
  courseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  courseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  metaBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  removeBtn: {
    padding: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  footer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 18,
    gap: 10,
    elevation: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  footerNote: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12,
  },
});
