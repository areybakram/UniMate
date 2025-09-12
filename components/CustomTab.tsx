// import React from "react";
// import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import Ionicons from "@expo/vector-icons/Ionicons";

// const CustomTabBar = ({ state, descriptors, navigation }) => {
//   const insets = useSafeAreaInsets();

//   return (
//     <View style={[styles.container, { paddingBottom: insets.bottom }]}>
//       {state.routes.map((route, index) => {
//         const { options } = descriptors[route.key];
//         const isFocused = state.index === index;

//         let IconName: keyof typeof Ionicons.glyphMap;
//         switch (route.name) {
//           case "Home":
//             IconName = "home-outline";
//             break;
//           case "Domains":
//             IconName = "globe-outline";
//             break;
//           case "Hosting":
//             IconName = "server-outline";
//             break;
//           case "Development":
//             IconName = "code-slash-outline";
//             break;
//           default:
//             IconName = "ellipse-outline";
//         }

//         const onPress = () => {
//           const event = navigation.emit({
//             type: "tabPress",
//             target: route.key,
//             canPreventDefault: true,
//           });
//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name);
//           }
//         };

//         return (
//           <TouchableOpacity
//             key={route.name}
//             onPress={onPress}
//             style={styles.tab}
//           >
//             <Ionicons
//               name={IconName}
//               size={24}
//               color={isFocused ? "#007bff" : "#888"}
//             />
//             <Text
//               style={{
//                 color: isFocused ? "#007bff" : "#888",
//                 fontSize: 12,
//               }}
//             >
//               {options.tabBarLabel ?? route.name}
//             </Text>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// };

// export default CustomTabBar;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     height: 60,
//   },
//   tab: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });


// the above is simple tabbar


// import React, { useEffect, useState } from "react";
// import Svg, { Path } from "react-native-svg";
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from "react-native-responsive-screen";

// import {
//   Text,
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   Keyboard,
//   Platform,
// } from "react-native";
// import { useRoute } from "@react-navigation/native";

// const HomeIcon = ({ width, height, color }) => {
//   return (
//     <View style={{ justifyContent: "center", alignItems: "center" }}>
//       <Svg
//         width={width}
//         height={height}
//         viewBox="0 0 24 24"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <Path
//           d="M9.44661 15.3975C9.11385 15.1508 8.64413 15.2206 8.39748 15.5534C8.15082 15.8862 8.22062 16.3559 8.55339 16.6025C9.5258 17.3233 10.715 17.75 12 17.75C13.285 17.75 14.4742 17.3233 15.4466 16.6025C15.7794 16.3559 15.8492 15.8862 15.6025 15.5534C15.3559 15.2206 14.8862 15.1508 14.5534 15.3975C13.825 15.9373 12.9459 16.25 12 16.25C11.0541 16.25 10.175 15.9373 9.44661 15.3975Z"
//           fill={color}
//         />
//         <Path
//           fillRule="evenodd"
//           clipRule="evenodd"
//           d="M12 1.25C11.2919 1.25 10.6485 1.45282 9.95055 1.79224C9.27585 2.12035 8.49642 2.60409 7.52286 3.20832L5.45628 4.4909C4.53509 5.06261 3.79744 5.5204 3.2289 5.95581C2.64015 6.40669 2.18795 6.86589 1.86131 7.46263C1.53535 8.05812 1.38857 8.69174 1.31819 9.4407C1.24999 10.1665 1.24999 11.0541 1.25 12.1672V13.7799C1.24999 15.6837 1.24998 17.1866 1.4027 18.3616C1.55937 19.567 1.88856 20.5401 2.63236 21.3094C3.37958 22.0824 4.33046 22.4277 5.50761 22.5914C6.64849 22.75 8.10556 22.75 9.94185 22.75H14.0581C15.8944 22.75 17.3515 22.75 18.4924 22.5914C19.6695 22.4277 20.6204 22.0824 21.3676 21.3094C22.1114 20.5401 22.4406 19.567 22.5973 18.3616C22.75 17.1866 22.75 15.6838 22.75 13.7799V12.1672C22.75 11.0541 22.75 10.1665 22.6818 9.4407C22.6114 8.69174 22.4646 8.05812 22.1387 7.46263C21.8121 6.86589 21.3599 6.40669 20.7711 5.95581C20.2026 5.5204 19.4649 5.06262 18.5437 4.49091L16.4771 3.20831C15.5036 2.60409 14.7241 2.12034 14.0494 1.79224C13.3515 1.45282 12.7081 1.25 12 1.25ZM8.27953 4.50412C9.29529 3.87371 10.0095 3.43153 10.6065 3.1412C11.1882 2.85833 11.6002 2.75 12 2.75C12.3998 2.75 12.8118 2.85833 13.3935 3.14119C13.9905 3.43153 14.7047 3.87371 15.7205 4.50412L17.7205 5.74537C18.6813 6.34169 19.3559 6.76135 19.8591 7.1467C20.3487 7.52164 20.6303 7.83106 20.8229 8.18285C21.0162 8.53589 21.129 8.94865 21.1884 9.58104C21.2492 10.2286 21.25 11.0458 21.25 12.2039V13.725C21.25 15.6959 21.2485 17.1012 21.1098 18.1683C20.9736 19.2163 20.717 19.8244 20.2892 20.2669C19.8649 20.7058 19.2871 20.9664 18.2858 21.1057C17.2602 21.2483 15.9075 21.25 14 21.25H10C8.09247 21.25 6.73983 21.2483 5.71422 21.1057C4.71286 20.9664 4.13514 20.7058 3.71079 20.2669C3.28301 19.8244 3.02642 19.2163 2.89019 18.1683C2.75149 17.1012 2.75 15.6959 2.75 13.725V12.2039C2.75 11.0458 2.75076 10.2286 2.81161 9.58104C2.87103 8.94865 2.98385 8.53589 3.17709 8.18285C3.36965 7.83106 3.65133 7.52164 4.14092 7.1467C4.6441 6.76135 5.31869 6.34169 6.27953 5.74537L8.27953 4.50412Z"
//           fill={color}
//         />
//       </Svg>
//     </View>
//   );
// };

