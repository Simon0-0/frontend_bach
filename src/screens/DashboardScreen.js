import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../api/api';

const DashboardScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);

  // Fetch user info from token
  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setAuthToken(token); // Set the token globally for API calls
          const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
          setUserInfo(payload.data); // Set user information from the token
        } else {
          navigation.navigate('Login'); // Redirect to login if no token
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    initialize();
  }, []);

  // Navigate to different pages
  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {userInfo && (
        <>
          <Text style={styles.title}>Welcome, {userInfo.name}</Text>
          <Text style={styles.subtext}>Role: {userInfo.role_id === 1 ? 'Admin' : userInfo.role_id === 2 ? 'Manager' : 'Employee'}</Text>
          <Text style={styles.subtext}>Email: {userInfo.email}</Text>
          <Text style={styles.subtext}>Phone: {userInfo.phone}</Text>
          <Text style={styles.subtext}>Position: {userInfo.position}</Text>
        </>
      )}

      <View style={styles.menu}>
        <Button title="Equipment" onPress={() => navigateTo('Equipment')} />
        <Button title="Suppliers" onPress={() => navigateTo('Suppliers')} />
        <Button title="Tasks" onPress={() => navigateTo('Tasks')} />
        <Button title="Documents" onPress={() => navigateTo('Documents')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 10 },
  subtext: { fontSize: 18, marginBottom: 20 },
  menu: { width: '100%', marginTop: 20 },
});

export default DashboardScreen;
