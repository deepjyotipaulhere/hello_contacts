import React from 'react'
import { Appbar } from 'react-native-paper'
import { StatusBar } from 'react-native'

function Header({ title, subtitle, showBack = true, onPressBack }) {
    return (
        <>
            <StatusBar barStyle='light-content' />
            <Appbar.Header>
                {showBack && <Appbar.BackAction onPress={onPressBack} />}
                <Appbar.Content title={title} subtitle={subtitle} />
            </Appbar.Header>
        </>
    )
}

export default React.memo(Header);
