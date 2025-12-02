import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const Notes = () => {
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <TouchableOpacity
      onPress={()=>router.push('/Modules/Navigation/MapScreen')}>
      <Text>Navigation</Text>
      </TouchableOpacity>
    
    </View>
  )
}

export default Notes