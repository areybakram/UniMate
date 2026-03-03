import { AuthContext } from "@/Context/AuthContext";
import { supabase } from "@/supabaseClient";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const ItemDetail = () => {
  const { id } = useLocalSearchParams();
  const { user } = useContext(AuthContext) || {};
  const [item, setItem] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const fetchData = async () => {
    try {
      // Fetch Item Details
      const { data: itemData, error: itemError } = await supabase
        .from("repository_items")
        .select("*")
        .eq("id", id)
        .single();

      if (itemError) throw itemError;
      setItem(itemData);

      // Fetch Comments
      const { data: commentData, error: commentError } = await supabase
        .from("item_comments")
        .select("*, profiles(name)")
        .eq("item_id", id)
        .order("created_at", { ascending: false });

      if (commentError) throw commentError;
      setComments(commentData || []);

      // Fetch Likes Count
      const { count: lCount, error: lError } = await supabase
        .from("item_likes")
        .select("*", { count: "exact", head: true })
        .eq("item_id", id);

      setLikesCount(lCount || 0);

      // Check if user liked
      if (user) {
        const { data: likeData } = await supabase
          .from("item_likes")
          .select("*")
          .eq("item_id", id)
          .eq("user_id", user.id)
          .single();
        setIsLiked(!!likeData);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
      Alert.alert("Error", "Failed to load document details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return;
    try {
      if (isLiked) {
        await supabase
          .from("item_likes")
          .delete()
          .eq("item_id", id)
          .eq("user_id", user.id);
        setLikesCount((prev) => prev - 1);
      } else {
        await supabase
          .from("item_likes")
          .insert({ item_id: id, user_id: user.id });
        setLikesCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || !user) return;
    setIsSubmittingComment(true);
    try {
      const { error } = await supabase.from("item_comments").insert({
        item_id: id,
        user_id: user.id,
        content: comment.trim(),
      });

      if (error) throw error;
      setComment("");
      fetchData(); // Refresh comments
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDownload = async () => {
    if (item?.file_url) {
      Linking.openURL(item.file_url);
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  if (!item) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Background */}
        <LinearGradient colors={["#1e40af", "#3b82f6"]} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Ionicons name="book" size={60} color="#fff" />
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.batchBadge}>
              <Text style={styles.batchText}>{item.batch}</Text>
            </View>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Stats Row */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statBox} onPress={handleLike}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={isLiked ? "#ef4444" : "#64748b"}
              />
              <Text style={styles.statValue}>{likesCount}</Text>
              <Text style={styles.statLabel}>Likes</Text>
            </TouchableOpacity>
            <View style={styles.statBox}>
              <Ionicons name="chatbubble-ellipses" size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{comments.length}</Text>
              <Text style={styles.statLabel}>Comments</Text>
            </View>
            <TouchableOpacity style={styles.statBox} onPress={handleDownload}>
              <Ionicons name="cloud-download" size={24} color="#10b981" />
              <Text style={styles.statValue}>-</Text>
              <Text style={styles.statLabel}>Files</Text>
            </TouchableOpacity>
          </View>

          {/* Metadata Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Info</Text>
            <View style={styles.infoRow}>
              <Ionicons name="school" size={20} color="#64748b" />
              <Text style={styles.infoText}>
                {item.course_name} ({item.course_code})
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="person" size={20} color="#64748b" />
              <Text style={styles.infoText}>{item.course_teacher_name}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagContainer}>
              {((item.tags as string[]) || []).map((tag: string) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Comments Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comments</Text>
            {comments.length > 0 ? (
              comments.map((c) => (
                <View key={c.id} style={styles.commentBox}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>
                      {c.profiles?.name || "User"}
                    </Text>
                    <Text style={styles.commentDate}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={styles.commentText}>{c.content}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>
                No comments yet. Be the first to comment!
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <View style={styles.commentInputContainer}>
          <TextInput
            placeholder="Add a comment..."
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleAddComment}
            disabled={isSubmittingComment}
          >
            {isSubmittingComment ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
        >
          <LinearGradient
            colors={["#10b981", "#059669"]}
            style={styles.downloadGradient}
          >
            <Ionicons name="download" size={20} color="#fff" />
            <Text style={styles.downloadText}>Download File</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 10,
  },
  batchBadge: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  batchText: {
    color: "#1e40af",
    fontWeight: "bold",
    fontSize: 12,
  },
  typeBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  typeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
    letterSpacing: 1,
  },
  content: {
    padding: 25,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    marginTop: -50,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: "#475569",
  },
  descriptionText: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
    color: "#3b82f6",
    fontWeight: "600",
  },
  commentBox: {
    backgroundColor: "#f8fafc",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  commentUser: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1e293b",
  },
  commentDate: {
    fontSize: 12,
    color: "#94a3b8",
  },
  commentText: {
    fontSize: 14,
    color: "#475569",
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    fontStyle: "italic",
  },
  bottomActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    backgroundColor: "#fff",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 25,
    paddingLeft: 20,
    marginBottom: 15,
  },
  commentInput: {
    flex: 1,
    height: 50,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  downloadButton: {
    width: "100%",
  },
  downloadGradient: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 55,
    borderRadius: 15,
    gap: 10,
  },
  downloadText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ItemDetail;
