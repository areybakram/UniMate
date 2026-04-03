import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getTasks, toggleTaskStatus, Task } from '../../utils/taskService';
import { scheduleTaskReminders } from '../../utils/notificationService';
import TaskCard from '../../components/TaskCard';
import AddTaskModal from '../../components/AddTaskModal';
import Animated, { FadeInDown } from 'react-native-reanimated';

const TasksScreen = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchTasks();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: 'todo' | 'done') => {
    await toggleTaskStatus(id, currentStatus);
    const updatedTasks = await getTasks();
    setTasks(updatedTasks);
    // Refresh notifications
    await scheduleTaskReminders(updatedTasks);
  };

  const filteredTasks = tasks.filter((t) => 
    activeTab === 'active' ? t.status === 'todo' : t.status === 'done'
  ).sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={["#1e293b", "#334155"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tasks & Goals</Text>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => setIsModalVisible(true)}
          >
            <Ionicons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'active' && styles.activeTab]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
              Active{' '}
              <Text style={styles.countText}>
                ({tasks.filter(t => t.status === 'todo').length})
              </Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Completed
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TaskCard 
                item={item} 
                index={index} 
                onToggleStatus={handleToggleStatus} 
              />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
            }
            ListEmptyComponent={
              <Animated.View entering={FadeInDown.delay(200)} style={styles.emptyState}>
                <Ionicons 
                  name={activeTab === 'active' ? "clipboard-outline" : "checkmark-done-circle-outline"} 
                  size={80} 
                  color="#e2e8f0" 
                />
                <Text style={styles.emptyTitle}>
                  {activeTab === 'active' ? "No active tasks" : "No completed tasks"}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {activeTab === 'active' 
                    ? "Your high-priority items will appear here once you add them." 
                    : "Finish your tasks to see them here!"}
                </Text>
                {activeTab === 'active' && (
                  <TouchableOpacity 
                    style={styles.createBtn}
                    onPress={() => setIsModalVisible(true)}
                  >
                    <Text style={styles.createBtnText}>Create New Task</Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            }
          />
        )}
      </View>

      <AddTaskModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        onTaskAdded={fetchTasks} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeTabText: {
    color: '#1e293b',
  },
  countText: {
    fontSize: 12,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 50,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#475569',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  createBtn: {
    marginTop: 24,
    backgroundColor: '#1e293b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default TasksScreen;
