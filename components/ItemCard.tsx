import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

interface ItemCardProps {
  item: {
    id: string;
    title: string;
    type: "book" | "note" | "past_paper";
    course_name: string;
    course_teacher: string;
    batch: string;
    likes: number;
    comments: number;
  };
  onPress: () => void;
  index: number;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onPress, index }) => {
  const getIcon = () => {
    switch (item.type) {
      case "book":
        return "book";
      case "note":
        return "document-text";
      case "past_paper":
        return "reader";
      default:
        return "help-circle";
    }
  };

  const getColor = () => {
    switch (item.type) {
      case "book":
        return "#3b82f6";
      case "note":
        return "#10b981";
      case "past_paper":
        return "#f59e0b";
      default:
        return "#64748b";
    }
  };

  return (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(500)}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View
          style={[styles.iconContainer, { backgroundColor: getColor() + "15" }]}
        >
          <Ionicons name={getIcon()} size={28} color={getColor()} />
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.batchTag}>{item.batch}</Text>
            <Text style={styles.typeTag}>
              {item.type.replace("_", " ").toUpperCase()}
            </Text>
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.course} numberOfLines={1}>
            {item.course_name} • {item.course_teacher}
          </Text>

          <View style={styles.footer}>
            <View style={styles.stat}>
              <Ionicons name="heart" size={16} color="#ef4444" />
              <Text style={styles.statValue}>{item.likes}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="chatbubble-ellipses" size={16} color="#64748b" />
              <Text style={styles.statValue}>{item.comments}</Text>
            </View>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#cbd5e1"
          style={styles.arrow}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 8,
  },
  batchTag: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e40af",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
  },
  typeTag: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 2,
  },
  course: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    gap: 15,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  arrow: {
    marginLeft: 10,
  },
});

export default ItemCard;
