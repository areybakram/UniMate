// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// export default function chatbot() {
//   return (
//     <View>
//       <Text>chatbot</Text>
//     </View>
//   )
// }

// const styles = StyleSheet.create({})


import React, { useEffect, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../Context/AuthContext'; // 👈 adjust this path if needed

export default function Chatbot() {
  const router = useRouter();
  const { user } = useContext(AuthContext); // 👈 access logged-in user

  useEffect(() => {
    // Redirect if no user is logged in
    if (!user) {
      router.replace('/StudentSignIn');
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chatbot</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
  },
});
