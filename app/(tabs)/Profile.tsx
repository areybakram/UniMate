// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";

// export default function ProfileScreen({ user }) {
//   // Example user fallback (remove this when integrating)
//   const currentUser = user || {
//     name: "Areeb Course",
//     email: "areeb@example.com",
//     role: "Student",
//     department: "Computer Science",
//     phone: "+92 300 1234567",
//     avatar:
//       "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&q=80",
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#0F0F0F" }}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* TOP GRADIENT HEADER */}
//         <LinearGradient
//           colors={["#1E1E1E", "#3B3B98"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.header}
//         >
//           <Text style={styles.headerTitle}>My Profile</Text>

//           {/* PROFILE PHOTO */}
//           <View style={styles.avatarContainer}>
//             <Image
//               source={{ uri: currentUser.avatar }}
//               style={styles.avatar}
//             />
//           </View>

//           <Text style={styles.name}>{currentUser.name}</Text>
//           <Text style={styles.email}>{currentUser.email}</Text>
//         </LinearGradient>

//         {/* DETAILS SECTION */}
//         <View style={{ marginTop: 70, paddingHorizontal: 20 }}>
//           <BlurView intensity={60} tint="dark" style={styles.card}>
//             <Text style={styles.cardTitle}>About Me</Text>

//             <View style={styles.row}>
//               <Text style={styles.label}>Role</Text>
//               <Text style={styles.value}>{currentUser.role}</Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Department</Text>
//               <Text style={styles.value}>{currentUser.department}</Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Phone</Text>
//               <Text style={styles.value}>{currentUser.phone}</Text>
//             </View>
//           </BlurView>

//           {/* SETTINGS CARD */}
//           <BlurView intensity={60} tint="dark" style={styles.card}>
//             <Text style={styles.cardTitle}>Account</Text>

//             <TouchableOpacity style={styles.item}>
//               <Text style={styles.itemText}>Edit Profile</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.item}>
//               <Text style={styles.itemText}>Change Password</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={[styles.item, { borderBottomWidth: 0 }]}>
//               <Text style={styles.itemText}>Notification Settings</Text>
//             </TouchableOpacity>
//           </BlurView>

//           {/* LOGOUT BUTTON */}
//           <TouchableOpacity style={styles.logoutButton}>
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>

//           <View style={{ height: 40 }} />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     height: 260,
//     width: "100%",
//     borderBottomLeftRadius: 35,
//     borderBottomRightRadius: 35,
//     paddingTop: 40,
//     paddingHorizontal: 20,
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "600",
//     marginBottom: 15,
//   },
//   avatarContainer: {
//     alignSelf: "center",
//     marginTop: 10,
//     shadowColor: "#ffffff",
//     shadowOpacity: 0.4,
//     shadowRadius: 20,
//     shadowOffset: { width: 0, height: 10 },
//   },
//   avatar: {
//     width: 110,
//     height: 110,
//     borderRadius: 999,
//     borderWidth: 3,
//     borderColor: "rgba(255,255,255,0.5)",
//   },
//   name: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "700",
//     textAlign: "center",
//     marginTop: 15,
//   },
//   email: {
//     color: "#dcdcdc",
//     fontSize: 14,
//     textAlign: "center",
//     marginTop: 4,
//   },
//   card: {
//     backgroundColor: "rgba(255,255,255,0.05)",
//     borderRadius: 25,
//     padding: 20,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//   },
//   cardTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 12,
//     opacity: 0.9,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 14,
//     borderBottomWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//     paddingBottom: 8,
//   },
//   label: {
//     color: "#AAA",
//     fontSize: 14,
//   },
//   value: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   item: {
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//   },
//   itemText: {
//     color: "#fff",
//     fontSize: 15,
//   },
//   logoutButton: {
//     backgroundColor: "#ff4d4d",
//     paddingVertical: 15,
//     borderRadius: 20,
//     marginTop: 10,
//   },
//   logoutText: {
//     color: "#fff",
//     fontSize: 15,
//     textAlign: "center",
//     fontWeight: "600",
//   },
// });


// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";

// export default function ProfileScreen({ user }) {
//   // Example fallback user
//   const currentUser = user || {
//     name: "Areeb Course",
//     email: "areeb@example.com", // FIXED — stays as it is
//     role: "Student",
//     department: "Computer Science",
//     phone: "+92 300 1234567",
//     avatar:
//       "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400&q=80",
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#0F0F0F" }}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 120 }} // 👈 FIX: tab bar no longer hides content
//       >
//         {/* TOP GRADIENT HEADER */}
//         <LinearGradient
//           colors={["#1E1E1E", "#3B3B98"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.header}
//         >
//           <Text style={styles.headerTitle}>My Profile</Text>

//           {/* PROFILE PHOTO */}
//           <View style={styles.avatarContainer}>
//             <Image
//               source={{ uri: currentUser.avatar }}
//               style={styles.avatar}
//             />
//           </View>

//           <Text style={styles.name}>{currentUser.name}</Text>
//           <Text style={styles.email}>{currentUser.email}</Text>
//         </LinearGradient>

//         {/* DETAILS SECTION */}
//         <View style={{ marginTop: 70, paddingHorizontal: 20 }}>
//           <BlurView intensity={60} tint="dark" style={styles.card}>
//             <Text style={styles.cardTitle}>About Me</Text>

//             <View style={styles.row}>
//               <Text style={styles.label}>Role</Text>
//               <Text style={styles.value}>{currentUser.role}</Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Department</Text>
//               <Text style={styles.value}>{currentUser.department}</Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Phone</Text>
//               <Text style={styles.value}>{currentUser.phone}</Text>
//             </View>
//           </BlurView>

//           {/* SETTINGS CARD */}
//           <BlurView intensity={60} tint="dark" style={styles.card}>
//             <Text style={styles.cardTitle}>Account</Text>

//             <TouchableOpacity style={styles.item}>
//               <Text style={styles.itemText}>Edit Profile</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.item}>
//               <Text style={styles.itemText}>Change Password</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={[styles.item, { borderBottomWidth: 0 }]}>
//               <Text style={styles.itemText}>Notification Settings</Text>
//             </TouchableOpacity>
//           </BlurView>

//           {/* LOGOUT BUTTON */}
//           <TouchableOpacity style={styles.logoutButton}>
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>

//           <View style={{ height: 40 }} />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     height: 260,
//     width: "100%",
//     borderBottomLeftRadius: 35,
//     borderBottomRightRadius: 35,
//     paddingTop: 40,
//     paddingHorizontal: 20,
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "600",
//     marginBottom: 15,
//   },
//   avatarContainer: {
//     alignSelf: "center",
//     marginTop: 10,
//     shadowColor: "#ffffff",
//     shadowOpacity: 0.4,
//     shadowRadius: 20,
//     shadowOffset: { width: 0, height: 10 },
//   },
//   avatar: {
//     width: 110,
//     height: 110,
//     borderRadius: 999,
//     borderWidth: 3,
//     borderColor: "rgba(255,255,255,0.5)",
//   },
//   name: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "700",
//     textAlign: "center",
//     marginTop: 15,
//   },
//   email: {
//     color: "#dcdcdc",
//     fontSize: 14,
//     textAlign: "center",
//     marginTop: 4,
//   },
//   card: {
//     backgroundColor: "rgba(255,255,255,0.05)",
//     borderRadius: 25,
//     padding: 20,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//   },
//   cardTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 12,
//     opacity: 0.9,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 14,
//     borderBottomWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//     paddingBottom: 8,
//   },
//   label: {
//     color: "#AAA",
//     fontSize: 14,
//   },
//   value: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   item: {
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//   },
//   itemText: {
//     color: "#fff",
//     fontSize: 15,
//   },
//   logoutButton: {
//     backgroundColor: "#ff4d4d",
//     paddingVertical: 15,
//     borderRadius: 20,
//     marginTop: 10,
//   },
//   logoutText: {
//     color: "#fff",
//     fontSize: 15,
//     textAlign: "center",
//     fontWeight: "600",
//   },
// });


// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";
// import { useContext, useState } from "react";
// import { AuthContext } from "../../Context/AuthContext";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router"; 


// export default function ProfileScreen() {
//   // Replace this with your local image path
//   const profilePhoto = require("../../assets/profilephoto.jpeg"); // 👈 put your image here
//   const { user, isLoading } = useContext(AuthContext);
//     const [currentUser, setCurrentUser] = useState(user);

//   const DummyUser = {
//     name: "name",
//     email: "areebakram30@gmail.com",
//     role: "Student",
//     department: "Computer Science",
//     phone: "+92 300 1234567",
//   };

//     const logout = async () => {
//     setCurrentUser(null);
//     await AsyncStorage.removeItem("user");
//     router.replace("/(auth)/Auth");
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#0F0F0F" }}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 120 }}
//       >
//         {/* TOP GRADIENT HEADER */}
//         <LinearGradient
//           colors={["#1E1E1E", "#3B3B98"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.header}
//         >
//           <Text style={styles.headerTitle}>My Profile</Text>

//           {/* PROFILE PHOTO */}
//           <View style={styles.avatarContainer}>
//             <Image source={profilePhoto} style={styles.avatar} />
//           </View>

//           <Text style={styles.name}>{currentUser.name}</Text>
//           <Text style={styles.email}>{currentUser.email}</Text>
//         </LinearGradient>

//         {/* DETAILS SECTION */}
//         <View style={{ marginTop: 70, paddingHorizontal: 20 }}>
//           <BlurView intensity={60} tint="dark" style={styles.card}>
//             <Text style={styles.cardTitle}>About Me</Text>

//             <View style={styles.row}>
//               <Text style={styles.label}>Role</Text>
//               <Text style={styles.value}>{currentUser.role}</Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Department</Text>
//               <Text style={styles.value}>{currentUser.department}</Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Phone</Text>
//               <Text style={styles.value}>{currentUser.phone}</Text>
//             </View>
//           </BlurView>

//           {/* SETTINGS CARD */}
//           <BlurView intensity={60} tint="dark" style={styles.card}>
//             <Text style={styles.cardTitle}>Account</Text>

//             <TouchableOpacity style={styles.item}>
//               <Text style={styles.itemText}>Edit Profile</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.item}>
//               <Text style={styles.itemText}>Change Password</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={[styles.item, { borderBottomWidth: 0 }]}>
//               <Text style={styles.itemText}>Notification Settings</Text>
//             </TouchableOpacity>
//           </BlurView>

//           {/* LOGOUT BUTTON */}
//           <TouchableOpacity onPress={logout} style={styles.logoutButton}>
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>

//           <View style={{ height: 40 }} />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     height: 260,
//     width: "100%",
//     borderBottomLeftRadius: 35,
//     borderBottomRightRadius: 35,
//     paddingTop: 40,
//     paddingHorizontal: 20,
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "600",
//     marginBottom: 15,
//   },
//   avatarContainer: {
//     alignSelf: "center",
//     marginTop: 10,
//     shadowColor: "#ffffff",
//     shadowOpacity: 0.4,
//     shadowRadius: 20,
//     shadowOffset: { width: 0, height: 10 },
//   },
//   avatar: {
//     width: 110,
//     height: 110,
//     borderRadius: 999,
//     borderWidth: 3,
//     borderColor: "rgba(255,255,255,0.5)",
//     resizeMode: "cover", // 👈 ensures image fits the circle
//   },
//   name: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "700",
//     textAlign: "center",
//     marginTop: 1,
//   },
//   email: {
//     color: "#dcdcdc",
//     fontSize: 14,
//     textAlign: "center",
//     // marginTop: 1,
//   },
//   card: {
//     backgroundColor: "rgba(255,255,255,0.05)",
//     borderRadius: 25,
//     padding: 20,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//   },
//   cardTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 12,
//     opacity: 0.9,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 14,
//     borderBottomWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//     paddingBottom: 8,
//   },
//   label: {
//     color: "#AAA",
//     fontSize: 14,
//   },
//   value: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   item: {
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//   },
//   itemText: {
//     color: "#fff",
//     fontSize: 15,
//   },
//   logoutButton: {
//     backgroundColor: "#ff4d4d",
//     paddingVertical: 15,
//     borderRadius: 20,
//     marginTop: 10,
//   },
//   logoutText: {
//     color: "#fff",
//     fontSize: 15,
//     textAlign: "center",
//     fontWeight: "600",
//   },
// });


