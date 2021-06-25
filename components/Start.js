import React from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	ImageBackground,
	TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';

const image = require('../assets/background-image.png');

export default class Start extends React.Component {
	constructor(props) {
		super(props);
		this.state = { name: '', backgroundColor: '090C08' };
	}
	render() {
		let { backgroundColor } = this.state;

		return (
			<View style={styles.container}>
				<ImageBackground source={image} style={styles.image}>
					<View style={styles.main}>
						<Text style={styles.title}>DEV Chat</Text>
						<View style={styles.options}>
							<View style={styles.yourName}>
								<Icon
									style={styles.yourIcon}
									name="person-outline"
									color="#757083"
								></Icon>
								<TextInput
									style={styles.inputName}
									onChangeText={(name) => this.setState({ name })}
									value={this.state.name}
									placeholder="Your Name"
								/>
							</View>
							<View style={styles.backgroundColorContainer}>
								<Text style={styles.backgroundColorText}>
									Choose Background Color:
								</Text>
								<View style={styles.backgroundColorOptions}>
									<TouchableOpacity
										style={styles.backgroundColor1}
										onPress={() =>
											this.setState({ backgroundColor: '#090C08' })
										}
									/>
									<TouchableOpacity
										style={styles.backgroundColor2}
										onPress={() =>
											this.setState({ backgroundColor: '#474056' })
										}
									/>
									<TouchableOpacity
										style={styles.backgroundColor3}
										onPress={() =>
											this.setState({ backgroundColor: '#8A95A5' })
										}
									/>
									<TouchableOpacity
										style={styles.backgroundColor4}
										onPress={() =>
											this.setState({ backgroundColor: '#B9C6AE' })
										}
									/>
								</View>
							</View>
							<TouchableOpacity
								style={styles.chatButton}
								onPress={() =>
									this.props.navigation.navigate('Chat', {
										name: this.state.name,
										backgroundColor: this.state.backgroundColor,
									})
								}
							>
								<Text style={styles.chatStartText}>Start Chatting</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ImageBackground>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
	},
	image: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
	},

	main: {
		flex: 0.5,
	},
	title: {
		fontSize: 45,
		fontWeight: '600',
		color: '#FFFFFF',
		textAlign: 'center',
		margin: 50,
	},
	options: {
		backgroundColor: 'white',
		width: '88%',
		padding: '6%',
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	yourName: {
		padding: '5%',
		borderColor: 'gray',
		borderWidth: 2,
		borderRadius: 2,
		flexDirection: 'row',
	},
	yourIcon: {
		opacity: 50,
	},
	inputName: {
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		opacity: 50,
	},
	backgroundColorContainer: {
		marginTop: 10,
		marginBottom: 10,
	},
	backgroundColorText: {
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		opacity: 100,
	},
	backgroundColorOptions: {
		flexDirection: 'row',
		top: 10,
		justifyContent: 'space-around',
		alignContent: 'flex-start',
	},
	backgroundColor1: {
		width: 40,
		height: 40,
		borderRadius: 30,
		backgroundColor: '#090C08',
	},
	backgroundColor2: {
		width: 40,
		height: 40,
		borderRadius: 30,
		backgroundColor: '#474056',
	},
	backgroundColor3: {
		width: 40,
		height: 40,
		borderRadius: 30,
		backgroundColor: '#8A95A5',
	},
	backgroundColor4: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#B9C6AE',
	},
	chatButton: {
		backgroundColor: '#757083',
		top: 10,
		borderRadius: 2,
		padding: '5%',
	},
	chatStartText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
		textAlign: 'center',
	},
});
