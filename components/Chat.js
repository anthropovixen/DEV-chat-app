import React from 'react';

import { View, StyleSheet, Text, LogBox, Alert } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

// Import Firestore

const firebase = require('firebase');
require('firebase/firestore');
require('firebase/auth');

// To get access to database

const firebaseConfig = {
	apiKey: 'AIzaSyB7yKJ_VE_0ZmM11sHv-hylYeHPnxqRWhs',
	authDomain: 'dev-chat-app-81265.firebaseapp.com',
	projectId: 'dev-chat-app-81265',
	storageBucket: 'dev-chat-app-81265.appspot.com',
	messagingSenderId: '518176343018',
	appId: '1:518176343018:web:72485be07c90218ca3e893',
	measurementId: 'G-2HJNQJ1FJN',
};

// Create a constructor that will initialize Firestore app

export default class Chat extends React.Component {
	constructor() {
		super();
		this.state = {
			messages: [],
			name: '',
			uid: '',
			isConnected: true,
			image: null,
			location: null,
		};

		// Connect to firebase

		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
			firebase
				.firestore()
				.settings({ experimentalAutoDetectLongPolling: true });
		}
		// Create a reference to Firestore collection

		this.referenceChatMessages = firebase.firestore().collection('messages');

		//Ignore warnings

		LogBox.ignoreLogs([
			'Setting a timer',
			'Animated.event now requires a second argument for options',
			'expo-permissions is now deprecated',
		]);
	}

	// get messages from asyncStorage

	// Get and display messages

	componentDidMount() {
		const name = this.props.route.params.name;
		this.props.navigation.setOptions({ title: `${name}'s Chat` });

		// Check for user's connection

		NetInfo.fetch().then((connection) => {
			if (connection.isConnected) {
				// connect to messages collection
				this.referenceChatMessages = firebase
					.firestore()
					.collection('messages');

				// Authenticate user

				this.authUnsubscribe = firebase
					.auth()
					.onAuthStateChanged(async (user) => {
						if (!user) {
							await firebase.auth().signInAnonymously();
						}

						// Update user state with current user data

						this.setState({
							isConnected: true,
							uid: user.uid,

							messages: [],
						});
						// Stop receiving updates on collection snapshots for current user

						this.unsubscribe = this.referenceChatMessages
							.orderBy('createdAt', 'desc')
							.onSnapshot(this.onCollectionUpdate);
					});
			} else {
				this.setState({ isConnected: false });
				this.getMessages();
				Alert.alert('No internet connection. Unable to send messages');
			}
		});
	}

	async getMessages() {
		let messages = '';
		try {
			messages = (await AsyncStorage.getItem('messages')) || [];
			this.setState({
				messages: JSON.parse(messages),
			});
		} catch (error) {
			console.log(error.message);
		}
	}

	// When component unmounts stop receiving updates on collection

	componentWillUnmount() {
		this.authUnsubscribe();
	}

	// Create a reference to Firestore collection

	onAuthStateChanged() {
		this.referenceChatMessages = firebase
			.firestore()
			.collection('messages')
			.where('uid', '==', this.state.uid);
	}

	// Retrieve data from collection and store it in state when something changes in the messages

	onCollectionUpdate = (querySnapshot) => {
		const messages = [];

		// go through each document

		querySnapshot.forEach((doc) => {
			// get the QueryDocumentSnapshot's data

			let data = doc.data();
			messages.push({
				_id: data._id,
				text: data.text,
				createdAt: new Date(),
				user: data.user,
				image: data.image || null,
				location: data.location || null,
			});
		});
		this.setState({
			messages,
		});

		// Access user's name and put it on top of app
	};

	// Add message to firestore cloud storage

	addMessages = () => {
		const messages = this.state.messages[0];
		this.referenceChatMessages.add({
			_id: messages._id,
			text: messages.text || '',
			uid: this.state.uid,
			createdAt: messages.createdAt,
			user: messages.user,
			image: messages.image || null,
			location: messages.location || null,
		});
	};

	// Append messages sent on send to chat with Save messages function

	onSend(messages = []) {
		this.setState(
			(previousState) => ({
				messages: GiftedChat.append(previousState.messages, messages),
			}),
			() => {
				this.addMessages();
				this.saveMessages();
			}
		);
	}

	// Save messages as strings to Firestore database

	async saveMessages() {
		try {
			await AsyncStorage.setItem(
				'messages',
				JSON.stringify(this.state.messages)
			);
		} catch (error) {
			console.log(error.message);
		}
	}

	// Delete stored messages

	async deleteMessages() {
		try {
			await AsyncStorage.removeItem('messages');
			this.setState({
				messages: [],
			});
		} catch (error) {
			console.log(error.message);
		}
	}

	// Style chat bubbles with alignment and color

	renderBubble(props) {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: 'black',
					},
				}}
			/>
		);
	}

	// Style input bar to only render when the user is online

	renderInputToolbar(props) {
		if (this.state.isConnected === false) {
		} else {
			return <InputToolbar {...props} />;
		}
	}

	// Display button to render custom actions

	renderCustomActions = (props) => <CustomActions {...props} />;

	// Render a MapView if the message contains location data

	renderCustomView(props) {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
					region={{
						latitude: Number(currentMessage.location.latitude),
						longitude: Number(currentMessage.location.longitude),
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			);
		}
		return null;
	}

	render() {
		// Style the chat screen with background color chosen on start screen;

		let backgroundColor = this.props.route.params.backgroundColor;
		const styles = StyleSheet.create({
			chatContainer: {
				flex: 1,
				backgroundColor: backgroundColor,
			},
		});

		const { messages, user } = this.state;

		return (
			<View style={styles.chatContainer}>
				{/* Display message of log in to user */}

				<Text>{this.state.loggedInText}</Text>

				{/* Create component to render chat  */}

				<GiftedChat
					// Render chat bubbles with style defined in function renderBubble
					renderBubble={this.renderBubble.bind(this)}
					// Messages from the state object will be fed into the chat
					messages={messages}
					// Style input bar to only render when the user is online
					renderInputToolbar={this.renderInputToolbar.bind(this)}
					// Style bar to show action button
					renderActions={this.renderCustomActions}
					// Style input bar to show custom view for maps
					renderCustomView={this.renderCustomView}
					// Messages will be fed on send
					onSend={(messages) => this.onSend(messages)}
					// User identifier
					user={{ _id: this.state.uid }}
					renderUsernameOnMessage={true}
				/>

				{/* Keyboard componet to avoid keyboard being hidden on older phone models */}

				{/* {Platform.OS === 'android' ? (
					<KeyboardAvoidingView behavior="height" />
				) : null} */}
			</View>
		);
	}
}
const styles = StyleSheet.create({});
