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


import {
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawer from "../../components/customDrawer";
import { useDrawer } from "@/Context/DrawerContext";

const { width } = Dimensions.get("screen");

const Home: React.FC = () => {
  const { closeDrawer } = useDrawer();
  const active = useSharedValue(false);

  const progress = useDerivedValue(() => {
    return withTiming(active.value ? 1 : 0);
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 1000 },
        { scale: active.value ? withTiming(0.85) : withTiming(1) },
        {
          translateX: active.value ? withSpring(240) : withTiming(0),
        },
      ],
      borderRadius: active.value ? withTiming(20) : withTiming(0),
    };
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Drawer stays behind */}
      <CustomDrawer active={active} />

      {/* Main screen */}
      <Animated.View style={[{ flex: 1, backgroundColor: "#fff" }, animatedStyle]}>
        <Pressable
          style={{ flex: 1 }}
          disabled={!active.value} // only active when drawer is open
          onPress={() => {
            active.value = false;
            closeDrawer();
          }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => (active.value = !active.value)}>
              <Ionicons name="menu" size={28} color="#000" />
            </Pressable>
            <Text style={styles.title}>Home</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.bodyText}>
              Welcome to Student Facilitation System 🎓
            </Text>
          </View>
        </Pressable>
      </Animated.View>

      <StatusBar backgroundColor={"#ffffff"} barStyle="dark-content" />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginLeft: 12,
    fontWeight: "600",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyText: {
    fontSize: 18,
    fontWeight: "400",
  },
});