// const DomainIcon = ({ width, height, color }) => {
//   return (
//     <View style={{ justifyContent: "center", alignItems: "center" }}>
//       <Svg
//         width={width}
//         height={height}
//         viewBox="0 0 20 20"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <Path
//           d="M10 0C10.918 0 11.8034 0.117188 12.6562 0.351562C13.5091 0.585938 14.3066 0.921224 15.0488 1.35742C15.791 1.79362 16.4648 2.31445 17.0703 2.91992C17.6758 3.52539 18.1966 4.20247 18.6328 4.95117C19.069 5.69987 19.4043 6.4974 19.6387 7.34375C19.873 8.1901 19.9935 9.07552 20 10C20 10.918 19.8828 11.8034 19.6484 12.6562C19.4141 13.5091 19.0788 14.3066 18.6426 15.0488C18.2064 15.791 17.6855 16.4648 17.0801 17.0703C16.4746 17.6758 15.7975 18.1966 15.0488 18.6328C14.3001 19.069 13.5026 19.4043 12.6562 19.6387C11.8099 19.873 10.9245 19.9935 10 20C9.08203 20 8.19661 19.8828 7.34375 19.6484C6.49089 19.4141 5.69336 19.0788 4.95117 18.6426C4.20898 18.2064 3.53516 17.6855 2.92969 17.0801C2.32422 16.4746 1.80339 15.7975 1.36719 15.0488C0.93099 14.3001 0.595703 13.5059 0.361328 12.666C0.126953 11.8262 0.00651042 10.9375 0 10C0 9.08203 0.117188 8.19661 0.351562 7.34375C0.585938 6.49089 0.921224 5.69336 1.35742 4.95117C1.79362 4.20898 2.31445 3.53516 2.91992 2.92969C3.52539 2.32422 4.20247 1.80339 4.95117 1.36719C5.69987 0.93099 6.49414 0.595703 7.33398 0.361328C8.17383 0.126953 9.0625 0.00651042 10 0ZM10 18.75C10.8008 18.75 11.5723 18.6458 12.3145 18.4375C13.0566 18.2292 13.7533 17.9362 14.4043 17.5586C15.0553 17.181 15.6478 16.722 16.1816 16.1816C16.7155 15.6413 17.1712 15.0521 17.5488 14.4141C17.9264 13.776 18.2227 13.0794 18.4375 12.3242C18.6523 11.569 18.7565 10.7943 18.75 10C18.75 9.19922 18.6458 8.42773 18.4375 7.68555C18.2292 6.94336 17.9362 6.24674 17.5586 5.5957C17.181 4.94466 16.722 4.35221 16.1816 3.81836C15.6413 3.28451 15.0521 2.82878 14.4141 2.45117C13.776 2.07357 13.0794 1.77734 12.3242 1.5625C11.569 1.34766 10.7943 1.24349 10 1.25C9.19922 1.25 8.42773 1.35417 7.68555 1.5625C6.94336 1.77083 6.24674 2.0638 5.5957 2.44141C4.94466 2.81901 4.35221 3.27799 3.81836 3.81836C3.28451 4.35872 2.82878 4.94792 2.45117 5.58594C2.07357 6.22396 1.77734 6.92057 1.5625 7.67578C1.34766 8.43099 1.24349 9.20573 1.25 10C1.25 10.8008 1.35417 11.5723 1.5625 12.3145C1.77083 13.0566 2.0638 13.7533 2.44141 14.4043C2.81901 15.0553 3.27799 15.6478 3.81836 16.1816C4.35872 16.7155 4.94792 17.1712 5.58594 17.5488C6.22396 17.9264 6.92057 18.2227 7.67578 18.4375C8.43099 18.6523 9.20573 18.7565 10 18.75ZM15.8301 10.1562L16.2988 8.75H17.0312L16.2012 11.25H15.4688L15 9.84375L14.5312 11.25H13.7988L12.9688 8.75H13.7012L14.1699 10.1562L14.6387 8.75H15.3613L15.8301 10.1562ZM11.2988 8.75H12.0312L11.2012 11.25H10.4688L10 9.84375L9.53125 11.25H8.79883L7.96875 8.75H8.70117L9.16992 10.1562L9.63867 8.75H10.3613L10.8301 10.1562L11.2988 8.75ZM6.29883 8.75H7.03125L6.20117 11.25H5.46875L5 9.84375L4.53125 11.25H3.79883L2.96875 8.75H3.70117L4.16992 10.1562L4.63867 8.75H5.36133L5.83008 10.1562L6.29883 8.75Z"
//           fill={color}
//         />
//       </Svg>
//     </View>
//   );
// };

