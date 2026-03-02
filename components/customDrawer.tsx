import { useDrawer } from "@/Context/DrawerContext";
import { Colors } from "@/utils/Constants";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
              icon={<FontAwesome5 name="user-shield" size={24} color={Colors.texttwo} />} 
              label="Guard Profile" 
              onPress={() => router.push('/(tabs)/Profile' as any)} 
            />
            <DrawerItem 
              icon={<MaterialCommunityIcons name="map-marker" size={25} color={Colors.texttwo} />} 
              label="Patrol Map" 
              onPress={() => router.push("/Modules/Tagging" as any)} 
            />
            <DrawerItem 
              icon={<MaterialIcons name="security" size={24} color={Colors.texttwo} />} 
              label="Active Alerts" 
              onPress={() => router.push('/(tabs)/GuardDashboard' as any)} 
            />
            <DrawerItem 
              icon={<Ionicons name="document-text-outline" size={24} color={Colors.texttwo} />} 
              label="About UniMate" 
              onPress={() => router.push("/(screens)/about" as any)} 
            />
          </>
        );
      case "teacher":
        return (
          <>
            <DrawerItem 
              icon={<FontAwesome5 name="user-tie" size={24} color={Colors.texttwo} />} 
              label="Faculty Profile" 
              onPress={() => router.push('/(tabs)/Profile' as any)} 
            />
            <DrawerItem 
              icon={<MaterialCommunityIcons name="calendar-check" size={25} color={Colors.texttwo} />} 
              label="Attendance" 
              onPress={() => router.push("/(tabs)/teacher/Attendance" as any)} 
            />
            <DrawerItem 
              icon={<MaterialIcons name="class" size={24} color={Colors.texttwo} />} 
              label="My Classes" 
              onPress={() => router.push('/(tabs)/teacher/Classes' as any)} 
            />
            <DrawerItem 
              icon={<Ionicons name="document-text-outline" size={24} color={Colors.texttwo} />} 
              label="About" 
              onPress={() => router.push("/(screens)/about")} 
            />
          </>
        );
      default: // student
        return (
          <>
            <DrawerItem 
              icon={<FontAwesome5 name="user-circle" size={24} color={Colors.texttwo} />} 
              label="Profile" 
              onPress={() => router.push('/(tabs)/Profile' as any)} 
            />
            <DrawerItem 
              icon={<MaterialCommunityIcons name="map-marker" size={25} color={Colors.texttwo} />} 
              label="Navigation" 
              onPress={() => router.push("/Modules/Tagging" as any)} 
            />
            <DrawerItem 
              icon={<MaterialIcons name="local-offer" size={24} color={Colors.texttwo} />} 
              label="Emergency" 
              onPress={() => router.push('/(screens)/emergency' as any)} 
            />
            <DrawerItem 
              icon={<Ionicons name="document-text-outline" size={24} color={Colors.texttwo} />} 
              label="About" 
              onPress={() => router.push("/(screens)/about" as any)} 
            />
            <DrawerItem 
              icon={<MaterialCommunityIcons name="security" size={24} color={Colors.texttwo} />} 
              label="Support" 
              onPress={() => router.push("/(screens)/support" as any)} 
            />
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}>
             <FontAwesome5 name="user-alt" size={30} color={Colors.primary} />
        </View>
        <Text style={styles.drawerUserName}>{user?.name || "Guest User"}</Text>
        <Text style={styles.drawerUserRole}>{user?.role || "No Role"}</Text>
      </View>
      <View style={styles.contentContainer}>
        {renderDrawerItems()}
      </View>

      <TouchableOpacity style={styles.containerdeleted} onPress={logoutPress}>
        <Text style={styles.logOutText}>Sign-out</Text>
        <AntDesign
          name="logout"
          size={24}
          color={Colors.texttwo}
          style={{ paddingTop: "1%" }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.primary,
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
    color: Colors.texttwo,
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
    color: Colors.texttwo,
  },
  profileHeader: {
    paddingBottom: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    alignItems: 'center',
    width: '100%'
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  drawerUserName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerUserRole: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textTransform: 'capitalize'
  }
});

export default CustomDrawer;
