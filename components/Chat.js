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

// Create a constructor that will iniatialize Firestore app

const firebaseConfig = {
	apiKey: 'AIzaSyDVj-DVpMx3lSnakSKgAPXReXj0clGnCeA',
	authDomain: 'dev-chat-app-5fa41.firebaseapp.com',
	projectId: 'dev-chat-app-5fa41',
	storageBucket: 'dev-chat-app-5fa41.appspot.com',
	messagingSenderId: '300350685305',
	appId: '1:300350685305:web:dd44d534a575a070ab94a8',
	measurementId: 'G-6BCBLHFW4N',
};

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: [],
			name: '',
			uid: '',
		};

		// Connect to firebase

		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}

		// Create a reference to Firestore collection

		this.referenceChatMessages = firebase.firestore().collection('chats');
	}

	// Get and display messages

	componentDidMount() {
		// Authenticate user

		this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
			if (!user) {
				firebase.auth().signInAnonymously();
			}
			// update user state with currently active user data

			this.setState({
				uid: user.uid,
				messages: [],
			});

			// Create a reference to Firestore collection

			this.referenceChatMessages = firebase.firestore().collection('chats');

			// Stop receiving updates on collection snapshots for current user

			this.unsubscribeMessages = this.referenceChatMessages
				.orderBy('createdAt', 'desc')
				.onSnapshot(this.onCollectionUpdate);
		});

		// Access user's name and put it on top

		const { name } = this.props.route.params;
		this.props.navigation.setOptions({ title: `${name}'s Chat` });
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
	};

	// Add message to firestore cloud storage

	addMessage = () => {
		const messages = this.state.messages[0];
		firebase
			.firestore()
			.collection('chats')
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

	// When component unmounts stop receiving updates on collection

	componentWillUnmount() {
		if (typeof this.unsubscribe === 'function') {
			this.authUnsubscribe();
		}
	}

	// Append messages sent on Send to state

	onSend(messages = []) {
		this.setState((previousState) => ({
			messages: GiftedChat.append(previousState.messages, messages),
		}));
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
