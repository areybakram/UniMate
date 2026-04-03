import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addTask, getTasks } from '../utils/taskService';
import { scheduleTaskReminders } from '../utils/notificationService';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withSpring,
  runOnJS,
  useAnimatedStyle
} from 'react-native-reanimated';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ visible, onClose, onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [hasSelectedStartDate, setHasSelectedStartDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    setIsSubmitting(true);
    try {
      const newTask = await addTask({
        title: title.trim(),
        description: description.trim(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      // Update notifications
      const allTasks = await getTasks();
      await scheduleTaskReminders(allTasks);

      setTitle('');
      setDescription('');
      setStartDate(new Date());
      setEndDate(new Date());
      onTaskAdded();
      onClose();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date, isStart: boolean = true) => {
    if (Platform.OS === 'android') {
      setShowStartDate(false);
      setShowEndDate(false);
    }
    
    if (selectedDate) {
      if (isStart) {
        setStartDate(selectedDate);
        setHasSelectedStartDate(true);
        if (selectedDate > endDate) setEndDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const changeDate = (isStart: boolean, days: number) => {
    if (isStart) {
      const newD = new Date(startDate);
      newD.setDate(newD.getDate() + days);
      setStartDate(newD);
      setHasSelectedStartDate(true);
      if (newD > endDate) setEndDate(newD);
    } else {
      const newD = new Date(endDate);
      newD.setDate(newD.getDate() + days);
      setEndDate(newD);
    }
  };

  const startTranslateX = useSharedValue(0);
  const endTranslateX = useSharedValue(0);

  const startPanGesture = Gesture.Pan()
    .onUpdate((event) => {
      startTranslateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > 100) {
         runOnJS(changeDate)(true, -1);
      } else if (event.translationX < -100) {
         runOnJS(changeDate)(true, 1);
      }
      startTranslateX.value = withSpring(0);
    });

  const endPanGesture = Gesture.Pan()
    .onUpdate((event) => {
      endTranslateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > 100) {
        runOnJS(changeDate)(false, -1);
      } else if (event.translationX < -100) {
        runOnJS(changeDate)(false, 1);
      }
      endTranslateX.value = withSpring(0);
    });

  const startAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: startTranslateX.value }]
  }));

  const endAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: endTranslateX.value }]
  }));

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Task Title</Text>
              <TextInput
                style={styles.input}
                placeholder="What needs to be done?"
                placeholderTextColor="#94a3b8"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Add more details..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.dateRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity
                  style={styles.datePickerBtn}
                  onPress={() => setShowStartDate(true)}
                >
                  <Ionicons name="calendar-outline" size={18} color="#3b82f6" />
                  <Text style={styles.dateValue}>{startDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity
                  style={styles.datePickerBtn}
                  onPress={() => {
                    if (!hasSelectedStartDate) {
                      alert('Please select a start date first.');
                      return;
                    }
                    setShowEndDate(true);
                  }}
                >
                  <Ionicons name="calendar-outline" size={18} color="#ef4444" />
                  <Text style={styles.dateValue}>{endDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showStartDate && (
              <View style={Platform.OS === 'ios' ? styles.iosPickerContainer : undefined}>
                <GestureDetector gesture={startPanGesture}>
                  <Animated.View style={[{flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', paddingHorizontal: 20}, startAnimatedStyle]}>
                    <Ionicons name="chevron-back" size={24} color="#94a3b8" />
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'inline' : 'default'}
                      onChange={(e, d) => onDateChange(e, d, true)}
                      textColor="#000000"
                      themeVariant="light"
                    />
                    <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
                  </Animated.View>
                </GestureDetector>
                {Platform.OS === 'ios' && (
                  <TouchableOpacity 
                    style={styles.iosPickerDoneBtn} 
                    onPress={() => {
                      setHasSelectedStartDate(true);
                      setShowStartDate(false);
                    }}
                  >
                    <Text style={styles.iosPickerDoneText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {showEndDate && (
              <View style={Platform.OS === 'ios' ? styles.iosPickerContainer : undefined}>
                <GestureDetector gesture={endPanGesture}>
                   <Animated.View style={[{flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', paddingHorizontal: 20}, endAnimatedStyle]}>
                     <Ionicons name="chevron-back" size={24} color="#94a3b8" />
                     <DateTimePicker
                        value={endDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                        onChange={(e, d) => onDateChange(e, d, false)}
                        textColor="#000000"
                        themeVariant="light"
                     />
                     <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
                   </Animated.View>
                </GestureDetector>
                {Platform.OS === 'ios' && (
                  <TouchableOpacity 
                    style={styles.iosPickerDoneBtn} 
                    onPress={() => setShowEndDate(false)}
                  >
                    <Text style={styles.iosPickerDoneText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitBtn, isSubmitting && styles.disabledBtn]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitBtnText}>
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  closeBtn: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1e293b',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 16,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  dtPickerContainer: {
    marginBottom: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 10,
  },
  dtPickerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    elevation: 4,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  iosPickerContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  iosPickerDoneBtn: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  iosPickerDoneText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default AddTaskModal;
