import ItemCard from "@/components/ItemCard";
import SmallSOSButton from "@/components/SmallSOSButton";
import UploadModal from "@/components/UploadModal";
import { supabase } from "@/supabaseClient";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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

interface RepositoryItem {
  id: string;
  title: string;
  type: "book" | "note" | "past_paper";
  course_name: string;
  course_teacher: string;
  batch: string;
  likes: number;
  comments: number;
  status: "pending" | "approved" | "disapproved";
}

const CATEGORIES = ["All", "Books", "Notes", "Past Papers"];

const Repository = () => {
  const [items, setItems] = useState<RepositoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [availableBatches, setAvailableBatches] = useState<string[]>([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

  const fetchAvailableBatches = async () => {
    try {
      const { data, error } = await supabase
        .from("repository_items")
        .select("batch")
        .eq("status", "approved");

      if (error) throw error;

      const uniqueBatches = Array.from(
        new Set((data || []).map((item) => item.batch)),
      ).sort();
      setAvailableBatches(uniqueBatches);

      // If current selected batch isn't in the list (except for default), reset it
      if (
        uniqueBatches.length > 0 &&
        selectedBatch === "All Batches" &&
        !uniqueBatches.includes(selectedBatch)
      ) {
        // We can keep "All Batches" as an option or default to first one
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const fetchItems = async () => {
    try {
      let query = supabase
        .from("repository_items")
        .select("*")
        .eq("status", "approved");

      if (selectedBatch !== "All Batches") {
        query = query.eq("batch", selectedBatch);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      const mappedItems = (data || []).map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        course_name: item.course_name,
        course_teacher: item.course_teacher_name,
        batch: item.batch,
        likes: 0, // Need to implement likes count separately or via join
        comments: 0, // Need to implement comments count separately or via join
        status: item.status,
      })) as RepositoryItem[];

      setItems(mappedItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAvailableBatches();
    fetchItems();
  }, [selectedBatch]);

  const handleBatchSelect = () => {
    const options = ["All Batches", ...availableBatches];

    Alert.alert(
      "Select Batch",
      "Choose your batch to filter content",
      options.map((batch) => ({
        text: batch,
        onPress: () => setSelectedBatch(batch),
      })),
      { cancelable: true },
    );
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchAvailableBatches();
    fetchItems();
  }, [selectedBatch]);

  const filteredData = items.filter((item) => {
    // Only show items with 'approved' status in global student library
    if (item.status !== "approved") return false;

    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Books" && item.type === "book") ||
      (selectedCategory === "Notes" && item.type === "note") ||
      (selectedCategory === "Past Papers" && item.type === "past_paper");

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.course_teacher.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Section */}
      <LinearGradient colors={["#2D3748", "#4A5568"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>UniMate</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <SmallSOSButton />
            <TouchableOpacity>
              <Ionicons name="filter" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#94a3b8"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search books, notes, teachers..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          >
            {CATEGORIES.map(renderCategoryChip)}
          </ScrollView>
        </View>

        <View style={styles.batchContainer}>
          <View style={styles.batchLeft}>
            <Text style={styles.batchLabel}>Browsing for: </Text>
            <TouchableOpacity
              style={styles.batchSelector}
              onPress={handleBatchSelect}
            >
              <Text style={styles.batchValue}>{selectedBatch}</Text>
              <Ionicons name="chevron-down" size={16} color="#2D3748" />
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
            <ActivityIndicator size="large" color="#2D3748" />
          </View>
        ) : filteredData.length > 0 ? (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <ItemCard
                item={item}
                index={index}
                onPress={() =>
                  router.push({
                    pathname: "/(screens)/ItemDetail",
                    params: { id: item.id },
                  } as any)
                }
              />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            style={styles.emptyState}
          >
            <Ionicons name="library-outline" size={80} color="#e2e8f0" />
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubText}>
              Try searching for something else or upload your own content!
            </Text>
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
    position: "relative",
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
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    top: 60, // Align with the icons
    zIndex: -1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  batchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
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
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 5,
  },
  inlineAddBtn: {
    elevation: 4,
    shadowColor: "#3b82f6",
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
  batchValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D3748",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#475569",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Repository;
