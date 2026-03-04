import ItemCard from "@/components/ItemCard";
import UploadModal from "@/components/UploadModal";
import { AuthContext } from "@/Context/AuthContext";
import { supabase } from "@/supabaseClient";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const CATEGORIES = ["All", "Books", "Notes", "Past Papers"];

const TeacherRepository = () => {
  const { user } = useContext(AuthContext) || {};
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"browse" | "approvals">("browse");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

  const fetchItems = async () => {
    try {
      let query = supabase.from("repository_items").select("*");

      if (activeTab === "approvals") {
        query = query
          .eq("status", "pending")
          .eq("course_teacher_email", user?.email?.toLowerCase().trim());
      } else {
        query = query.eq("status", "approved");
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });
      if (error) throw error;

      const mappedItems = (data || []).map((item) => ({
        ...item,
        course_teacher: item.course_teacher_name, // Map for ItemCard
      }));

      setItems(mappedItems);

      // Fetch pending count for badge
      const { count } = await supabase
        .from("repository_items")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
        .eq("course_teacher_email", user?.email?.toLowerCase().trim());
      setPendingCount(count || 0);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleAction = async (
    id: string,
    newStatus: "approved" | "disapproved",
  ) => {
    try {
      const { error } = await supabase
        .from("repository_items")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      Alert.alert("Success", `Document ${newStatus} successfully.`);
      fetchItems();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update document status");
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchItems();
    }
  }, [activeTab, user?.email]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchItems();
  }, [activeTab]);

  const availableBatches = [
    "All",
    ...Array.from(new Set(items.map((item) => item.batch))).filter(Boolean),
  ] as string[];

  const handleBatchSelect = () => {
    Alert.alert(
      "Select Batch",
      "Choose a batch to filter documents",
      availableBatches.map((batch) => ({
        text: batch,
        onPress: () => setSelectedBatch(batch),
      })),
      { cancelable: true },
    );
  };

  const filteredData = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Books" && item.type === "book") ||
      (selectedCategory === "Notes" && item.type === "note") ||
      (selectedCategory === "Past Papers" &&
        (item.type as string) === "past_paper");

    const matchesBatch =
      selectedBatch === "All" || item.batch === selectedBatch;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course_name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesBatch && matchesSearch;
  });

  const renderCategoryChip = (category: string) => {
    const isActive = selectedCategory === category;
    return (
      <TouchableOpacity
        key={category}
        onPress={() => setSelectedCategory(category)}
        style={[styles.categoryChip, isActive && styles.activeCategoryChip]}
      >
        <Text
          style={[styles.categoryText, isActive && styles.activeCategoryText]}
        >
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderBatchChip = (batch: string) => {
    const isActive = selectedBatch === batch;
    return (
      <TouchableOpacity
        key={batch}
        onPress={() => setSelectedBatch(batch)}
        style={[
          styles.categoryChip,
          isActive && { backgroundColor: "#2D3748", borderColor: "#2D3748" },
        ]}
      >
        <Text
          style={[styles.categoryText, isActive && styles.activeCategoryText]}
        >
          {batch}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#2D3748", "#4A5568"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Faculty Library</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "browse" && styles.activeTab]}
            onPress={() => setActiveTab("browse")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "browse" && styles.activeTabText,
              ]}
            >
              Browse
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "approvals" && styles.activeTab]}
            onPress={() => setActiveTab("approvals")}
          >
            <View style={styles.tabWithBadge}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === "approvals" && styles.activeTabText,
                ]}
              >
                Approvals
              </Text>
              {pendingCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pendingCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#94a3b8"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search documents..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {activeTab === "browse" && (
          <View style={styles.filterSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {CATEGORIES.map(renderCategoryChip)}
            </ScrollView>
          </View>
        )}

        <View style={styles.batchContainer}>
          <View style={styles.batchLeft}>
            <Text style={styles.batchLabel}>Browsing for: </Text>
            <TouchableOpacity
              style={styles.batchSelector}
              onPress={handleBatchSelect}
            >
              <Text style={styles.batchValue}>{selectedBatch}</Text>
              <Ionicons name="chevron-down" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.inlineAddBtn}
            onPress={() => setIsUploadModalVisible(true)}
          >
            <LinearGradient
              colors={["#4A5568", "#2D3748"]}
              style={styles.inlineAddGradient}
            >
              <Ionicons name="add" size={23} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#4338CA" />
          </View>
        ) : filteredData.length > 0 ? (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View>
                <ItemCard
                  item={item as any}
                  index={index}
                  onPress={() =>
                    router.push({
                      pathname: "/(screens)/ItemDetail",
                      params: { id: item.id },
                    } as any)
                  }
                />
                {activeTab === "approvals" && (
                  <View style={styles.approvalActions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.disapproveBtn]}
                      onPress={() => handleAction(item.id, "disapproved")}
                    >
                      <Ionicons name="close-circle" size={20} color="#ef4444" />
                      <Text style={styles.disapproveText}>Disapprove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.approveBtn]}
                      onPress={() => handleAction(item.id, "approved")}
                    >
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#fff"
                      />
                      <Text style={styles.approveText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <Animated.View
            entering={FadeInDown.delay(200)}
            style={styles.emptyState}
          >
            <Ionicons name="documents-outline" size={80} color="#e2e8f0" />
            <Text style={styles.emptyText}>Nothing to show here</Text>
          </Animated.View>
        )}
      </View>

      <UploadModal
        visible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "700",
    fontSize: 14,
  },
  activeTabText: {
    color: "#4338CA",
  },
  tabWithBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    backgroundColor: "#ef4444",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    // fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  filterSection: {
    marginBottom: 15,
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeCategoryChip: {
    backgroundColor: "#4A5568",
    borderColor: "#4A5568",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  activeCategoryText: {
    color: "#fff",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  approvalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: -10,
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    elevation: 2,
  },
  approveBtn: {
    backgroundColor: "#10b981",
  },
  disapproveBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  approveText: {
    color: "#fff",
    fontWeight: "bold",
  },
  disapproveText: {
    color: "#ef4444",
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#94a3b8",
    marginTop: 15,
  },
  batchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  batchLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  batchLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  batchSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2D3748",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 5,
  },
  batchValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  inlineAddBtn: {
    elevation: 4,
    shadowColor: "#2D3748",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  inlineAddGradient: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TeacherRepository;
