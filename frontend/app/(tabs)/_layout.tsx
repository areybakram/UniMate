import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useContext } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Import your custom tab bar
import TabBar from "../../components/CustomTab";

// Import Role-Based Screen Components
// Student
import ProfileScreen from "./Profile";
import StudentFreeSlots from "./student/FreeSlots";
import StudentHome from "./student/Home";
import StudentRepository from "./student/Repository";
import TimetableScreen from "./student/Timetable";
// import NotesScreen from "./student/Notes";

// Guard
import GuardDashboard from "./guard/Dashboard";
import GuardHome from "./guard/Home";
import GuardLogs from "./guard/Logs";

// Teacher
import TeacherHome from "./teacher/Home";
import TeacherRepository from "./teacher/Repository";

import { AuthContext } from "../../Context/AuthContext";

const Tab = createBottomTabNavigator();

const TabsLayout = () => {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const isLoading = auth?.isLoading;
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const role = user?.role || "student"; // Default to student for safety
  console.log("Current Layout Role:", role);

  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => {
          if (!props.state) {
            return null;
          }
          return <TabBar {...props} />;
        }}
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
        }}
        initialRouteName="Home"
      >
        {/* SHARED/DYNAMIC HOME SCREEN */}
        <Tab.Screen
          name="Home"
          component={
            role === "guard"
              ? GuardHome
              : role === "teacher"
                ? TeacherHome
                : StudentHome
          }
        />

        {/* STUDENT SPECIFIC TABS */}
        {role === "student" && (
          <>
            <Tab.Screen name="Repository" component={StudentRepository} />
            <Tab.Screen name="Timetable" component={TimetableScreen} />
            <Tab.Screen name="FreeSlots" component={StudentFreeSlots} />
          </>
        )}

        {/* GUARD SPECIFIC TABS */}
        {role === "guard" && (
          <>
            <Tab.Screen name="Alerts" component={GuardDashboard} />
            <Tab.Screen name="Logs" component={GuardLogs} />
          </>
        )}

        {/* TEACHER SPECIFIC TABS */}
        {role === "teacher" && (
          <>
            {/* <Tab.Screen name="Attendance" component={TeacherAttendance} /> */}
            {/* <Tab.Screen name="Classes" component={TeacherClasses} /> */}
            <Tab.Screen name="Repository" component={TeacherRepository} />
            <Tab.Screen name="Timetable" component={TimetableScreen} />
            <Tab.Screen name="FreeSlots" component={StudentFreeSlots} />
          </>
        )}

        {/* SHARED PROFILE TAB */}
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {/* Floating Chatbot button - Hidden for Guards */}
      {role !== "guard" && (
        <TouchableOpacity
          style={styles.chatbotButton}
          onPress={() => router.push("/(screens)/chatbot")}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubbles" size={38} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  chatbotButton: {
    position: "absolute",
    bottom: 100,
    right: 20, // Adjusted to right side
    backgroundColor: "#2D3748",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
});

export default TabsLayout;