// const HostingIcon = ({ width, height, color }) => {
//   return (
//     <View style={{ justifyContent: "center", alignItems: "center" }}>
//       <Svg
//         width={width}
//         height={height}
//         viewBox="0 0 18 18"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <Path
//           d="M4.5 0H0.9C0.661305 0 0.432387 0.0948211 0.263604 0.263604C0.0948211 0.432387 0 0.661305 0 0.9V17.1C0 17.3387 0.0948211 17.5676 0.263604 17.7364C0.432387 17.9052 0.661305 18 0.9 18H4.5C4.73869 18 4.96761 17.9052 5.1364 17.7364C5.30518 17.5676 5.4 17.3387 5.4 17.1V0.9C5.4 0.661305 5.30518 0.432387 5.1364 0.263604C4.96761 0.0948211 4.73869 0 4.5 0ZM2.7 17.1C2.34399 17.1 1.99598 16.9944 1.69997 16.7966C1.40396 16.5989 1.17325 16.3177 1.03702 15.9888C0.900779 15.6599 0.865133 15.298 0.934587 14.9488C1.00404 14.5997 1.17547 14.2789 1.42721 14.0272C1.67894 13.7755 1.99967 13.604 2.34884 13.5346C2.698 13.4651 3.05992 13.5008 3.38883 13.637C3.71774 13.7733 3.99886 14.004 4.19665 14.3C4.39443 14.596 4.5 14.944 4.5 15.3C4.5 15.7774 4.31036 16.2352 3.97279 16.5728C3.63523 16.9104 3.17739 17.1 2.7 17.1ZM4.5 9H0.9V0.9H4.5V9ZM3.6 15.3C3.6 15.478 3.54722 15.652 3.44832 15.8C3.34943 15.948 3.20887 16.0634 3.04441 16.1315C2.87996 16.1996 2.699 16.2174 2.52442 16.1827C2.34984 16.148 2.18947 16.0623 2.0636 15.9364C1.93774 15.8105 1.85202 15.6502 1.81729 15.4756C1.78257 15.301 1.80039 15.12 1.86851 14.9556C1.93663 14.7911 2.05198 14.6506 2.19999 14.5517C2.34799 14.4528 2.522 14.4 2.7 14.4C2.93869 14.4 3.16761 14.4948 3.3364 14.6636C3.50518 14.8324 3.6 15.0613 3.6 15.3ZM10.8 0H7.2C6.96131 0 6.73239 0.0948211 6.5636 0.263604C6.39482 0.432387 6.3 0.661305 6.3 0.9V17.1C6.3 17.3387 6.39482 17.5676 6.5636 17.7364C6.73239 17.9052 6.96131 18 7.2 18H10.8C11.0387 18 11.2676 17.9052 11.4364 17.7364C11.6052 17.5676 11.7 17.3387 11.7 17.1V0.9C11.7 0.661305 11.6052 0.432387 11.4364 0.263604C11.2676 0.0948211 11.0387 0 10.8 0ZM9 17.1C8.64399 17.1 8.29598 16.9944 7.99997 16.7966C7.70397 16.5989 7.47325 16.3177 7.33702 15.9888C7.20078 15.6599 7.16513 15.298 7.23459 14.9488C7.30404 14.5997 7.47547 14.2789 7.72721 14.0272C7.97894 13.7755 8.29967 13.604 8.64884 13.5346C8.998 13.4651 9.35992 13.5008 9.68883 13.637C10.0177 13.7733 10.2989 14.004 10.4966 14.3C10.6944 14.596 10.8 14.944 10.8 15.3C10.8 15.7774 10.6104 16.2352 10.2728 16.5728C9.93523 16.9104 9.47739 17.1 9 17.1ZM10.8 9H7.2V0.9H10.8V9ZM9.9 15.3C9.9 15.478 9.84722 15.652 9.74832 15.8C9.64943 15.948 9.50887 16.0634 9.34441 16.1315C9.17996 16.1996 8.999 16.2174 8.82442 16.1827C8.64984 16.148 8.48947 16.0623 8.3636 15.9364C8.23774 15.8105 8.15202 15.6502 8.11729 15.4756C8.08257 15.301 8.10039 15.12 8.16851 14.9556C8.23663 14.7911 8.35198 14.6506 8.49999 14.5517C8.64799 14.4528 8.822 14.4 9 14.4C9.23869 14.4 9.46761 14.4948 9.6364 14.6636C9.80518 14.8324 9.9 15.0613 9.9 15.3ZM17.1 0H13.5C13.2613 0 13.0324 0.0948211 12.8636 0.263604C12.6948 0.432387 12.6 0.661305 12.6 0.9V17.1C12.6 17.3387 12.6948 17.5676 12.8636 17.7364C13.0324 17.9052 13.2613 18 13.5 18H17.1C17.3387 18 17.5676 17.9052 17.7364 17.7364C17.9052 17.5676 18 17.3387 18 17.1V0.9C18 0.661305 17.9052 0.432387 17.7364 0.263604C17.5676 0.0948211 17.3387 0 17.1 0ZM15.3 17.1C14.944 17.1 14.596 16.9944 14.3 16.7966C14.004 16.5989 13.7733 16.3177 13.637 15.9888C13.5008 15.6599 13.4651 15.298 13.5346 14.9488C13.604 14.5997 13.7755 14.2789 14.0272 14.0272C14.2789 13.7755 14.5997 13.604 14.9488 13.5346C15.298 13.4651 15.6599 13.5008 15.9888 13.637C16.3177 13.7733 16.5989 14.004 16.7966 14.3C16.9944 14.596 17.1 14.944 17.1 15.3C17.1 15.7774 16.9104 16.2352 16.5728 16.5728C16.2352 16.9104 15.7774 17.1 15.3 17.1ZM17.1 9H13.5V0.9H17.1V9ZM16.2 15.3C16.2 15.478 16.1472 15.652 16.0483 15.8C15.9494 15.948 15.8089 16.0634 15.6444 16.1315C15.48 16.1996 15.299 16.2174 15.1244 16.1827C14.9498 16.148 14.7895 16.0623 14.6636 15.9364C14.5377 15.8105 14.452 15.6502 14.4173 15.4756C14.3826 15.301 14.4004 15.12 14.4685 14.9556C14.5366 14.7911 14.652 14.6506 14.8 14.5517C14.948 14.4528 15.122 14.4 15.3 14.4C15.5387 14.4 15.7676 14.4948 15.9364 14.6636C16.1052 14.8324 16.2 15.0613 16.2 15.3Z"
//           fill={color}
//         />
//       </Svg>
//     </View>
//   );
// };

