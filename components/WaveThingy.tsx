import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("screen");

import Svg, { Path } from "react-native-svg";

const _color = "#1E40AF";
// const _color = "#D71A45";
const _size = 100;

const WaveThingy = () => {
  const scales = [useSharedValue(1), useSharedValue(1), useSharedValue(1)];
  const opacities = [
    useSharedValue(0.3),
    useSharedValue(0.3),
    useSharedValue(0.3),
  ];

  useEffect(() => {
    scales.forEach((scale, i) => {
      scale.value = withDelay(
        i * 400,
        withRepeat(
          withTiming(4, {
            duration: 2000,
            easing: Easing.out(Easing.ease),
          }),
          -1,
          false
        )
      );
    });

    opacities.forEach((opacity, i) => {
      opacity.value = withDelay(
        i * 400,
        withRepeat(
          withTiming(0, {
            duration: 2000,
            easing: Easing.out(Easing.ease),
          }),
          -1,
          false
        )
      );
    });
  }, []);

  const animatedStyles = scales.map((scale, i) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacities[i].value,
    }))
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={[styles.dot, styles.center]}>
        {animatedStyles.map((style, i) => (
          <Animated.View
            key={i}
            style={[styles.dot, styles.absoluteFill, style]}
          />
        ))}
        {/* <Feather name="phone-outgoing" size={32} color="#fff" /> */}
        <Svg
          width="50"
          height="60"
          viewBox="0 0 50 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Path
            d="M39.1222 38.1406C41.7345 35.3968 43.4807 31.9522 44.145 28.2325C44.8094 24.5128 44.3627 20.6812 42.8603 17.2111C41.3579 13.7411 38.8655 10.7847 35.6913 8.70754C32.5171 6.63034 28.8002 5.52332 25 5.52332C21.1998 5.52332 17.4829 6.63034 14.3087 8.70754C11.1345 10.7847 8.64213 13.7411 7.13971 17.2111C5.63729 20.6812 5.19065 24.5128 5.85499 28.2325C6.51934 31.9522 8.26555 35.3968 10.8778 38.1406C12.3769 35.7626 14.4593 33.8024 16.9296 32.444C19.3999 31.0858 22.177 30.3739 25 30.3754C27.823 30.3739 30.6001 31.0858 33.0704 32.444C35.5407 33.8024 37.6231 35.7626 39.1222 38.1406ZM25 60L7.32223 42.4263C3.82595 38.9506 1.44496 34.5222 0.480357 29.7012C-0.484249 24.8803 0.0108523 19.8832 1.90305 15.342C3.79525 10.8007 6.99956 6.91928 11.1108 4.18843C15.222 1.45758 20.0555 0 25 0C29.9445 0 34.778 1.45758 38.8892 4.18843C43.0004 6.91928 46.2048 10.8007 48.097 15.342C49.9892 19.8832 50.4843 24.8803 49.5196 29.7012C48.555 34.5222 46.1741 38.9506 42.6778 42.4263L25 60ZM25 27.614C22.7899 27.614 20.6702 26.7412 19.1074 25.1876C17.5446 23.634 16.6667 21.5269 16.6667 19.3298C16.6667 17.1326 17.5446 15.0255 19.1074 13.4719C20.6702 11.9183 22.7899 11.0455 25 11.0455C27.2101 11.0455 29.3298 11.9183 30.8926 13.4719C32.4554 15.0255 33.3333 17.1326 33.3333 19.3298C33.3333 21.5269 32.4554 23.634 30.8926 25.1876C29.3298 26.7412 27.2101 27.614 25 27.614Z"
            fill="#fff"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  dot: {
    width: _size,
    height: _size,
    borderRadius: _size,
    backgroundColor: _color,
  },
  center: { alignItems: "center", justifyContent: "center" },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default WaveThingy;