// import React, { useContext, useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";
// import { AuthContext } from "../../Context/AuthContext"; // <-- your auth context path

// export default function ProfileScreen() {
//   // Replace with your local image
//   const profilePhoto = require("../../assets/profilephoto.jpeg");

//   const { user, isLoading } = useContext(AuthContext);
//   const [currentUser, setCurrentUser] = useState(user);

//   // Update currentUser whenever context user changes
//   useEffect(() => {
//     if (user) setCurrentUser(user);
//   }, [user]);
//     // Redirect if not logged in
//     useEffect(() => {
//       if (!isLoading && !user) {
//         router.replace("/(auth)/Auth");
//       }
//     }, [user, isLoading]);
  
//     // Logout function
//     const logout = async () => {
//       setCurrentUser(null);
//       await AsyncStorage.removeItem("user");
//       router.replace("/(auth)/Auth");
//     };

//   if (isLoading || !currentUser) {
//     return (
//       <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F0F0F" }}>
//         <Text style={{ color: "#fff" }}>Loading...</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#0F0F0F" }}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 120 }}
//       >
//         {/* TOP GRADIENT HEADER */}
//         <LinearGradient
//           colors={["#1E1E1E", "#3B3B98"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.header}
//         >
//           <Text style={styles.headerTitle}>My Profile</Text>

//           {/* PROFILE PHOTO */}
//           <View style={styles.avatarContainer}>
//             <Image source={profilePhoto} style={styles.avatar} />
//           </View>

//           <Text style={styles.name}>{currentUser.name}</Text>
//           <Text style={styles.email}>{currentUser.email}</Text>
//         </LinearGradient>

//         {/* DETAILS SECTION */}
//         <View style={{ marginTop: 70, paddingHorizontal: 20 }}>
//           <BlurView intensity={60} tint="dark" style={styles.card}>
//             <Text style={styles.cardTitle}>About Me</Text>

//             <View style={styles.row}>
//               <Text style={styles.label}>Role</Text>
//               <Text style={styles.value}>{currentUser.role || "Student"}</Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Department</Text>
//               <Text style={styles.value}>{currentUser.department || "Computer Science"}</Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Phone</Text>
//               <Text style={styles.value}>{currentUser.phone || "+92 300 1234567"}</Text>
//             </View>
//           </BlurView>

//           {/* SETTINGS CARD */}
//           <BlurView intensity={60} tint="dark" style={styles.card}>
//             <Text style={styles.cardTitle}>Account</Text>

//             <TouchableOpacity style={styles.item}>
//               <Text style={styles.itemText}>Edit Profile</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.item}>
//               <Text style={styles.itemText}>Change Password</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={[styles.item, { borderBottomWidth: 0 }]}>
//               <Text style={styles.itemText}>Notification Settings</Text>
//             </TouchableOpacity>
//           </BlurView>

//           {/* LOGOUT BUTTON */}
//           <TouchableOpacity onPress={logout} style={styles.logoutButton}>
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>

