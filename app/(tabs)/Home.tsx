// import {
//   Dimensions,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import React from "react";
// import Animated, {
//   Extrapolation,
//   interpolate,
//   useAnimatedStyle,
//   useDerivedValue,
//   useSharedValue,
//   withSpring,
//   withTiming,
// } from "react-native-reanimated";
// import { Ionicons } from "@expo/vector-icons";
// import CustomDrawer from "../../components/customDrawer";
// import { useDrawer } from "../../Context/DrawerContext";

// const { width } = Dimensions.get("screen");

// const Home: React.FC = () => {
//   const { closeDrawer } = useDrawer();
//   const active = useSharedValue(false);

//   const progress = useDerivedValue(() => {
//     return withTiming(active.value ? 1 : 0);
//   });

//   // Animation for main content
//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { perspective: 1000 },
//         { scale: active.value ? withTiming(0.85) : withTiming(1) },
//         {
//           translateX: active.value ? withSpring(240) : withTiming(0),
//         },
//       ],
//       borderRadius: active.value ? withTiming(20) : withTiming(0),
//     };
//   });

//   // Overlay behind drawer
//   const Overlay = () => {
//     const overlayStyle = useAnimatedStyle(() => {
//       return {
//         display: active.value ? "flex" : "none",
//       };
//     });

//     return (
//       <Animated.View
//         style={[
//           {
//             ...StyleSheet.absoluteFillObject,
//             backgroundColor: "rgba(0,0,0,0.4)",
//           },
//           overlayStyle,
//         ]}
//       >
//         <Pressable
//           style={StyleSheet.absoluteFillObject}
//           onPress={() => {
//             active.value = false;
//             closeDrawer();
//           }}
//         />
//       </Animated.View>
//     );
//   };

//   return (
//     <>
//       {/* Drawer */}
//       <CustomDrawer active={active} />

//       {/* Main content */}
//       <Animated.View style={[{ flex: 1, backgroundColor: "#fff" }, animatedStyle]}>
//         <View style={styles.header}>
//           {/* Hamburger Menu */}
//           <Pressable onPress={() => (active.value = !active.value)}>
//             <Ionicons name="menu" size={28} color="#000" />
//           </Pressable>
//           <Text style={styles.title}>Home</Text>
//         </View>

//         {/* Simple content */}
//         <View style={styles.body}>
//           <Text style={styles.bodyText}>Welcome to Student Facilitation System 🎓</Text>
//         </View>
//       </Animated.View>

//       {/* Overlay */}
//       <Overlay />

//       <StatusBar backgroundColor={"#ffffff"} barStyle="dark-content" />
//     </>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     backgroundColor: "#f8f8f8",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginLeft: 12,
//   },
//   body: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   bodyText: {
//     fontSize: 16,
//   },
// });

// import {
//   Dimensions,
//   Pressable,
//   StatusBar,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import React from "react";
// import Animated, {
//   Extrapolation,
//   interpolate,
//   useAnimatedStyle,
//   useDerivedValue,
//   useSharedValue,
//   withSpring,
//   withTiming,
// } from "react-native-reanimated";
// import { Ionicons } from "@expo/vector-icons";
// import CustomDrawer from "../../components/customDrawer";
// import { useDrawer } from "@/Context/DrawerContext";

// const { width } = Dimensions.get("screen");

// const Home: React.FC = () => {
//   const { closeDrawer } = useDrawer();
//   const active = useSharedValue(false);

//   const progress = useDerivedValue(() => {
//     return withTiming(active.value ? 1 : 0);
//   });

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         { perspective: 1000 },
//         { scale: active.value ? withTiming(0.85) : withTiming(1) },
//         {
//           translateX: active.value ? withSpring(240) : withTiming(0),
//         },
//       ],
//       borderRadius: active.value ? withTiming(20) : withTiming(0),
//     };
//   });

//   return (
//     <View style={{ flex: 1 }}>
//       {/* Drawer stays behind */}
//       <CustomDrawer active={active} />

//       {/* Main screen */}
//       <Animated.View style={[{ flex: 1, backgroundColor: "#fff" }, animatedStyle]}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Pressable onPress={() => (active.value = !active.value)}>
//             <Ionicons name="menu" size={28} color="#000" />
//           </Pressable>
//           <Text style={styles.title}>Home</Text>
//         </View>

//         {/* Body */}
//         <View style={styles.body}>
//           <Text style={styles.bodyText}>
//             Welcome to Student Facilitation System 🎓
//           </Text>
//         </View>

//         {/* Overlay only over main content */}
//         {active.value && (
//           <Pressable
//             style={StyleSheet.absoluteFillObject}
//             onPress={() => {
//               active.value = false;
//               closeDrawer();
//             }}
//           />
//         )}
//       </Animated.View>

//       <StatusBar backgroundColor={"#ffffff"} barStyle="dark-content" />
//     </View>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//   },
//   title: {
//     fontSize: 20,
//     marginLeft: 12,
//     fontWeight: "600",
//   },
//   body: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   bodyText: {
//     fontSize: 18,
//     fontWeight: "400",
//   },
// });

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Dimensions,
//   StatusBar,
//   Image,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { BlurView } from 'expo-blur';

// const { width, height } = Dimensions.get('window');

// interface ActivityItem {
//   id: string;
//   title: string;
//   time: string;
//   location?: string;
//   type: 'class' | 'event' | 'deadline' | 'meeting';
// }

// interface QuickStatCard {
//   label: string;
//   value: string;
//   change: string;
//   isPositive: boolean;
// }

