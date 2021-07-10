import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// import react native gesture handler

import 'react-native-gesture-handler';

// Google Firebase
const firebase = require('firebase');
require('firebase/firestore');
require('firebase/auth');

export default class CustomActions extends React.Component {
	constructor() {
		super();
	}

	// User clicks action button

	onActionPress = () => {
		// User gets options to choose from in ActionSheet

		const options = [
			'Choose From Library',
			'Take Picture',
			'Send Location',
			'Cancel',
		];

		// Positions and displays ActionSheet

		const cancelButtonIndex = options.length - 1;
		this.context.actionSheet().showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
			},
			async (buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						console.log('user wants to pick an image');
						return this.ImagePicker();
					case 1:
						console.log('user wants to take a photo');
						return this.takePhoto();
						return;
					case 2:
						console.log('user wants to get their location');
						return this.getLocation();
					default:
				}
			}
		);
	};

	// Allow access to photo library

	ImagePicker = async () => {
		const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
		if (status === 'granted') {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: 'Images',
			}).catch((error) => console.log(error));
			if (!result.cancelled) {
				// If the user does not press the cancel button, upload image
				//  to database and send image in chat
				const imageUrl = await this.uploadImage(result.uri);
				this.props.onSend({ image: imageUrl, text: '' });
			}
		}
	};

	// Allow access to camera to take photo

	takePhoto = async () => {
		const { status } = await Permissions.askAsync(
			Permissions.CAMERA_ROLL,
			Permissions.MEDIA_LIBRARY
		);
		try {
			if (status === 'granted') {
				const result = await ImagePicker.launchCameraAsync({
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
				}).catch((error) => console.log(error));

				if (!result.cancelled) {
					const imageUrl = await this.uploadImage(result.uri);
					this.props.onSend({ image: imageUrl, text: '' });
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	// Get user's location

	getLocation = async () => {
		try {
			const { status } = await Permissions.askAsync(
				Permissions.LOCATION_FOREGROUND
			);
			if (status === 'granted') {
				const result = await Location.getCurrentPositionAsync(
					{}
				).catch((error) => console.log(error));
				if (result) {
					this.props.onSend({
						location: {
							longitude: result.coords.longitude,
							latitude: result.coords.latitude,
						},
					});
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	// Upload image to Firebase in blob format

	uploadImage = async (uri) => {
		const blob = await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function () {
				resolve(xhr.response);
			};
			xhr.onerror = function (error) {
				console.log(error);
				reject(new TypeError('Network request failed'));
			};
			xhr.responseType = 'blob';
			xhr.open('GET', uri, true);
			xhr.send(null);
		});
		try {
			const imageNameBefore = uri.split('/');
			const imageName = imageNameBefore[imageNameBefore.length - 1];

			const ref = firebase.storage().ref().child(`images/${imageName}`);

			const snapshot = await ref.put(blob);

			blob.close();

			const imageDownload = await snapshot.ref.getDownloadURL();
			return imageDownload;
		} catch (error) {
			console.log(error.message);
		}
	};

	render() {
		return (
			<TouchableOpacity
				style={[styles.container]}
				accessibilityLabel="Action button"
				accessibilityHint="Select an image to send, take a picture, or send your geolocation"
				onPress={this.onActionPress}
			>
				<View style={[styles.wrapper, this.props.wrapperStyle]}>
					<Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: 26,
		height: 26,
		marginLeft: 10,
		marginBottom: 10,
	},
	wrapper: {
		borderRadius: 13,
		borderColor: '#b2b2b2',
		borderWidth: 2,
		flex: 1,
	},
	iconText: {
		color: '#b2b2b2',
		fontWeight: 'bold',
		fontSize: 16,
		backgroundColor: 'transparent',
		textAlign: 'center',
	},
});

CustomActions.contextTypes = {
	actionSheet: PropTypes.func,
};