//           <View style={{ height: 40 }} />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     height: 260,
//     width: "100%",
//     borderBottomLeftRadius: 35,
//     borderBottomRightRadius: 35,
//     paddingTop: 40,
//     paddingHorizontal: 20,
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "600",
//     marginBottom: 15,
//   },
//   avatarContainer: {
//     alignSelf: "center",
//     marginTop: 10,
//     shadowColor: "#ffffff",
//     shadowOpacity: 0.4,
//     shadowRadius: 20,
//     shadowOffset: { width: 0, height: 10 },
//   },
//   avatar: {
//     width: 110,
//     height: 110,
//     borderRadius: 999,
//     borderWidth: 3,
//     borderColor: "rgba(255,255,255,0.5)",
//     resizeMode: "cover",
//   },
//   name: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "700",
//     textAlign: "center",
//     marginTop: 15,
//   },
//   email: {
//     color: "#dcdcdc",
//     fontSize: 14,
//     textAlign: "center",
//     marginTop: 4,
//   },
//   card: {
//     backgroundColor: "rgba(255,255,255,0.05)",
//     borderRadius: 25,
//     padding: 20,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//   },
//   cardTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 12,
//     opacity: 0.9,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 14,
//     borderBottomWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//     paddingBottom: 8,
//   },
//   label: {
//     color: "#AAA",
//     fontSize: 14,
//   },
//   value: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   item: {
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//   },
//   itemText: {
//     color: "#fff",
//     fontSize: 15,
//   },
//   logoutButton: {
//     backgroundColor: "#ff4d4d",
//     paddingVertical: 15,
//     borderRadius: 20,
//     marginTop: 10,
//   },
//   logoutText: {
//     color: "#fff",
//     fontSize: 15,
//     textAlign: "center",
//     fontWeight: "600",
//   },
// });



// import React, { useContext, useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { BlurView } from "expo-blur";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { AuthContext } from "../../Context/AuthContext"; // your auth context

// export default function ProfileScreen() {
//   const router = useRouter();

//   // Replace with your local image
//   const profilePhoto = require("../../assets/profilephoto.jpeg");

//   const { user, isLoading, logout: contextLogout } = useContext(AuthContext);
//   const [currentUser, setCurrentUser] = useState(user);

//   // Update currentUser whenever context user changes
//   useEffect(() => {
//     if (user) setCurrentUser(user);
//   }, [user]);

//   // Redirect if not logged in
//   useEffect(() => {
//     if (!isLoading && !user) {
//       router.replace("/(auth)/Auth");
//     }
//   }, [user, isLoading]);

//   // Use context logout function if available
//   const handleLogout = async () => {
//     if (contextLogout) {
//       await contextLogout();
//     }
//     setCurrentUser(null);
//     await AsyncStorage.removeItem("user");
//     router.replace("/(auth)/Auth");
//   };

//   if (isLoading || !currentUser) {
//     return (
//       <SafeAreaView
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "#0F0F0F",
//         }}
//       >
//         <Text style={{ color: "#fff" }}>Loading...</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#0F0F0F" }}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 120 }}
//       >
//         {/* TOP GRADIENT HEADER */}
//         <LinearGradient
//           colors={["#1E1E1E", "#3B3B98"]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={styles.header}
//         >
//           <Text style={styles.headerTitle}>My Profile</Text>

//           {/* PROFILE PHOTO */}
//           <View style={styles.avatarContainer}>
//             <Image source={profilePhoto} style={styles.avatar} />
//           </View>

//           <Text style={styles.name}>{currentUser.name}</Text>
//           <Text style={styles.email}>{currentUser.email}</Text>
//         </LinearGradient>

//         {/* DETAILS SECTION */}
//         <View style={{ marginTop: 70, paddingHorizontal: 20 }}>
//           <BlurView intensity={60} tint="dark" style={styles.card}>
//             <Text style={styles.cardTitle}>About Me</Text>