// const HomeScreen: React.FC = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [selectedDay, setSelectedDay] = useState(new Date().getDay());

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const getGreeting = (): string => {
//     const hour = currentTime.getHours();
//     if (hour < 12) return 'Good Morning';
//     if (hour < 17) return 'Good Afternoon';
//     return 'Good Evening';
//   };

//   const todayActivities: ActivityItem[] = [
//     {
//       id: '1',
//       title: 'Database Systems Lab',
//       time: '09:00 AM - 11:00 AM',
//       location: 'Lab 4, CS Block',
//       type: 'class',
//     },
//     {
//       id: '2',
//       title: 'Software Engineering',
//       time: '02:00 PM - 04:00 PM',
//       location: 'Room 301, Main Block',
//       type: 'class',
//     },
//     {
//       id: '3',
//       title: 'Assignment Submission',
//       time: '11:59 PM',
//       location: 'LMS Portal',
//       type: 'deadline',
//     },
//   ];

//   const quickStats: QuickStatCard[] = [
//     { label: 'Attendance', value: '87%', change: '+2%', isPositive: true },
//     { label: 'CGPA', value: '3.45', change: '+0.12', isPositive: true },
//     { label: 'Pending Tasks', value: '4', change: '-2', isPositive: true },
//   ];

//   const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//   const getActivityColor = (type: string): string => {
//     switch (type) {
//       case 'class': return '#4F46E5';
//       case 'event': return '#10B981';
//       case 'deadline': return '#EF4444';
//       case 'meeting': return '#F59E0B';
//       default: return '#6B7280';
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Hero Section with Gradient */}
//       <LinearGradient
//         colors={['#1e3a8a', '#3b82f6', '#60a5fa']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.heroSection}
//       >
//         <View style={styles.heroContent}>
//           <View style={styles.headerRow}>
//             <View>
//               <Text style={styles.greeting}>{getGreeting()}</Text>
//               <Text style={styles.userName}>Muhammad Ali</Text>
//               <Text style={styles.userDetails}>FA21-BSE-123 • Semester 6</Text>
//             </View>
//             <TouchableOpacity style={styles.avatarContainer}>
//               <LinearGradient
//                 colors={['#ffffff', '#e0e7ff']}
//                 style={styles.avatar}
//               >
//                 <Text style={styles.avatarText}>MA</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>

//           {/* Current Time Card */}
//           <View style={styles.timeCard}>
//             <View style={styles.timeCardContent}>
//               <Text style={styles.currentDate}>
//                 {currentTime.toLocaleDateString('en-US', {
//                   weekday: 'long',
//                   month: 'long',
//                   day: 'numeric'
//                 })}
//               </Text>
//               <Text style={styles.currentTime}>
//                 {currentTime.toLocaleTimeString('en-US', {
//                   hour: '2-digit',
//                   minute: '2-digit'
//                 })}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </LinearGradient>

//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Quick Stats Row */}
//         <View style={styles.statsContainer}>
//           {quickStats.map((stat, index) => (
//             <View key={index} style={styles.statCard}>
//               <Text style={styles.statValue}>{stat.value}</Text>
//               <Text style={styles.statLabel}>{stat.label}</Text>
//               <View style={styles.statChange}>
//                 <Text style={[
//                   styles.statChangeText,
//                   { color: stat.isPositive ? '#10B981' : '#EF4444' }
//                 ]}>
//                   {stat.change}
//                 </Text>
//               </View>
//             </View>
//           ))}
//         </View>

//         {/* Weekly Overview */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>This Week</Text>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.weekDaysScroll}
//           >
//             {weekDays.map((day, index) => {
//               const isToday = index === selectedDay;
//               const dayNumber = new Date();
//               dayNumber.setDate(dayNumber.getDate() - selectedDay + index);

//               return (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.dayCard,
//                     isToday && styles.dayCardActive
//                   ]}
//                   onPress={() => setSelectedDay(index)}
//                 >
//                   <Text style={[
//                     styles.dayName,
//                     isToday && styles.dayNameActive
//                   ]}>
//                     {day}
//                   </Text>
//                   <Text style={[
//                     styles.dayNumber,
//                     isToday && styles.dayNumberActive
//                   ]}>
//                     {dayNumber.getDate()}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         </View>

//         {/* Today's Schedule */}
//         <View style={styles.sectionContainer}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Today's Schedule</Text>
//             <TouchableOpacity>
//               <Text style={styles.seeAllText}>View All</Text>
//             </TouchableOpacity>
//           </View>

//           {todayActivities.map((activity) => (
//             <TouchableOpacity key={activity.id} style={styles.activityCard}>
//               <View
//                 style={[
//                   styles.activityIndicator,
//                   { backgroundColor: getActivityColor(activity.type) }
//                 ]}
//               />
//               <View style={styles.activityContent}>
//                 <Text style={styles.activityTitle}>{activity.title}</Text>
//                 <Text style={styles.activityTime}>{activity.time}</Text>
//                 {activity.location && (
//                   <Text style={styles.activityLocation}>📍 {activity.location}</Text>
//                 )}
//               </View>
//               <View style={[
//                 styles.activityBadge,
//                 { backgroundColor: getActivityColor(activity.type) + '20' }
//               ]}>
//                 <Text style={[
//                   styles.activityBadgeText,
//                   { color: getActivityColor(activity.type) }
//                 ]}>
//                   {activity.type}
//                 </Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Quick Insights */}
//         <View style={styles.sectionContainer}>
//           <Text style={styles.sectionTitle}>Insights</Text>

//           <View style={styles.insightCard}>
//             <View style={styles.insightIcon}>
//               <Text style={styles.insightEmoji}>📚</Text>
//             </View>
//             <View style={styles.insightContent}>
//               <Text style={styles.insightTitle}>Study Recommendation</Text>
//               <Text style={styles.insightDescription}>
//                 Your optimal study time is between 8 PM - 10 PM based on your schedule
//               </Text>
//             </View>
//           </View>

//           <View style={styles.insightCard}>
//             <View style={styles.insightIcon}>
//               <Text style={styles.insightEmoji}>⚡</Text>
//             </View>
//             <View style={styles.insightContent}>
//               <Text style={styles.insightTitle}>Performance Trend</Text>
//               <Text style={styles.insightDescription}>
//                 Great job! Your attendance improved by 5% this month
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Campus Updates */}
//         <View style={styles.sectionContainer}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Campus Updates</Text>
//             <View style={styles.notificationBadge}>
//               <Text style={styles.notificationBadgeText}>3</Text>
//             </View>
//           </View>

