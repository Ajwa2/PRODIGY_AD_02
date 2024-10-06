import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './src/Home';
import TextList from './src/TextList';

const Stack = createNativeStackNavigator();

const App = () => {

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown:false}}>
                <Stack.Screen name='Home' component={Home}/>
                <Stack.Screen name='TextList' component={TextList}/>
            </Stack.Navigator>
        </NavigationContainer>

    )
}

export default App

const styles = StyleSheet.create({})