import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = { name: '', backgroundColor: '090C08' };
	}
	render() {
		let { name } = this.props.route.params;
		this.props.navigation.setOptions({ title: name });

		let { backgroundColor } = this.props.route.params.backgroundColor;
		const styles = StyleSheet.create({
			chatContainer: {
				flex: 1,
				backgroundColor: backgroundColor,
			},
		});

		return (
			<View style={styles.chatContainer}>
				<Button
					title="Go to Start"
					onPress={() => this.props.navigation.navigate('Start')}
				/>
			</View>
		);
	}
}
