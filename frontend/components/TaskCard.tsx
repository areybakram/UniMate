import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  FadeInDown,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface Task {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'todo' | 'done';
}

interface TaskCardProps {
  item: Task;
  index: number;
  onToggleStatus: (id: string, currentStatus: 'todo' | 'done') => void;
  compact?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ item, index, onToggleStatus, compact = false }) => {
  const router = useRouter();
  const isDone = item.status === 'done';
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > 100 && !isDone) {
        // Swipe Right to Complete
        translateX.value = withSpring(0);
        runOnJS(onToggleStatus)(item.id, 'todo');
      } else if (event.translationX < -100 && isDone) {
        // Swipe Left to Undo
        translateX.value = withSpring(0);
        runOnJS(onToggleStatus)(item.id, 'done');
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <View style={[styles.swipeContainer, compact && { marginBottom: 10 }]}>
      {/* Background Actions */}
      <View style={[styles.bgAction, styles.bgActionRight]}>
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
        <Text style={styles.bgText}>DONE</Text>
      </View>
      <View style={[styles.bgAction, styles.bgActionLeft]}>
        <Text style={styles.bgText}>UNDO</Text>
        <Ionicons name="arrow-undo" size={24} color="#fff" />
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          entering={FadeInDown.delay(index * 100)}
          style={[
            styles.cardContainer,
            compact && { padding: 12, borderRadius: 12 },
            isDone && styles.doneCard,
            animatedCardStyle,
          ]}
        >
          <View style={[styles.statusIndicator, { backgroundColor: isDone ? '#10B981' : '#F59E0B' }]} />
          
          <TouchableOpacity 
            style={styles.content}
            activeOpacity={0.7}
            onPress={() => {
              router.push({
                pathname: '/(screens)/TaskDetails',
                params: { task: JSON.stringify(item) }
              });
            }}
          >
            <View style={[styles.header, compact && { marginBottom: 2 }]}>
              <Text style={[styles.title, isDone && styles.strikeText, compact && { fontSize: 14 }]}>{item.title}</Text>
              {isDone && <Ionicons name="checkmark-circle" size={compact ? 18 : 20} color="#10B981" />}
            </View>
            
            {item.description && !compact && (
              <Text style={[styles.description, isDone && styles.dimmedText]} numberOfLines={2}>
                {item.description}
              </Text>
            )}

            <View style={[styles.footer, compact && { marginTop: 4 }]}>
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={14} color="#64748b" />
                <Text style={styles.dateText}>
                  {formatDate(item.startDate)} - {formatDate(item.endDate)}
                </Text>
              </View>
              
              <View style={[styles.badge, isDone ? styles.doneBadge : styles.todoBadge]}>
                <Text style={[styles.badgeText, isDone ? styles.doneBadgeText : styles.todoBadgeText]}>
                  {isDone ? 'COMPLETED' : 'PENDING'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  swipeContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  bgAction: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  bgActionRight: {
    backgroundColor: '#10B981',
    justifyContent: 'flex-start',
  },
  bgActionLeft: {
    backgroundColor: '#64748b',
    justifyContent: 'flex-end',
  },
  bgText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
    marginHorizontal: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  doneCard: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  statusIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  strikeText: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  description: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 18,
  },
  dimmedText: {
    color: '#cbd5e1',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  todoBadge: {
    backgroundColor: '#fff7ed',
  },
  doneBadge: {
    backgroundColor: '#f0fdf4',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  todoBadgeText: {
    color: '#c2410c',
  },
  doneBadgeText: {
    color: '#15803d',
  },
});

export default TaskCard;
