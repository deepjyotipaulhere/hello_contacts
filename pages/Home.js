import React from 'react'
import Contacts from '../components/Contacts'
import Header from '../components/Header'

export default function Home({navigation}) {
    return (
        <>
            <Header title="Home" showBack={false} />
            <Contacts onAddContact={()=>navigation.navigate("AddContact")} />
        </>
    )
}
