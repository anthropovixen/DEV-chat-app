import React from 'react';
import {
	View,
	Button,
	StyleSheet,
	Platform,
	KeyboardAvoidingView,
	Text,
} from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

// Import Firestore

const firebase = require('firebase');
require('firebase/firestore');

var firebaseConfig = {
	apiKey: 'AIzaSyB7yKJ_VE_0ZmM11sHv-hylYeHPnxqRWhs',
	authDomain: 'dev-chat-app-81265.firebaseapp.com',
	projectId: 'dev-chat-app-81265',
	storageBucket: 'dev-chat-app-81265.appspot.com',
	messagingSenderId: '518176343018',
	appId: '1:518176343018:web:72485be07c90218ca3e893',
	measurementId: 'G-2HJNQJ1FJN',
};

// Create a constructor that will iniatialize Firestore app

export default class Chat extends React.Component {
	constructor() {
		super();
		this.state = {
			messages: [],
			name: '',
		};

		// Connect to firebase

		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
			firebase.analytics();
		}

		// Create a reference to Firestore collection

		this.referenceChatMessages = firebase.firestore().collection('messages');
	}

	// Get and display messages

	componentDidMount() {
		// Authenticate user

		this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
			if (!user) {
				firebase.auth().signInAnonymously();
			}

			// Create a reference to Firestore collection

			this.referenceChatMessages = firebase.firestore().collection('messages');

			// Stop receiving updates on collection snapshots for current user

			this.unsubscribeMessages = this.referenceChatMessages
				.orderBy('createdAt', 'desc')
				.onSnapshot(this.onCollectionUpdate);
		});
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
			});
		});

		// Access user's name and put it on top of app

		const name = this.props.route.params.name;
		this.props.navigation.setOptions({ title: `${name}'s Chat` });
	};

	// Add message to firestore cloud storage

	addMessage = () => {
		const messages = this.state.messages[0];
		firebase
			.firestore()
			.collection('messages')
			.add({
				_id: messages._id,
				text: messages.text,
				createdAt: messages.createdAt,
				user: {
					_id: messages.user._id,
					name: messages.user.name,
				},
			})
			.then()
			.catch((error) => console.log('error', error));
	};

	// Append messages sent on Send to state

	onSend(messages = []) {
		this.setState((previousState) => ({
			messages: GiftedChat.append(previousState.messages, messages),
		}));
		() => {
			this.addMessage();
		};
	}

	// When component unmounts stop receiving updates on collection

	componentWillUnmount() {
		if (typeof this.unsubscribe === 'function') {
			this.authUnsubscribe();
		}
	}

	// Style chat bubbles with alignment and color

	renderBubble(props) {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: '#000',
					},
				}}
			/>
		);
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

		return (
			<View style={styles.chatContainer}>
				{/* Create button to return to Start screen */}

				<Button
					title="Start"
					onPress={() => this.props.navigation.navigate('Start')}
				/>

				{/* Display message of log in to user */}

				<Text>{this.state.loggedInText}</Text>

				{/* Create component to render chat  */}

				<GiftedChat
					// Render chat bubbles with style defined in function renderBubble

					renderBubble={this.renderBubble.bind(this)}
					// Messages from the state object will be fed into the chat

					messages={this.state.messages}
					// Messages will be fed on send

					onSend={(messages) => this.onSend(messages)}
					// User identifier
					user={{ _id: 1 }}
				/>

				{/* Keyboard componet to avoid keyboard being hidden on older phone models */}

				{Platform.OS === 'android' ? (
					<KeyboardAvoidingView behavior="height" />
				) : null}
			</View>
		);
	}
}
