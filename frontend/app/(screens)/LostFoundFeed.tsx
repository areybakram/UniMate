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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { 
  getLostFoundPosts, 
  createLostFoundPost, 
  createClaim, 
  getMyClaims, 
  getClaimsByPostId,
  markAsResolved,
  LostFoundPost, 
  LostFoundClaim 
} from '@/utils/lostFoundService';
import { AuthContext } from '@/Context/AuthContext';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');

export default function LostFoundFeedScreen() {
  const { user } = useContext(AuthContext) || {};
  const [activeTab, setActiveTab] = useState<'community' | 'activity'>('community');
  const [posts, setPosts] = useState<LostFoundPost[]>([]);
  const [myActivity, setMyActivity] = useState<{ posts: (LostFoundPost & { claims?: LostFoundClaim[] })[], claims: LostFoundClaim[] }>({ posts: [], claims: [] });
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // New Post Form
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'lost' | 'found'>('lost');

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'community') {
        const data = await getLostFoundPosts();
        setPosts(data.filter(p => p.user_id !== user?.id));
      } else {
        const [posts, claims] = await Promise.all([
          getLostFoundPosts(user?.id),
          getMyClaims(user.id!)
        ]);
        
        const postsWithClaims = await Promise.all(posts.map(async (p) => {
          const postClaims = await getClaimsByPostId(p.id);
          return { ...p, claims: postClaims };
        }));

        setMyActivity({ posts: postsWithClaims, claims });
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

  const handleCreatePost = async () => {
    if (!itemName || !description) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      await createLostFoundPost({ item_name: itemName, description, type });
      setIsModalVisible(false);
      setItemName(''); setDescription('');
      fetchData();
      Alert.alert("Success", "Incident reported successfully.");
    } catch (err: any) {
      if (err.message === "ALREADY_SUBMITTED") {
        Alert.alert("Duplicate Report", "You already have an active report for this item. Please resolve the existing one before posting again.");
      } else {
        Alert.alert("Error", "Could not create report");
      }
    }
  };

  const handleClaimItem = async (post: LostFoundPost) => {
    Alert.prompt(
      item.type === 'lost' ? "Found it?" : "Is this yours?",
      `Provide proof or details to ${post.profiles?.name || 'the user'}`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Contact & Coordinate", 
          onPress: async (msg) => {
            if (!msg) return;
            try {
              await createClaim(post.id, msg);
              router.push({
                pathname: "/(screens)/ChatRoom",
                params: { 
                    roomId: `lostfound_${post.id}_${user?.id}`, 
                    title: `Claim: ${post.item_name}`,
                    otherUser: post.profiles?.name
                }
              });
            } catch (e) {
              Alert.alert("Error", "Could not submit claim");
            }
          }
        }
      ]
    );
  };

  const handleResolveToClaimant = async (postId: string, claimantId: string, claimantName: string) => {
    Alert.alert(
      "Confirm Resolution",
      `Mark this item as handed over to ${claimantName}? This will close the report and store the delivery record.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm & Resolve", 
          onPress: async () => {
            try {
              await markAsResolved(postId, claimantId);
              fetchData();
              Alert.alert("Success", "Incident resolved and record stored.");
            } catch (e) {
              Alert.alert("Error", "Could not resolve incident.");
            }
          } 
        }
      ]
    );
  };

  const renderCommunityItem = ({ item, index }: { item: LostFoundPost, index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)} layout={Layout.springify()} style={styles.rowItem}>
      <View style={styles.rowMain}>
        <View style={[styles.typeMarker, { backgroundColor: item.type === 'lost' ? '#ef4444' : '#22c55e' }]} />
        <View style={styles.rowContent}>
          <Text style={styles.rowTitle}>{item.item_name}</Text>
          <Text style={styles.rowSub} numberOfLines={1}>{item.description}</Text>
          <View style={styles.rowMeta}>
             <Text style={styles.metaType}>{item.type.toUpperCase()}</Text>
             <View style={styles.dot} />
             <Text style={styles.metaUser}>{item.profiles?.name || 'User'}</Text>
             <View style={styles.dot} />
             <Text style={styles.metaDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.contactBtn} onPress={() => handleClaimItem(item)}>
          <Ionicons name="chatbubble-outline" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderActivityItem = ({ item, type }: { item: any, type: 'post' | 'claim' }) => (
    <Animated.View entering={FadeInDown} layout={Layout.springify()} style={styles.activityBox}>
      <View style={styles.activityTop}>
        <View style={{ flex: 1 }}>
          <Text style={styles.activitySmallLabel}>{type === 'post' ? `MY ${item.type.toUpperCase()} REPORT` : 'MY INTEREST'}</Text>
          <Text style={styles.activityMainTitle}>{item.item_name || item.lost_found_posts?.item_name}</Text>
        </View>
        {type === 'post' && (
           <View style={[styles.statusIndicator, { backgroundColor: item.status === 'open' ? '#dcfce7' : '#f1f5f9' }]}>
             <Text style={[styles.statusIndicatorText, { color: item.status === 'open' ? '#166534' : '#64748b' }]}>{item.status}</Text>
           </View>
        )}
      </View>

      {type === 'post' && item.claims && item.claims.length > 0 && (
        <View style={styles.claimantsSection}>
          <Text style={styles.sectionHeading}>Coordinations ({item.claims.length}):</Text>
          {item.claims.map((claim: any) => (
            <View key={claim.id} style={styles.claimantRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.claimantName}>{claim.profiles?.name}</Text>
                <Text style={styles.claimantMsg} numberOfLines={1}>{claim.message}</Text>
              </View>
              <View style={styles.claimantActions}>
                <TouchableOpacity 
                    style={styles.chatIconBtn}
                    onPress={() => router.push({
                       pathname: "/(screens)/ChatRoom",
                       params: { 
                         roomId: `lostfound_${item.id}_${claim.claimer_id}`, 
                         title: `Chat: ${claim.profiles?.name}`,
                         otherUser: claim.profiles?.name
                       }
                    })}
                >
                  <Ionicons name="chatbubbles" size={18} color="#4f46e5" />
                </TouchableOpacity>
                <TouchableOpacity 
                   style={styles.resolveInlineBtn}
                   onPress={() => handleResolveToClaimant(item.id, claim.claimer_id, claim.profiles?.name)}
                >
                  <Text style={styles.resolveInlineText}>Handed Over</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.sysHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.sysBack}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.sysHeaderTitle}>Lost & Found</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.filterArea}>
        <View style={styles.tabBackground}>
          <TouchableOpacity style={[styles.tab, activeTab === 'community' && styles.tabActive]} onPress={() => setActiveTab('community')}>
            <Ionicons name="search-outline" size={16} color={activeTab === 'community' ? '#2D3748' : '#64748b'} />
            <Text style={[styles.tabTxt, activeTab === 'community' && styles.tabTxtActive]}>L&F Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, activeTab === 'activity' && styles.tabActive]} onPress={() => setActiveTab('activity')}>
            <Ionicons name="folder-open-outline" size={16} color={activeTab === 'activity' ? '#2D3748' : '#64748b'} />
            <Text style={[styles.tabTxt, activeTab === 'activity' && styles.tabTxtActive]}>My Handlings</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'community' && (
          <View style={styles.miniTypeFilter}>
            {['all', 'lost', 'found'].map((f) => (
              <TouchableOpacity key={f} style={[styles.typeBtn, filter === f && styles.typeBtnActive]} onPress={() => setFilter(f as any)}>
                <Text style={[styles.typeBtnTxt, filter === f && { color: '#2D3748' }]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 50 }} size="small" color="#2D3748" />
      ) : activeTab === 'community' ? (
        <FlatList
          data={posts.filter(p => filter === 'all' || p.type === filter)}
          renderItem={renderCommunityItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={styles.nothingView}><Text style={styles.nothingTxt}>No incidents reported</Text></View>}
        />
      ) : (
        <FlatList
          data={[...myActivity.posts.map(p => ({ ...p, _type: 'post' })), ...myActivity.claims.map(c => ({ ...c, _type: 'claim' }))] as any}
          renderItem={({ item }) => renderActivityItem({ item, type: item._type })}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<View style={styles.nothingView}><Text style={styles.nothingTxt}>No active handlings</Text></View>}
        />
      )}

      <TouchableOpacity style={styles.sysFab} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="create-outline" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.blurOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalBody}>
                <Text style={styles.mTitle}>Report Incident</Text>
                <View style={styles.mToggleRow}>
                  <TouchableOpacity onPress={() => setType('lost')} style={[styles.mModeBtn, type === 'lost' && styles.mModeActiveLost]}><Text style={[styles.mModeText, type === 'lost' && { color: '#fff' }]}>Lost</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => setType('found')} style={[styles.mModeBtn, type === 'found' && styles.mModeActiveFound]}><Text style={[styles.mModeText, type === 'found' && { color: '#fff' }]}>Found</Text></TouchableOpacity>
                </View>
                <TextInput placeholder="Item name" style={styles.mInput} value={itemName} onChangeText={setItemName} />
                <TextInput placeholder="Details (Color, location...)" style={[styles.mInput, { height: 100 }]} multiline value={description} onChangeText={setDescription} />
                <View style={styles.mFooter}>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}><Text style={styles.mCancel}>Cancel</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.mSubmit} onPress={handleCreatePost}><Text style={styles.mSubmitTxt}>Post</Text></TouchableOpacity>
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
  sysHeader: { backgroundColor: '#2D3748', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sysBack: { width: 30 },
  sysHeaderTitle: { color: '#fff', fontSize: RFValue(17), fontWeight: '700' },
  filterArea: { backgroundColor: '#F8FAFC', paddingVertical: 14, paddingHorizontal: 20 },
  tabBackground: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4, marginBottom: 12 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10, borderRadius: 10 },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  tabTxt: { color: '#64748b', fontSize: RFValue(12), fontWeight: '700' },
  tabTxtActive: { color: '#2D3748' },
  miniTypeFilter: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  typeBtn: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' },
  typeBtnActive: { borderColor: '#2D3748', backgroundColor: '#f1f5f9' },
  typeBtnTxt: { fontSize: RFValue(10), color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' },
  listContainer: { padding: 16, paddingBottom: 100 },
  rowItem: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  rowMain: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingRight: 14 },
  typeMarker: { width: 4, height: 40, borderRadius: 2 },
  rowContent: { flex: 1 },
  rowTitle: { fontSize: RFValue(14), fontWeight: '800', color: '#1e293b' },
  rowSub: { fontSize: RFValue(11), color: '#64748b', marginTop: 1 },
  rowMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 },
  metaType: { fontSize: RFValue(9), fontWeight: '900', color: '#64748b' },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#cbd5e1' },
  metaUser: { fontSize: RFValue(9), color: '#94a3b8', fontWeight: '600' },
  metaDate: { fontSize: RFValue(9), color: '#cbd5e1' },
  contactBtn: { width: 36, height: 36, borderRadius: 18, borderWith: 1, borderColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  activityBox: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  activityTop: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  activitySmallLabel: { fontSize: RFValue(8), fontWeight: '900', color: '#94a3b8', letterSpacing: 1 },
  activityMainTitle: { fontSize: RFValue(14), fontWeight: '800', color: '#101828', marginTop: 2 },
  statusIndicator: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusIndicatorText: { fontSize: RFValue(9), fontWeight: '800', textTransform: 'capitalize' },
  claimantsSection: { padding: 12, backgroundColor: '#fafafa', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  sectionHeading: { fontSize: RFValue(10), fontWeight: '800', color: '#64748b', marginBottom: 10 },
  claimantRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#f1f5f9' },
  claimantName: { fontSize: RFValue(12), fontWeight: '700', color: '#1e293b' },
  claimantMsg: { fontSize: RFValue(11), color: '#64748b' },
  claimantActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chatIconBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  resolveInlineBtn: { backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  resolveInlineText: { color: '#166534', fontSize: RFValue(10), fontWeight: '800' },
  sysFab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2D3748', justifyContent: 'center', alignItems: 'center', elevation: 8 },
  nothingView: { alignItems: 'center', marginTop: 120 },
  nothingTxt: { color: '#94a3b8', fontSize: RFValue(13) },
  blurOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 25 },
  modalBody: { backgroundColor: '#fff', borderRadius: 16, padding: 24 },
  mTitle: { fontSize: RFValue(18), fontWeight: '800', color: '#2D3748', marginBottom: 20 },
  mToggleRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  mModeBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#f1f5f9', alignItems: 'center' },
  mModeActiveLost: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  mModeActiveFound: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  mModeText: { fontWeight: '800', fontSize: RFValue(12), color: '#94a3b8' },
  mInput: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 14, marginBottom: 14, fontSize: RFValue(14), borderWidth: 1, borderColor: '#e2e8f0' },
  mFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 20, marginTop: 10 },
  mCancel: { color: '#64748b', fontWeight: '700' },
  mSubmit: { backgroundColor: '#2D3748', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  mSubmitTxt: { color: '#fff', fontWeight: '700' }
});
