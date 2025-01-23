import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchEmployeeById } from '../api/api';

const EmployeeDetailScreen = ({ route, navigation }) => {
  const { employeeId } = route.params; // Get employee ID from navigation params
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Get auth token
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        // Decode JWT token (extract user info)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.data.role_id);

        // Redirect unauthorized users
        if (payload.data.role_id > 2) {
          Alert.alert("Access Denied", "You are not authorized to view this page.");
          navigation.navigate('Dashboard');
          return;
        }

        // Fetch employee details
        const data = await fetchEmployeeById(employeeId);
        setEmployee(data);
      } catch (err) {
        setError('Failed to load employee details.');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [employeeId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Employee Details</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.detailsContainer}>
          <Text style={styles.detail}>Name: {employee.name}</Text>
          <Text style={styles.detail}>Email: {employee.email}</Text>
          <Text style={styles.detail}>Phone: {employee.phone}</Text>
          <Text style={styles.detail}>Position: {employee.position}</Text>
          <Text style={styles.detail}>Department: {employee.department}</Text>
          <Text style={styles.detail}>Joined: {employee.created_at}</Text>
        </View>
      )}

      {/* Only show Edit button for Admin (1) and Manager (2) */}
      {userRole && (userRole === 1 || userRole === 2) && (
        <Button title="Edit Employee" onPress={() => navigation.navigate('UpdateEmployee', { employeeId })} />
      )}

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  error: { fontSize: 18, color: 'red' },
  detailsContainer: { width: '100%', padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  detail: { fontSize: 18, marginBottom: 10 },
});

export default EmployeeDetailScreen;
