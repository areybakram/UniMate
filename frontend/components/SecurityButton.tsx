import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../Context/AuthContext";
import { useLocation } from "../Context/LocationContext";
import { supabase } from "../supabaseClient";

const SecurityButton: React.FC = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  const user = auth?.user;
  const userLocation = location?.userLocation;
  const fetchUserLocation = location?.fetchUserLocation;

  const [loading, setLoading] = useState(false);

  const handleSecurityAlert = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to send a security alert.");
      return;
    }

    // Trigger haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    setLoading(true);
    try {
      // Refresh location before sending
      if (fetchUserLocation) {
        await fetchUserLocation();
      }

      const currentLocation = userLocation;

      if (!currentLocation) {
        Alert.alert(
          "Error",
          "Could not retrieve your current location. Please ensure GPS is enabled.",
        );
        setLoading(false);
        return;
      }

      const { error } = await supabase.from("security_alerts").insert([
        {
          user_id: user.id,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          status: "pending",
        },
      ]);

      if (error) throw error;

      Alert.alert(
        "Alert Sent",
        "Your location has been sent to the guards. Stay safe, they are on their way.",
      );
    } catch (error: any) {
      console.error("Security alert error:", error);
      Alert.alert("Error", "Failed to send security alert: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSecurityAlert}
        disabled={loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <>
            <Ionicons name="shield-checkmark" size={60} color="#fff" />
            <Text style={styles.buttonText}>SOS</Text>
          </>
        )}
      </TouchableOpacity>
      <Text style={styles.subText}>Press for Instant Guard Assistance</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "#EF4444",
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 8,
    borderColor: "rgba(255,255,255,0.2)",
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 5,
    letterSpacing: 4,
  },
  subText: {
    marginTop: 25,
    fontSize: 15,
    color: "#64748B",
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});

export default SecurityButton;
