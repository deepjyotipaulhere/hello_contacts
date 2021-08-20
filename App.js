import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Home from './pages/Home'
import AddContact from './pages/AddContact'


const ContactStack = createNativeStackNavigator()

export default function App() {
  return (
    <ContactStack.Navigator screenOptions={{ headerShown: false }}>
      <ContactStack.Screen name="Home" component={Home} />
      <ContactStack.Screen name="AddContact" component={AddContact} />
    </ContactStack.Navigator>
  )
}
