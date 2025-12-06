import polyline from '@mapbox/polyline';
import axios from 'axios';
import { Platform } from 'react-native';
const API_KEY = Platform.OS === 'ios' 
  ? process.env.GOOGLE_MAPS_API_KEY_IOS 
  : process.env.GOOGLE_MAPS_API_KEY_ANDROID;

export const getDirections = async (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
) => {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${API_KEY}`;
  
  const response = await axios.get(url);
  if (!response.data.routes.length) throw new Error('No route found');

  const points = response.data.routes[0].overview_polyline.points;
  return polyline.decode(points).map((point: [number, number]) => ({
    latitude: point[0],
    longitude: point[1],
  }));
};
