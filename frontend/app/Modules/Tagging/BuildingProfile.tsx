"use client";

import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import buildings from "./data";

export default function BuildingProfileScreen() {
  const params = useLocalSearchParams() as { id: string };
  const id = params.id;
  const [showExtraImages, setShowExtraImages] = useState(false);

  console.log("id", id);
  const building = buildings.find((b) => b.id === id);
  const { width } = useWindowDimensions();

  if (!building) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Building Not Found</Text>
        <Text style={styles.errorText}>
          We couldn't find information for this building.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={building.mainImage}
        style={{ width, height: 300 }}
        resizeMode="cover"
      />

      {building.extraImages?.length > 0 && (
        <>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => setShowExtraImages(!showExtraImages)}
            activeOpacity={0.8}
          >
            <Text style={styles.exploreBtnText}>
              {showExtraImages ? "Hide" : "Explore More"} (
              {building.extraImages.length} photos)
            </Text>
          </TouchableOpacity>

          {showExtraImages && (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            >
              {building.extraImages.map((img, index) => (
                <Image
                  key={index}
                  source={img}
                  style={{ width, height: 300 }}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}
        </>
      )}

      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{building.short || building.id}</Text>
        </View>
        <Text style={styles.title}>{building.title}</Text>
        <Text style={styles.subtitle}>{building.subtitle}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.text}>{building.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Details</Text>
        <Text style={styles.text}>Hours: {building.hours}</Text>
        <Text style={styles.text}>Contact: {building.contact}</Text>
        {building.departments && (
          <Text style={styles.text}>Departments: {building.departments}</Text>
        )}
        {building.facilities && (
          <Text style={styles.text}>Facilities: {building.facilities}</Text>
        )}
      </View>

      {building.features?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          {building.features.map((f, idx) => (
            <Text key={idx} style={styles.text}>
              • {f}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b" },
  content: { paddingBottom: 32 },
  hero: { alignItems: "center", gap: 8, padding: 16 },
  badge: { backgroundColor: "#0284c7", padding: 8, borderRadius: 20 },
  badgeText: { color: "#fff", fontWeight: "700" },
  title: {
    color: "#e5e7eb",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: { color: "#9ca3af", fontSize: 16, textAlign: "center" },
  card: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#93c5fd",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  text: { color: "#d1d5db", fontSize: 14, lineHeight: 20 },
  exploreBtn: {
    backgroundColor: "#0284c7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  exploreBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorTitle: {
    color: "#e5e7eb",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  errorText: { color: "#9ca3af", fontSize: 14, textAlign: "center" },
});
