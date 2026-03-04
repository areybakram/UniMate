import Fuse from "fuse.js";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import MessageBubble from "../../components/MessageBubble";
import dataset from "../../utils/comsats_data";

/* ============================= */
/* ========= TYPES ============= */
/* ============================= */

interface Message {
  role: "user" | "bot";
  content: string;
  time: string;
}

interface FacultyItem {
  type: "faculty";
  name: string;
  department: string;
  designation: string;
  area?: string;
  hod?: boolean;
}

interface GeneralItem {
  type: "general";
  question: string;
  answer: string;
}

type DatasetItem = FacultyItem | GeneralItem;

/* ============================= */
/* ========= COMPONENT ========= */
/* ============================= */

const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "👋 Hi! Ask me anything about COMSATS Lahore.",
      time: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState<string>("");
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  const scrollRef = useRef<ScrollView | null>(null);

  /* ============================= */
  /* ========= FUSE SETUP ======== */
  /* ============================= */

  const fuse = new Fuse<DatasetItem>(dataset as DatasetItem[], {
    keys: ["question", "name", "department", "designation", "area"],
    threshold: 0.4,
  });

  /* ============================= */
  /* ===== KEYBOARD LISTENER ===== */
  /* ============================= */

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (e) =>
      setKeyboardHeight(e.endCoordinates.height),
    );

    const hide = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardHeight(0),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  /* ============================= */
  /* ===== FACULTY LINKS ========= */
  /* ============================= */

  const facultyLinks: Record<string, string> = {
    "management sciences": "https://lahore.comsats.edu.pk/ms/faculty.aspx",
    "electrical engineering": "https://lahore.comsats.edu.pk/ee/faculty.aspx",
    "computer engineering": "https://lahore.comsats.edu.pk/ce/faculty.aspx",
    pharmacy: "https://lahore.comsats.edu.pk/pharmacy/Faculty.aspx",
    "computer science": "https://lahore.comsats.edu.pk/cs/faculty.aspx",
  };

  /* ============================= */
  /* ========= GET ANSWER ======== */
  /* ============================= */

  const getAnswer = (query: string): string => {
    const lowerQuery = query.toLowerCase().trim();

    /* === Greetings === */
    const greetings = ["hi", "hello", "salam", "assalamualaikum", "hey"];
    if (greetings.includes(lowerQuery)) {
      return "👋 Hello! I am here to provide information about COMSATS Lahore. Ask me anything! 🎓";
    }

    /* === HOD Logic === */
    if (
      lowerQuery.includes("hod") ||
      lowerQuery.includes("head of department")
    ) {
      const hodExact = (dataset as DatasetItem[]).find(
        (item) =>
          item.type === "faculty" &&
          item.hod &&
          lowerQuery.includes(item.department.toLowerCase()),
      ) as FacultyItem | undefined;

      if (hodExact) {
        return `${hodExact.name} is the HOD of ${hodExact.department}.`;
      }

      for (const dept in facultyLinks) {
        if (lowerQuery.includes(dept)) {
          return `I couldn't find the HOD for ${dept}. You can visit the faculty page here: ${facultyLinks[dept]}`;
        }
      }

      const hod = (dataset as DatasetItem[]).find(
        (item) => item.type === "faculty" && item.hod,
      ) as FacultyItem | undefined;

      if (hod) {
        return `${hod.name} is the HOD of ${hod.department}.`;
      }
    }

    /* === Campus Info === */
    const campusKeywords = ["campus", "campuses", "locations", "cui"];
    if (campusKeywords.some((word) => lowerQuery.includes(word))) {
      return "COMSATS University Islamabad has campuses in Islamabad, Abbottabad, Wah, Lahore, Attock, Sahiwal, Vehari & Virtual.";
    }

    /* === Keyword Rules === */
    const keywordsMap = [
      { keywords: ["library"], field: "library" },
      { keywords: ["fee", "tuition"], field: "fee" },
      { keywords: ["location", "where"], field: "location" },
      { keywords: ["hostel", "dorm"], field: "hostel" },
      { keywords: ["department"], field: "department" },
      { keywords: ["students"], field: "students" },
      { keywords: ["facilities"], field: "facilities" },
      { keywords: ["n block"], field: "n block" },
      { keywords: ["scholarship"], field: "scholarship" },
    ];

    for (const rule of keywordsMap) {
      if (rule.keywords.some((word) => lowerQuery.includes(word))) {
        const found = (dataset as DatasetItem[]).find(
          (item) =>
            item.type === "general" &&
            item.question.toLowerCase().includes(rule.field),
        ) as GeneralItem | undefined;

        if (found) return found.answer;
      }
    }

    /* === Fuse Search Fallback === */
    const fuseResult = fuse.search(query)[0]?.item;

    if (fuseResult) {
      if (fuseResult.type === "faculty") {
        return `${fuseResult.name} is ${fuseResult.designation} in ${fuseResult.department}. Area: ${fuseResult.area || "N/A"}`;
      }

      if (fuseResult.type === "general") {
        return fuseResult.answer;
      }
    }

    /* === Department Link Fallback === */
    const departmentKeywords = [
      "faculty",
      "professor",
      "department",
      "hod",
      "teacher",
    ];

    if (departmentKeywords.some((word) => lowerQuery.includes(word))) {
      for (const dept in facultyLinks) {
        if (lowerQuery.includes(dept)) {
          return `I couldn't find specific info for that department or professor. Please visit the faculty page here: ${facultyLinks[dept]}`;
        }
      }
    }

    /* === Default === */
    return "This information is confidential. Please visit Student Services or COMSATS official websites.";
  };

  /* ============================= */
  /* ===== MESSAGE HANDLING ====== */
  /* ============================= */

  const addMessage = (role: "user" | "bot", content: string) => {
    setMessages((prev) => [
      ...prev,
      { role, content, time: new Date().toISOString() },
    ]);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    addMessage("user", input);
    Keyboard.dismiss();

    const answer = getAnswer(input);
    addMessage("bot", answer);

    setInput("");
  };

  /* === Auto Scroll === */
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, keyboardHeight]);

  /* ============================= */
  /* ========= UI ================ */
  /* ============================= */

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={{ flex: 1, backgroundColor: "#0A5EFF" }}>
        <View
          style={{
            padding: 20,
            paddingTop: 40,
            backgroundColor: "#0A5EFF",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            COMSATS Chatbot
          </Text>
          <Text style={{ color: "#dbe7ff", fontSize: 12 }}>
            Ask anything about COMSATS
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "#f5f7ff",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingTop: 10,
          }}
        >
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1, padding: 15 }}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} />
            ))}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              margin: 10,
              backgroundColor: "#fff",
              borderRadius: 30,
              paddingHorizontal: 10,
              paddingVertical: 5,
              alignItems: "center",
              elevation: 5,
            }}
          >
            <TextInput
              style={{ flex: 1, padding: 10, fontSize: 14 }}
              placeholder="Type your message..."
              value={input}
              onChangeText={setInput}
              multiline
            />

            <TouchableOpacity
              onPress={handleSend}
              style={{
                backgroundColor: "#0A5EFF",
                padding: 12,
                borderRadius: 25,
                marginLeft: 5,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
