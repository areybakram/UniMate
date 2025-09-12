
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import CustomTabBar from "../../components/CustomTab";

// import HomeScreen from "./HomeScreen";
// import DomainsScreen from "./DomainScreen";
// import HostingScreen from "./HostingScreen";
// import DevelopmentScreen from "./DevelopmentScreen";

// const Tab = createBottomTabNavigator();

// export default function AppTabs() {
//   return (
//     <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Domains" component={DomainsScreen} />
//       <Tab.Screen name="Hosting" component={HostingScreen} />
//       <Tab.Screen name="Development" component={DevelopmentScreen} />
//     </Tab.Navigator>
//   );
// }

// the above is simple layout file




import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Import your custom tab bar
import TabBar from '../../components/CustomTab'; // Adjust path as needed

// Import your screen components
import Home from './Home'; // Adjust paths as needed
import Profile from './Profile';
import Timetable from './Timetable';
import Notes from './Notes'


const Tab = createBottomTabNavigator();

const TabsLayout = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        tabBar={(props) => {
          // Add safety check before rendering TabBar
          if (!props.state) {
            return null;
          }
          return <TabBar {...props} />;
        }}
        screenOptions={{
          tabBarShowLabel:false, // Hide default header
        }}
        initialRouteName="Home"
      >
        <Tab.Screen 
          name="Home" 
          component={Home}
          options={{
            tabBarLabel: 'Home',
            headerShown:false
          }}
        />
        {/* <Tab.Screen 
          name="Emergency" 
          component={EmergencyScreen}
          options={{
            tabBarLabel: 'Emergency',
          }}
        /> */}
        <Tab.Screen 
          name="Notes" 
          component={Notes}
          options={{
            tabBarLabel: 'Notes',
            headerShown:false
          }}
        />
        <Tab.Screen 
          name="Timetable" 
          component={Timetable}
          options={{
            tabBarLabel: 'Timetable',
            headerShown:false
          }}
        />
        <Tab.Screen 
          name="Profile" 
          component={Profile}
          options={{
            tabBarLabel: 'Profile',
            headerShown:false
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Adjust background color as needed
  },
});

export default TabsLayout;