import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../api/api';

const DashboardScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setAuthToken(token);
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserInfo(payload.data);
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    initialize();
  }, []);

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => navigateTo('Equipment')} style={styles.menuItem}>
          <Text style={styles.menuText}>Equipment</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo('Suppliers')} style={styles.menuItem}>
          <Text style={styles.menuText}>Suppliers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo('Tasks')} style={styles.menuItem}>
          <Text style={styles.menuText}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo('Documents')} style={styles.menuItem}>
          <Text style={styles.menuText}>Documents</Text>
        </TouchableOpacity>
      </View>

      {userInfo && (
        <View style={styles.userInfo}>
          <Text style={styles.title}>Welcome, {userInfo.name}</Text>
          <Text style={styles.subtext}>Role: {userInfo.role_id === 1 ? 'Admin' : userInfo.role_id === 2 ? 'Manager' : 'Employee'}</Text>
          <Text style={styles.subtext}>Email: {userInfo.email}</Text>
          <Text style={styles.subtext}>Phone: {userInfo.phone}</Text>
          <Text style={styles.subtext}>Position: {userInfo.position}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  userInfo: { alignItems: 'center', marginTop: 60 },
  title: { fontSize: 24, marginBottom: 10 },
  subtext: { fontSize: 18, marginBottom: 5 },
  menu: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  menuItem: {
    marginHorizontal: 8,
    paddingVertical: 5,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DashboardScreen;
