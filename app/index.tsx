// // // onbarding screen after splash screen. can make it as a splash screen later if needed

// // import { View, Text, Image, TouchableOpacity } from 'react-native'
// // import '../global.css'
// // import React from 'react'
// // import { Link, router } from 'expo-router'
// // import { SafeAreaView } from 'react-native-safe-area-context'
// // import icons from '../constants/icons'
// // import CommonButton from '@/components/CommonButton'
// // import WaveThingy from '@/components/WaveThingy'

// // const onBoarding = () => {
// //   return (
// //     <SafeAreaView>
// //       <View>

// //         <View>
// //           <Image
// //           source={icons.blueelipse}
// //           className='w-full h-50%'
// //           resizeMode='cover'
// //           />
// //         </View>

// //         {/* <View>
// //           <Image
// //           source={icons.comsats}
// //           className='-mt-28 items-center justify-center self-center'/>
// //         </View> */}

// //         <View>
// //           <WaveThingy/>
// //           <Image
// //           source={icons.comsats}
// //           className='-mt-28 items-center justify-center self-center'/>
// //         </View>

// //         <View className="items-center justify-center mt-10 space-y-3">
// //           <Text className="font-pmedium text-4xl leading-tight">To Get Started</Text>
// //           <Text className="font-pregular text-xs leading-tight">Allow Location Access</Text>
// //         </View>

// //         <CommonButton
// //          text='Share live location'
// //          textStyle={{color:'black', fontSize:16,}}
// //          buttonStyle={{justifyContent:'center', alignItems:'center' , alignSelf:'center', marginTop:130 , width:'69%' ,}}
// //          onPress={()=>router.push('/who')}/>

// //          <View className="mt-5">
// //           <Text className="mt-1 text-xs font-pthin italic text-center">Enable location to assist with navigation and</Text>
// //           <Text className="mt-1 text-xs font-pthin italic text-center">enhance campus security response</Text>
// //          </View>

// //       </View>

// //     </SafeAreaView>
// //   )
// // }

// // export default onBoarding

// import React, { useContext, useEffect } from 'react';
// import { View, Text, Image } from 'react-native';
// import '../global.css';
// import { router } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import icons from '../constants/icons';
// import CommonButton from '@/components/CommonButton';
// import WaveThingy from '@/components/WaveThingy';
// import { AuthContext } from '../Context/AuthContext'; // 👈 Import your context

// const OnBoarding = () => {
//   const { user } = useContext(AuthContext); // 👈 Access the logged-in user

//   useEffect(() => {
//     // If already logged in, skip onboarding
//     if (user) {
//       router.replace('/(tabs)/Home'); // 👈 Change this to your actual main screen
//     }
//   }, [user]);

//   return (
//     <SafeAreaView>
//       <View>
//         <View>
//           <Image
//             source={icons.blueelipse}
//             className="w-full h-50%"
//             resizeMode="cover"
//           />
//         </View>

//         <View>
//           <WaveThingy />
//           <Image
//             source={icons.comsats}
//             className="-mt-28 items-center justify-center self-center"
//           />
//         </View>

//         <View className="items-center justify-center mt-10 space-y-3">
//           <Text className="font-pmedium text-4xl leading-tight">To Get Started</Text>
//           <Text className="font-pregular text-xs leading-tight">
//             Allow Location Access
//           </Text>
//         </View>

//         <CommonButton
//           text="Share live location"
//           textStyle={{ color: 'black', fontSize: 16 }}
//           buttonStyle={{
//             justifyContent: 'center',
//             alignItems: 'center',
//             alignSelf: 'center',
//             marginTop: 130,
//             width: '69%',
//           }}
//           onPress={() => router.push('/who')}
//         />

//         <View className="mt-5">
//           <Text className="mt-1 text-xs font-pthin italic text-center">
//             Enable location to assist with navigation and
//           </Text>
//           <Text className="mt-1 text-xs font-pthin italic text-center">
//             enhance campus security response
//           </Text>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default OnBoarding;

import CommonButton from "@/components/CommonButton";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../constants/icons";
import { useLocation } from "../Context/LocationContext";

const OnBoarding = () => {
  const { fetchUserLocation } = useLocation();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(false);
    }, []),
  );

  const handleShareLocation = async () => {
    setLoading(true);
    await fetchUserLocation();
    router.push("/(auth)/who");
  };

  return (
    <LinearGradient colors={["#F8FAFC", "#E2E8F0"]} style={styles.background}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Logo area */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.logoArea}>
          <View style={styles.logoCard}>
            <Image
              source={icons.comsats}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>UniMate</Text>
          <Text style={styles.tagline}>Your Smart Campus Companion</Text>
        </Animated.View>

        {/* Content card */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.card}>
          {/* Icon badge */}
          <View style={styles.iconBadge}>
            <Ionicons name="location" size={28} color="#2D3748" />
          </View>

          <Text style={styles.headline}>Enable Location</Text>
          <Text style={styles.subtitle}>
            Allow UniMate to access your location to assist with campus
            navigation and enhance security response.
          </Text>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2D3748"
              style={styles.loader}
            />
          ) : (
            <CommonButton
              text="Share Live Location"
              iconName="location-outline"
              textStyle={styles.buttonText}
              buttonStyle={styles.button}
              onPress={handleShareLocation}
            />
          )}

          <Text style={styles.disclaimer}>
            Your location is only used within the campus for your safety.
          </Text>
        </Animated.View>

        {/* Footer */}
        <Animated.Text entering={FadeInUp.delay(500)} style={styles.footer}>
          COMSATS University Islamabad
        </Animated.Text>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 28,
  },
  logoArea: {
    alignItems: "center",
    gap: 8,
  },
  logoCard: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 4,
  },
  logo: {
    width: 64,
    height: 64,
  },
  appName: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1E293B",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  card: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
    gap: 12,
  },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  headline: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 4,
  },
  loader: {
    marginTop: 8,
    marginBottom: 8,
  },
  button: {
    width: "85%",
    height: 48,
    borderRadius: 14,
    backgroundColor: "#2D3748",
    alignSelf: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
  },
  disclaimer: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 4,
  },
  footer: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});

export default OnBoarding;
