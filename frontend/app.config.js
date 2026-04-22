export default ({ config }) => ({
  ...config,
  name: "UniMate",
  slug: "UniMate",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icons/gradstudent.png",
  scheme: "unimate",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "We need your location to show it on the map"
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icons/gradstudent.png",
      backgroundColor: "#ffffff"
    },
    edgeToEdgeEnabled: true,
    package: "com.arybb.UniMate",
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION"
    ],
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID
      }
    }
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/icons/gradstudent.png"
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/icons/gradstudent.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      }
    ],
    "@react-native-community/datetimepicker",
    "expo-font",
    "expo-web-browser"
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {},
    eas: {
      projectId: "5646b1d2-5745-430b-a0ce-520902dfc91f"
    }
  }
});
