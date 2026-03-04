import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../Context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoading, logout, updateProfile, changePassword }: any =
    useContext(AuthContext) || {};

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedPhone, setEditedPhone] = useState(user?.phone || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/(auth)/Auth");
    }
  }, [user, isLoading]);

  // Logout handler using AuthContext
  const handleLogout = async () => {
    await logout?.();
    router.replace("/(auth)/Auth");
  };

  const handleSaveProfile = async () => {
    if (!editedName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    setIsSaving(true);
    const { error } = await updateProfile?.({
      name: editedName,
      phone: editedPhone,
    });
    setIsSaving(false);
    if (error) {
      Alert.alert("Mutation Error", error.message || String(error));
    } else {
      Alert.alert("Success", "Profile updated successfully");
      setIsEditing(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setIsSaving(true);
    const { error } = await changePassword?.(newPassword);
    setIsSaving(false);
    if (error) {
      Alert.alert("Error", error.message || String(error));
    } else {
      Alert.alert("Success", "Password changed successfully");
      setIsChangingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (isLoading || !user) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0F0F0F",
        }}
      >
        <Text style={{ color: "#fff" }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Replace with your local image
  const profilePhoto = require("../../assets/profilephoto.jpeg");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* TOP GRADIENT HEADER */}
          <LinearGradient
            colors={["#2D3748", "#4A5568"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>My Profile</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* PROFILE PHOTO */}
            <View style={styles.avatarContainer}>
              <Image source={profilePhoto} style={styles.avatar} />
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>
                  {(user.role || "student").toUpperCase()}
                </Text>
              </View>
            </View>

            {isEditing ? (
              <TextInput
                style={[styles.nameInput]}
                value={editedName}
                onChangeText={setEditedName}
                placeholder="Enter your name"
                placeholderTextColor="rgba(0,0,0,0.4)"
              />
            ) : (
              <Text style={styles.name}>{user.name || "User Name"}</Text>
            )}
            <Text style={styles.email}>{user.email}</Text>
          </LinearGradient>

          {/* DETAILS SECTION */}
          <View style={{ marginTop: 80, paddingHorizontal: 20 }}>
            <LinearGradient
              colors={["#ffffff", "#F8FAFC", "#F1F5F9"]}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Ionicons
                  name="person-circle-outline"
                  size={22}
                  color="#3b82f6"
                />
                <Text style={styles.cardTitle}>Personal Information</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.rowLabelGroup}>
                  <Ionicons name="mail-outline" size={16} color="#64748b" />
                  <Text style={styles.label}>Email Address</Text>
                </View>
                <Text style={styles.value}>{user.email}</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.rowLabelGroup}>
                  <Ionicons name="call-outline" size={16} color="#64748b" />
                  <Text style={styles.label}>Phone Number</Text>
                </View>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editedPhone}
                    onChangeText={setEditedPhone}
                    placeholder="Enter phone number"
                    placeholderTextColor="#94a3b8"
                  />
                ) : (
                  <Text style={styles.value}>{user.phone || "Not set"}</Text>
                )}
              </View>
            </LinearGradient>

            {/* SETTINGS CARD */}
            <LinearGradient
              colors={["#ffffff", "#F8FAFC", "#F1F5F9"]}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Ionicons name="settings-outline" size={22} color="#3b82f6" />
                <Text style={styles.cardTitle}>Account Settings</Text>
              </View>

              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  if (isEditing) {
                    handleSaveProfile();
                  } else {
                    setIsEditing(true);
                  }
                }}
                disabled={isSaving}
              >
                <View style={styles.itemLeft}>
                  <Ionicons
                    name={
                      isEditing ? "checkmark-circle-outline" : "create-outline"
                    }
                    size={20}
                    color="#3b82f6"
                  />
                  <Text style={styles.itemText}>
                    {isEditing ? "Save Changes" : "Edit Profile Info"}
                  </Text>
                </View>
                {isSaving && !isChangingPassword && (
                  <ActivityIndicator color="#4A5568" size="small" />
                )}
              </TouchableOpacity>

              {isEditing && (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    setIsEditing(false);
                    setEditedName(user.name || "");
                    setEditedPhone(user.phone || "");
                  }}
                >
                  <View style={styles.itemLeft}>
                    <Ionicons
                      name="close-circle-outline"
                      size={20}
                      color="#ef4444"
                    />
                    <Text style={[styles.itemText, { color: "#ef4444" }]}>
                      Cancel Editing
                    </Text>
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.item}
                onPress={() => setIsChangingPassword(true)}
              >
                <View style={styles.itemLeft}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#3b82f6"
                  />
                  <Text style={styles.itemText}>Change Privacy Settings</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.item}>
                <View style={styles.itemLeft}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#3b82f6"
                  />
                  <Text style={styles.itemText}>Notification Preferences</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.item}
                onPress={() => router.push("/(screens)/about")}
              >
                <View style={styles.itemLeft}>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="#3b82f6"
                  />
                  <Text style={styles.itemText}>About UniMate</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.item, { borderBottomWidth: 0 }]}
                onPress={() => router.push("/(screens)/support")}
              >
                <View style={styles.itemLeft}>
                  <Ionicons name="headset-outline" size={20} color="#3b82f6" />
                  <Text style={styles.itemText}>Help & Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
              </TouchableOpacity>
            </LinearGradient>

            {/* LOGOUT BUTTON */}
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <LinearGradient
                colors={["#aa0f0fff", "#dc2626"]}
                style={styles.logoutGradient}
              >
                <Ionicons name="log-out-outline" size={22} color="#fff" />
                <Text style={styles.logoutText}>Sign Out</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* CHANGE PASSWORD MODAL */}
            <Modal
              visible={isChangingPassword}
              transparent={true}
              animationType="slide"
            >
              <View style={styles.modalOverlay}>
                <BlurView
                  intensity={90}
                  tint="dark"
                  style={styles.modalContent}
                >
                  <Text style={styles.modalTitle}>Change Password</Text>

                  <TextInput
                    style={styles.modalInput}
                    placeholder="New Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />

                  <TextInput
                    style={styles.modalInput}
                    placeholder="Confirm New Password"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />

                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={() => setIsChangingPassword(false)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.modalButton, styles.saveButton]}
                      onPress={handleChangePassword}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Change</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </View>
            </Modal>

            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 300,
    width: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignSelf: "center",
    marginTop: 10,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  roleBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  roleBadgeText: {
    color: "#1e40af",
    fontSize: 10,
    fontWeight: "bold",
  },
  name: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
  },
  email: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  cardTitle: {
    color: "#1E293B",
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rowLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    color: "#94a3b8",
    fontSize: 13,
  },
  value: {
    color: "#1E293B",
    fontSize: 14,
    fontWeight: "600",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemText: {
    color: "#1E293B",
    fontSize: 14,
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 10,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    color: "#1E293B",
    fontSize: 14,
    fontWeight: "500",
    padding: 0,
    textAlign: "right",
    minWidth: 150,
  },
  nameInput: {
    color: "#1E293B",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    marginHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    padding: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    overflow: "hidden",
  },
  modalTitle: {
    color: "#1E293B",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 15,
    color: "#1E293B",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    flex: 0.48,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  saveButton: {
    backgroundColor: "#3B3B98",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