//           <TouchableOpacity style={styles.updateCard}>
//             <View style={styles.updateHeader}>
//               <Text style={styles.updateTitle}>🎓 Scholarship Applications Open</Text>
//               <Text style={styles.updateTime}>2h ago</Text>
//             </View>
//             <Text style={styles.updateDescription}>
//               Merit-based scholarship applications are now open until Dec 15
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.updateCard}>
//             <View style={styles.updateHeader}>
//               <Text style={styles.updateTitle}>🏆 Tech Fest 2024</Text>
//               <Text style={styles.updateTime}>5h ago</Text>
//             </View>
//             <Text style={styles.updateDescription}>
//               Register your team for the annual tech fest happening next week
//             </Text>
//           </TouchableOpacity>
//         </View>

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8FAFC',
//   },
//   heroSection: {
//     paddingTop: StatusBar.currentHeight || 50,
//     paddingBottom: 30,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//   },
//   heroContent: {
//     paddingHorizontal: 20,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 20,
//   },
//   greeting: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontWeight: '500',
//   },
//   userName: {
//     fontSize: 28,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     marginTop: 4,
//   },
//   userDetails: {
//     fontSize: 12,
//     color: 'rgba(255, 255, 255, 0.7)',
//     marginTop: 4,
//   },
//   avatarContainer: {
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#FFFFFF',
//   },
//   avatarText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1e3a8a',
//   },
//   timeCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 20,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   timeCardContent: {
//     alignItems: 'center',
//   },
//   currentDate: {
//     fontSize: 16,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   currentTime: {
//     fontSize: 36,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     marginTop: 8,
//     letterSpacing: 2,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingTop: 20,
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     gap: 12,
//     marginBottom: 24,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   statChange: {
//     marginTop: 8,
//   },
//   statChangeText: {
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   sectionContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 24,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   seeAllText: {
//     fontSize: 14,
//     color: '#3B82F6',
//     fontWeight: '600',
//   },
//   weekDaysScroll: {
//     marginTop: 16,
//   },
//   dayCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginRight: 12,
//     minWidth: 70,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   dayCardActive: {
//     backgroundColor: '#3B82F6',
//   },
//   dayName: {
//     fontSize: 12,
//     color: '#6B7280',
//     fontWeight: '600',
//   },
//   dayNameActive: {
//     color: '#FFFFFF',
//   },
//   dayNumber: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginTop: 8,
//   },
//   dayNumberActive: {
//     color: '#FFFFFF',
//   },
//   activityCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   activityIndicator: {
//     width: 4,
//     borderRadius: 2,
//     marginRight: 12,
//   },
//   activityContent: {
//     flex: 1,
//   },
//   activityTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   activityTime: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginTop: 4,
//   },
//   activityLocation: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginTop: 4,
//   },
//   activityBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//   },
//   activityBadgeText: {
//     fontSize: 11,
//     fontWeight: '600',
//     textTransform: 'capitalize',
//   },
//   insightCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   insightIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   insightEmoji: {
//     fontSize: 24,
//   },
//   insightContent: {
//     flex: 1,
//   },
//   insightTitle: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#1F2937',
//   },
//   insightDescription: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginTop: 4,
//     lineHeight: 18,
//   },
//   notificationBadge: {
//     backgroundColor: '#EF4444',
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     minWidth: 24,
//     alignItems: 'center',
//   },
//   notificationBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   updateCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   updateHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   updateTitle: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#1F2937',
//     flex: 1,
//   },
//   updateTime: {
//     fontSize: 12,
//     color: '#9CA3AF',
//   },
//   updateDescription: {
//     fontSize: 13,
//     color: '#6B7280',
//     lineHeight: 18,
//   },
// });

// export default HomeScreen;

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Dimensions,
//   StatusBar,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// const { width } = Dimensions.get('window');

// interface ActivityItem {
//   id: string;
//   title: string;
//   time: string;
//   location?: string;
//   type: 'class' | 'event' | 'deadline' | 'meeting';
//   professor?: string;
//   room?: string;
//   progress?: number;
// }

// interface Milestone {
//   id: string;
//   title: string;
//   date: string;
//   daysLeft: number;
//   type: 'exam' | 'project' | 'event';
// }

// const HomeScreen: React.FC = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [selectedDay, setSelectedDay] = useState(new Date().getDay());
//   const [motivationalQuote] = useState({
//     text: "The secret of getting ahead is getting started.",
//     author: "Mark Twain"
//   });

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const getGreeting = (): string => {
//     const hour = currentTime.getHours();
//     if (hour < 12) return 'Good Morning';
//     if (hour < 17) return 'Good Afternoon';
//     return 'Good Evening';
//   };

//   const getMotivationalEmoji = (): string => {
//     const hour = currentTime.getHours();
//     if (hour < 12) return '☀️';
//     if (hour < 17) return '🌤️';
//     return '🌙';
//   };

//   const getDayProgress = (): number => {
//     const hour = currentTime.getHours();
//     return (hour / 24) * 100;
//   };

//   const todayActivities: ActivityItem[] = [
//     {
//       id: '1',
//       title: 'Database Systems Lab',
//       time: '09:00 AM',
//       location: 'Lab 4, CS Block',
//       type: 'class',
//       professor: 'Dr. Ahmed Khan',
//       room: 'CS-401',
//       progress: 100,
//     },
//     {
//       id: '2',
//       title: 'Software Engineering',
//       time: '02:00 PM',
//       location: 'Room 301',
//       type: 'class',
//       professor: 'Dr. Sarah Ali',
//       room: 'MB-301',
//       progress: 0,
//     },
//     {
//       id: '3',
//       title: 'Project Proposal',
//       time: '11:59 PM',
//       location: 'LMS Portal',
//       type: 'deadline',
//       progress: 75,
//     },
//   ];

//   const upcomingMilestones: Milestone[] = [
//     {
//       id: '1',
//       title: 'Database Midterm',
//       date: 'Dec 12',
//       daysLeft: 4,
//       type: 'exam',
//     },
//     {
//       id: '2',
//       title: 'SWE Project Demo',
//       date: 'Dec 15',
//       daysLeft: 7,
//       type: 'project',
//     },
//   ];

//   const quickStats = [
//     { label: 'Classes Today', value: '3', icon: '📚', color: '#3B82F6' },
//     { label: 'Attendance', value: '87%', icon: '✅', color: '#10B981' },
//     { label: 'Tasks Due', value: '4', icon: '⏰', color: '#F59E0B' },
//     { label: 'CGPA', value: '3.45', icon: '🎯', color: '#8B5CF6' },
//   ];

//   const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//   const getActivityIcon = (type: string): string => {
//     switch (type) {
//       case 'class': return '📖';
//       case 'event': return '🎉';
//       case 'deadline': return '⚡';
//       case 'meeting': return '👥';
//       default: return '📌';
//     }
//   };

//   const getActivityColor = (type: string): string => {
//     switch (type) {
//       case 'class': return '#3B82F6';
//       case 'event': return '#10B981';
//       case 'deadline': return '#EF4444';
//       case 'meeting': return '#F59E0B';
//       default: return '#6B7280';
//     }
//   };

//   const getMilestoneColor = (type: string): string => {
//     switch (type) {
//       case 'exam': return '#EF4444';
//       case 'project': return '#8B5CF6';
//       case 'event': return '#10B981';
//       default: return '#6B7280';
//     }
//   };

//   const getCurrentClass = () => {
//     const hour = currentTime.getHours();
//     if (hour >= 9 && hour < 11) return todayActivities[0];
//     if (hour >= 14 && hour < 16) return todayActivities[1];
//     return null;
//   };

//   const currentClass = getCurrentClass();

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Animated Hero Section */}
//       <LinearGradient
//         colors={['#1e40af', '#3b82f6', '#60a5fa']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.heroSection}
//       >
//         <View style={styles.heroContent}>
//           {/* Header Row */}
//           <View style={styles.headerRow}>
//             <View style={styles.greetingContainer}>
//               <Text style={styles.greetingEmoji}>{getMotivationalEmoji()}</Text>
//               <View>
//                 <Text style={styles.greeting}>{getGreeting()}</Text>
//                 <Text style={styles.userName}>Muhammad Ali</Text>
//               </View>
//             </View>
//             <TouchableOpacity style={styles.profileButton}>
//               <LinearGradient
//                 colors={['#fbbf24', '#f59e0b']}
//                 style={styles.avatar}
//               >
//                 <Text style={styles.avatarText}>MA</Text>
//               </LinearGradient>
//               <View style={styles.onlineDot} />
//             </TouchableOpacity>
//           </View>

//           {/* Student Info Card */}
//           <View style={styles.infoCard}>
//             <View style={styles.infoRow}>
//               <View style={styles.infoItem}>
//                 <Text style={styles.infoLabel}>Registration</Text>
//                 <Text style={styles.infoValue}>FA21-BSE-123</Text>
//               </View>
//               <View style={styles.infoDivider} />
//               <View style={styles.infoItem}>
//                 <Text style={styles.infoLabel}>Semester</Text>
//                 <Text style={styles.infoValue}>6th</Text>
//               </View>
//               <View style={styles.infoDivider} />
//               <View style={styles.infoItem}>
//                 <Text style={styles.infoLabel}>Batch</Text>
//                 <Text style={styles.infoValue}>2021</Text>
//               </View>
//             </View>
//           </View>

//           {/* Live Clock */}
//           <View style={styles.clockContainer}>
//             <Text style={styles.clockTime}>
//               {currentTime.toLocaleTimeString('en-US', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: true
//               })}
//             </Text>
//             <Text style={styles.clockDate}>
//               {currentTime.toLocaleDateString('en-US', {
//                 weekday: 'long',
//                 month: 'short',
//                 day: 'numeric'
//               })}
//             </Text>
//             {/* Day Progress Bar */}
//             <View style={styles.progressBarContainer}>
//               <View
//                 style={[
//                   styles.progressBarFill,
//                   { width: `${getDayProgress()}%` }
//                 ]}
//               />
//             </View>
//             <Text style={styles.progressText}>
//               {Math.round(getDayProgress())}% of today completed
//             </Text>
//           </View>
//         </View>
//       </LinearGradient>

//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Current Class Highlight */}
//         {currentClass && (
//           <View style={styles.currentClassContainer}>
//             <View style={styles.liveIndicator}>
//               <View style={styles.liveDot} />
//               <Text style={styles.liveText}>HAPPENING NOW</Text>
//             </View>
//             <View style={styles.currentClassCard}>
//               <View style={styles.currentClassHeader}>
//                 <Text style={styles.currentClassTitle}>{currentClass.title}</Text>
//                 <Text style={styles.currentClassEmoji}>📖</Text>
//               </View>
//               <View style={styles.currentClassDetails}>
//                 <Text style={styles.currentClassInfo}>👨‍🏫 {currentClass.professor}</Text>
//                 <Text style={styles.currentClassInfo}>📍 {currentClass.location}</Text>
//                 <Text style={styles.currentClassInfo}>⏰ {currentClass.time}</Text>
//               </View>
//               <TouchableOpacity style={styles.navigateButton}>
//                 <Text style={styles.navigateButtonText}>Navigate to Class 🧭</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}

//         {/* Quick Stats Grid */}
//         <View style={styles.statsGrid}>
//           {quickStats.map((stat, index) => (
//             <TouchableOpacity key={index} style={styles.statCard}>
//               <Text style={styles.statIcon}>{stat.icon}</Text>
//               <Text style={styles.statValue}>{stat.value}</Text>
//               <Text style={styles.statLabel}>{stat.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Upcoming Milestones */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>🎯 Upcoming Milestones</Text>
//             <TouchableOpacity>
//               <Text style={styles.seeAllText}>See All</Text>
//             </TouchableOpacity>
//           </View>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={styles.milestonesScroll}
//           >
//             {upcomingMilestones.map((milestone) => (
//               <View
//                 key={milestone.id}
//                 style={[
//                   styles.milestoneCard,
//                   { borderLeftColor: getMilestoneColor(milestone.type) }
//                 ]}
//               >
//                 <View style={styles.milestoneHeader}>
//                   <Text style={styles.milestoneType}>
//                     {milestone.type.toUpperCase()}
//                   </Text>
//                   <View style={[
//                     styles.daysLeftBadge,
//                     { backgroundColor: getMilestoneColor(milestone.type) }
//                   ]}>
//                     <Text style={styles.daysLeftText}>{milestone.daysLeft}d</Text>
//                   </View>
//                 </View>
//                 <Text style={styles.milestoneTitle}>{milestone.title}</Text>
//                 <Text style={styles.milestoneDate}>📅 {milestone.date}</Text>
//               </View>
//             ))}
//           </ScrollView>
//         </View>

//         {/* Weekly Overview */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>📆 This Week</Text>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             style={styles.weekScroll}
//           >
//             {weekDays.map((day, index) => {
//               const isToday = index === new Date().getDay();
//               const dayDate = new Date();
//               dayDate.setDate(dayDate.getDate() - new Date().getDay() + index);

//               return (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.dayCard,
//                     isToday && styles.dayCardToday
//                   ]}
//                   onPress={() => setSelectedDay(index)}
//                 >
//                   <Text style={[
//                     styles.dayName,
//                     isToday && styles.dayNameToday
//                   ]}>
//                     {day}
//                   </Text>
//                   <Text style={[
//                     styles.dayNumber,
//                     isToday && styles.dayNumberToday
//                   ]}>
//                     {dayDate.getDate()}
//                   </Text>
//                   {isToday && <View style={styles.todayDot} />}
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         </View>

//         {/* Today's Schedule */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>📋 Today's Schedule</Text>
//             <View style={styles.scheduleCount}>
//               <Text style={styles.scheduleCountText}>{todayActivities.length}</Text>
//             </View>
//           </View>

//           {todayActivities.map((activity) => (
//             <TouchableOpacity key={activity.id} style={styles.activityCard}>
//               <View style={styles.activityLeft}>
//                 <View style={[
//                   styles.activityIconContainer,
//                   { backgroundColor: getActivityColor(activity.type) + '20' }
//                 ]}>
//                   <Text style={styles.activityIcon}>{getActivityIcon(activity.type)}</Text>
//                 </View>
//                 <View style={styles.activityContent}>
//                   <Text style={styles.activityTitle}>{activity.title}</Text>
//                   <Text style={styles.activityTime}>⏰ {activity.time}</Text>
//                   {activity.professor && (
//                     <Text style={styles.activityMeta}>👨‍🏫 {activity.professor}</Text>
//                   )}
//                   {activity.location && (
//                     <Text style={styles.activityMeta}>📍 {activity.location}</Text>
//                   )}
//                   {activity.progress !== undefined && (
//                     <View style={styles.progressContainer}>
//                       <View style={styles.progressBackground}>
//                         <View
//                           style={[
//                             styles.progressFill,
//                             {
//                               width: `${activity.progress}%`,
//                               backgroundColor: getActivityColor(activity.type)
//                             }
//                           ]}
//                         />
//                       </View>
//                       <Text style={styles.progressLabel}>{activity.progress}%</Text>
//                     </View>
//                   )}
//                 </View>
//               </View>
//               <TouchableOpacity
//                 style={[
//                   styles.activityAction,
//                   { backgroundColor: getActivityColor(activity.type) }
//                 ]}
//               >
//                 <Text style={styles.activityActionText}>→</Text>
//               </TouchableOpacity>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Motivational Quote */}
//         <View style={styles.section}>
//           <LinearGradient
//             colors={['#fef3c7', '#fde68a']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.quoteCard}
//           >
//             <Text style={styles.quoteIcon}>💡</Text>
//             <Text style={styles.quoteText}>"{motivationalQuote.text}"</Text>
//             <Text style={styles.quoteAuthor}>— {motivationalQuote.author}</Text>
//           </LinearGradient>
//         </View>

//         {/* Campus Buzz */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>🔥 Campus Buzz</Text>
//             <View style={styles.newBadge}>
//               <Text style={styles.newBadgeText}>NEW</Text>
//             </View>
//           </View>

//           <TouchableOpacity style={styles.buzzCard}>
//             <View style={styles.buzzIcon}>
//               <Text style={styles.buzzEmoji}>🎓</Text>
//             </View>
//             <View style={styles.buzzContent}>
//               <Text style={styles.buzzTitle}>Merit Scholarships Open!</Text>
//               <Text style={styles.buzzDescription}>
//                 Applications accepted until Dec 15. Don't miss out!
//               </Text>
//               <Text style={styles.buzzTime}>2 hours ago</Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.buzzCard}>
//             <View style={styles.buzzIcon}>
//               <Text style={styles.buzzEmoji}>🏆</Text>
//             </View>
//             <View style={styles.buzzContent}>
//               <Text style={styles.buzzTitle}>Tech Fest 2024 Registration</Text>
//               <Text style={styles.buzzDescription}>
//                 Team registrations now open. Prize pool: 500K PKR
//               </Text>
//               <Text style={styles.buzzTime}>5 hours ago</Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F9FAFB',
//   },
//   heroSection: {
//     paddingTop: (StatusBar.currentHeight || 40) + 10,
//     paddingBottom: 30,
//     borderBottomLeftRadius: 32,
//     borderBottomRightRadius: 32,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   heroContent: {
//     paddingHorizontal: 20,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   greetingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   greetingEmoji: {
//     fontSize: 40,
//   },
//   greeting: {
//     fontSize: 14,
//     color: 'rgba(255, 255, 255, 0.9)',
//     fontWeight: '600',
//   },
//   userName: {
//     fontSize: 24,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     marginTop: 2,
//   },
//   profileButton: {
//     position: 'relative',
//   },
//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: '#FFFFFF',
//   },
//   avatarText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   onlineDot: {
//     position: 'absolute',
//     bottom: 2,
//     right: 2,
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: '#10B981',
//     borderWidth: 2,
//     borderColor: '#FFFFFF',
//   },
//   infoCard: {
//     backgroundColor: 'rgba(255, 255, 255, 0.25)',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   infoItem: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   infoLabel: {
//     fontSize: 11,
//     color: 'rgba(255, 255, 255, 0.8)',
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   infoValue: {
//     fontSize: 15,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//   },
//   infoDivider: {
//     width: 1,
//     height: 30,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   clockContainer: {
//     alignItems: 'center',
//     paddingVertical: 16,
//   },
//   clockTime: {
//     fontSize: 48,
//     color: '#FFFFFF',
//     fontWeight: 'bold',
//     letterSpacing: 2,
//   },
//   clockDate: {
//     fontSize: 16,
//     color: 'rgba(255, 255, 255, 0.9)',
//     fontWeight: '600',
//     marginTop: 4,
//   },
//   progressBarContainer: {
//     width: '100%',
//     height: 6,
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//     borderRadius: 3,
//     marginTop: 16,
//     overflow: 'hidden',
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: '#fbbf24',
//     borderRadius: 3,
//   },
//   progressText: {
//     fontSize: 12,
//     color: 'rgba(255, 255, 255, 0.8)',
//     marginTop: 8,
//     fontWeight: '600',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingTop: 20,
//     paddingHorizontal: 20,
//   },
//   currentClassContainer: {
//     marginBottom: 24,
//   },
//   liveIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   liveDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#EF4444',
//     marginRight: 8,
//   },
//   liveText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#EF4444',
//     letterSpacing: 1,
//   },
//   currentClassCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 20,
//     padding: 20,
//     borderLeftWidth: 6,
//     borderLeftColor: '#3B82F6',
//     shadowColor: '#3B82F6',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   currentClassHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   currentClassTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     flex: 1,
//   },
//   currentClassEmoji: {
//     fontSize: 32,
//   },
//   currentClassDetails: {
//     gap: 8,
//     marginBottom: 16,
//   },
//   currentClassInfo: {
//     fontSize: 14,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   navigateButton: {
//     backgroundColor: '#3B82F6',
//     borderRadius: 12,
//     padding: 14,
//     alignItems: 'center',
//   },
//   navigateButtonText: {
//     color: '#FFFFFF',
//     fontSize: 15,
//     fontWeight: 'bold',
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginBottom: 24,
//   },
//   statCard: {
//     flex: 1,
//     minWidth: (width - 56) / 2,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   statIcon: {
//     fontSize: 32,
//     marginBottom: 8,
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1F2937',
//   },
//   seeAllText: {
//     fontSize: 14,
//     color: '#3B82F6',
//     fontWeight: '600',
//   },
//   scheduleCount: {
//     backgroundColor: '#3B82F6',
//     borderRadius: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   scheduleCountText: {
//     color: '#FFFFFF',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   milestonesScroll: {
//     gap: 12,
//   },
//   milestoneCard: {
//     width: width * 0.7,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     borderLeftWidth: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   milestoneHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   milestoneType: {
//     fontSize: 11,
//     fontWeight: 'bold',
//     color: '#6B7280',
//     letterSpacing: 1,
//   },
//   daysLeftBadge: {
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   daysLeftText: {
//     color: '#FFFFFF',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   milestoneTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 8,
//   },
//   milestoneDate: {
//     fontSize: 13,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   weekScroll: {
//     marginTop: 12,
//   },
//   dayCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginRight: 12,
//     minWidth: 70,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   dayCardToday: {
//     backgroundColor: '#3B82F6',
//     shadowColor: '#3B82F6',
//     shadowOpacity: 0.3,
//   },
//   dayName: {
//     fontSize: 13,
//     color: '#6B7280',
//     fontWeight: '600',
//   },
//   dayNameToday: {
//     color: '#FFFFFF',
//   },
//   dayNumber: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginTop: 8,
//   },
//   dayNumberToday: {
//     color: '#FFFFFF',
//   },
//   todayDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: '#fbbf24',
//     marginTop: 8,
//   },
//   activityCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   activityLeft: {
//     flexDirection: 'row',
//     flex: 1,
//   },
//   activityIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   activityIcon: {
//     fontSize: 24,
//   },
//   activityContent: {
//     flex: 1,
//   },
//   activityTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 4,
//   },
//   activityTime: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginBottom: 2,
//   },
//   activityMeta: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginBottom: 2,
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 8,
//     gap: 8,
//   },
//   progressBackground: {
//     flex: 1,
//     height: 6,
//     backgroundColor: '#E5E7EB',
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     borderRadius: 3,
//   },
//   progressLabel: {
//     fontSize: 11,
//     fontWeight: 'bold',
//     color: '#6B7280',
//   },
//   activityAction: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 12,
//   },
//   activityActionText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   quoteCard: {
//     borderRadius: 20,
//     padding: 24,
//     alignItems: 'center',
//     shadowColor: '#F59E0B',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   quoteIcon: {
//     fontSize: 40,
//     marginBottom: 16,
//   },
//   quoteText: {
//     fontSize: 16,
//     fontStyle: 'italic',
//     color: '#78350F',
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 12,
//   },
//   quoteAuthor: {
//     fontSize: 14,
//     color: '#92400E',
//     fontWeight: '600',
//   },
//   newBadge: {
//     backgroundColor: '#EF4444',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//   },
//   newBadgeText: {
//     color: '#FFFFFF',
//     fontSize: 11,
//     fontWeight: 'bold',
//     letterSpacing: 0.5,
//   },
//   buzzCard: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   buzzIcon: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#FEF3C7',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   buzzEmoji: {
//     fontSize: 28,
//   },
//   buzzContent: {
//     flex: 1,
//   },
//   buzzTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 6,
//   },
//   buzzDescription: {
//     fontSize: 13,
//     color: '#6B7280',
//     lineHeight: 18,
//     marginBottom: 8,
//   },
//   buzzTime: {
//     fontSize: 11,
//     color: '#9CA3AF',
//     fontWeight: '500',
//   },
// });

// export default HomeScreen;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
//   Dimensions,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";

// const { width } = Dimensions.get("window");

// interface ActivityItem {
//   id: string;
//   title: string;
//   time: string;
//   location?: string;
//   type: "class" | "event" | "deadline" | "meeting";
// }

// interface QuickStatCard {
//   label: string;
//   value: string;
//   change: string;
//   isPositive: boolean;
// }

// const HomeScreen: React.FC = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [selectedDay, setSelectedDay] = useState(new Date().getDay());

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const getGreeting = () => {
//     const hr = currentTime.getHours();
//     if (hr < 12) return "Good Morning";
//     if (hr < 17) return "Good Afternoon";
//     return "Good Evening";
//   };

//   // Daily dummy activities
//   const todayActivities: ActivityItem[] = [
//     {
//       id: "1",
//       title: "Database Systems Lab",
//       time: "09:00 AM - 11:00 AM",
//       location: "Lab 4, CS Block",
//       type: "class",
//     },
//     {
//       id: "2",
//       title: "Software Engineering",
//       time: "02:00 PM - 04:00 PM",
//       location: "Room 301, Main Block",
//       type: "class",
//     },
//     {
//       id: "3",
//       title: "Assignment Submission",
//       time: "11:59 PM",
//       location: "LMS Portal",
//       type: "deadline",
//     },
//   ];

//   const quickStats: QuickStatCard[] = [
//     { label: "Attendance", value: "87%", change: "+2%", isPositive: true },
//     { label: "CGPA", value: "3.45", change: "+0.12", isPositive: true },
//     { label: "Pending Tasks", value: "4", change: "-2", isPositive: true },
//   ];

//   const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//   const getActivityColor = (type: string) => {
//     switch (type) {
//       case "class":
//         return "#4F46E5";
//       case "event":
//         return "#10B981";
//       case "deadline":
//         return "#EF4444";
//       case "meeting":
//         return "#F59E0B";
//       default:
//         return "#6B7280";
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* GRADIENT HERO */}
//       <LinearGradient
//         colors={["#0C1C3A", "#1E3A8A", "#3B82F6"]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.heroSection}
//       >
//         <View style={styles.heroTop}>
//           <View>
//             <Text style={styles.greetingText}>{getGreeting()}</Text>
//             <Text style={styles.userName}>Areeb Akram</Text>
//             <Text style={styles.userDetails}>FA22-BCS-110 • Semester 7</Text>
//           </View>

//           {/* Profile Avatar */}
//           <BlurView intensity={40} tint="light" style={styles.avatarOuter}>
//             <View style={styles.avatarInner}>
//               <Text style={styles.avatarText}>MA</Text>
//             </View>
//           </BlurView>
//         </View>

//         {/* GLASS TIME CARD */}
//         <BlurView intensity={50} tint="light" style={styles.timeCard}>
//           <Text style={styles.dateText}>
//             {currentTime.toLocaleDateString("en-US", {
//               weekday: "long",
//               month: "long",
//               day: "numeric",
//             })}
//           </Text>
//           <Text style={styles.timeText}>
//             {currentTime.toLocaleTimeString("en-US", {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </Text>
//         </BlurView>
//       </LinearGradient>

//       {/* MAIN SCROLL */}
//       <ScrollView
//         style={{ flex: 1 }}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 60 }}
//       >
//         {/* QUICK STATS */}
//         <View style={styles.statsRow}>
//           {quickStats.map((item, i) => (
//             <BlurView key={i} intensity={30} tint="light" style={styles.statCard}>
//               <Text style={styles.statValue}>{item.value}</Text>
//               <Text style={styles.statLabel}>{item.label}</Text>

//               <Text
//                 style={[
//                   styles.statChange,
//                   { color: item.isPositive ? "#10B981" : "#EF4444" },
//                 ]}
//               >
//                 {item.change}
//               </Text>
//             </BlurView>
//           ))}
//         </View>

//         {/* WEEKLY OVERVIEW */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>This Week</Text>

//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {weekDays.map((d, i) => {
//               const isToday = i === selectedDay;

//               const date = new Date();
//               date.setDate(date.getDate() - selectedDay + i);

//               return (
//                 <TouchableOpacity
//                   key={i}
//                   onPress={() => setSelectedDay(i)}
//                   style={[styles.dayCard, isToday && styles.dayCardActive]}
//                 >
//                   <Text
//                     style={[styles.dayName, isToday && styles.dayNameActive]}
//                   >
//                     {d}
//                   </Text>
//                   <Text
//                     style={[styles.dayNumber, isToday && styles.dayNumberActive]}
//                   >
//                     {date.getDate()}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         </View>

//         {/* TODAY'S SCHEDULE */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Today's Schedule</Text>
//             <Text style={styles.sectionLink}>View All</Text>
//           </View>

//           {todayActivities.map((a) => (
//             <BlurView key={a.id} intensity={30} tint="light" style={styles.activityCard}>
//               <View
//                 style={[
//                   styles.activityIndicator,
//                   { backgroundColor: getActivityColor(a.type) },
//                 ]}
//               />
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.activityTitle}>{a.title}</Text>
//                 <Text style={styles.activityTime}>{a.time}</Text>
//                 {a.location && (
//                   <Text style={styles.activityLocation}>📍 {a.location}</Text>
//                 )}
//               </View>

//               <View
//                 style={[
//                   styles.typeTag,
//                   { backgroundColor: getActivityColor(a.type) + "25" },
//                 ]}
//               >
//                 <Text
//                   style={[
//                     styles.typeTagText,
//                     { color: getActivityColor(a.type) },
//                   ]}
//                 >
//                   {a.type}
//                 </Text>
//               </View>
//             </BlurView>
//           ))}
//         </View>

//         {/* INSIGHTS */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Insights</Text>

//           <BlurView intensity={25} tint="light" style={styles.insightCard}>
//             <View style={styles.insightIcon}>
//               <Text style={styles.emoji}>📚</Text>
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.insightTitle}>Study Recommendation</Text>
//               <Text style={styles.insightDesc}>
//                 Your optimal study time is between 8 PM - 10 PM based on your
//                 schedule.
//               </Text>
//             </View>
//           </BlurView>

//           <BlurView intensity={25} tint="light" style={styles.insightCard}>
//             <View style={styles.insightIcon}>
//               <Text style={styles.emoji}>⚡</Text>
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.insightTitle}>Performance Trend</Text>
//               <Text style={styles.insightDesc}>
//                 Great job! Your attendance improved by 5% this month.
//               </Text>
//             </View>
//           </BlurView>
//         </View>

