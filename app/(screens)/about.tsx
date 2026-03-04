import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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

const About = () => {
  const features = [
    {
      icon: "library-outline",
      title: "Global Library",
      desc: "Access approved study materials, past papers, and notes shared by your batchmates and teachers.",
    },
    {
      icon: "calendar-outline",
      title: "Smart Timetable",
      desc: "Stay organized with real-time schedule updates and automated class remainders for your specific batch.",
    },
    {
      icon: "checkmark-done-circle-outline",
      title: "Attendance Tracking",
      desc: "Keep a steady record of your presence in classes and stay on top of your academic performance.",
    },
    {
      icon: "chatbubbles-outline",
      title: "Personal AI Assistant",
      desc: "A smart chatbot designed to help you navigate campus life and academic queries instantly.",
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
            <Text style={styles.headerTitle}>About UniMate</Text>
            <View style={{ width: 40 }} />
          </View>

          <Animated.View
            entering={FadeInUp.delay(200)}
            style={styles.heroContainer}
          >
            <Ionicons name="school" size={60} color="#fff" />
            <Text style={styles.heroTitle}>Your Campus Companion</Text>
            <Text style={styles.heroSubTitle}>Version 1.0.0</Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.content}>
          {/* UniMate Intro */}
          <Animated.View
            entering={FadeInDown.delay(300)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>What is UniMate?</Text>
            <Text style={styles.paragraph}>
              UniMate is a comprehensive student facilitation system designed to
              streamline your university experience. Built specifically for
              COMSATS students, it bridges the gap between students and teachers
              by providing a centralized hub for all academic needs.
            </Text>
          </Animated.View>

          {/* Features Grid */}
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(400 + index * 100)}
                style={styles.featureCard}
              >
                <LinearGradient
                  colors={["rgba(45, 55, 72, 0.08)", "rgba(26, 32, 44, 0.03)"]}
                  style={styles.featureGradient}
                >
                  <Ionicons
                    name={feature.icon as any}
                    size={30}
                    color="#2D3748"
                  />
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.desc}</Text>
                </LinearGradient>
              </Animated.View>
            ))}
          </View>

          {/* COMSATS Info */}
          <Animated.View
            entering={FadeInDown.delay(800)}
            style={styles.universityCard}
          >
            <BlurView intensity={20} tint="light" style={styles.uniBlur}>
              <Text style={styles.uniTitle}>COMSATS University Islamabad</Text>
              <Text style={styles.uniTag}>Lahore Campus</Text>
              <Text style={styles.paragraph}>
                COMSATS University Islamabad (CUI) is a top-ranked public
                research university in Pakistan. The Lahore campus, known for
                its excellence in Computing, Engineering, and Management
                Sciences, provides a vibrant environment for over 10,000
                students.
              </Text>
              <TouchableOpacity
                style={styles.uniLink}
                onPress={() =>
                  Linking.openURL("https://share.google/7u7VcJev1TXAnK9f2")
                }
              >
                <Text style={styles.uniLinkText}>Visit Campus Website</Text>
                <Ionicons name="open-outline" size={16} color="#2D3748" />
              </TouchableOpacity>
            </BlurView>
          </Animated.View>

          <View style={styles.footer}>
            <Text style={styles.copyright}>
              © 2026 UniMate Team. All rights reserved.
            </Text>
            <Text style={styles.madeWith}>Crafted with ❤️ for COMSATS</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    height: 320,
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
    marginTop: 30,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
    textAlign: "center",
  },
  heroSubTitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 5,
  },
  content: {
    paddingHorizontal: 20,
    marginTop: -30,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 25,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: "#64748b",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  featureCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  featureGradient: {
    padding: 20,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 15,
    textAlign: "center",
  },
  featureDesc: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 16,
  },
  universityCard: {
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 30,
  },
  uniBlur: {
    padding: 25,
  },
  uniTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 2,
  },
  uniTag: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 15,
    textTransform: "uppercase",
  },
  uniLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    gap: 8,
  },
  uniLinkText: {
    color: "#2D3748",
    fontWeight: "bold",
    fontSize: 14,
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
  },
  copyright: {
    fontSize: 12,
    color: "#94a3b8",
  },
  madeWith: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 5,
  },
});