// const DevelopmentIcon = ({ width, height, color }) => {
//   return (
//     <View style={{ justifyContent: "center", alignItems: "center" }}>
//       <Svg
//         width={width}
//         height={height}
//         viewBox="0 0 17 18"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <Path
//           d="M13.8581 0C14.0129 0.116129 14.0516 0.27097 14.0516 0.425809C14.0516 1.08387 14.0516 1.74194 14.0516 2.4C14.0516 2.47742 14.0516 2.51612 14.0516 2.63225C14.2064 2.63225 14.3613 2.63225 14.5161 2.63225C15.3677 2.67096 16.1032 3.44516 16.1419 4.25806C16.1419 4.72258 16.1419 5.14839 16.1419 5.6129C16.1419 8.12903 16.1419 10.6452 16.1419 13.2C16.1419 13.9742 15.8322 14.5161 15.1355 14.8645C14.9419 14.9806 14.671 15.0194 14.4387 15.0581C14.1677 15.0968 13.8968 15.0581 13.6258 15.0581C13.3935 15.0581 13.2387 14.9032 13.2387 14.7097C13.2387 14.5161 13.3935 14.3613 13.6645 14.3613C13.9742 14.3613 14.2839 14.3613 14.5935 14.3226C15.0581 14.2839 15.4452 13.8581 15.4839 13.3935C15.4839 13.1613 15.4839 12.929 15.4839 12.6581C10.5677 12.6581 5.69032 12.6581 0.774194 12.6581C0.774194 13.1613 0.696774 13.7032 1.16129 14.0903C1.39355 14.2839 1.66452 14.3226 1.93548 14.3226C4.83871 14.3226 7.74193 14.3226 10.6839 14.3226C10.7613 14.3226 10.8387 14.3226 10.9161 14.3226C11.071 14.3613 11.1871 14.4774 11.2258 14.6323C11.2258 14.7871 11.1484 14.9419 10.9548 14.9806C10.8774 14.9806 10.8 15.0194 10.7226 15.0194C10.4516 15.0194 10.1806 15.0194 9.87097 15.0194C9.87097 15.2903 9.87097 15.5613 9.87097 15.7935C10.1806 15.9097 10.4903 15.9871 10.7613 16.1419C11.2645 16.4516 11.5355 16.9161 11.5742 17.5355C11.6129 17.8452 11.4581 18 11.1484 18C9.90967 18 8.67096 18 7.43225 18C6.65806 18 5.84515 18 5.07096 18C4.68386 18 4.56774 17.8452 4.60645 17.4581C4.72258 16.6065 5.38064 15.9871 6.23225 15.9097C6.27096 15.9097 6.27096 15.9097 6.30967 15.9097C6.30967 15.6387 6.30967 15.3677 6.30967 15.0581C6.23225 15.0581 6.15483 15.0581 6.11612 15.0581C4.68387 15.0581 3.29032 15.0581 1.85806 15.0581C1.12258 15.0581 0.541935 14.7097 0.193548 14.0516C0.0774193 13.7806 0 13.5097 0 13.2C0 10.7613 0 8.28387 0 5.84516C0 5.38065 0 4.91613 0 4.49032C0 3.44516 0.735474 2.70968 1.78064 2.67097C1.85805 2.67097 1.97419 2.67097 2.09032 2.67097C2.09032 2.55484 2.09032 2.43871 2.09032 2.36129C2.09032 1.74194 2.09032 1.12258 2.09032 0.503221C2.09032 0.309673 2.12903 0.154841 2.28387 0.038712C6.11613 2.36207e-06 9.98709 0 13.8581 0Z"
//           fill={color}
//         />
//       </Svg>
//     </View>
//   );
// };

