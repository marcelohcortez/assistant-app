import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import AppNavigation from './src/navigation'
import { apiCall } from './src/api/openAI'

export default function App() {  
  useEffect(() => {
    // apiCall('create an image of a dog playing with a cat')
  }, [])
  
  return (
    <AppNavigation />
  )
}