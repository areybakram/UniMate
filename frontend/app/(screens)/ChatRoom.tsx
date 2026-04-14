import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { AuthContext } from '@/Context/AuthContext';
import { useSocket } from '@/hooks/useSocket';

interface Message {
  id?: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export default function ChatRoomScreen() {
  const { roomId, title } = useLocalSearchParams();
  const { user } = useContext(AuthContext) || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const { isConnected, sendMessage, onMessage } = useSocket(roomId as string);

  useEffect(() => {
    onMessage((msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });
  }, [onMessage]);

  const handleSend = () => {
    if (!inputText.trim() || !user) return;

    const newMessage: Message = {
      senderId: user.id,
      text: inputText,
      timestamp: new Date().toISOString(),
    };

    sendMessage({
      roomId: roomId as string,
      ...newMessage
    });

    setInputText('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === user?.id;
    return (
      <View style={[styles.messageWrapper, isMine ? styles.myMessage : styles.theirMessage]}>
        <View style={[styles.messageBubble, isMine ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMine ? styles.myText : styles.theirText]}>
            {item.text}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{title || "Coordination Chat"}</Text>
          <Text style={styles.headerStatus}>{isConnected ? "Online" : "Connecting..."}</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 50, 
    paddingBottom: 15, 
    paddingHorizontal: 20, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  backBtn: { marginRight: 15 },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  headerStatus: { fontSize: 12, color: '#10b981' },
  list: { padding: 20 },
  messageWrapper: { marginBottom: 15, maxWidth: '80%' },
  myMessage: { alignSelf: 'flex-end' },
  theirMessage: { alignSelf: 'flex-start' },
  messageBubble: { padding: 12, borderRadius: 20 },
  myBubble: { backgroundColor: '#4f46e5', borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: '#e2e8f0', borderBottomLeftRadius: 4 },
  messageText: { fontSize: 15, lineHeight: 22 },
  myText: { color: '#fff' },
  theirText: { color: '#1e293b' },
  timestamp: { fontSize: 10, color: 'rgba(0,0,0,0.4)', marginTop: 4, alignSelf: 'flex-end' },
  inputArea: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    padding: 15, 
    backgroundColor: '#fff', 
    borderTopWidth: 1, 
    borderTopColor: '#f1f5f9' 
  },
  input: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, fontSize: 16, maxHeight: 100 },
  sendBtn: { marginLeft: 10, width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center' }
});
