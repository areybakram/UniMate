import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocation } from '../../../Context/LocationContext';
import { getDirections } from './directions';

interface Point {
  name: string;
  latitude: number;
  longitude: number;
}

const universityPoints: Point[] = [
  { name: 'Main Gate', latitude: 33.6411, longitude: 72.9830 },
  { name: 'Library', latitude: 33.6420, longitude: 72.9845 },
  { name: 'CS Department', latitude: 33.6430, longitude: 72.9850 },
];

const MapScreen: React.FC = () => {
  const { userLocation, startLocationTracking } = useLocation();
  console.log('MapScreen userLocation:', userLocation);
  const [destination, setDestination] = useState<Point | null>(null);
  const [routeCoords, setRouteCoords] = useState<Array<{ latitude: number; longitude: number }>>([]);

  useEffect(() => {
    startLocationTracking();
  }, []);
  console.log('Rendering MapScreen with userLocation:', userLocation);

  const handleNavigate = async () => {
    if (!userLocation || !destination) return;
    try {
      const coords = await getDirections(userLocation, destination);
      setRouteCoords(coords);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch directions');
    }
  };

  if (!userLocation) return <View style={styles.loading}></View>;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation
      >
        {universityPoints.map((point) => (
          <Marker
            key={point.name}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            title={point.name}
            pinColor={destination?.name === point.name ? 'blue' : 'red'}
          />
        ))}
        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeWidth={4} strokeColor="blue" />}
      </MapView>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Enter destination"
          style={styles.input}
          onChangeText={(text) => {
            const found = universityPoints.find((p) => p.name.toLowerCase() === text.toLowerCase());
            setDestination(found || null);
          }}
        />
        <Button title="Navigate" onPress={handleNavigate} disabled={!destination} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    position: 'absolute',
    top: 50,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  input: { flex: 1, padding: 8, borderWidth: 1, borderRadius: 5, marginRight: 10, color:'red' },
});

export default MapScreen;
