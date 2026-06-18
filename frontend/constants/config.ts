import Constants from "expo-constants";

export const API_URL: string =
  Constants.expoConfig?.extra?.apiUrl ||
  "http://localhost:5000/api";

// Derive socket URL from API_URL by stripping "/api" suffix
// Both live on the same host:port during local development
export const SOCKET_URL: string = API_URL.replace(/\/api$/, "");


