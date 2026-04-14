import React, { useState, useEffect, useContext } from 'react';
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
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleReturnReminder } from '@/utils/notificationService';
import { router } from 'expo-router';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { 
  getBorrowRequests, 
  createBorrowRequest, 
  createOffer, 
  getMyOffers, 
  getOffersByRequestId,
  markAsHandedOver,
  BorrowRequest, 
  BorrowOffer 
} from '@/utils/lendBorrowService';
import { AuthContext } from '@/Context/AuthContext';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');

export default function LendBorrowFeedScreen() {
  const { user } = useContext(AuthContext) || {};
  const [activeTab, setActiveTab] = useState<'market' | 'activity'>('market');
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [myActivity, setMyActivity] = useState<{ posts: (BorrowRequest & { offers?: BorrowOffer[] })[], offers: BorrowOffer[] }>({ posts: [], offers: [] });
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // New Request Form
  const [itemName, setItemName] = useState('');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');
  
  // Date Picker States
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date(Date.now() + 86400000)); // Default +1 day
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  useEffect(() => {
    // Auto-update duration string when dates change
    const options:Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const fromStr = fromDate.toLocaleDateString('en-US', options);
    const toStr = toDate.toLocaleDateString('en-US', options);
    setDuration(`${fromStr} - ${toStr}`);
  }, [fromDate, toDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'market') {
        const data = await getBorrowRequests();
        setRequests(data.filter(r => r.user_id !== user?.id));
      } else {
        const [posts, offers] = await Promise.all([
          getBorrowRequests(user?.id),
          getMyOffers(user.id!)
        ]);
        
        const postsWithOffers = await Promise.all(posts.map(async (p) => {
          const postOffers = await getOffersByRequestId(p.id);
          return { ...p, offers: postOffers };
        }));

        setMyActivity({ posts: postsWithOffers, offers });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleCreateRequest = async () => {
    if (!itemName || !reason || !duration) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      await createBorrowRequest({ 
        item_name: itemName, 
        reason, 
        duration,
        end_date: toDate.toISOString() 
      });
      setIsModalVisible(false);
      setItemName(''); setReason(''); setDuration('');
      fetchData();
      Alert.alert("Success", "Request posted successfully.");
    } catch (err: any) {
      if (err.message === "ALREADY_SUBMITTED") {
        Alert.alert("Duplicate Request", "You already have an active request for this item. Please resolve the existing one before posting again.");
      } else {
        Alert.alert("Error", "Could not create request");
      }
    }
  };

  const handleOfferHelp = async (request: BorrowRequest) => {
    Alert.prompt(
      "Offer Help",
      `Send a message about the ${request.item_name}`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Offer & Chat", 
          onPress: async (msg) => {
            if (!msg) return;
            try {
              await createOffer(request.id, msg);
              router.push({
                pathname: "/(screens)/ChatRoom",
                params: { 
                  roomId: `borrow_${request.id}_${user?.id}`, 
                  title: `Lending: ${request.item_name}`,
                  otherUser: request.profiles?.name
                }
              });
            } catch (e) {
              Alert.alert("Error", "Could not send offer");
            }
          }
        }
      ]
    );
  };

  const handleMarkReceived = async (requestId: string, lenderId: string, lenderName: string) => {
    Alert.alert(
      "Confirm Reception",
      `Are you sure you received this item from ${lenderName}? This will close the request and create a record.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm Received", 
          onPress: async () => {
            try {
              await markAsHandedOver(requestId, lenderId);
              
              // Schedule return reminder notification
              const request = myActivity.posts.find(p => p.id === requestId);
              if (request && request.end_date) {
                await scheduleReturnReminder(request.item_name, new Date(request.end_date));
              }

              fetchData();
              Alert.alert("Success", "Record stored and request closed.");
            } catch (e) {
              Alert.alert("Error", "Could not process reception.");
            }
          } 
        }
      ]
    );
  };

  const renderMarketItem = ({ item, index }: { item: BorrowRequest, index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)} layout={Layout.springify()} style={styles.listItem}>
      <View style={styles.listMain}>
        <View style={styles.avatarMini}>
          <Text style={styles.avatarText}>{item.profiles?.name?.[0]}</Text>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.item_name}</Text>
          <Text style={styles.itemSub} numberOfLines={1}>{item.reason}</Text>
          <View style={styles.badgeRow}>
             <View style={styles.tinyBadge}><Ionicons name="time-outline" size={10} color="#64748b" /><Text style={styles.tinyBadgeText}>{item.duration}</Text></View>
             <Text style={styles.timestampText}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleOfferHelp(item)}>
          <Text style={styles.actionBtnText}>Offer</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderActivityItem = ({ item, type }: { item: any, type: 'post' | 'offer' }) => (
    <Animated.View entering={FadeInDown} layout={Layout.springify()} style={styles.activityItem}>
      <View style={styles.activityHeader}>
        <View style={[styles.statusLine, { backgroundColor: type === 'post' ? '#2563eb' : '#059669' }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.activityType}>{type === 'post' ? 'MY POSTING' : 'MY OFFER'}</Text>
          <Text style={styles.activityTitle}>{item.item_name || item.borrow_requests?.item_name}</Text>
        </View>
        {type === 'offer' && (
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: "/(screens)/ChatRoom",
              params: { 
                roomId: `borrow_${item.request_id}_${user?.id}`, 
                title: item.borrow_requests?.item_name,
                otherUser: item.borrow_requests?.profiles?.name
              }
            })}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#10b981" />
          </TouchableOpacity>
        )}
      </View>

      {type === 'post' && item.status === 'open' && item.offers && item.offers.length === 0 && (
        <View style={{ padding: 14, backgroundColor: '#f8fafc', borderTopWidth: 1, borderColor: '#e2e8f0' }}>
          <Text style={{ fontSize: RFValue(11), color: '#64748b', fontWeight: '600' }}>Waiting for offers... Request is submitted and public.</Text>
        </View>
      )}

      {type === 'post' && item.status === 'open' && item.offers && item.offers.length > 0 && (
        <View style={styles.interactionsList}>
          {item.offers.map((offer: any) => (
            <View key={offer.id} style={styles.interactionRow}>
              <View style={styles.interactionUser}>
                <Text style={styles.interactionName}>{offer.profiles?.name}</Text>
                <Text style={styles.interactionMsg} numberOfLines={1}>{offer.message}</Text>
              </View>
              <View style={styles.interactionActions}>
                  <TouchableOpacity 
                    style={styles.chatMiniBtn}
                    onPress={() => router.push({
                       pathname: "/(screens)/ChatRoom",
                       params: { 
                         roomId: `borrow_${item.id}_${offer.lender_id}`, 
                         title: `Chat: ${offer.profiles?.name}`,
                         otherUser: offer.profiles?.name
                       }
                    })}
                  >
                    <Ionicons name="chatbubble" size={16} color="#10b981" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.handoverBtn, { backgroundColor: '#eff6ff' }]}
                    onPress={() => handleMarkReceived(item.id, offer.lender_id, offer.profiles?.name)}
                  >
                    <Text style={[styles.handoverText, { color: '#2563eb' }]}>Mark Received</Text>
                  </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {type === 'post' && item.status === 'completed' && item.offers && (
        <View style={styles.completedCard}>
          <View style={styles.completedHeader}>
            <Ionicons name="checkmark-circle" size={14} color="#10b981" />
            <Text style={styles.completedTitle}>Item Received Successfully</Text>
          </View>
          
          <View style={styles.completedDetailsRow}>
            <Text style={styles.completedDetailText}><Text style={{fontWeight: '700'}}>Reason:</Text> {item.reason}</Text>
            <Text style={styles.completedDetailText}><Text style={{fontWeight: '700'}}>Duration:</Text> {item.duration}</Text>
          </View>

          {item.offers.find((o:any) => o.lender_id === item.completed_with_id) && (() => {
            const lender = item.offers.find((o:any) => o.lender_id === item.completed_with_id);
            return (
              <View style={styles.lenderInfoCard}>
                <View style={styles.lenderAvatar}>
                  <Text style={styles.lenderAvatarText}>{lender.profiles?.name?.[0] || '?'}</Text>
                </View>
                <View style={styles.lenderDetails}>
                  <Text style={styles.lenderName}>{lender.profiles?.name}</Text>
                  <View style={{ marginTop: 2 }}>
                    <Text style={styles.lenderMetaLine}>
                      ID: {lender.profiles?.registration_number || 'N/A'}
                    </Text>
                    <Text style={styles.lenderMetaLine}>
                      Phone: {lender.profiles?.phone || 'N/A'}
                    </Text>
                    {lender.profiles?.batch && (
                      <Text style={styles.lenderBatchLine}>Batch: {lender.profiles.batch}</Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.keepChatBtn}
                  onPress={() => router.push({
                     pathname: "/(screens)/ChatRoom",
                     params: { 
                       roomId: `borrow_${item.id}_${lender.lender_id}`, 
                       title: `Chat: ${lender.profiles?.name}`,
                       otherUser: lender.profiles?.name
                     }
                  })}
                >
                  <Ionicons name="chatbubbles" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )
          })()}
        </View>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.systemHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.systemHeaderTitle}>Lend & Borrow</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.tabBackground}>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'market' && styles.tabItemActive]} 
            onPress={() => setActiveTab('market')}
          >
            <Ionicons name="apps" size={16} color={activeTab === 'market' ? '#2D3748' : '#64748b'} />
            <Text style={[styles.tabText, activeTab === 'market' && styles.tabTextActive]}>Public Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'activity' && styles.tabItemActive]} 
            onPress={() => setActiveTab('activity')}
          >
            <Ionicons name="list" size={16} color={activeTab === 'activity' ? '#2D3748' : '#64748b'} />
            <Text style={[styles.tabText, activeTab === 'activity' && styles.tabTextActive]}>My Postings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="small" color="#2D3748" />
      ) : activeTab === 'market' ? (
        <FlatList
          data={requests}
          renderItem={renderMarketItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={styles.emptyView}><Text style={styles.emptyTxt}>No public requests</Text></View>}
        />
      ) : (
        <FlatList
          data={[...myActivity.posts.map(p => ({ ...p, _type: 'post' })), ...myActivity.offers.map(o => ({ ...o, _type: 'offer' }))] as any}
          renderItem={({ item }) => renderActivityItem({ item, type: item._type })}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listPadding}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={styles.emptyView}><Text style={styles.emptyTxt}>No active postings</Text></View>}
        />
      )}

      <TouchableOpacity style={styles.systemFab} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Request Item</Text>
                
                <Text style={styles.label}>Item Name</Text>
                <TextInput placeholder="e.g. Scientific Calculator" placeholderTextColor="#94a3b8" style={styles.systemInput} value={itemName} onChangeText={setItemName} />
                
                <Text style={styles.label}>Reason for Borrowing</Text>
                <TextInput placeholder="e.g. Lost mine, need for exam" placeholderTextColor="#94a3b8" style={styles.systemInput} value={reason} onChangeText={setReason} />
                
                <Text style={styles.label}>Duration (Date Range)</Text>
                <View style={styles.datePickerContainer}>
                  <TouchableOpacity style={styles.dateBtn} onPress={() => setShowFromPicker(true)}>
                    <Ionicons name="calendar-outline" size={16} color="#2563eb" />
                    <Text style={styles.dateBtnText}>{fromDate.toLocaleDateString('en-GB')}</Text>
                  </TouchableOpacity>
                  <Ionicons name="arrow-forward" size={16} color="#cbd5e1" />
                  <TouchableOpacity style={styles.dateBtn} onPress={() => setShowToPicker(true)}>
                    <Ionicons name="calendar-outline" size={16} color="#2563eb" />
                    <Text style={styles.dateBtnText}>{toDate.toLocaleDateString('en-GB')}</Text>
                  </TouchableOpacity>
                </View>

                {showFromPicker && (
                  <DateTimePicker
                    value={fromDate}
                    mode="date"
                    display="default"
                    onChange={(e, date) => {
                      setShowFromPicker(false);
                      if (date) setFromDate(date);
                    }}
                  />
                )}

                {showToPicker && (
                  <DateTimePicker
                    value={toDate}
                    mode="date"
                    display="default"
                    minimumDate={fromDate}
                    onChange={(e, date) => {
                      setShowToPicker(false);
                      if (date) setToDate(date);
                    }}
                  />
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}><Text style={styles.modalCancel}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.modalSubmit} onPress={handleCreateRequest}><Text style={styles.modalSubmitText}>Post Request</Text></TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  systemHeader: { backgroundColor: '#2D3748', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerBack: { width: 30 },
  systemHeaderTitle: { color: '#fff', fontSize: RFValue(18), fontWeight: '700' },
  filterContainer: { backgroundColor: '#F8FAFC', paddingVertical: 14, paddingHorizontal: 20 },
  tabBackground: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4 },
  tabItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 10 },
  tabItemActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  tabText: { color: '#64748b', fontSize: RFValue(12), fontWeight: '700' },
  tabTextActive: { color: '#2D3748' },
  listPadding: { padding: 16, paddingBottom: 100 },
  listItem: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  listMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarMini: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: RFValue(16), fontWeight: '700', color: '#64748b' },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: RFValue(14), fontWeight: '800', color: '#1e293b' },
  itemSub: { fontSize: RFValue(11), color: '#64748b', marginTop: 2 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  tinyBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f8fafc', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tinyBadgeText: { fontSize: RFValue(9), color: '#64748b', fontWeight: '700' },
  timestampText: { fontSize: RFValue(9), color: '#94a3b8' },
  actionBtn: { backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  actionBtnText: { color: '#2563eb', fontSize: RFValue(11), fontWeight: '800' },
  activityItem: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  activityHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 12 },
  statusLine: { width: 4, height: 35, borderRadius: 2 },
  activityType: { fontSize: RFValue(8), fontWeight: '900', color: '#94a3b8', letterSpacing: 0.5 },
  activityTitle: { fontSize: RFValue(14), fontWeight: '800', color: '#1e293b' },
  interactionsList: { marginTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9', backgroundColor: '#fafafa' },
  interactionRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  interactionUser: { flex: 1 },
  interactionName: { fontSize: RFValue(12), fontWeight: '700', color: '#1e293b' },
  interactionMsg: { fontSize: RFValue(11), color: '#64748b' },
  interactionActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chatMiniBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center' },
  handoverBtn: { backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  handoverText: { color: '#2563eb', fontSize: RFValue(10), fontWeight: '800' },
  systemFab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2D3748', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  emptyView: { alignItems: 'center', marginTop: 100 },
  emptyTxt: { color: '#94a3b8', fontSize: RFValue(13) },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalView: { backgroundColor: '#fff', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  modalTitle: { fontSize: RFValue(18), fontWeight: '800', color: '#1e293b', marginBottom: 20 },
  label: { fontSize: RFValue(11), fontWeight: '700', color: '#64748b', marginBottom: 6, marginLeft: 4 },
  systemInput: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, marginBottom: 16, fontSize: RFValue(13), borderWidth: 1, borderColor: '#e2e8f0', color: '#1e293b' },
  datePickerContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20, backgroundColor: '#f8fafc', padding: 8, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  dateBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  dateBtnText: { fontSize: RFValue(11), color: '#1e293b', fontWeight: '700' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 24, marginTop: 10 },
  modalCancel: { color: '#94a3b8', fontWeight: '700', fontSize: RFValue(13) },
  modalSubmit: { backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, shadowColor: '#2563eb', shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  modalSubmitText: { color: '#fff', fontWeight: '700', fontSize: RFValue(13) },
  completedCard: { padding: 12, backgroundColor: '#fcfdfe', borderTopWidth: 1, borderColor: '#eef2f7' },
  completedHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  completedTitle: { fontSize: RFValue(10), fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: 0.5 },
  completedDetailsRow: { marginBottom: 10, paddingLeft: 20 },
  completedDetailText: { fontSize: RFValue(10), color: '#64748b', marginBottom: 2 },
  lenderInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  lenderAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  lenderAvatarText: { fontSize: RFValue(12), fontWeight: '800', color: '#475569' },
  lenderDetails: { flex: 1 },
  lenderName: { fontSize: RFValue(13), fontWeight: '800', color: '#1e293b' },
  lenderMetaLine: { fontSize: RFValue(10), color: '#64748b', marginTop: 2, fontWeight: '600' },
  lenderBatchLine: { fontSize: RFValue(9), color: '#2563eb', marginTop: 1, fontWeight: '700', textTransform: 'uppercase' },
  keepChatBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center' },

});
