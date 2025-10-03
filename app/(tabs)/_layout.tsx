
// // import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// // import CustomTabBar from "../../components/CustomTab";

// // import HomeScreen from "./HomeScreen";
// // import DomainsScreen from "./DomainScreen";
// // import HostingScreen from "./HostingScreen";
// // import DevelopmentScreen from "./DevelopmentScreen";

// // const Tab = createBottomTabNavigator();

// // export default function AppTabs() {
// //   return (
// //     <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
// //       <Tab.Screen name="Home" component={HomeScreen} />
// //       <Tab.Screen name="Domains" component={DomainsScreen} />
// //       <Tab.Screen name="Hosting" component={HostingScreen} />
// //       <Tab.Screen name="Development" component={DevelopmentScreen} />
// //     </Tab.Navigator>
// //   );
// // }

// // the above is simple layout file




// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import React from 'react';
// import { StyleSheet, TouchableOpacity, View } from 'react-native';

// // Import your custom tab bar
// import TabBar from '../../components/CustomTab'; // Adjust path as needed

// // Import your screen components
// import Home from './Home'; // Adjust paths as needed
// import Profile from './Profile';
// import Timetable from './Timetable';
// import Notes from './Notes'


// const Tab = createBottomTabNavigator();

// const TabsLayout = () => {
//   return (
//     <View style={styles.container}>
//       <Tab.Navigator
//         tabBar={(props) => {
//           // Add safety check before rendering TabBar
//           if (!props.state) {
//             return null;
//           }
//           return <TabBar {...props} />;
//         }}
//         screenOptions={{
//           tabBarShowLabel:false, // Hide default header
//         }}
//         initialRouteName="Home"
//       >
//         <Tab.Screen 
//           name="Home" 
//           component={Home}
//           options={{
//             tabBarLabel: 'Home',
//             headerShown:false
//           }}
//         />
//         {/* <Tab.Screen 
//           name="Emergency" 
//           component={EmergencyScreen}
//           options={{
//             tabBarLabel: 'Emergency',
//           }}
//         /> */}
//         <Tab.Screen 
//           name="Notes" 
//           component={Notes}
//           options={{
//             tabBarLabel: 'Notes',
//             headerShown:false
//           }}
//         />
//         <Tab.Screen 
//           name="Timetable" 
//           component={Timetable}
//           options={{
//             tabBarLabel: 'Timetable',
//             headerShown:false
//           }}
//         />
//         <Tab.Screen 
//           name="Profile" 
//           component={Profile}
//           options={{
//             tabBarLabel: 'Profile',
//             headerShown:false
//           }}
//         />
//       </Tab.Navigator>



//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000', // Adjust background color as needed
//   },
// });

// export default TabsLayout;

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Import your custom tab bar
import TabBar from '../../components/CustomTab'; 

// Import your screen components
import Home from './Home';
import Profile from './Profile';
import Timetable from './Timetable';
import Notes from './Notes';
// Chatbot screen (make sure it exists in your stack/drawer)
import Chatbot from '../chatbot';
import { router } from 'expo-router';

const Tab = createBottomTabNavigator();

const TabsLayout = () => {
  const navigation = useNavigation();

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
        }}
        initialRouteName="Home"
      >
        <Tab.Screen 
          name="Home" 
          component={Home}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Notes" 
          component={Notes}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Timetable" 
          component={Timetable}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Profile" 
          component={Profile}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>

      {/* Floating Chatbot button above TabBar (left side) */}
      <TouchableOpacity 
        style={styles.chatbotButton}
        onPress={()=>router.push('/chatbot')} // 👈 Navigate to chatbot
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubbles" size={38} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  chatbotButton: {
    position: 'absolute',
    bottom: 100,     // Just above tab bar
    left: 320,       // Left side
    backgroundColor: '#2D3748',
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
});

export default TabsLayout;
