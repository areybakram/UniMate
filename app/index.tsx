//onbarding screen after splash screen. can make it as a splash screen later if needed


import { View, Text, Image, TouchableOpacity } from 'react-native'
import '../global.css'
import React from 'react'
import { Link, router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import icons from '../constants/icons'
import CommonButton from '@/components/CommonButton'
import WaveThingy from '@/components/WaveThingy'

const onBoarding = () => {
  return (
    <SafeAreaView>
      <View>

        <View>
          <Image
          source={icons.blueelipse}
          className='w-full h-50%'
          resizeMode='cover'
          />
        </View>

        {/* <View>
          <Image
          source={icons.comsats}
          className='-mt-28 items-center justify-center self-center'/>
        </View> */}

        <View>
          <WaveThingy/>
          <Image
          source={icons.comsats}
          className='-mt-28 items-center justify-center self-center'/>
        </View>













        <View className="items-center justify-center mt-10 space-y-3">
          <Text className="font-pmedium text-4xl leading-tight">To Get Started</Text>
          <Text className="font-pregular text-xs leading-tight">Allow Location Access</Text>
        </View>










        <CommonButton
         text='Share live location'
         textStyle={{color:'black', fontSize:16,}}
         buttonStyle={{justifyContent:'center', alignItems:'center' , alignSelf:'center', marginTop:130 , width:'69%' ,}}
         onPress={()=>router.push('/who')}/>

         <View className="mt-5">
          <Text className="mt-1 text-xs font-pthin italic text-center">Enable location to assist with navigation and</Text>
          <Text className="mt-1 text-xs font-pthin italic text-center">enhance campus security response</Text>
         </View>




      </View>


    </SafeAreaView>
  )
}

export default onBoarding