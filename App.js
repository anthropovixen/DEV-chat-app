import React, { Component } from 'react';

// import screens we want to navigate

import Start from './components/Start';
import Chat from './components/Chat';

import 'react-native-gesture-handler';

//import navigation container and stack method

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//create variable needed for navigation

const Stack = createStackNavigator();

export default class App extends React.Component {
	//initiate state

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Screen1">
					<Stack.Screen name="Start" component={Start} />
					<Stack.Screen name="Chat" component={Chat} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