// const EmergencyIcon = ({ width, height, color }) => {
//   return (
//     <View style={{ justifyContent: "center", alignItems: "center" }}>
//       <Svg
//         width={width}
//         height={height}
//         viewBox="0 0 17 18"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <Path
//           d="M13.8581 0C14.0129 0.116129 14.0516 0.27097 14.0516 0.425809C14.0516 1.08387 14.0516 1.74194 14.0516 2.4C14.0516 2.47742 14.0516 2.51612 14.0516 2.63225C14.2064 2.63225 14.3613 2.63225 14.5161 2.63225C15.3677 2.67096 16.1032 3.44516 16.1419 4.25806C16.1419 4.72258 16.1419 5.14839 16.1419 5.6129C16.1419 8.12903 16.1419 10.6452 16.1419 13.2C16.1419 13.9742 15.8322 14.5161 15.1355 14.8645C14.9419 14.9806 14.671 15.0194 14.4387 15.0581C14.1677 15.0968 13.8968 15.0581 13.6258 15.0581C13.3935 15.0581 13.2387 14.9032 13.2387 14.7097C13.2387 14.5161 13.3935 14.3613 13.6645 14.3613C13.9742 14.3613 14.2839 14.3613 14.5935 14.3226C15.0581 14.2839 15.4452 13.8581 15.4839 13.3935C15.4839 13.1613 15.4839 12.929 15.4839 12.6581C10.5677 12.6581 5.69032 12.6581 0.774194 12.6581C0.774194 13.1613 0.696774 13.7032 1.16129 14.0903C1.39355 14.2839 1.66452 14.3226 1.93548 14.3226C4.83871 14.3226 7.74193 14.3226 10.6839 14.3226C10.7613 14.3226 10.8387 14.3226 10.9161 14.3226C11.071 14.3613 11.1871 14.4774 11.2258 14.6323C11.2258 14.7871 11.1484 14.9419 10.9548 14.9806C10.8774 14.9806 10.8 15.0194 10.7226 15.0194C10.4516 15.0194 10.1806 15.0194 9.87097 15.0194C9.87097 15.2903 9.87097 15.5613 9.87097 15.7935C10.1806 15.9097 10.4903 15.9871 10.7613 16.1419C11.2645 16.4516 11.5355 16.9161 11.5742 17.5355C11.6129 17.8452 11.4581 18 11.1484 18C9.90967 18 8.67096 18 7.43225 18C6.65806 18 5.84515 18 5.07096 18C4.68386 18 4.56774 17.8452 4.60645 17.4581C4.72258 16.6065 5.38064 15.9871 6.23225 15.9097C6.27096 15.9097 6.27096 15.9097 6.30967 15.9097C6.30967 15.6387 6.30967 15.3677 6.30967 15.0581C6.23225 15.0581 6.15483 15.0581 6.11612 15.0581C4.68387 15.0581 3.29032 15.0581 1.85806 15.0581C1.12258 15.0581 0.541935 14.7097 0.193548 14.0516C0.0774193 13.7806 0 13.5097 0 13.2C0 10.7613 0 8.28387 0 5.84516C0 5.38065 0 4.91613 0 4.49032C0 3.44516 0.735474 2.70968 1.78064 2.67097C1.85805 2.67097 1.97419 2.67097 2.09032 2.67097C2.09032 2.55484 2.09032 2.43871 2.09032 2.36129C2.09032 1.74194 2.09032 1.12258 2.09032 0.503221C2.09032 0.309673 2.12903 0.154841 2.28387 0.038712C6.11613 2.36207e-06 9.98709 0 13.8581 0Z"
//           fill={color}
//         />
//       </Svg>
//     </View>
//   );
// };

