import polyline from "@mapbox/polyline";
import axios from "axios";
import { Platform } from "react-native";
const API_KEY =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS
    : process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID;

export const getDirections = async (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
) => {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${API_KEY}`;

  const response = await axios.get(url);
  if (!response.data.routes.length) throw new Error("No route found");

  const route = response.data.routes[0];
  const leg = route.legs[0];
  const points = route.overview_polyline.points;

  const coordinates = polyline
    .decode(points)
    .map((point: [number, number]) => ({
      latitude: point[0],
      longitude: point[1],
    }));

  return {
    coordinates,
    distance: leg.distance.text,
    duration: leg.duration.text,
  };
};
