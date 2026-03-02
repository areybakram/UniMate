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
  const { user, isLoading, logout, updateProfile, changePassword }: any = useContext(AuthContext) || {};

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
    const { error } = await updateProfile?.({ name: editedName, phone: editedPhone });
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0F0F0F" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* TOP GRADIENT HEADER */}
        <LinearGradient
          colors={["#1E1E1E", "#3B3B98"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>My Profile</Text>

          {/* PROFILE PHOTO */}
          <View style={styles.avatarContainer}>
            <Image source={profilePhoto} style={styles.avatar} />
          </View>

          {isEditing ? (
            <TextInput
              style={[styles.nameInput]}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your name"
              placeholderTextColor="rgba(255,255,255,0.6)"
            />
          ) : (
            <Text style={styles.name}>{user.name || "User Name"}</Text>
          )}
          <Text style={styles.email}>{user.email}</Text>
        </LinearGradient>

        {/* DETAILS SECTION */}
        <View style={{ marginTop: 70, paddingHorizontal: 20 }}>
          <BlurView intensity={60} tint="dark" style={styles.card}>
            <Text style={styles.cardTitle}>About Me</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Role</Text>
              <Text style={styles.value}>{user.role || "Unauthorized"}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Phone</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={editedPhone}
                  onChangeText={setEditedPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor="#666"
                />
              ) : (
                <Text style={styles.value}>{user.phone || "+92 300 1234567"}</Text>
              )}
            </View>
          </BlurView>

          {/* SETTINGS CARD */}
          <BlurView intensity={60} tint="dark" style={styles.card}>
            <Text style={styles.cardTitle}>Account</Text>

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
              {isSaving && !isChangingPassword ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.itemText}>{isEditing ? "Save Changes" : "Edit Profile"}</Text>
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
                <Text style={[styles.itemText, { color: "#ff4d4d" }]}>Cancel Editing</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={styles.item}
              onPress={() => setIsChangingPassword(true)}
            >
              <Text style={styles.itemText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.item, { borderBottomWidth: 0 }]}>
              <Text style={styles.itemText}>Notification Settings</Text>
            </TouchableOpacity>
          </BlurView>

          {/* LOGOUT BUTTON */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* CHANGE PASSWORD MODAL */}
          <Modal
            visible={isChangingPassword}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <BlurView intensity={90} tint="dark" style={styles.modalContent}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 260,
    width: "100%",
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
  },
  avatarContainer: {
    alignSelf: "center",
    marginTop: 10,
    shadowColor: "#ffffff",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
    resizeMode: "cover",
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 15,
  },
  email: {
    color: "#dcdcdc",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 25,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    opacity: 0.9,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingBottom: 8,
  },
  label: {
    color: "#AAA",
    fontSize: 14,
  },
  value: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  itemText: {
    color: "#fff",
    fontSize: 15,
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "600",
  },
  input: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    padding: 0,
    textAlign: 'right',
    minWidth: 150,
  },
  nameInput: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    padding: 25,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 0.48,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  saveButton: {
    backgroundColor: '#3B3B98',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
