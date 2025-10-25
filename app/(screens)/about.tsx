// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const about = () => {
//   return (
//     <View>
//       <Text>about</Text>
//     </View>
//   )
// }

// export default about

// const styles = StyleSheet.create({})


import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { router } from "expo-router";
import { AuthContext } from "../../Context/AuthContext";

const About = () => {
  const { user, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/(auth)/who"); // redirect to role selection/login
    }
  }, [user, isLoading]);

  if (isLoading) return null;

  return (
    <View>
      <Text>about</Text>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({});
