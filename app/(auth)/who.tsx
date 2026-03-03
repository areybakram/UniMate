import icons from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../Context/AuthContext";

const { width } = Dimensions.get("window");

const RoleCard = ({
  role,
  title,
  icon,
  image,
  onPress,
}: {
  role: string;
  title: string;
  icon: string;
  image: any;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={styles.cardContainer}
  >
    <BlurView intensity={80} tint="light" style={styles.blurCard}>
      <LinearGradient
        colors={["rgba(255,255,255,0.8)", "rgba(255,255,255,0.4)"]}
        style={styles.cardGradient}
      >
        <View style={styles.iconWrapper}>
          <Image source={image} style={styles.roleImage} resizeMode="contain" />
          <View style={styles.miniIconBadge}>
            <Ionicons name={icon as any} size={16} color="#60A5FA" />
          </View>
        </View>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleSubtitle}>Continue as {title}</Text>
      </LinearGradient>
    </BlurView>
  </TouchableOpacity>
);

const Who = () => {
  const { user, isLoading }: any = useContext(AuthContext) || {};

  useEffect(() => {
    if (!isLoading && user) {
      const userRole = user.role || "student";
      router.replace(`/(tabs)/${userRole.toLowerCase()}/Home` as any);
    }
  }, [user, isLoading]);

  if (isLoading) return null;

  return (
    <LinearGradient
      colors={["#F8FAFC", "#E2E8F0", "#CBD5E1"]}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to UniMate</Text>
          <Text style={styles.subtitle}>Choose your role to get started</Text>
        </View>

        <View style={styles.cardsWrapper}>
          <View style={styles.row}>
            <RoleCard
              role="student"
              title="Student"
              icon="school-outline"
              image={icons.student}
              onPress={() => router.push(`/(auth)/Auth?role=student`)}
            />
            <RoleCard
              role="teacher"
              title="Teacher"
              icon="briefcase-outline"
              image={icons.teacher}
              onPress={() => router.push(`/(auth)/Auth?role=teacher`)}
            />
          </View>

          <View style={styles.singleRow}>
            <RoleCard
              role="guard"
              title="Security Guard"
              icon="shield-checkmark-outline"
              image={icons.guard}
              onPress={() => router.push(`/(auth)/Auth?role=guard`)}
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
  },
  cardsWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  singleRow: {
    alignItems: "center",
  },
  cardContainer: {
    flex: 1,
    maxWidth: width * 0.45,
    minHeight: 180,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  blurCard: {
    flex: 1,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    position: "relative",
  },
  roleImage: {
    width: 50,
    height: 50,
  },
  miniIconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
  },
  roleSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
    textAlign: "center",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#94A3B8",
  },
});

export default Who;
