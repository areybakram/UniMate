// import { StatusBar, StyleSheet, Text, View } from "react-native";
// import React, { useContext } from "react";
// import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
// import AntDesign from "@expo/vector-icons/AntDesign";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
// import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
// import { Colors } from "@/utils/Constants";
// import { TouchableOpacity } from "react-native";
// import { RFValue } from "react-native-responsive-fontsize";
// // import { AuthContext } from "@/Context/AuthContext";
// import { useDrawer } from "../Context/DrawerContext";
// import { router } from "expo-router";
// // import { resetAndNavigate } from "@/utils/Helpers";
// // import useCartStore from "@/basketStore";

// const CustomDrawer = ({ active }: any) => {
//   const { closeDrawer } = useDrawer();
//   // const { clearCart } = useCartStore();

//   // const { logout } = useContext(AuthContext);
//   const logoutPress = () => {
//     clearCart();
//     closeDrawer();
//     active.value = false;
//     logout();
//     router.push("/(auth)/StudentSignIn");
//   };
//   return (
//     <View style={styles.container}>
//       <View style={styles.contentContainer}>
//         {/* <View style={styles.containerProfile}>
//           <FontAwesome5 name="user-circle" size={24} color={Colors.texttwo} />
//           <View>
//             <Text
//               style={{
//                 fontSize: RFValue(17),
//                 fontFamily: "BarlowRegular",
//                 fontWeight: "400",
//                 color: Colors.texttwo,
//               }}
//             >
//               Hot N’ Fast
//             </Text>
//           </View>
//         </View> */}
//         <TouchableOpacity
//           accessibilityRole="button"
//           accessibilityState={{ selected: true }}
//           style={styles.lablecontainer}
//           // onPress={() => {
//           //   router.push("./");
//           // }}
//         >
//           <FontAwesome5 name="user-circle" size={24} color={Colors.texttwo} />
//           <Text allowFontScaling={false} style={styles.textName}>
//             Profile
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           accessibilityRole="button"
//           accessibilityState={{ selected: true }}
//           style={styles.lablecontainer}
//           // onPress={() => {
//           //   resetAndNavigate("/(tabs)/orders");
//           // }}
//         >
//           <MaterialCommunityIcons
//             name="cart-arrow-down"
//             size={25}
//             color={Colors.texttwo}
//           />
//           <Text allowFontScaling={false} style={styles.textName}>
//             Navigation
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           accessibilityRole="button"
//           accessibilityState={{ selected: true }}
//           style={styles.lablecontainer}
//         >
//           <MaterialIcons name="local-offer" size={24} color={Colors.texttwo} />
//           <Text allowFontScaling={false} style={styles.textName}>
//             Emergency
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           accessibilityRole="button"
//           accessibilityState={{ selected: true }}
//           style={styles.lablecontainer}
//         >
//           <Ionicons
//             name="document-text-outline"
//             size={24}
//             color={Colors.texttwo}
//           />
//           <Text allowFontScaling={false} style={styles.textName}>
//             Privacy policy
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           accessibilityRole="button"
//           accessibilityState={{ selected: true }}
//           style={styles.lablecontainer}
//         >
//           <MaterialCommunityIcons
//             name="security"
//             size={24}
//             color={Colors.texttwo}
//           />
//           <Text allowFontScaling={false} style={styles.textName}>
//             Support
//           </Text>
//         </TouchableOpacity>
//       </View>
//       <TouchableOpacity
//         style={styles.containerdeleted}
//         onPress={() => {
//           logoutPress();
//         }}
//       >
//         <Text allowFontScaling={false} style={styles.logOutText}>
//           Sign-out
//         </Text>
//         <AntDesign
//           name="arrowright"
//           size={24}
//           color={Colors.texttwo}
//           style={{ paddingTop: "1%" }}
//         />
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: Colors.primary,
//     zIndex: -9999,
//   },
//   contentContainer: {
//     paddingTop: "20%",
//     marginHorizontal: "5%",
//     flex: 0.89,
//     maxWidth: 180,
//   },
//   containerProfile: {
//     gap: 14,
//     paddingBottom: "10%",
//     borderBottomWidth: 1,
//     borderBottomColor: "#F4F4F8",
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   lablecontainer: {
//     flexDirection: "row",
//     gap: 14,
//     alignItems: "center",
//     borderBottomWidth: 1,
//     borderBottomColor: "#F4F4F8",
//   },
//   imageProfile: {
//     width: 48,
//     height: 48,
//   },
//   divider: {
//     width: "100%",
//   },
//   textName: {
//     fontSize: RFValue(17),
//     fontFamily: "BarlowRegular",
//     fontWeight: "400",
//     color: Colors.texttwo,
//     paddingBottom: "12%",
//     paddingTop: "12%",
//   },
//   containerdeleted: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 14,
//     marginHorizontal: "5%",
//   },
//   logOutText: {
//     fontSize: RFValue(17),
//     fontFamily: "BarlowRegular",
//     fontWeight: "400",
//     color: Colors.texttwo,
//   },
// });

// export default CustomDrawer;

import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Colors } from "@/utils/Constants";
import { RFValue } from "react-native-responsive-fontsize";
import { useDrawer } from "@/Context/DrawerContext";

const CustomDrawer = ({ active }: any) => {
  const { closeDrawer } = useDrawer();

  const logoutPress = () => {
    active.value = false;
    closeDrawer();
    // router.push("/(auth)/StudentSignIn");
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.lablecontainer}>
          <FontAwesome5 name="user-circle" size={24} color={Colors.texttwo} />
          <Text style={styles.textName}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.lablecontainer}>
          <MaterialCommunityIcons
            name="map-marker"
            size={25}
            color={Colors.texttwo}
          />
          <Text style={styles.textName}>Navigation</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.lablecontainer}>
          <MaterialIcons name="local-offer" size={24} color={Colors.texttwo} />
          <Text style={styles.textName}>Emergency</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.lablecontainer}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color={Colors.texttwo}
          />
          <Text style={styles.textName}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.lablecontainer}>
          <MaterialCommunityIcons
            name="security"
            size={24}
            color={Colors.texttwo}
          />
          <Text style={styles.textName}>Support</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.containerdeleted}
        onPress={logoutPress}
      >
        <Text style={styles.logOutText}>Sign-out</Text>
        <AntDesign
          name="arrowright"
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
});

export default CustomDrawer;
