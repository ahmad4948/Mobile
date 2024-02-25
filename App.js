import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [showLoginText, setShowLoginText] = useState(true);

  const regularLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.4:3000/login', { // Adjust the URL here
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        setErrorMessage('');
        setAuthenticated(true);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFingerprintLogin = async () => {
    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to login',
      });

      if (success) {
        Alert.alert('Authenticated');
        setErrorMessage('');
        setAuthenticated(true);
      } else {
        setErrorMessage('Fingerprint authentication failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {!authenticated && (
        <>
          {showLoginText && <Text style={styles.title}>Login</Text>}
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Login" onPress={() => {
            regularLogin();
            setShowLoginText(false);
          }} />
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </>
      )}
      {authenticated && (
        <View style={styles.authenticatedContainer}>
          <Text style={[styles.successMessage, styles.credentialsText]}>Credentials Authenticated</Text>
          <View style={styles.buttonContainer}>
            <Button title="Fingerprint Login" onPress={handleFingerprintLogin} />
          </View>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
    textAlign: 'center', // Center the "Credentials Authenticated" text
  },
  credentialsText: {
    fontSize: 20,
    marginBottom: 20,
  },
  authenticatedContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default LoginScreen;