//         {/* CAMPUS UPDATES */}
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Campus Updates</Text>

//             <View style={styles.alertBadge}>
//               <Text style={styles.alertBadgeText}>3</Text>
//             </View>
//           </View>

//           <BlurView intensity={30} tint="light" style={styles.updateCard}>
//             <View style={styles.updateHeader}>
//               <Text style={styles.updateTitle}>
//                 🎓 Scholarship Applications Open
//               </Text>
//               <Text style={styles.updateTime}>2h ago</Text>
//             </View>
//             <Text style={styles.updateDesc}>
//               Merit-based scholarship applications are now open until Dec 15.
//             </Text>
//           </BlurView>

//           <BlurView intensity={30} tint="light" style={styles.updateCard}>
//             <View style={styles.updateHeader}>
//               <Text style={styles.updateTitle}>🏆 Tech Fest 2024</Text>
//               <Text style={styles.updateTime}>5h ago</Text>
//             </View>
//             <Text style={styles.updateDesc}>
//               Register your team for the annual tech fest happening next week.
//             </Text>
//           </BlurView>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import CustomDrawer from "../../components/customDrawer";
import { useDrawer } from "../../Context/DrawerContext";

const { width } = Dimensions.get("window");

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  location?: string;
  type: "class" | "event" | "deadline" | "meeting";
}

