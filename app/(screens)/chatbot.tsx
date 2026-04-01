import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeInUp, Layout } from "react-native-reanimated";
import { queryUniMate, ChatMessage } from "../../utils/chatbotService";
import { AuthContext } from "../../Context/AuthContext";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");

const ChatScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext) || {};
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content: `👋 Hi ${user?.name || "there"}! I'm UniMate. Ask me anything about COMSATS Lahore academics, faculty, or campus.`,
    },
  ]);

  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView | null>(null);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userQuery = input.trim();
    const newMessages: ChatMessage[] = [...messages, { role: "user", content: userQuery }];
    
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);
    Keyboard.dismiss();

    try {
      const response = await queryUniMate(userQuery, messages);
      setMessages([...newMessages, { role: "bot", content: response }]);
    } catch (error) {
      setMessages([...newMessages, { role: "bot", content: "Sorry, I'm having trouble thinking right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  /* === Auto Scroll === */
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isTyping]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient colors={["#2D3748", "#1A202C"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>UniMate Assistant</Text>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.headerSubtitle}>Always here to help</Text>
            </View>
          </View>
          <Ionicons name="sparkles" size={20} color="#90CDF4" />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.chatArea}>
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, index) => (
              <Animated.View 
                key={index} 
                entering={FadeInDown.springify().delay(100)} 
                layout={Layout.springify()}
                style={[
                  styles.bubbleWrapper,
                  msg.role === "user" ? styles.userWrapper : styles.botWrapper
                ]}
              >
                <View style={styles.avatarMessageRow}>
                  {msg.role === "bot" && (
                    <View style={[styles.avatar, styles.botAvatar]}>
                      <MaterialCommunityIcons name="robot-outline" size={16} color="#fff" />
                    </View>
                  )}
                  
                  <View style={[
                    styles.bubble,
                    msg.role === "user" ? styles.userBubble : styles.botBubble
                  ]}>
                    <Text style={[
                      styles.messageText,
                      msg.role === "user" ? styles.userText : styles.botText
                    ]}>
                      {msg.content}
                    </Text>
                  </View>

                  {msg.role === "user" && (
                    <View style={[styles.avatar, styles.userAvatar]}>
                      <Text style={styles.avatarText}>{user?.name?.charAt(0) || "U"}</Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            ))}
            
            {isTyping && (
              <Animated.View entering={FadeInDown} style={styles.botWrapper}>
                <View style={styles.avatarMessageRow}>
                  <View style={[styles.avatar, styles.botAvatar]}>
                    <Ionicons name="sparkles" size={12} color="#fff" />
                  </View>
                  <View style={[styles.bubble, styles.botBubble, styles.typingContainer]}>
                    <ActivityIndicator size="small" color="#4A5568" />
                    <Text style={styles.typingText}>Thinking...</Text>
                  </View>
                </View>
              </Animated.View>
            )}
          </ScrollView>

          {/* Input Area */}
          <BlurView intensity={80} tint="light" style={styles.inputContainer}>
            <Animated.View entering={FadeInUp.delay(300)} style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { maxHeight: 100 }]}
                placeholder="Message UniMate..."
                placeholderTextColor="#94A3B8"
                value={input}
                onChangeText={setInput}
                multiline
              />
              <TouchableOpacity 
                activeOpacity={0.7}
                onPress={handleSend} 
                style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
                disabled={!input.trim() || isTyping}
              >
                <LinearGradient
                  colors={!input.trim() ? ["#E2E8F0", "#CBD5E0"] : ["#3182CE", "#2C5282"]}
                  style={styles.sendGradient}
                >
                  {isTyping ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="arrow-up" size={20} color="#fff" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </BlurView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D3748",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#48BB78",
    marginRight: 6,
  },
  headerSubtitle: {
    color: "#A0AEC0",
    fontSize: 12,
    fontWeight: "500",
  },
  chatArea: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  bubbleWrapper: {
    marginBottom: 20,
    maxWidth: "85%",
  },
  userWrapper: {
    alignSelf: "flex-end",
  },
  botWrapper: {
    alignSelf: "flex-start",
  },
  avatarMessageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  botAvatar: {
    backgroundColor: "#2D3748",
  },
  userAvatar: {
    backgroundColor: "#3182CE",
  },
  avatarText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  bubble: {
    padding: 14,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    flexShrink: 1,
  },
  userBubble: {
    backgroundColor: "#3182CE",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: "#fff",
    fontWeight: "500",
  },
  botText: {
    color: "#1E293B",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  typingText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "500",
  },
  inputContainer: {
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.5)",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 6,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1E293B",
    minHeight: 44,
  },
  sendButton: {
    width: 40,
    height: 40,
  },
  sendGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});

export default ChatScreen;
