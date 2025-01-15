import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, setAuthToken } from '../api/api';
import DashboardScreen from './DashboardScreen';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      console.log('Attempting login with:', email, password); 
      const data = await login(email, password);
      console.log('Token received:', data.token);
  
      // Save the token locally
      await AsyncStorage.setItem('authToken', data.token);
  
      // Set token globally for Axios
      setAuthToken(data.token);
  
      // Navigate to the Dashboard
      navigation.navigate('Menu', { screen: 'Dashboard' });
    } catch (err) {
      console.error('Login failed:', err.response?.data || err.message); // Debug error
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
  error: { color: 'red', marginBottom: 15, textAlign: 'center' },
});

export default LoginScreen;
