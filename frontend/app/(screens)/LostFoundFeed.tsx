import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { getLostFoundPosts, createLostFoundPost, createClaim, LostFoundPost } from '@/utils/lostFoundService';

export default function LostFoundFeedScreen() {
  const [posts, setPosts] = useState<LostFoundPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClaimModalVisible, setIsClaimModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<LostFoundPost | null>(null);

  // New Post Form
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'lost' | 'found'>('lost');

  // Claim Form
  const [claimMessage, setClaimMessage] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getLostFoundPosts();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(p => filter === 'all' || p.type === filter);

  const handleCreatePost = async () => {
    if (!itemName || !description) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      await createLostFoundPost({ item_name: itemName, description, type });
      setIsModalVisible(false);
      setItemName(''); setDescription('');
      fetchPosts();
    } catch (err) {
      Alert.alert("Error", "Could not create post");
    }
  };

  const handleCreateClaim = async () => {
    if (!selectedPost || !claimMessage) return;
    try {
      await createClaim(selectedPost.id, claimMessage);
      setIsClaimModalVisible(false);
      setClaimMessage('');
      Alert.alert("Success", "Claim sent! The finder/loser will review it and coordinate.");
    } catch (err) {
      Alert.alert("Error", "Could not send claim");
    }
  };

  const renderItem = ({ item }: { item: LostFoundPost }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeBadge, { backgroundColor: item.type === 'lost' ? '#fee2e2' : '#dcfce7' }]}>
          <Text style={[styles.typeText, { color: item.type === 'lost' ? '#ef4444' : '#22c55e' }]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
      
      <Text style={styles.itemName}>{item.item_name}</Text>
      <Text style={styles.description}>{item.description}</Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.userInfo}>
          <Ionicons name="person-outline" size={14} color="#64748b" />
          <Text style={styles.userName}>{item.profiles?.name || 'User'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.claimBtn} 
          onPress={() => { setSelectedPost(item); setIsClaimModalVisible(true); }}
        >
          <Text style={styles.claimBtnText}>{item.type === 'lost' ? 'Found it?' : 'This is mine!'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lost & Found</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.filterRow}>
          {['all', 'lost', 'found'].map((f) => (
            <TouchableOpacity 
              key={f} 
              style={[styles.filterBtn, filter === f && styles.activeFilter]}
              onPress={() => setFilter(f as any)}
            >
              <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#1e293b" />
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={80} color="#e2e8f0" />
              <Text style={styles.emptyText}>No items found matches your filter.</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="megaphone" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Create Post Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Post an Item</Text>
            
            <View style={styles.typeSelector}>
              <TouchableOpacity 
                style={[styles.typeBtn, type === 'lost' && styles.activeLost]} 
                onPress={() => setType('lost')}
              >
                <Text style={[styles.typeBtnText, type === 'lost' && { color: '#fff' }]}>I Lost Something</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeBtn, type === 'found' && styles.activeFound]} 
                onPress={() => setType('found')}
              >
                <Text style={[styles.typeBtnText, type === 'found' && { color: '#fff' }]}>I Found Something</Text>
              </TouchableOpacity>
            </View>

            <TextInput 
              placeholder="What is the item?" 
              style={styles.input} 
              value={itemName} 
              onChangeText={setItemName}
            />
            <TextInput 
              placeholder="Describe it (color, location, etc.)" 
              style={[styles.input, { height: 80 }]} 
              multiline
              value={description} 
              onChangeText={setDescription}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#1e293b' }]} onPress={handleCreatePost}>
                <Text style={styles.submitBtnText}>Submit Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Claim Modal */}
      <Modal visible={isClaimModalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verfication Claim</Text>
            <Text style={styles.modalSub}>Item: {selectedPost?.item_name}</Text>
            <TextInput 
              placeholder="Provide proof or details to verify ownership" 
              style={[styles.input, { height: 100 }]} 
              multiline 
              value={claimMessage} 
              onChangeText={setClaimMessage}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsClaimModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.submitBtn, { backgroundColor: '#1e293b' }]} onPress={handleCreateClaim}>
                <Text style={styles.submitBtnText}>Submit Claim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingTop: 40, paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  filterRow: { flexDirection: 'row', gap: 10 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
  activeFilter: { backgroundColor: '#fff' },
  filterText: { color: 'rgba(255,255,255,0.7)', fontWeight: '700', fontSize: 13 },
  activeFilterText: { color: '#1e293b' },
  list: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 16, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 10, fontWeight: '900' },
  date: { fontSize: 12, color: '#94a3b8' },
  itemName: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 6 },
  description: { fontSize: 14, color: '#64748b', marginBottom: 16, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 15 },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  userName: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  claimBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12 },
  claimBtnText: { color: '#1e293b', fontSize: 13, fontWeight: '700' },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94a3b8', fontSize: 16, marginTop: 10 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 30, padding: 25 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 20, textAlign: 'center' },
  typeSelector: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  typeBtn: { flex: 1, padding: 12, borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  activeLost: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  activeFound: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  typeBtnText: { fontWeight: '700', fontSize: 13, color: '#64748b' },
  input: { backgroundColor: '#f8fafc', borderRadius: 15, padding: 15, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#f1f5f9' },
  modalButtons: { flexDirection: 'row', gap: 10, marginTop: 10 },
  cancelBtn: { flex: 1, padding: 15, alignItems: 'center' },
  cancelBtnText: { color: '#64748b', fontWeight: '600' },
  submitBtn: { flex: 2, padding: 15, borderRadius: 15, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '800' }
});
