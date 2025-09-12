// ------------------------------ Login/Register Screen ------------------------------

import React, { useState, useEffect } from "react";
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonButton from "@/components/CommonButton";
import { Colors } from "@/utils/Constants";
import { router } from "expo-router";

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
    .matches(/^[0-9]{12}$/, "Phone Number must be 12 digits")
    .required("Phone Number is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Login");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () =>
      setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
      setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const dismissKeyboard = () => Keyboard.dismiss();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(activeTab === "Login" ? loginSchema : registerSchema),
    defaultValues:
      activeTab === "Login"
        ? { email: "", password: "" }
        : {
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
          },
  });

  useEffect(() => {
    reset(
      activeTab === "Login"
        ? { email: "", password: "" }
        : {
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
          }
    );
  }, [activeTab, reset]);

  const onSubmit = (data: any) => {
    // setLoading(true);
    // setTimeout(() => {
    //   console.log(`${activeTab} Data:`, data);
    //   setLoading(false);
    // }, 1500); // Fake loading
    router.push('/(tabs)/Home')
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.container}>
            <Text className="font-pmedium" style={styles.title}>Welcome!</Text>
            <Text className="font-pregular" style={styles.subtitle}>
              Sign up or Login to your Account
            </Text>

            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "Login" ? styles.activeTab : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab("Login")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "Login"
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                  ]}
                >
                  Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "Register"
                    ? styles.activeTab
                    : styles.inactiveTab,
                ]}
                onPress={() => setActiveTab("Register")}
              >
                <Text
                className="font-pregular"
                  style={[
                    styles.tabText,
                    activeTab === "Register"
                      ? styles.activeTabText
                      : styles.inactiveTabText,
                      
                  ]}
                >
                  Signup
                </Text>
              </TouchableOpacity>
            </View>

            {/* Forms */}
            {activeTab === "Login" ? (
              <>
                {/* Email */}
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  keyboardVerticalOffset={60}
                >
                  <Text className="font-pregular" style={styles.label}>Email Address</Text>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your Email"
                        keyboardType="email-address"
                        placeholderTextColor="#B3BFCB"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                  )}
                </KeyboardAvoidingView>

                {/* Password */}
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  keyboardVerticalOffset={60}
                >
                  <Text className="font-pregular" style={styles.label}>Password</Text>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your Password"
                        placeholderTextColor="#B3BFCB"
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>
                      {errors.password.message}
                    </Text>
                  )}
                </KeyboardAvoidingView>
              </>
            ) : (
              <ScrollView>
                {/* Full Name */}
                <Text className="font-pregular" style={styles.label}>Full Name</Text>
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your Name"
                      placeholderTextColor="#B3BFCB"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.fullName && (
                  <Text style={styles.errorText}>
                    {errors.fullName.message}
                  </Text>
                )}

                {/* Email */}
                <Text className="font-pregular" style={styles.label}>E-mail</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your E-mail"
                      placeholderTextColor="#B3BFCB"
                      keyboardType="email-address"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}

                {/* Phone */}
                <Text className="font-pregular" style={styles.label}>Phone Number</Text>
                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="921234567890"
                      placeholderTextColor="#B3BFCB"
                      keyboardType="phone-pad"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      maxLength={12}
                    />
                  )}
                />
                {errors.phoneNumber && (
                  <Text style={styles.errorText}>
                    {errors.phoneNumber.message}
                  </Text>
                )}

                {/* Password */}
                <Text className="font-pregular" style={styles.label}>Create Password</Text>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your Password"
                      placeholderTextColor="#B3BFCB"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.password && (
                  <Text style={styles.errorText}>
                    {errors.password.message}
                  </Text>
                )}

                {/* Confirm Password */}
                <Text className="font-pregular" style={styles.label}>Confirm Password</Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Re-enter your Password"
                      placeholderTextColor="#B3BFCB"
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </ScrollView>
            )}

            {/* Button / Loader */}
            {!isKeyboardVisible && !loading && (
              <CommonButton
                text={activeTab === "Login" ? "Login" : "Sign Up"}
                iconName="chevron-forward"
                onPress={handleSubmit(onSubmit)}
                buttonStyle={{
                  alignSelf: "center",
                  position: "absolute",
                  bottom: "11%",
                }}
              />
            )}

            {loading && !isKeyboardVisible && (
              <ActivityIndicator
                size="large"
                color={Colors.primary}
                style={{
                  alignSelf: "center",
                  position: "absolute",
                  bottom: "3%",
                }}
              />
            )}
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <StatusBar backgroundColor={"#ffffff"} barStyle="dark-content" />
    </SafeAreaView>
  );
};

export default Auth;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: "7%",
  },
  title: {
    fontSize: RFValue(25),
    // fontFamily: "pmedium",
    fontWeight: "400",
    color: Colors.text,
    marginHorizontal: "5%",
  },
  subtitle: {
    fontSize: RFValue(13),
    // fontFamily: "BarlowRegular",
    fontWeight: "400",
    color: Colors.otpColor,
    marginBottom: "4.5%",
    marginHorizontal: "5%",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
    marginHorizontal: "5%",
    backgroundColor: Colors.secondary_light,
    borderRadius: 50,
  },
  tab: {
    flex: 1,
    paddingVertical: "1.9%",
    alignItems: "center",
    borderRadius: 50,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  inactiveTab: {
    backgroundColor: Colors.secondary_light,
  },
  tabText: {
    fontSize: RFValue(17),
    // fontFamily: "BarlowRegular",
    color: Colors.text,
    fontWeight: "400",
  },
  activeTabText: {
    color: Colors.texttwo,
  },
  inactiveTabText: {
    color: Colors.primary,
  },
  label: {
    fontSize: RFValue(13),
    // fontFamily: "BarlowLight",
    color: Colors.text,
    fontWeight: "400",
    marginHorizontal: "7%",
    marginBottom: 7,
  },
  input: {
    backgroundColor: Colors.inputfild,
    borderRadius: 50,
    paddingVertical: "1.9%",
    marginHorizontal: "5%",
    fontSize: RFValue(14),
    fontFamily: "BarlowRegular",
    color: Colors.text,
    fontWeight: "400",
    height: RFValue(41),
    marginBottom: 15,
    paddingLeft: "5%",
  },
  errorText: {
    fontSize: RFValue(12),
    color: "red",
    marginHorizontal: "7%",
    top: -10,
    fontFamily: "BarlowRegular",
  },
});
