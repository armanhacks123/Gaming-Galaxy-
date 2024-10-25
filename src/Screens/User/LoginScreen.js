import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import auth from '@react-native-firebase/auth'; 

const { width, height } = Dimensions.get('window');

const scaleFont = (size) => {
  const scale = width / 320; // Based on iPhone 5's width
  return Math.round(size * scale);
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      if (email.length > 0 && password.length > 0) {
        const isUserLogin = await auth().signInWithEmailAndPassword(email, password);
        setMessage('');
        console.log(isUserLogin);

        navigation.navigate('home', {
          email: isUserLogin.user.email,
          uid: isUserLogin.user.uid,
        });
      } else {
        Alert.alert('Missing Information', 'Please fill in all required fields.');
      }
    } catch (err) {
      console.log('Error code:', err.code);
      console.log(err);

      setMessage(err.message);
      switch (err.code) {
        case 'auth/wrong-password':
          Alert.alert('Invalid Credentials', 'You entered a wrong password.');
          break;
        case 'auth/user-not-found':
          Alert.alert('Invalid Credentials', 'You entered a wrong email.');
          break;
        case 'auth/invalid-email':
          Alert.alert('Invalid Credentials', 'You entered an invalid email.');
          break;
        case 'auth/invalid-credential':
          Alert.alert('Invalid Credentials', 'You entered wrong email or password.');
          break;
      }
    }
  };

  const handleForgotPassword = async () => {
    if (email.length > 0) {
      try {
        await auth().sendPasswordResetEmail(email);
        Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
      } catch (error) {
        console.log('Error sending password reset email:', error);
        Alert.alert('Error', 'Unable to send password reset email. Please check your email address.');
      }
    } else {
      Alert.alert('Missing Information', 'Please enter your email address.');
    }
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      // Handle orientation change if needed
    });

    return () => subscription?.remove(); // Cleanup the listener
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'login1' }} 
          style={styles.image}
        />
      </View>
      
      <View style={styles.inputContainer}>
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
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
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
    paddingHorizontal: width * 0.05,  // 5% of screen width
    paddingVertical: height * 0.05,   // 5% of screen height
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,      // 2% of screen height
  },
  image: {
    width: width * 0.35,              // 35% of screen width
    height: width * 0.35,             // Maintain aspect ratio
    borderRadius: 30,
    resizeMode: 'contain',
  },
  inputContainer: {
    marginTop: height * 0.05,         // 5% of screen height
    marginBottom: height * 0.02,
  },
  input: {
    backgroundColor: '#fff',
    padding: width * 0.04,            // 4% of screen width
    borderRadius: 10,
    marginVertical: height * 0.01,    // 1% of screen height
    borderColor: '#F7B500',
    borderWidth: 1,
  },
  forgotPassword: {
    color: '#F7B500',
    alignSelf: 'flex-end',
    marginTop: height * 0.01,         // 1% of screen height
  },
  loginButton: {
    backgroundColor: '#F7B500',
    padding: height * 0.02,            // 2% of screen height
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: height * 0.03,     // 3% of screen height
  },
  loginButtonText: {
    color: '#fff',
    fontSize: scaleFont(18),           // Use the utility function for responsive text
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: height * 0.02,     // 2% of screen height
    color: '#6F6F6F',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height * 0.02,       // 2% of screen height
  },
  socialButton: {
    backgroundColor: '#fff',
    padding: width * 0.03,             // 3% of screen width
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.15,               // 15% of screen width
    height: width * 0.15,              // Maintain aspect ratio
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

export default LoginScreen;
