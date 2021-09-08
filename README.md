# DEVChat App

DEVChat App is an application for mobile devices,built with React Native and developed using Expo.

Conversations are stored locally with Google Firestore Database and Google Firebase authentication. The interface was creates with Gifted Chat library.

Users can share images by taking pictures or from media library after granting permission to the app to access their media library and camera. Location sharing is also possible after the userallos the app to access user's location information.

See a video demonstration of the application on an Android emulator [here](https://www.youtube.com/watch?v=k6-SGBRoPmI)

![Online Android Emulator Setup](assets/DEVChatApp-showcase.gif)

## Start the App

### Install dependencies

Check that you are running the latest version of [Node](https://nodejs.org/en/).

Install [Expo](https://expo.io/) and create an account.

```bash
$ npm install expo-cli --global
```

Go to your project's directory

```bash
$ cd DEV-Chat-app
```

Launch the server Metro Bundler in a new tab

```bash
$ expo start
```

### Mobile Device Setup

- Install the Expo app through your app store
- Login with expo account
- Take a screenshot of the QR Code on the Metro Builder

### Device Emulator Setup

- If you would like to run the app on an emulator/simulator, you will need:
  - [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/)
  - [IOS Simulator](https://docs.expo.dev/workflow/ios-simulator/)

## Features

- Users can join a chat screen entering their name and choosing background color before joining the chat
- Conversation page displays and input field and a submit button
- Users can send images and location data through chat
- Chat data gets stored online and offline

## Technologies

- React Native
- Expo
- Google Firestore Database
- Google Firebase Authentication
- Firebase Cloud Storage
- Gifted Chat Library

### Author

[Tanimara Elias Santos](https://github.com/anthropovixen)

### Version

1.0.0