// const TabBar = (props) => {
//   const { state, descriptors, navigation } = props;
//   const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
//   const route = useRoute();

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       "keyboardDidShow",
//       () => {
//         setIsKeyboardOpen(true);
//       }
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//       "keyboardDidHide",
//       () => {
//         setIsKeyboardOpen(false);
//       }
//     );
//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   // Hide the TabBar when keyboard is open
//   if (isKeyboardOpen) {
//     return null;
//   }

//   // Define your routes - update these to match your actual screen names
//   const routes = [
//     {
//       name: "Home",
//       key: "Home-tab",
//       navigation: "HomeScreen", // Replace with your actual Home screen name
//     },
//     // {
//     //   name: "Emergency",
//     //   key: "Emergency-tab",
//     //   navigation: "EmergencyScreen", // Replace with your actual Home screen name
//     // },
//     {
//       name: "Domain",
//       key: "Domain-tab",
//       navigation: "DomainScreen", // Replace with your actual Domain screen name
//     },
//     {
//       name: "Hosting",
//       key: "Hosting-tab",
//       navigation: "HostingScreen", // Replace with your actual Hosting screen name
//     },
//     {
//       name: "Development",
//       key: "Development-tab",
//       navigation: "DevelopmentScreen", // Replace with your actual Development screen name
//     },
//   ];

//   return (
//     <View
//       style={{
//         position: "absolute",
//         bottom: Platform.OS === "ios" ? 20 : 10,
//         alignSelf: "center",
//       }}
//     >
//       <View style={styles.tabbar}>
//         {routes.map((route, index) => {
//           const label = route?.name;
//           const isFocused = state.index === index;

//           const onPress = () => {
//             const event = navigation.emit({
//               type: "tabPress",
//               target: route.key,
//               canPreventDefault: true,
//             });
//             if (!isFocused && !event.defaultPrevented) {
//               navigation.navigate(route.name);
//             }
//           };

//           const onLongPress = () => {
//             navigation.emit({
//               type: "tabLongPress",
//               target: route.key,
//             });
//           };

