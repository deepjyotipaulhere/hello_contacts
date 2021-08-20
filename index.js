/**
 * @format
 */
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux';
import store from './store';

export default function Main() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <PaperProvider>
                    <App />
                </PaperProvider>
            </NavigationContainer>
        </Provider>
    )
}


AppRegistry.registerComponent(appName, () => Main);
