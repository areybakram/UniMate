import CommonButton from "@/components/CommonButton";
import { Colors } from "@/utils/Constants";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  Layout,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as yup from "yup";
import { AuthContext } from "../../Context/AuthContext";

const { width } = Dimensions.get("window");

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const registerSchema = yup.object().shape({
  fullName: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{12}$/, "Phone Number must be 12 digits (e.g. 923...)")
    .required("Phone Number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const InputField = ({
  control,
  name,
  placeholder,
  icon,
  secureTextEntry = false,
  keyboardType = "default",
  maxLength,
  error,
}: any) => (
  <View style={styles.inputWrapper}>
    <View style={[styles.inputContainer, error && styles.inputError]}>
      <Ionicons
        name={icon}
        size={20}
        color={error ? "#EF4444" : "#64748B"}
        style={styles.inputIcon}
      />
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#94A3B8"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            maxLength={maxLength}
            autoCapitalize="none"
          />
        )}
      />
    </View>
    {error && (
      <Animated.Text entering={FadeInUp} style={styles.errorText}>
        {error.message}
      </Animated.Text>
    )}
  </View>
);

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Login" | "Register">("Login");
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const params = useLocalSearchParams();
  const [role, setRole] = useState<string>("student");

  useEffect(() => {
    if (params.role) {
      setRole(params.role as string);
    }
  }, [params.role]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(activeTab === "Login" ? loginSchema : registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    reset();
  }, [activeTab]);

  const onSubmit = async (data: any) => {
    if (!auth) return;
    setLoading(true);
    try {
      if (activeTab === "Login") {
        const res = await auth.signIn(data.email, data.password);
        if (res.error) {
          Alert.alert("Login Failed", res.error.message || String(res.error));
        } else if (res.user) {
          const userRole = res.user.role || "student";
          router.replace(`/(tabs)/${userRole.toLowerCase()}/Home` as any);
        }
      } else {
        const res = await auth.signUp(
          data.fullName,
          data.email,
          data.phoneNumber,
          data.password,
          role,
        );
        if (res.error) {
          Alert.alert("Sign Up Failed", res.error.message || String(res.error));
        } else {
          Alert.alert("Success", "Account created successfully!");
          const userRole = res.user?.role || role || "student";
          router.replace(`/(tabs)/${userRole.toLowerCase()}/Home` as any);
        }
      }
    } catch (e: any) {
      Alert.alert("Error", e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(
            activeTab === "Login" ? 0 : (width * 0.85) / 2,
          ),
        },
      ],
    };
  });

  return (
    <LinearGradient colors={["#F8FAFC", "#E2E8F0"]} style={styles.background}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.innerContainer}>
                <Animated.View
                  entering={FadeInDown.delay(200)}
                  style={styles.header}
                >
                  <Text style={styles.title}>
                    {activeTab === "Login" ? "Welcome Back" : "Create Account"}
                  </Text>
                  <Text style={styles.subtitle}>
                    {activeTab === "Login"
                      ? "Enter your credentials to continue"
                      : `Join UniMate as a ${role}`}
                  </Text>
                </Animated.View>

                <Animated.View
                  entering={FadeInDown.delay(400)}
                  style={styles.tabWrapper}
                >
                  <View style={styles.tabContainer}>
                    <Animated.View
                      style={[styles.tabIndicator, tabIndicatorStyle]}
                    />
                    <TouchableOpacity
                      style={styles.tabButton}
                      onPress={() => setActiveTab("Login")}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === "Login" && styles.activeTabText,
                        ]}
                      >
                        Login
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.tabButton}
                      onPress={() => setActiveTab("Register")}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === "Register" && styles.activeTabText,
                        ]}
                      >
                        Signup
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>

                <Animated.View
                  entering={FadeInDown.delay(600)}
                  layout={Layout.springify()}
                >
                  <BlurView intensity={40} tint="light" style={styles.formCard}>
                    {activeTab === "Register" && (
                      <InputField
                        control={control}
                        name="fullName"
                        placeholder="Full Name"
                        icon="person-outline"
                        error={errors.fullName}
                      />
                    )}

                    <InputField
                      control={control}
                      name="email"
                      placeholder="Email Address"
                      icon="mail-outline"
                      keyboardType="email-address"
                      error={errors.email}
                    />

                    {activeTab === "Register" && (
                      <InputField
                        control={control}
                        name="phoneNumber"
                        placeholder="92..."
                        icon="call-outline"
                        keyboardType="phone-pad"
                        maxLength={12}
                        error={errors.phoneNumber}
                      />
                    )}

                    <InputField
                      control={control}
                      name="password"
                      placeholder="Password"
                      icon="lock-closed-outline"
                      secureTextEntry
                      error={errors.password}
                    />

                    {activeTab === "Register" && (
                      <InputField
                        control={control}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        icon="shield-checkmark-outline"
                        secureTextEntry
                        error={errors.confirmPassword}
                      />
                    )}

                    <View style={styles.buttonWrapper}>
                      {loading ? (
                        <ActivityIndicator
                          size="large"
                          color={Colors.primary}
                        />
                      ) : (
                        <CommonButton
                          text={activeTab === "Login" ? "Sign In" : "Sign Up"}
                          iconName="arrow-forward"
                          onPress={handleSubmit(onSubmit)}
                          buttonStyle={styles.submitButton}
                        />
                      )}
                    </View>
                  </BlurView>
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1E293B",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 8,
    textTransform: "capitalize",
  },
  tabWrapper: {
    marginBottom: 32,
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    padding: 4,
    position: "relative",
  },
  tabIndicator: {
    position: "absolute",
    width: "50%",
    height: "100%",
    top: 4,
    left: 4,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    zIndex: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  activeTabText: {
    color: "#1E293B",
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.6)",
    overflow: "hidden",
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    height: 56,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: "#EF4444",
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    fontFamily: Platform.OS === "ios" ? "System" : "BarlowRegular",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonWrapper: {
    marginTop: 24,
    alignItems: "center",
  },
  submitButton: {
    width: "100%",
    height: 56,
    borderRadius: 16,
    backgroundColor: "#60A5FA",
  },
});

export default Auth;
