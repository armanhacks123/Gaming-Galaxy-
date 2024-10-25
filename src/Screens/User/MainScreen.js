import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const scaleFont = (size) => {
  const scale = width / 320; // Based on iPhone 5's width
  return Math.round(size * scale);
};

const MainScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's Get Started!</Text>

      <Image
        source={{ uri: 'login1' }} 
        style={styles.image}
      />

      <TouchableOpacity style={styles.signUpButton} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Log In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8368FE', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,  // 5% of screen width
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.05, // 5% of screen height
  },
  image: {
    width: width * 0.4, // 40% of screen width
    height: width * 0.4, // Maintain aspect ratio
    resizeMode: 'contain',
    marginBottom: height * 0.1, // 10% of screen height
    borderRadius: 30,
  },
  signUpButton: {
    backgroundColor: '#FFC107', 
    paddingVertical: height * 0.02, // 2% of screen height
    paddingHorizontal: width * 0.2,  // 20% of screen width
    borderRadius: 30,
    marginBottom: height * 0.03, // 3% of screen height
  },
  signUpText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: scaleFont(18),
  },
  loginText: {
    color: '#fff',
    fontSize: scaleFont(16),
  },
  loginLink: {
    color: '#FFC107',
    fontWeight: 'bold',
  },
});

export default MainScreen;
