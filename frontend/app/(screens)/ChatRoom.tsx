import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { AuthContext } from '@/Context/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import { RFValue } from 'react-native-responsive-fontsize';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { SlideInRight, SlideInLeft } from 'react-native-reanimated';
import { getChatHistory } from '@/utils/chatService';

const { width } = Dimensions.get('window');

interface Message {
  id?: string;
  senderId: string;
  text: string;
  timestamp: string;
  sender_id?: string; // from DB
  created_at?: string; // from DB
}

export default function ChatRoomScreen() {
  const { roomId, title, otherUser } = useLocalSearchParams();
  const { user } = useContext(AuthContext) || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const { socket, isConnected, sendMessage } = useSocket(roomId as string);

  // 1. Load Conversation History
  useEffect(() => {
    const loadHistory = async () => {
      if (!roomId) return;
      setLoadingHistory(true);
      try {
        console.log(`🔍 Fetching history for room: ${roomId}`);
        const history = await getChatHistory(roomId as string);
        console.log(`📜 History loaded: ${history.length} messages`);
        // Map DB fields to component fields if needed
        const mappedHistory = history.map(m => ({
          id: m.id,
          senderId: m.sender_id,
          text: m.text,
          timestamp: m.created_at
        }));
        setMessages(mappedHistory);
      } catch (e) {
        console.error("Error loading chat history:", e);
      } finally {
        setLoadingHistory(false);
      }
    };
    loadHistory();
  }, [roomId]);

  // 2. Handle Real-time Messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: any) => {
        // Prevent duplication by checking ID if it exists
        setMessages(prev => {
            const exists = prev.some(m => (m.id && m.id === msg.id) || (m.timestamp === msg.timestamp && m.text === msg.text && m.senderId === msg.senderId));
            if (exists) return prev;
            
            return [...prev, {
                id: msg.id,
                senderId: msg.senderId,
                text: msg.text,
                timestamp: msg.timestamp
            }];
        });
    };

    socket.on('receive_message', handleNewMessage);

    return () => {
      socket.off('receive_message', handleNewMessage);
    };
  }, [socket]);

  const handleSend = () => {
    if (!inputText.trim() || !user) return;

    const timestamp = new Date().toISOString();
    const newMessage: Message = {
      senderId: user.id,
      text: inputText,
      timestamp,
    };

    sendMessage({
      roomId: roomId as string,
      ...newMessage
    });

    // Optimistically add to list (optional, but good for UX)
    // Actually, socket broadcast will return it. 
    // To avoid waiting for broadcast, we can add it but the deduplication logic in handleNewMessage will catch it when it arrives from socket.
    
    setInputText('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const sender = item.senderId || item.sender_id;
    const isMine = sender === user?.id;
    
    return (
      <Animated.View 
        entering={isMine ? SlideInRight : SlideInLeft}
        style={[styles.messageWrapper, isMine ? styles.myWrapper : styles.theirWrapper]}
      >
        {!isMine && (
          <View style={styles.miniAvatar}>
            <Text style={styles.miniAvatarText}>{(otherUser as string)?.[0] || 'U'}</Text>
          </View>
        )}
        <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMine ? styles.myText : styles.theirText]}>
            {item.text}
          </Text>
          <Text style={[styles.timestampLabel, isMine ? styles.myTimestamp : styles.theirTimestamp]}>
            {new Date(item.timestamp || item.created_at || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4f46e5', '#312e81']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle} numberOfLines={1}>{title || "Coordination"}</Text>
            <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10b981' : '#f59e0b' }]} />
                <Text style={styles.headerStatus}>{otherUser || (isConnected ? "Online" : "Connecting...")}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {loadingHistory ? (
            <ActivityIndicator style={{ flex: 1 }} size="large" color="#4f46e5" />
        ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(m, index) => m.id || index.toString()}
              contentContainerStyle={styles.list}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="chatbubbles-outline" size={80} color="#e2e8f0" />
                  <Text style={styles.emptyText}>No messages yet</Text>
                  <Text style={styles.emptySub}>Start the coordination between you and {otherUser}</Text>
                </View>
              }
            />
        )}

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Message..."
              placeholderTextColor="#94a3b8"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: RFValue(17), fontWeight: '900', color: '#fff' },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  headerStatus: { fontSize: RFValue(11), color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  keyboardView: { flex: 1 },
  list: { padding: 20, paddingBottom: 40 },
  messageWrapper: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 18, gap: 8 },
  myWrapper: { alignSelf: 'flex-end' },
  theirWrapper: { alignSelf: 'flex-start' },
  miniAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  miniAvatarText: { color: '#fff', fontSize: RFValue(12), fontWeight: '900' },
  bubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 22, maxWidth: width * 0.7 },
  myBubble: { backgroundColor: '#2D3748', borderBottomRightRadius: 4, elevation: 5, shadowColor: '#2D3748', shadowOpacity: 0.2, shadowRadius: 10 },
  theirBubble: { backgroundColor: '#fff', borderBottomLeftRadius: 4, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  messageText: { fontSize: RFValue(14), lineHeight: 22 },
  myText: { color: '#fff' },
  theirText: { color: '#1e293b' },
  timestampLabel: { fontSize: RFValue(9), marginTop: 6, opacity: 0.6 },
  myTimestamp: { color: '#fff', alignSelf: 'flex-end' },
  theirTimestamp: { color: '#64748b', alignSelf: 'flex-start' },
  emptyState: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyText: { color: '#1e293b', fontSize: RFValue(16), fontWeight: '900', marginTop: 15 },
  emptySub: { color: '#94a3b8', fontSize: RFValue(12), textAlign: 'center', marginTop: 8 },
  inputContainer: { padding: 20, backgroundColor: 'transparent' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 30, paddingHorizontal: 15, paddingVertical: 8, elevation: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15 },
  input: { flex: 1, fontSize: RFValue(14), color: '#1e293b', paddingHorizontal: 10, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center' },
  sendBtnDisabled: { backgroundColor: '#e2e8f0' }
});
