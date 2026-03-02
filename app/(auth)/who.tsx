// import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
// import React from 'react'
// import icons from '@/constants/icons'
// import { router } from 'expo-router'

// const who = () => {
//   return (
//     <SafeAreaView>

//             <Text className="font-pmedium text-2xl text-center leading-tight mt-10">Choose Your Role To Continue</Text>

//         <View className='justify-center h-full'>

//             <View className='flex-row justify-evenly'>

//                 <TouchableOpacity
//                 onPress={()=>router.push('/(auth)/StudentSignIn')}>
//                     <Image
//                     source={icons.who}
//                     className='relative'/>

//                     <Image
//                     source={icons.student}
//                     className='absolute h-20 w-20 items-center justify-center self-center top-8 '
//                     resizeMode='contain'
//                     />

//                     <Text className='text-center font-pregular'>Student</Text>

//                 </TouchableOpacity>

//                 <TouchableOpacity>
//                     <Image
//                     source={icons.who}
//                     className='relative'/>

//                     <Image
//                     source={icons.teacher}
//                     className='absolute h-20 w-20 items-center justify-center self-center top-8 '
//                     resizeMode='contain'
//                     />

//                     <Text className='text-center font-pregular'>Teacher</Text>
//                 </TouchableOpacity>

//                 </View>

//             <TouchableOpacity className='flex-row justify-center mt-10'>
//                 <Image
//                 source={icons.who}
//                 className='relative'/>

//                 <Image
//                 source={icons.guard}
//                 className='absolute h-20 w-20 items-center justify-center self-center top-8 '
//                 resizeMode='contain'/>
//             </TouchableOpacity>

//                 <Text className='text-center font-pregular'>Student</Text>

//         </View>

//     </SafeAreaView>

//   )
// }

// export default who

import icons from "@/constants/icons";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthContext } from "../../Context/AuthContext";

const Who = () => {
  const { user, isLoading }: any = useContext(AuthContext) || {};

  useEffect(() => {
    if (!isLoading && user) {
      const userRole = user.role || "student";
      router.replace(`/(tabs)/${userRole.toLowerCase()}/Home` as any);
    }
  }, [user, isLoading]);

  if (isLoading) return null;

  return (
    <SafeAreaView>
      <Text className="font-pmedium text-2xl text-center leading-tight mt-20">
        Choose Your Role To Continue
      </Text>

      <View className="justify-center h-full">
        <View className="flex-row justify-evenly">
          <TouchableOpacity
            onPress={() => router.push(`/(auth)/Auth?role=student`)}>
            <Image source={icons.who} className="relative" />
            <Image
              source={icons.student}
              className="absolute h-20 w-20 items-center justify-center self-center top-8"
              resizeMode="contain"
            />
            <Text className="text-center font-pregular">Student</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push(`/(auth)/Auth?role=teacher`)}>
            <Image source={icons.who} className="relative" />
            <Image
              source={icons.teacher}
              className="absolute h-20 w-20 items-center justify-center self-center top-8"
              resizeMode="contain"
            />
            <Text className="text-center font-pregular">Teacher</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.push(`/(auth)/Auth?role=guard`)}
          className="flex-row justify-center mt-10">
          <Image source={icons.who} className="relative" />
          <Image
            source={icons.guard}
            className="absolute h-20 w-20 items-center justify-center self-center top-8"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text className="text-center font-pregular">Guard</Text>
      </View>
    </SafeAreaView>
  );
};

export default Who;
