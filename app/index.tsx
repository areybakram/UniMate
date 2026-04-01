// Onboarding / Share Live Location screen
import CommonButton from "@/components/CommonButton";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import icons from "../constants/icons";
import { useLocation } from "../Context/LocationContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const FEATURES = [
  { icon: "map-marker-path", label: "Campus Navigation" },
  { icon: "alert-octagon-outline", label: "Emergency Alerts" },
  { icon: "shield-account-outline", label: "Guard Tracking" },
];

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
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* ── Dark hero section ── */}
      <LinearGradient
        colors={["#1e293b", "#334155"]}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.heroInner} edges={["top"]}>
          {/* Decorative circles */}
          <View style={[styles.circle, styles.circleLarge]} />
          <View style={[styles.circle, styles.circleSmall]} />

          {/* Logo */}
          <Animated.View
            entering={ZoomIn.delay(100).duration(500)}
            style={styles.logoWrap}
          >
            <View style={styles.logoRing}>
              <View style={styles.logoCard}>
                <Image
                  source={icons.comsats}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
            </View>
          </Animated.View>

          {/* Branding */}
          <Animated.View
            entering={FadeInDown.delay(300)}
            style={styles.brandBlock}
          >
            <Text style={styles.appName}>UniMate</Text>
            <Text style={styles.tagline}>Smart Campus Companion</Text>
          </Animated.View>

          {/* Feature pills */}
          <Animated.View
            entering={FadeInDown.delay(450)}
            style={styles.pillsRow}
          >
            {FEATURES.map((f) => (
              <View key={f.label} style={styles.pill}>
                <MaterialCommunityIcons
                  name={f.icon as any}
                  size={14}
                  color="#CBD5E0"
                />
                <Text style={styles.pillText}>{f.label}</Text>
              </View>
            ))}
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── White CTA card ── */}
      <Animated.View
        entering={FadeInUp.delay(300).duration(500)}
        style={styles.card}
      >
        {/* Location icon badge */}
        <View style={styles.iconRing}>
          <View style={styles.iconBadge}>
            <Ionicons name="location" size={28} color="#fff" />
          </View>
        </View>

        <Text style={styles.cardHeadline}>Enable Location Access</Text>
        <Text style={styles.cardSubtitle}>
          UniMate uses your location to guide you around campus and assist
          security teams in real time.
        </Text>

        {/* CTA */}
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

        {/* Trust line */}
        <View style={styles.trustRow}>
          <Ionicons name="lock-closed-outline" size={12} color="#94A3B8" />
          <Text style={styles.trustText}>
            Used only within campus · Never shared externally
          </Text>
        </View>

        {/* University name */}
        <Text style={styles.university}>COMSATS University Islamabad</Text>

        {/* Footer signature */}
        <View style={styles.signatureRow}>
          <Text style={styles.signatureText}>Crafted with ❤️ by Team UniMate</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  /* Hero */
  hero: {
    height: SCREEN_HEIGHT * 0.52,
    overflow: "hidden",
  },
  heroInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 24,
  },

  /* Decorative background circles */
  circle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  circleLarge: {
    width: 300,
    height: 300,
    top: -80,
    right: -80,
  },
  circleSmall: {
    width: 180,
    height: 180,
    bottom: -40,
    left: -40,
  },

  /* Logo */
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoRing: {
    width: 108,
    height: 108,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  logoCard: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },

  /* Branding */
  brandBlock: {
    alignItems: "center",
    gap: 4,
  },
  appName: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  /* Feature pills */
  pillsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 4,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  pillText: {
    fontSize: 11,
    color: "#CBD5E0",
    fontWeight: "600",
  },

  /* Card */
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 24,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 12,
  },

  /* Location badge */
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#2D3748",
    justifyContent: "center",
    alignItems: "center",
  },

  cardHeadline: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  loader: {
    marginVertical: 8,
  },
  button: {
    width: "88%",
    height: 50,
    borderRadius: 14,
    backgroundColor: "#2D3748",
    alignSelf: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  /* Trust row */
  trustRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  trustText: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
  },

  /* Footer */
  university: {
    fontSize: 11,
    color: "#CBD5E0",
    fontWeight: "600",
    letterSpacing: 0.4,
    marginTop: 4,
  },
  signatureRow: {
    marginTop: 'auto',
    marginBottom: 5,
    opacity: 0.8,
  },
  signatureText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 5,
    // textTransform: "uppercase",
  },
});

export default OnBoarding;
