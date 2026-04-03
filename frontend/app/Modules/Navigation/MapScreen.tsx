import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useLocation } from "../../../Context/LocationContext";
import { getDirections } from "./directions";

interface Point {
  name: string;
  latitude: number;
  longitude: number;
  icon: string;
}

const universityPoints: Point[] = [
  {
    name: "Main Gate",
    latitude: 31.4005,
    longitude: 74.2104,
    icon: "enter-outline",
  },
  {
    name: "A-Block",
    latitude: 31.4011,
    longitude: 74.2118,
    icon: "business-outline",
  },
  {
    name: "N-Block",
    latitude: 31.3995,
    longitude: 74.2125,
    icon: "layers-outline",
  },
  {
    name: "Faculty Block",
    latitude: 31.4002,
    longitude: 74.2135,
    icon: "school-outline",
  },
  {
    name: "CS Dept",
    latitude: 31.4022,
    longitude: 74.212,
    icon: "laptop-outline",
  },
  {
    name: "Library",
    latitude: 31.4018,
    longitude: 74.2132,
    icon: "library-outline",
  },
  {
    name: "Student Cafe",
    latitude: 31.4008,
    longitude: 74.211,
    icon: "cafe-outline",
  },
  {
    name: "Mosque",
    latitude: 31.399,
    longitude: 74.2108,
    icon: "moon-outline",
  },
  {
    name: "Student Parking",
    latitude: 31.4016,
    longitude: 74.2092,
    icon: "car-outline",
  },
];

const MapScreen: React.FC = () => {
  const { userLocation, fetchUserLocation } = useLocation();
  const [destination, setDestination] = useState<Point | null>(null);
  const [routeCoords, setRouteCoords] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const handleNavigate = async (target: Point) => {
    setDestination(target);
    if (!userLocation) return;

    setIsLoadingRoute(true);
    setRouteInfo(null);
    try {
      const { coordinates, distance, duration } = await getDirections(
        userLocation,
        target,
      );
      setRouteCoords(coordinates);
      setRouteInfo({ distance, duration });
    } catch (error) {
      Alert.alert(
        "Route Error",
        "Could not find a valid walking route to this block.",
      );
      setRouteCoords([]);
      setRouteInfo(null);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const openInGoogleMaps = () => {
    if (!destination) return;
    const { latitude, longitude } = destination;
    const url = Platform.select({
      ios: `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=walking`,
      android: `google.navigation:q=${latitude},${longitude}&mode=w`,
    });

    if (url) {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            Linking.openURL(url);
          } else {
            // Fallback to browser
            const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=walking`;
            Linking.openURL(browserUrl);
          }
        })
        .catch((err) => console.error("An error occurred", err));
    }
  };

  if (!userLocation)
    return (
      <View style={styles.loading}>
        <Text>Fetching current location...</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Campus Navigation</Text>
        <View style={{ width: 40 }} />
      </View>

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 31.4014, // Center roughly around COMSATS Lahore
          longitude: 74.211,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {universityPoints.map((point) => (
          <Marker
            key={point.name}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude,
            }}
            title={point.name}
            pinColor={destination?.name === point.name ? "#3B82F6" : "#EF4444"}
          />
        ))}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={5}
            strokeColor="#3B82F6"
            lineDashPattern={[1]}
          />
        )}
      </MapView>

      <View style={styles.bottomPanel}>
        <View style={styles.panelHeaderRow}>
          <Text style={styles.panelTitle}>Where to?</Text>
          {destination && (
            <TouchableOpacity
              style={styles.startNavBtn}
              onPress={openInGoogleMaps}
            >
              <Ionicons name="navigate" size={16} color="#fff" />
              <Text style={styles.startNavText}>Start</Text>
            </TouchableOpacity>
          )}
        </View>

        {routeInfo && !isLoadingRoute && (
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Ionicons name="walk" size={18} color="#3B82F6" />
              <Text style={styles.infoText}>{routeInfo.duration}</Text>
            </View>
            <View style={styles.infoDot} />
            <View style={styles.infoRow}>
              <Ionicons name="resize" size={16} color="#3B82F6" />
              <Text style={styles.infoText}>{routeInfo.distance}</Text>
            </View>
          </View>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          {universityPoints.map((point) => {
            const isSelected = destination?.name === point.name;
            return (
              <TouchableOpacity
                key={point.name}
                style={[styles.chip, isSelected && styles.chipSelected]}
                onPress={() => handleNavigate(point)}
              >
                <Ionicons
                  name={point.icon as any}
                  size={18}
                  color={isSelected ? "#fff" : "#64748B"}
                />
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextSelected,
                  ]}
                >
                  {point.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {isLoadingRoute && (
          <Text style={styles.routingText}>Calculating best route...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  bottomPanel: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 10,
  },
  panelHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  startNavBtn: {
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  startNavText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    color: "#1E3A8A",
    fontWeight: "600",
    fontSize: 14,
  },
  infoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#93C5FD",
  },
  chipContainer: {
    gap: 12,
    paddingRight: 20,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  chipSelected: {
    backgroundColor: "#3B82F6",
  },
  chipText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 14,
  },
  chipTextSelected: {
    color: "#fff",
  },
  routingText: {
    marginTop: 15,
    color: "#3B82F6",
    fontWeight: "500",
    textAlign: "center",
    fontSize: 13,
  },
});

export default MapScreen;