//           return (
//             <TouchableOpacity
//               key={route.key}
//               accessibilityRole="button"
//               accessibilityState={isFocused ? { selected: true } : {}}
//               onPress={onPress}
//               onLongPress={onLongPress}
//               style={{
//                 flex: 1,
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: 0,
//               }}
//             >
//               {/* Icons based on label */}
//               {label === "Home" && (
//                 <HomeIcon
//                   width={20}
//                   height={20}
//                   color={isFocused ? "#C3DDF4" : "#fff"}
//                 />
//               )}
//               {label === "Domain" && (
//                 <DomainIcon
//                   width={22}
//                   height={22}
//                   color={isFocused ? "#C3DDF4" : "#fff"}
//                 />
//               )}
//               {label === "Hosting" && (
//                 <HostingIcon
//                   width={20}
//                   height={20}
//                   color={isFocused ? "#C3DDF4" : "#fff"}
//                 />
//               )}

//                 {label === "Emergency" && (
//                 <EmergencyIcon
//                   width={20}
//                   height={20}
//                   color={isFocused ? "#C3DDF4" : "#fff"}
//                 />
//               )}
//               {label === "Development" && (
//                 <DevelopmentIcon
//                   width={20}
//                   height={20}
//                   color={isFocused ? "#C3DDF4" : "#fff"}
//                 />
//               )}
//               <Text
//                 allowFontScaling={false}
//                 style={{
//                   color: isFocused ? "#C3DDF4" : "#fff",
//                   fontSize: 10,
//                   fontFamily: "OldschoolGrotesk-CompactRegular",
//                   fontWeight: "900",
//                 }}
//               >
//                 {label}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   tabbar: {
//     flexDirection: "row",
//     backgroundColor: "#1d1d1d",


//     borderRadius: 100,
//     overflow: "hidden",
//     height: hp(7),
//     width: wp(95),
//     paddingHorizontal: 5,
//   },
// });

// export default TabBar;


import React, { useEffect, useState } from "react";
import Svg, { Path } from "react-native-svg";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Colors } from "@/utils/Constants";

const HomeIcon = ({ width, height, color }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M9.44661 15.3975C9.11385 15.1508 8.64413 15.2206 8.39748 15.5534C8.15082 15.8862 8.22062 16.3559 8.55339 16.6025C9.5258 17.3233 10.715 17.75 12 17.75C13.285 17.75 14.4742 17.3233 15.4466 16.6025C15.7794 16.3559 15.8492 15.8862 15.6025 15.5534C15.3559 15.2206 14.8862 15.1508 14.5534 15.3975C13.825 15.9373 12.9459 16.25 12 16.25C11.0541 16.25 10.175 15.9373 9.44661 15.3975Z"
          fill={color}
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 1.25C11.2919 1.25 10.6485 1.45282 9.95055 1.79224C9.27585 2.12035 8.49642 2.60409 7.52286 3.20832L5.45628 4.4909C4.53509 5.06261 3.79744 5.5204 3.2289 5.95581C2.64015 6.40669 2.18795 6.86589 1.86131 7.46263C1.53535 8.05812 1.38857 8.69174 1.31819 9.4407C1.24999 10.1665 1.24999 11.0541 1.25 12.1672V13.7799C1.24999 15.6837 1.24998 17.1866 1.4027 18.3616C1.55937 19.567 1.88856 20.5401 2.63236 21.3094C3.37958 22.0824 4.33046 22.4277 5.50761 22.5914C6.64849 22.75 8.10556 22.75 9.94185 22.75H14.0581C15.8944 22.75 17.3515 22.75 18.4924 22.5914C19.6695 22.4277 20.6204 22.0824 21.3676 21.3094C22.1114 20.5401 22.4406 19.567 22.5973 18.3616C22.75 17.1866 22.75 15.6838 22.75 13.7799V12.1672C22.75 11.0541 22.75 10.1665 22.6818 9.4407C22.6114 8.69174 22.4646 8.05812 22.1387 7.46263C21.8121 6.86589 21.3599 6.40669 20.7711 5.95581C20.2026 5.5204 19.4649 5.06262 18.5437 4.49091L16.4771 3.20831C15.5036 2.60409 14.7241 2.12034 14.0494 1.79224C13.3515 1.45282 12.7081 1.25 12 1.25ZM8.27953 4.50412C9.29529 3.87371 10.0095 3.43153 10.6065 3.1412C11.1882 2.85833 11.6002 2.75 12 2.75C12.3998 2.75 12.8118 2.85833 13.3935 3.14119C13.9905 3.43153 14.7047 3.87371 15.7205 4.50412L17.7205 5.74537C18.6813 6.34169 19.3559 6.76135 19.8591 7.1467C20.3487 7.52164 20.6303 7.83106 20.8229 8.18285C21.0162 8.53589 21.129 8.94865 21.1884 9.58104C21.2492 10.2286 21.25 11.0458 21.25 12.2039V13.725C21.25 15.6959 21.2485 17.1012 21.1098 18.1683C20.9736 19.2163 20.717 19.8244 20.2892 20.2669C19.8649 20.7058 19.2871 20.9664 18.2858 21.1057C17.2602 21.2483 15.9075 21.25 14 21.25H10C8.09247 21.25 6.73983 21.2483 5.71422 21.1057C4.71286 20.9664 4.13514 20.7058 3.71079 20.2669C3.28301 19.8244 3.02642 19.2163 2.89019 18.1683C2.75149 17.1012 2.75 15.6959 2.75 13.725V12.2039C2.75 11.0458 2.75076 10.2286 2.81161 9.58104C2.87103 8.94865 2.98385 8.53589 3.17709 8.18285C3.36965 7.83106 3.65133 7.52164 4.14092 7.1467C4.6441 6.76135 5.31869 6.34169 6.27953 5.74537L8.27953 4.50412Z"
          fill={color}
        />
      </Svg>
    </View>
  );
};

