import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const StudentSignUp = () => {
  return (
    <View className='text-center items-center justify-center flex-1'>
      <Text>StudentsignUp</Text>
      <Link href="/(auth)/StudentSignIn" asChild>
        <Text>Go to Sign In</Text>
      </Link>
    </View>
  )
}

export default StudentSignUp