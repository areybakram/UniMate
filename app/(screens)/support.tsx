import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  Dimensions,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const Support = () => {
  const supportPhone = "+923216955693";
  const supportEmail = "support@unimate.edu.pk";
  const whatsappNumber = "923216955693";

  const handleCall = () => Linking.openURL(`tel:${supportPhone}`);
  const handleEmail = () => Linking.openURL(`mailto:${supportEmail}`);
  const handleWhatsApp = () =>
    Linking.openURL(
      `whatsapp://send?phone=${whatsappNumber}&text=Hello UniMate Support, I need help with...`,
    );

  const faqs = [
    {
      q: "How do I upload a document?",
      a: "Go to the Global Library and click the '+' button. Fill in the details and upload your file. It will be visible once a teacher approves it.",
    },
    {
      q: "Why is my document still pending?",
      a: "Documents require verification by the assigned teacher. Please ensure you entered the correct teacher email during upload.",
    },
    {
      q: "How can I update my profile?",
      a: "Navigate to the Profile tab and click 'Edit Profile Info' to update your name or phone number.",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <LinearGradient
          colors={["#1A202C", "#2D3748"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerNav}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Help & Support</Text>
            <View style={{ width: 40 }} />
          </View>

          <Animated.View
            entering={FadeInUp.delay(200)}
            style={styles.heroContainer}
          >
            <View style={styles.iconCircle}>
              <Ionicons name="headset-outline" size={50} color="#fff" />
            </View>
            <Text style={styles.heroTitle}>How can we help you?</Text>
            <Text style={styles.heroSubTitle}>
              We're here to support your journey
            </Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionLabel}>Quick Contact</Text>

          <Animated.View
            entering={FadeInDown.delay(300)}
            style={styles.contactContainer}
          >
            <TouchableOpacity
              style={styles.contactCard}
              onPress={handleWhatsApp}
            >
              <LinearGradient
                colors={["#25D366", "#128C7E"]}
                style={styles.contactGradient}
              >
                <Ionicons name="logo-whatsapp" size={30} color="#fff" />
                <Text style={styles.contactText}>WhatsApp</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={handleCall}>
              <LinearGradient
                colors={["#2D3748", "#1A202C"]}
                style={styles.contactGradient}
              >
                <Ionicons name="call" size={30} color="#fff" />
                <Text style={styles.contactText}>Call Support</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400)}
            style={styles.emailCard}
          >
            <TouchableOpacity style={styles.emailInner} onPress={handleEmail}>
              <View style={styles.emailLeft}>
                <View style={styles.emailIconBox}>
                  <Ionicons name="mail" size={24} color="#2D3748" />
                </View>
                <View>
                  <Text style={styles.emailLabel}>Email us at</Text>
                  <Text style={styles.emailValue}>{supportEmail}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>

          <View style={styles.faqList}>
            {faqs.map((faq, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(500 + index * 100)}
                style={styles.faqCard}
              >
                <Text style={styles.faqQuestion}>{faq.q}</Text>
                <Text style={styles.faqAnswer}>{faq.a}</Text>
              </Animated.View>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Available Mon-Fri, 9:00 AM - 5:00 PM
            </Text>
            {/* <Text style={styles.versionText}>UniMate Support v1.0</Text> */}
            <Text
              style={[styles.versionText, { marginTop: 4, fontWeight: "600" }]}
            >
              Crafted with ❤️ by Team UniMate
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    height: 300,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  heroContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
  },
  heroSubTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 5,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 15,
    marginLeft: 5,
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  contactCard: {
    width: (width - 55) / 2,
    borderRadius: 22,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  contactGradient: {
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  contactText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  emailCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    marginBottom: 30,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  emailInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
  },
  emailLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  emailIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  emailLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  emailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e293b",
  },
  faqList: {
    gap: 15,
  },
  faqCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    marginTop: 40,
    gap: 5,
  },
  footerText: {
    fontSize: 12,
    color: "#94a3b8",
  },
  versionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#cbd5e1",
  },
});
