import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import MapTag from "../../../components/MapTag";
import buildings from "../../Modules/Tagging/data";

interface Building {
  id: string;
  short: string;
  title: string;
  subtitle: string;
  description: string;
  x: number;
  y: number;
  hours: string;
  contact: string;
  departments?: string;
  facilities?: string;
  features?: string[];
  images: any[];
}

interface NaturalSize {
  w: number;
  h: number;
}

const CAMPUS_MAP = require("../../../assets/campus-map.png");

export default function MapTaggerScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const [naturalSize] = useState<NaturalSize>({ w: 1920, h: 1080 });
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null,
  );
  const scrollRef = useRef<ScrollView>(null);

  const { containerWidth, containerHeight } = useMemo(() => {
    if (!naturalSize.w || !naturalSize.h)
      return { containerWidth: 0, containerHeight: 0 };
    const w = screenWidth;
    const aspect = naturalSize.h / naturalSize.w;
    return { containerWidth: w, containerHeight: w * aspect };
  }, [screenWidth, naturalSize]);

  const handleTagPress = (building: Building) => {
    setSelectedBuilding(building);
    // Scroll down to show the details panel
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Sticky Header */}
      <SafeAreaView style={styles.safeHeader} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Campus Navigation</Text>
            <Text style={styles.headerSubtitle}>
              COMSATS University Islamabad
            </Text>
          </View>

          <View style={styles.badge}>
            <Ionicons name="location" size={12} color="#fff" />
            <Text style={styles.badgeText}>{buildings.length}</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* Scrollable content */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Map */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <View
            style={[
              styles.imageWrap,
              { width: containerWidth, height: containerHeight },
            ]}
          >
            <Image
              source={CAMPUS_MAP}
              style={{ width: containerWidth, height: containerHeight }}
              resizeMode="cover"
              accessible
              accessibilityLabel="Campus satellite map with tagged buildings"
            />

            {/* Tags overlay */}
            <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
              {buildings?.map((b: any) => {
                const left = b.x * containerWidth;
                const top = b.y * containerHeight;
                return (
                  <MapTag
                    key={b.id}
                    title={b.short || b.title}
                    left={left}
                    top={top}
                    onPress={() => handleTagPress(b)}
                  />
                );
              })}
            </View>
          </View>
        </Animated.View>

        {/* Hint bar (shown when nothing selected) */}
        {!selectedBuilding && (
          <View style={styles.infoBar}>
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={16} color="#2D3748" />
              <Text style={styles.infoText}>
                {buildings.length} buildings tagged
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="hand-left-outline" size={16} color="#2D3748" />
              <Text style={styles.infoText}>Tap a pin to explore</Text>
            </View>
          </View>
        )}

        {/* Inline Building Detail Panel */}
        {selectedBuilding && (
          <Animated.View
            entering={FadeInUp.duration(350)}
            style={styles.detailPanel}
          >
            {/* Panel header */}
            <View style={styles.panelHeader}>
              <View style={styles.panelBadge}>
                <Text style={styles.panelBadgeText}>
                  {selectedBuilding.short}
                </Text>
              </View>
              <View style={styles.panelTitleBlock}>
                <Text style={styles.panelTitle}>{selectedBuilding.title}</Text>
                <Text style={styles.panelSubtitle}>
                  {selectedBuilding.subtitle}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedBuilding(null)}
              >
                <Ionicons name="close" size={18} color="#2D3748" />
              </TouchableOpacity>
            </View>

            {/* Images carousel */}
            {selectedBuilding.images?.length > 0 && (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.imageCarousel}
              >
                {selectedBuilding.images.map((img: any, idx: number) => (
                  <Image
                    key={idx}
                    source={img}
                    style={{
                      width: screenWidth - 32,
                      height: 180,
                      borderRadius: 12,
                    }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
            )}

            {/* About */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.sectionText}>
                {selectedBuilding.description}
              </Text>
            </View>

            {/* Info rows */}
            <View style={styles.infoGrid}>
              <View style={styles.infoGridItem}>
                <Ionicons name="time-outline" size={16} color="#2D3748" />
                <View>
                  <Text style={styles.infoGridLabel}>Hours</Text>
                  <Text style={styles.infoGridValue}>
                    {selectedBuilding.hours}
                  </Text>
                </View>
              </View>

              <View style={styles.infoGridItem}>
                <Ionicons name="mail-outline" size={16} color="#2D3748" />
                <View>
                  <Text style={styles.infoGridLabel}>Contact</Text>
                  <Text style={styles.infoGridValue}>
                    {selectedBuilding.contact}
                  </Text>
                </View>
              </View>

              {selectedBuilding.departments && (
                <View style={styles.infoGridItem}>
                  <Ionicons name="school-outline" size={16} color="#2D3748" />
                  <View>
                    <Text style={styles.infoGridLabel}>Departments</Text>
                    <Text style={styles.infoGridValue}>
                      {selectedBuilding.departments}
                    </Text>
                  </View>
                </View>
              )}

              {selectedBuilding.facilities && (
                <View style={styles.infoGridItem}>
                  <Ionicons name="business-outline" size={16} color="#2D3748" />
                  <View>
                    <Text style={styles.infoGridLabel}>Facilities</Text>
                    <Text style={styles.infoGridValue}>
                      {selectedBuilding.facilities}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Key Features */}
            {selectedBuilding.features &&
              selectedBuilding.features.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Key Features</Text>
                  {selectedBuilding.features.map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <View style={styles.featureDot} />
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </View>
              )}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  safeHeader: {
    backgroundColor: "#2D3748",
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    marginTop: 1,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  imageWrap: {
    overflow: "hidden",
    backgroundColor: "#1E293B",
  },

  // Hint bar
  infoBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#2D3748",
    fontWeight: "500",
  },

  // Detail Panel
  detailPanel: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 16,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  panelBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#2D3748",
    justifyContent: "center",
    alignItems: "center",
  },
  panelBadgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  panelTitleBlock: {
    flex: 1,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  panelSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  // Images
  imageCarousel: {
    borderRadius: 12,
    overflow: "hidden",
  },

  // Section
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2D3748",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },

  // Info grid
  infoGrid: {
    gap: 12,
  },
  infoGridItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoGridLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  infoGridValue: {
    fontSize: 13,
    color: "#2D3748",
    fontWeight: "500",
    marginTop: 2,
  },

  // Features
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2D3748",
  },
  featureText: {
    fontSize: 14,
    color: "#475569",
    flex: 1,
  },
});
