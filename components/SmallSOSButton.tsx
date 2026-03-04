import * as Haptics from "expo-haptics";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../Context/AuthContext";
import { useLocation } from "../Context/LocationContext";
import { supabase } from "../supabaseClient";

const SmallSOSButton: React.FC = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();

  const user = auth?.user;
  const userLocation = location?.userLocation;
  const fetchUserLocation = location?.fetchUserLocation;

  const [loading, setLoading] = useState(false);

  const handleSOS = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to send an SOS alert.");
      return;
    }

    Alert.alert(
      "Confirm SOS",
      "Are you sure you want to send an emergency alert to campus security?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Alert",
          style: "destructive",
          onPress: sendAlert,
        },
      ],
    );
  };

  const sendAlert = async () => {
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
          user_id: user?.id,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          status: "pending",
        },
      ]);

      if (error) throw error;

      Alert.alert(
        "Alert Sent",
        "Your emergency location has been sent to the guards. Stay safe.",
      );
    } catch (error: any) {
      console.error("SOS alert error:", error);
      Alert.alert("Error", "Failed to send SOS alert: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handleSOS}
      disabled={loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <View style={styles.dot} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 22,
    height: 22,
    borderRadius: 14,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default SmallSOSButton;