interface QuickStatCard {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

const HomeScreen: React.FC = () => {
  const { closeDrawer } = useDrawer();
  const active = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { scale: active.value ? withTiming(0.85) : withTiming(1) },
        { translateX: active.value ? withSpring(240) : withTiming(0) },
      ],
      borderRadius: active.value ? withTiming(20) : withTiming(0),
    };
  });

  // ------------------------
  // YOUR ORIGINAL HOME LOGIC
  // ------------------------
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hr = currentTime.getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const todayActivities: ActivityItem[] = [
    {
      id: "1",
      title: "Database Systems Lab",
      time: "09:00 AM - 11:00 AM",
      location: "Lab 4, CS Block",
      type: "class",
    },
    {
      id: "2",
      title: "Software Engineering",
      time: "02:00 PM - 04:00 PM",
      location: "Room 301, Main Block",
      type: "class",
    },
    {
      id: "3",
      title: "Assignment Submission",
      time: "11:59 PM",
      location: "LMS Portal",
      type: "deadline",
    },
  ];

  const quickStats: QuickStatCard[] = [
    { label: "Attendance", value: "87%", change: "+2%", isPositive: true },
    { label: "CGPA", value: "3.45", change: "+0.12", isPositive: true },
    { label: "Pending Tasks", value: "4", change: "-2", isPositive: true },
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getActivityColor = (type: string) => {
    switch (type) {
      case "class":
        return "#4F46E5";
      case "event":
        return "#10B981";
      case "deadline":
        return "#EF4444";
      case "meeting":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  // ------------------------
  // RENDER
  // ------------------------
  return (
    <View style={{ flex: 1 }}>
      {/* Drawer stays behind */}
      <CustomDrawer active={active} />

      {/* Main Screen */}
      <Animated.View
        style={[{ flex: 1, backgroundColor: "#F4F7FA" }, animatedStyle]}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* <Text style={styles.headerTitle}>Home</Text> */}
        </View>

        {/* MAIN CONTENT */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}>
          {/* GRADIENT HERO */}
          <LinearGradient
            colors={["#0C1C3A", "#1E3A8A", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroSection}>
            <View style={styles.heroTop}>
              <View>
                <Pressable onPress={() => (active.value = !active.value)}>
                  <Ionicons name="menu" size={28} color="white" />
                </Pressable>
                <Text style={styles.greetingText}>{getGreeting()}</Text>
                <Text style={styles.userName}>Areeb Akram</Text>
                <Text style={styles.userDetails}>
                  FA22-BCS-110 • Semester 7
                </Text>
              </View>

              {/* Profile Avatar */}
              <BlurView intensity={40} tint="light" style={styles.avatarOuter}>
                <View style={styles.avatarInner}>
                  <Text style={styles.avatarText}>MA</Text>
                </View>
              </BlurView>
            </View>

            {/* GLASS TIME CARD */}
            <BlurView intensity={50} tint="light" style={styles.timeCard}>
              <Text style={styles.dateText}>
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
              <Text style={styles.timeText}>
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </BlurView>
          </LinearGradient>

          {/* QUICK STATS */}
          <View style={styles.statsRow}>
            {quickStats.map((item, i) => (
              <BlurView
                key={i}
                intensity={30}
                tint="light"
                style={styles.statCard}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
                <Text
                  style={[
                    styles.statChange,
                    { color: item.isPositive ? "#10B981" : "#EF4444" },
                  ]}>
                  {item.change}
                </Text>
              </BlurView>
            ))}
          </View>

          {/* WEEKLY OVERVIEW */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {weekDays.map((d, i) => {
                const isToday = i === selectedDay;
                const date = new Date();
                date.setDate(date.getDate() - selectedDay + i);
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setSelectedDay(i)}
                    style={[styles.dayCard, isToday && styles.dayCardActive]}>
                    <Text
                      style={[styles.dayName, isToday && styles.dayNameActive]}>
                      {d}
                    </Text>
                    <Text
                      style={[
                        styles.dayNumber,
                        isToday && styles.dayNumberActive,
                      ]}>
                      {date.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* TODAY'S SCHEDULE */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
              <Text style={styles.sectionLink}>View All</Text>
            </View>

            {todayActivities.map((a) => (
              <BlurView
                key={a.id}
                intensity={30}
                tint="light"
                style={styles.activityCard}>
                <View
                  style={[
                    styles.activityIndicator,
                    { backgroundColor: getActivityColor(a.type) },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle}>{a.title}</Text>
                  <Text style={styles.activityTime}>{a.time}</Text>
                  {a.location && (
                    <Text style={styles.activityLocation}>📍 {a.location}</Text>
                  )}
                </View>

                <View
                  style={[
                    styles.typeTag,
                    { backgroundColor: getActivityColor(a.type) + "25" },
                  ]}>
                  <Text
                    style={[
                      styles.typeTagText,
                      { color: getActivityColor(a.type) },
                    ]}>
                    {a.type}
                  </Text>
                </View>
              </BlurView>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* OVERLAY when drawer active */}
      {active.value && (
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => {
            active.value = false;
            closeDrawer();
          }}
        />
      )}

      <StatusBar backgroundColor={"#ffffff"} barStyle="dark-content" />
    </View>
  );
};

export default HomeScreen;

// Styles remain the same as your original HomeScreen

// --------------------
// MODERN HYBRID STYLES
// --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },
  header: {
    flexDirection: "row",
  },

  // HERO SECTION
  heroSection: {
    width: "100%",
    paddingTop: 60,
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  greetingText: {
    color: "#D1D5DB",
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
  },
  userDetails: {
    color: "#E5E7EB",
    marginTop: 3,
    fontSize: 12,
  },

  // AVATAR
  avatarOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  avatarInner: {
    backgroundColor: "rgba(255,255,255,0.8)",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  // TIME CARD
  timeCard: {
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
    alignItems: "center",
  },
  dateText: {
    color: "#F1F5F9",
    fontSize: 15,
    fontWeight: "500",
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "700",
    marginTop: 6,
    letterSpacing: 1,
  },

  // QUICK STATS
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 18,
    marginTop: 25,
    justifyContent: "space-between",
  },
  statCard: {
    width: (width - 60) / 3,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  statChange: {
    marginTop: 6,
    fontWeight: "600",
    fontSize: 12,
  },

  // SECTIONS
  section: {
    paddingHorizontal: 18,
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionLink: {
    color: "#3B82F6",
    fontWeight: "600",
    fontSize: 14,
  },

  // WEEK CARDS
  dayCard: {
    width: 72,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginRight: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  dayCardActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  dayName: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
  },
  dayNameActive: {
    color: "#FFFFFF",
  },
  dayNumber: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  dayNumberActive: {
    color: "#FFFFFF",
  },

  // ACTIVITIES
  activityCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  activityIndicator: {
    width: 4,
    borderRadius: 4,
    marginRight: 14,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  activityTime: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  activityLocation: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  typeTag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  typeTagText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  // INSIGHTS
  insightCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  insightIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emoji: {
    fontSize: 24,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  insightDesc: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },

  // CAMPUS UPDATES
  alertBadge: {
    backgroundColor: "#EF4444",
    minWidth: 24,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
    alignItems: "center",
  },
  alertBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  updateCard: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  updateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  updateTitle: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  updateTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  updateDesc: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },
});

// export default HomeScreen;
