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
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { getBorrowRequests, createBorrowRequest, createOffer, BorrowRequest } from '@/utils/lendBorrowService';

export default function LendBorrowFeedScreen() {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null);

  // New Request Form
  const [itemName, setItemName] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');

  // Offer Form
  const [offerMessage, setOfferMessage] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getBorrowRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCreateRequest = async () => {
    if (!itemName || !reason || !duration) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      await createBorrowRequest({ item_name: itemName, reason, duration });
      setIsModalVisible(false);
      setItemName(''); setReason(''); setDuration('');
      fetchRequests();
    } catch (err) {
      Alert.alert("Error", "Could not create request");
    }
  };

  const handleCreateOffer = async () => {
    if (!selectedRequest || !offerMessage) return;
    try {
      await createOffer(selectedRequest.id, offerMessage);
      setIsOfferModalVisible(false);
      setOfferMessage('');
      Alert.alert("Success", "Offer sent! Coordination chat will open once accepted.");
    } catch (err) {
      Alert.alert("Error", "Could not send offer");
    }
  };

  const renderItem = ({ item }: { item: BorrowRequest }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userBadge}>
          <Text style={styles.userInitial}>{(item.profiles?.name || 'U')[0]}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{item.profiles?.name || 'Anonymous'}</Text>
          <Text style={styles.userRole}>{item.profiles?.Role || 'Student'}</Text>
        </View>
        <TouchableOpacity style={styles.offerBtn} onPress={() => { setSelectedRequest(item); setIsOfferModalVisible(true); }}>
          <Text style={styles.offerBtnText}>Offer Help</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.itemName}>{item.item_name}</Text>
      <Text style={styles.reason}>{item.reason}</Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={14} color="#64748b" />
          <Text style={styles.footerText}>{item.duration}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={14} color="#64748b" />
          <Text style={styles.footerText}>{new Date(item.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4f46e5', '#3730a3']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lend & Borrow</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSubtitle}>Need something for campus? Ask your fellows!</Text>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#4f46e5" />
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="cart-outline" size={80} color="#e2e8f0" />
              <Text style={styles.emptyText}>No requests yet. Be the first!</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Create Request Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Borrow Something</Text>
            <TextInput 
              placeholder="What do you need? (e.g. DLD Book)" 
              style={styles.input} 
              value={itemName} 
              onChangeText={setItemName}
            />
            <TextInput 
              placeholder="Why do you need it? (e.g. Quiz prep)" 
              style={styles.input} 
              value={reason} 
              onChangeText={setReason}
            />
            <TextInput 
              placeholder="For how long? (e.g. 2 days)" 
              style={styles.input} 
              value={duration} 
              onChangeText={setDuration}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateRequest}>
                <Text style={styles.submitBtnText}>Post Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Offer Modal */}
      <Modal visible={isOfferModalVisible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Lend this item</Text>
            <Text style={styles.modalSub}>Item: {selectedRequest?.item_name}</Text>
            <TextInput 
              placeholder="Add a message (e.g. Meet me after class)" 
              style={[styles.input, { height: 100 }]} 
              multiline 
              value={offerMessage} 
              onChangeText={setOfferMessage}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsOfferModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateOffer}>
                <Text style={styles.submitBtnText}>Send Offer</Text>
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
  header: { paddingTop: 40, paddingBottom: 25, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', marginTop: 10, fontSize: 14 },
  list: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  userBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center' },
  userInitial: { color: '#fff', fontWeight: 'bold' },
  headerInfo: { flex: 1, marginLeft: 12 },
  userName: { fontWeight: '700', fontSize: 16, color: '#1e293b' },
  userRole: { fontSize: 12, color: '#64748b', textTransform: 'capitalize' },
  offerBtn: { backgroundColor: '#e0e7ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  offerBtnText: { color: '#4f46e5', fontSize: 12, fontWeight: '700' },
  itemName: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  reason: { fontSize: 14, color: '#64748b', marginBottom: 16 },
  cardFooter: { flexDirection: 'row', gap: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 12, color: '#64748b' },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94a3b8', fontSize: 16, marginTop: 10 },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 25, padding: 25 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 10 },
  modalSub: { color: '#64748b', marginBottom: 20 },
  input: { backgroundColor: '#f1f5f9', borderRadius: 15, padding: 15, marginBottom: 15, fontSize: 16 },
  modalButtons: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, padding: 15, alignItems: 'center' },
  cancelBtnText: { color: '#64748b', fontWeight: '600' },
  submitBtn: { flex: 2, backgroundColor: '#4f46e5', padding: 15, borderRadius: 15, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '800' }
});