//             <View style={styles.row}>
//               <Text style={styles.label}>Role</Text>
//               <Text style={styles.value}>{currentUser.role || "Student"}</Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Department</Text>
//               <Text style={styles.value}>
//                 {currentUser.department || "Computer Science"}
//               </Text>
//             </View>

//             <View style={styles.row}>
//               <Text style={styles.label}>Phone</Text>
//               <Text style={styles.value}>
//                 {currentUser.phone || "+92 300 1234567"}
//               </Text>
//             </View>
//           </BlurView>

//           {/* SETTINGS CARD */}
//           <BlurView intensity={60} tint="dark" style={styles.card}>
//             <Text style={styles.cardTitle}>Account</Text>

//             <TouchableOpacity style={styles.item}>
//               <Text style={styles.itemText}>Edit Profile</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.item}>
//               <Text style={styles.itemText}>Change Password</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={[styles.item, { borderBottomWidth: 0 }]}>
//               <Text style={styles.itemText}>Notification Settings</Text>
//             </TouchableOpacity>
//           </BlurView>

//           {/* LOGOUT BUTTON */}
//           <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//             <Text style={styles.logoutText}>Logout</Text>
//           </TouchableOpacity>

//           <View style={{ height: 40 }} />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     height: 260,
//     width: "100%",
//     borderBottomLeftRadius: 35,
//     borderBottomRightRadius: 35,
//     paddingTop: 40,
//     paddingHorizontal: 20,
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "600",
//     marginBottom: 15,
//   },
//   avatarContainer: {
//     alignSelf: "center",
//     marginTop: 10,
//     shadowColor: "#ffffff",
//     shadowOpacity: 0.4,
//     shadowRadius: 20,
//     shadowOffset: { width: 0, height: 10 },
//   },
//   avatar: {
//     width: 110,
//     height: 110,
//     borderRadius: 999,
//     borderWidth: 3,
//     borderColor: "rgba(255,255,255,0.5)",
//     resizeMode: "cover",
//   },
//   name: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "700",
//     textAlign: "center",
//     marginTop: 15,
//   },
//   email: {
//     color: "#dcdcdc",
//     fontSize: 14,
//     textAlign: "center",
//     marginTop: 4,
//   },
//   card: {
//     backgroundColor: "rgba(255,255,255,0.05)",
//     borderRadius: 25,
//     padding: 20,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//   },
//   cardTitle: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 12,
//     opacity: 0.9,
//   },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 14,
//     borderBottomWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//     paddingBottom: 8,
//   },
//   label: {
//     color: "#AAA",
//     fontSize: 14,
//   },
//   value: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   item: {
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderColor: "rgba(255,255,255,0.08)",
//   },
//   itemText: {
//     color: "#fff",
//     fontSize: 15,
//   },
//   logoutButton: {
//     backgroundColor: "#ff4d4d",
//     paddingVertical: 15,
//     borderRadius: 20,
//     marginTop: 10,
//   },
//   logoutText: {
//     color: "#fff",
//     fontSize: 15,
//     textAlign: "center",
//     fontWeight: "600",
//   },
// });


import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { AuthContext } from "../../Context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoading, logout } = useContext(AuthContext);

 

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

          <Text style={styles.name}>{user.name || "Student Name"}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </LinearGradient>

        {/* DETAILS SECTION */}
        <View style={{ marginTop: 70, paddingHorizontal: 20 }}>
          <BlurView intensity={60} tint="dark" style={styles.card}>
            <Text style={styles.cardTitle}>About Me</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Role</Text>
              <Text style={styles.value}>{user.role || "Student"}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{user.phone || "+92 300 1234567"}</Text>
            </View>
          </BlurView>

          {/* SETTINGS CARD */}
          <BlurView intensity={60} tint="dark" style={styles.card}>
            <Text style={styles.cardTitle}>Account</Text>

            <TouchableOpacity style={styles.item}>
              <Text style={styles.itemText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item}>
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
});
