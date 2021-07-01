import React from 'react';
import {
	View,
	Button,
	StyleSheet,
	Platform,
	KeyboardAvoidingView,
} from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = { name: '', messages: [] };
	}

	componentDidMount() {
		let { name } = this.props.route.params;
		this.props.navigation.setOptions({ title: `${name}'s Chatroom` });

		this.setState({
			messages: [
				{
					_id: 1,
					text: 'Hello developer',
					createdAt: new Date(),
					user: {
						_id: 2,
						name: 'React Native',
						avatar: 'https://placeimg.com/140/140/any',
					},
				},
				{
					_id: 2,
					text: 'This is a system message',
					createdAt: new Date(),
					system: true,
				},
			],
		});
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