const NotesIcon = ({ width, height, color }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M8 12H16M8 8H16M8 16H12"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
          stroke={color}
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
};

const TimetableIcon = ({ width, height, color }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
          stroke={color}
          strokeWidth="2"
        />
        <Path
          d="M16 2V6M8 2V6M3 10H21"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M8 14H8.01M12 14H12.01M16 14H16.01M8 18H8.01M12 18H12.01M16 18H16.01"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const ProfileIcon = ({ width, height, color }) => {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
          stroke={color}
          strokeWidth="2"
        />
        <Path
          d="M20 20C20 18.3431 16.4183 17 12 17C7.58172 17 4 18.3431 4 20"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

const TabBar = (props) => {
  const { state, descriptors, navigation } = props;
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const route = useRoute();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardOpen(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardOpen(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Hide the TabBar when keyboard is open
  if (isKeyboardOpen) {
    return null;
  }

  // Define your routes - update these to match your actual screen names
  const routes = [
    {
      name: "Home",
      key: "Home-tab",
      navigation: "Home", // Replace with your actual Home screen name
    },
    {
      name: "Notes",
      key: "Notes-tab",
      navigation: "Notes", // Replace with your actual Notes screen name
    },
    {
      name: "Timetable",
      key: "Timetable-tab",
      navigation: "Timetable", // Replace with your actual Timetable screen name
    },
    {
      name: "Profile",
      key: "Profile-tab",
      navigation: "Profile", // Replace with your actual Profile screen name
    },
  ];

  return (
    <View
      style={{
        position: "absolute",
        bottom: Platform.OS === "ios" ? 20 : 10,
        alignSelf: "center",
      }}
    >
      <View style={styles.tabbar}>
        {routes.map((route, index) => {
          const label = route?.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              {/* Icons based on label */}
              {label === "Home" && (
                <HomeIcon
                  width={20}
                  height={20}
                  color={isFocused ? "#C3DDF4" : "#fff"}
                />
              )}
              {label === "Notes" && (
                <NotesIcon
                  width={20}
                  height={20}
                  color={isFocused ? "#C3DDF4" : "#fff"}
                />
              )}
              {label === "Timetable" && (
                <TimetableIcon
                  width={20}
                  height={20}
                  color={isFocused ? "#C3DDF4" : "#fff"}
                />
              )}
              {label === "Profile" && (
                <ProfileIcon
                  width={20}
                  height={20}
                  color={isFocused ? "#C3DDF4" : "#fff"}
                />
              )}
              <Text
                allowFontScaling={false}
                style={{
                  color: isFocused ? "#C3DDF4" : "#fff",
                  fontSize: 10,
                  fontFamily: "OldschoolGrotesk-CompactRegular",
                  fontWeight: "900",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    // backgroundColor: "#1d1d1d",
    // backgroundColor: "#1E2A3A",
    backgroundColor: Colors.tabbar,

    
    borderRadius: 100,
    overflow: "hidden",
    height: hp(7),
    width: wp(95),
    paddingHorizontal: 5,
  },
});

export default TabBar;