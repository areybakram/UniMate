import { useDrawer } from "@/Context/DrawerContext";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFValue } from "react-native-responsive-fontsize";
import { AuthContext } from "../Context/AuthContext";

interface DrawerItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

const DrawerItem = ({ icon, label, onPress }: DrawerItemProps) => (
  <TouchableOpacity style={styles.lablecontainer} onPress={onPress}>
    {icon}
    <Text style={styles.textName}>{label}</Text>
  </TouchableOpacity>
);

const CustomDrawer = ({ active }: any) => {
  const { closeDrawer } = useDrawer();
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const isLoading = auth?.isLoading;

  const [customProfilePhoto, setCustomProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    if (user?.custom_profile_photo) {
      setCustomProfilePhoto(user.custom_profile_photo);
    }
  }, [user]); // refresh if drawer toggles or user context updates

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/(auth)/who");
    }
  }, [user, isLoading]);

  // Logout button press handler
  const logoutPress = async () => {
    active.value = false;
    closeDrawer();
    if (auth?.logout) {
      await auth.logout();
    }
  };

  const role = user?.role || "student";

  const renderDrawerItems = () => {
    switch (role) {
      case "guard":
        return (
          <>
            <DrawerItem
              icon={
                <MaterialCommunityIcons
                  name="map-marker"
                  size={25}
                  color={"#2D3748"}
                />
              }
              label="Explore Campus"
              onPress={() => router.push("/Modules/Tagging" as any)}
            />
            {/* <DrawerItem
              icon={
                <MaterialIcons name="security" size={24} color={"#2D3748"} />
              }
              label="Active Alerts"
              onPress={() => router.push("/" as any)}
            /> */}
            <DrawerItem
              icon={
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={"#2D3748"}
                />
              }
              label="About UniMate"
              onPress={() => router.push("/(screens)/about" as any)}
            />
            <DrawerItem
              icon={
                <Ionicons name="headset-outline" size={24} color={"#2D3748"} />
              }
              label="Help & Support"
              onPress={() => router.push("/(screens)/support" as any)}
            />
          </>
        );
      case "teacher":
        return (
          <>
            <DrawerItem
              icon={
                <MaterialCommunityIcons
                  name="map-marker"
                  size={25}
                  color={"#2D3748"}
                />
              }
              label="Explore Campus"
              onPress={() => router.push("/Modules/Tagging" as any)}
            />

            <DrawerItem
              icon={<Ionicons name="map-outline" size={24} color={"#2D3748"} />}
              label="Campus Navigation"
              onPress={() => router.push("/Modules/Navigation" as any)}
            />
            <DrawerItem
              icon={
                <MaterialIcons name="local-offer" size={24} color={"#2D3748"} />
              }
              label="Emergency"
              onPress={() => router.push("/(screens)/emergency" as any)}
            />
            {/* <DrawerItem
              icon={
                <MaterialCommunityIcons
                  name="calendar-check"
                  size={25}
                  color={"#2D3748"}
                />
              }
              label="Attendance"
              onPress={() => router.push("/(tabs)/teacher/Attendance" as any)}
            />
            <DrawerItem
              icon={<MaterialIcons name="class" size={24} color={"#2D3748"} />}
              label="My Classes"
              onPress={() => router.push("/(tabs)/teacher/Classes" as any)}
            /> */}
            <DrawerItem
              icon={
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={"#2D3748"}
                />
              }
              label="About UniMate"
              onPress={() => router.push("/(screens)/about")}
            />

            <DrawerItem
              icon={
                <Ionicons name="headset-outline" size={24} color={"#2D3748"} />
              }
              label="Help & Support"
              onPress={() => router.push("/(screens)/support")}
            />
          </>
        );
    default: // student
        return (
          <>
            <DrawerItem
              icon={<MaterialCommunityIcons name="map-marker" size={25} color={"#2D3748"} />}
              label="Explore Campus"
              onPress={() => router.push("/Modules/Tagging" as any)}
            />
            <DrawerItem
              icon={<Ionicons name="map-outline" size={24} color={"#2D3748"} />}
              label="Campus Navigation"
              onPress={() => router.push("/Modules/Navigation" as any)}
            />
            <DrawerItem
              icon={<MaterialIcons name="local-offer" size={24} color={"#2D3748"} />}
              label="Emergency"
              onPress={() => router.push("/(screens)/emergency" as any)}
            />
            <DrawerItem
              icon={<Ionicons name="play-circle" size={24} color={"#2D3748"} />}
              label="Semester Story"
              onPress={() => router.push("/(screens)/StoryMode" as any)}
            />
            <DrawerItem
              icon={<Ionicons name="repeat" size={24} color={"#059669"} />}
              label="Lend & Borrow"
              onPress={() => router.push("/(screens)/LendBorrowFeed" as any)}
            />
            <DrawerItem
              icon={<Ionicons name="search" size={24} color={"#1e293b"} />}
              label="Lost & Found"
              onPress={() => router.push("/(screens)/LostFoundFeed" as any)}
            />
            <DrawerItem
              icon={
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={"#2D3748"}
                />
              }
              label="About UniMate"
              onPress={() => router.push("/(screens)/about" as any)}
            />

            <DrawerItem
              icon={
                <Ionicons name="headset-outline" size={24} color={"#2D3748"} />
              }
              label="Help & Support"
              onPress={() => router.push("/(screens)/support" as any)}
            />
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.profileHeader}
        activeOpacity={0.7}
        onPress={() => {
          active.value = false;
          closeDrawer();
          router.push("/(tabs)/Profile" as any);
        }}
      >
        {customProfilePhoto ? (
          <Image source={{ uri: customProfilePhoto }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <FontAwesome5 name="user-alt" size={30} color={"#2D3748"} />
          </View>
        )}
        <Text style={styles.drawerUserName}>{user?.name || "Guest User"}</Text>
        <Text style={styles.drawerUserRole}>{user?.role || "No Role"}</Text>
      </TouchableOpacity>
      <View style={styles.contentContainer}>{renderDrawerItems()}</View>

      {/* <TouchableOpacity style={styles.containerdeleted} onPress={logoutPress}>
        <Text style={styles.logOutText}>Sign-out</Text>
        <AntDesign
          name="logout"
          size={24}
          color={"#2D3748"}
          style={{ paddingTop: "1%" }}
        />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: Colors.primary,
    backgroundColor: "#fff",
    paddingTop: "20%",
    paddingHorizontal: 16,
  },
  contentContainer: {
    flex: 0.89,
    maxWidth: 200,
  },
  lablecontainer: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F4F4F8",
    paddingVertical: 12,
  },
  textName: {
    fontSize: RFValue(16),
    fontWeight: "400",
    color: "#2D3748",
  },
  containerdeleted: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 20,
  },
  logOutText: {
    fontSize: RFValue(16),
    fontWeight: "400",
    color: "#2D3748",
  },
  profileHeader: {
    paddingBottom: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    alignItems: "flex-start",
    width: "100%",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  drawerUserName: {
    color: "#2D3748",
    fontSize: 18,
    fontWeight: "bold",
  },
  drawerUserRole: {
    color: "#2D374899",
    fontSize: 14,
    textTransform: "capitalize",
  },
});

export default CustomDrawer;
