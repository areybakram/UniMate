import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import { supabase } from "../../../supabaseClient";

const { width, height } = Dimensions.get("window");

interface SecurityAlert {
  id: string;
  latitude: number;
  longitude: number;
  status: string;
  created_at: string;
  profiles: {
    name: string;
    phone: string;
  };
}

const GuardDashboard = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [region, setRegion] = useState({
    latitude: 33.6411, // Campus default
    longitude: 72.983,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    fetchAlerts();

    // Subscribe to new alerts
    const subscription = supabase
      .channel("security_alerts_channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "security_alerts" },
        (payload) => {
          console.log("New alert received!", payload);
          fetchAlerts(); // Refresh list to get profile details
          Alert.alert("🚨 EMERGENCY ALERT", "A new security alert has been triggered!");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "security_alerts" },
        () => fetchAlerts()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("security_alerts")
        .select(`
          *,
          profiles:user_id (name, phone)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("security_alerts")
        .update({ status: "resolved", resolved_at: new Date().toISOString() })
        .eq("id", alertId);

      if (error) throw error;
      Alert.alert("Success", "Alert marked as resolved.");
      fetchAlerts();
    } catch (error) {
      Alert.alert("Error", "Failed to resolve alert.");
    }
  };

  const renderAlertItem = ({ item }: { item: SecurityAlert }) => (
    <BlurView intensity={30} tint="light" style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <View style={styles.userBadge}>
          <Ionicons name="person" size={16} color="#1E3A8A" />
          <Text style={styles.userName}>{item.profiles?.name || "Unknown User"}</Text>
        </View>
        <Text style={styles.alertTime}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.phoneContainer}
        onPress={() => Alert.alert("Call User", `Do you want to call ${item.profiles?.phone}?`)}
      >
        <Ionicons name="call" size={18} color="#3B82F6" />
        <Text style={styles.phoneNumber}>{item.profiles?.phone || "No Phone"}</Text>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => setRegion({ ...region, latitude: item.latitude, longitude: item.longitude })}
        >
          <Ionicons name="navigate" size={18} color="#fff" />
          <Text style={styles.buttonText}>Locate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resolveButton}
          onPress={() => resolveAlert(item.id)}
        >
          <Ionicons name="checkmark-circle" size={18} color="#fff" />
          <Text style={styles.buttonText}>Resolve</Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            coordinate={{ latitude: alert.latitude, longitude: alert.longitude }}
            pinColor="red"
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{alert.profiles?.name}</Text>
                <Text>{alert.profiles?.phone}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Active Security Alerts ({alerts.length})</Text>
        <FlatList
          data={alerts}
          renderItem={renderAlertItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="shield-checkmark" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No active alerts. Stay vigilant!</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  map: {
    width: width,
    height: height * 0.45,
  },
  listContainer: {
    flex: 1,
    marginTop: -20,
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 40,
  },
  alertCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    marginLeft: 8,
  },
  alertTime: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 15,
    color: "#3B82F6",
    marginLeft: 8,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  locationButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#1E293B",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  resolveButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#10B981",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
    fontSize: 14,
  },
  callout: {
    padding: 10,
    minWidth: 120,
  },
  calloutTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyText: {
    marginTop: 10,
    color: "#94A3B8",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default GuardDashboard;
