import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/supabaseClient';
import { AuthContext } from '@/Context/AuthContext';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RFValue } from 'react-native-responsive-fontsize';

export default function LectureHistoryScreen() {
  const { user }: any = useContext(AuthContext);
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('lecture_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err: any) {
      console.error("Fetch Notes Error:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <TouchableOpacity 
        style={styles.noteCard}
        onPress={() => router.push({
          pathname: '/(screens)/LectureNotes',
          params: { savedNote: JSON.stringify(item) }
        })}
      >
        <View style={styles.noteIcon}>
          <MaterialCommunityIcons name="file-document-outline" size={24} color="#2563eb" />
        </View>
        <View style={styles.noteInfo}>
          <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.noteMeta}>
            {item.course_id} • {new Date(item.lecture_date).toLocaleDateString()}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My AI Notes</Text>
        <TouchableOpacity onPress={fetchNotes} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerView}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <MaterialCommunityIcons name="note-off-outline" size={60} color="#cbd5e1" />
              <Text style={styles.emptyText}>No saved notes yet.</Text>
              <Text style={styles.emptySubText}>Record your first lecture to see it here!</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    backgroundColor: '#2D3748', 
    paddingTop: 20, 
    paddingBottom: 20, 
    paddingHorizontal: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  backBtn: { width: 40 },
  headerTitle: { color: '#fff', fontSize: RFValue(18), fontWeight: '700' },
  refreshBtn: { width: 40, alignItems: 'flex-end' },
  
  centerView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20 },
  noteCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  noteIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    backgroundColor: '#eff6ff', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 16
  },
  noteInfo: { flex: 1 },
  noteTitle: { fontSize: RFValue(14), fontWeight: '700', color: '#1e293b', marginBottom: 4 },
  noteMeta: { fontSize: RFValue(11), color: '#64748b' },
  
  emptyView: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: RFValue(16), fontWeight: '700', color: '#64748b', marginTop: 16 },
  emptySubText: { fontSize: RFValue(12), color: '#94a3b8', marginTop: 8 }
});
