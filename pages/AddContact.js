import React from 'react'
import { View, Text } from 'react-native'
import ContactForm from '../components/ContactForm'
import Header from '../components/Header'

export default function AddContact({ navigation }) {
    return (
        <>
            <Header title="Add Contact" showBack={true} onPressBack={navigation.goBack} />
            <ContactForm onGoHome={navigation.goBack} />
        </>
    )
}
