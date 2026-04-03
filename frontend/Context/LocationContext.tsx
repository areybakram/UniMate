// // import React, { createContext, useContext, useState } from 'react';
// // import * as Location from 'expo-location';

// // interface LocationContextType {
// //   userLocation: { latitude: number; longitude: number } | null;
// //   startLocationTracking: () => Promise<void>;
// // }

// // const LocationContext = createContext<LocationContextType>({
// //   userLocation: null,
// //   startLocationTracking: async () => {},
// // });

// // export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// //   const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

// //   const startLocationTracking = async () => {
// //     const { status } = await Location.requestForegroundPermissionsAsync();
// //     console.log('Location permission status:', status);
// //     if (status !== 'granted') {
// //       alert('Location permission denied');
// //       return;
// //     }

// //     await Location.watchPositionAsync(
// //       { accuracy: Location.Accuracy.High, distanceInterval: 5 },
// //       (loc) => {
// //         setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
// //       }
// //     );
// //   };

// //   console.log('User Location:', userLocation);

// //   return (
// //     <LocationContext.Provider value={{ userLocation, startLocationTracking }}>
// //       {children}
// //     </LocationContext.Provider>
// //   );
// // };

// // export const useLocation = () => useContext(LocationContext);


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import * as Location from 'expo-location';

// interface LocationContextType {
//   userLocation: { latitude: number; longitude: number } | null;
//   startLocationTracking: () => void;
// }

// const LocationContext = createContext<LocationContextType>({
//   userLocation: null,
//   startLocationTracking: () => {},
// });

// export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

//   const startLocationTracking = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       console.log('Location permission status:', status);

//       if (status !== 'granted') {
//         alert('Location permission denied. Using fallback location.');
//         setUserLocation({ latitude: 33.6411, longitude: 72.9830 }); // fallback
//         return;
//       }

//       console.log('Starting location watch...');
//       const subscription = await Location.watchPositionAsync(
//         { accuracy: Location.Accuracy.High, distanceInterval: 5 },
//         (loc) => {
//           console.log('Updated location received:', loc.coords);
//           setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
//         }
//       );

//       // Optional: stop tracking after some time
//       // setTimeout(() => subscription.remove(), 60000); // stop after 1 min
//     } catch (error) {
//       console.error('Error starting location tracking:', error);
//       setUserLocation({ latitude: 33.6411, longitude: 72.9830 }); // fallback
//     }
//   };

//   // Automatically start tracking when provider mounts
//   useEffect(() => {
//     startLocationTracking();
//   }, []);

//   console.log('Current userLocation:', userLocation);

//   return (
//     <LocationContext.Provider value={{ userLocation, startLocationTracking }}>
//       {children}
//     </LocationContext.Provider>
//   );
// };

// export const useLocation = () => useContext(LocationContext);


import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationContextType {
  userLocation: { latitude: number; longitude: number } | null;
  fetchUserLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType>({
  userLocation: null,
  fetchUserLocation: async () => {},
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Function to ask permission and fetch location once
  const fetchUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Location permission status:', status);

      if (status !== 'granted') {
        alert('Location permission denied. Using fallback location.');
        setUserLocation({ latitude: 33.6411, longitude: 72.9830 }); // fallback
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      console.log('Fetched location:', location.coords);
      setUserLocation({ latitude: location.coords.latitude, longitude: location.coords.longitude });
    } catch (error) {
      console.error('Error fetching location:', error);
      setUserLocation({ latitude: 33.6411, longitude: 72.9830 }); // fallback
    }
  };

  // Optional: automatic tracking if you want continuous updates
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startTracking = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 5 },
        (loc) => {
          setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
        }
      );
    };

    startTracking();

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <LocationContext.Provider value={{ userLocation, fetchUserLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
