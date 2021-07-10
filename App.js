import React, { Component } from 'react';

// import screens we want to navigate

import Start from './components/Start';
import Chat from './components/Chat';
import CustomActions from './components/CustomActions';

// import react native gesture handler

import 'react-native-gesture-handler';

//import navigation container and stack method

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createAppContainer } from 'react-navigation';

//create variable needed for navigation

// const navigator = createStackNavigator({
// 	Start: {
// 		screen: Start,
// 		navigationOptions:{
// 			headerShown: false,
// 		}
// 	}
// 	Chat: { screen: Chat },
// }),

// const navigatorContainer = createAppContainer(navigator)l
// export default navigatorContainer

const Stack = createStackNavigator();

export default class App extends React.Component {
	renderCustomActions = (props) => {
		return <CustomActions {...props} />;
	};
	render() {
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Start">
					<Stack.Screen name="Start" component={Start} />
					<Stack.Screen name="Chat" component={Chat} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}
