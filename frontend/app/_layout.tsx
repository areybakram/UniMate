import "../global.css";
import { AuthProvider } from "@/Context/AuthContext";
import { DrawerProvider } from "@/Context/DrawerContext";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { LocationProvider } from "../Context/LocationContext";
import { NotificationProvider } from "../Context/NotificationContext";
// import GlobalProvider from '../context/GlobalProvider'

SplashScreen.preventAutoHideAsync();

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, View } from "react-native";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#333" }}>Something went wrong</Text>
      <Text style={{ fontSize: 13, color: "#666", textAlign: "center" }}>{error.message}</Text>
    </View>
  );
}

const _layout = () => {
  const [fatalError, setFatalError] = useState<Error | null>(null);
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (fontError) {
      console.warn("Font loading error (non-fatal):", fontError);
    }
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (fatalError) {
    return <ErrorFallback error={fatalError} />;
  }

  // Allow app to continue rendering if fonts fail or load
  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NotificationProvider>
          <DrawerProvider>
            <LocationProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(screens)" />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </LocationProvider>
          </DrawerProvider>
        </NotificationProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default _layout;
