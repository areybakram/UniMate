import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import icons from '@/constants/icons'
import { router } from 'expo-router'

const who = () => {
  return (
    <SafeAreaView>
   
            <Text className="font-pmedium text-2xl text-center leading-tight mt-10">Choose Your Role To Continue</Text>


        <View className='justify-center h-full'>

            <View className='flex-row justify-evenly'>

                <TouchableOpacity
                onPress={()=>router.push('/(auth)/StudentSignIn')}>
                    <Image
                    source={icons.who}
                    className='relative'/>


                    <Image
                    source={icons.student}
                    className='absolute h-20 w-20 items-center justify-center self-center top-8 '
                    resizeMode='contain'
                    />

                    <Text className='text-center font-pregular'>Student</Text>

                </TouchableOpacity>


            


                <TouchableOpacity>
                    <Image
                    source={icons.who}
                    className='relative'/>



                    <Image
                    source={icons.teacher}
                    className='absolute h-20 w-20 items-center justify-center self-center top-8 '
                    resizeMode='contain'
                    />

                    <Text className='text-center font-pregular'>Teacher</Text>
                </TouchableOpacity>
                
                </View>



        


            <TouchableOpacity className='flex-row justify-center mt-10'>
                <Image
                source={icons.who}
                className='relative'/>



                <Image
                source={icons.guard}
                className='absolute h-20 w-20 items-center justify-center self-center top-8 '
                resizeMode='contain'/>
            </TouchableOpacity>

            

                <Text className='text-center font-pregular'>Student</Text>



        </View>


        


    </SafeAreaView>

  )
}

export default who