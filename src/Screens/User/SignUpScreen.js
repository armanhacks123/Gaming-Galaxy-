import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async () => {
    try {
      if (name.length > 0 && email.length > 0 && password.length > 0 && confirmPassword.length > 0) {
        if (password.length < 6) {
          Alert.alert('Weak Password', 'Password must be more than 6 characters.');
          return;
        }

        if (password === confirmPassword) {
          const isUserSignUp = await auth().createUserWithEmailAndPassword(email, password);
          setMessage('');

          await firestore().collection('users').doc(isUserSignUp.user.uid).set({
            email: isUserSignUp.user.email,
            name: name,
            createdYear: new Date().getFullYear(),
          });

          Alert.alert('Success', 'Your account has been created successfully.');
          navigation.navigate('home', {
            email: isUserSignUp.user.email,
            uid: isUserSignUp.user.uid,
          });
        } else {
          Alert.alert('Password Mismatch', 'Passwords do not match.');
        }
      } else {
        Alert.alert('Missing Information', 'Please fill in all required fields.');
      }
    } catch (err) {
      console.log('Error code:', err.code);
      console.log(err);

      setMessage(err.message);
      switch (err.code) {
        case 'auth/email-already-in-use':
          Alert.alert('Error', 'This email address is already in use.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Error', 'You entered an invalid email.');
          break;
        case 'auth/weak-password':
          Alert.alert('Error', 'Password should be at least 6 characters.');
          break;
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      GoogleSignin.configure({
        webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your webClientId from Firebase
      });

      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);

      await firestore().collection('users').doc(userCredential.user.uid).set({
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        createdYear: new Date().getFullYear(),
      });

      Alert.alert('Success', 'You have signed in successfully with Google.');
      navigation.navigate('home', {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
      });
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'login1' }} // Replace with your image URI
          style={styles.image}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          placeholderTextColor="#9E9E9E"
          style={styles.input}
          value={name}
          onChangeText={value => setName(value)}
        />
        <TextInput
          placeholder="Email Address"
          placeholderTextColor="#9E9E9E"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={value => setEmail(value)}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#9E9E9E"
          secureTextEntry={true}
          style={styles.input}
          value={password}
          onChangeText={value => setPassword(value)}
        />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#9E9E9E"
          secureTextEntry={true}
          style={styles.input}
          value={confirmPassword}
          onChangeText={value => setConfirmPassword(value)}
        />
      </View>

      <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
          <Icon name="google" size={30} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Entypo name="google-play" size={30} color="#34A853" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="facebook" size={30} color="#3b5998" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e7e7fc',
    paddingHorizontal: width * 0.05, // 5% padding
    paddingVertical: height * 0.05, // 5% padding
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02, // 2% margin
  },
  image: {
    width: width * 0.3, // 30% of screen width
    height: width * 0.3, // 30% of screen width
    borderRadius: 30,
    resizeMode: 'contain',
  },
  inputContainer: {
    marginTop: height * 0.02, // 2% margin
    marginBottom: height * 0.02, // 2% margin
  },
  input: {
    backgroundColor: '#fff',
    padding: height * 0.02, // 2% padding
    borderRadius: 10,
    marginVertical: height * 0.01, // 1% margin
    borderColor: '#F7B500',
    borderWidth: 1,
  },
  signUpButton: {
    backgroundColor: '#F7B500',
    padding: height * 0.02, // 2% padding
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: height * 0.02, // 2% margin
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: height * 0.02, // 2% margin
    color: '#6F6F6F',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.02, // 2% margin
  },
  socialButton: {
    backgroundColor: '#fff',
    padding: height * 0.01, // 1% padding
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.15, // 15% of screen width
    height: width * 0.15, // 15% of screen width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  registerText: {
    textAlign: 'center',
    color: '#6F6F6F',
  },
  loginText: {
    color: '#F7B500',
  },
});

export default SignUpScreen;
