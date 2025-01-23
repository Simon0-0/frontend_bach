import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateEmployee, fetchEmployeeById } from '../api/api';

const UpdateEmployeeScreen = ({ route, navigation }) => {
  const { employeeId } = route.params;
  const [employee, setEmployee] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.data.role_id);

      if (payload.data.role_id > 2) {
        Alert.alert("Access Denied", "You are not authorized to update employees.");
        navigation.navigate('Dashboard');
        return;
      }

      // Fetch employee details
      try {
        const data = await fetchEmployeeById(employeeId);
        setEmployee(data);
        setName(data.name || ''); // ✅ Ensure default values
        setEmail(data.email || '');
        setPhone(data.phone || '');
        setPosition(data.position || '');
        setRole(data.role_id ? data.role_id.toString() : '');
      } catch (error) {
        Alert.alert("Error", "Failed to load employee data.");
        console.error(error);
      }
    };

    checkAuthAndFetchData();
  }, [employeeId]);

  const handleUpdate = async () => {
    if (!name || !email || !phone || !position || !role) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const payload = { employee_id: employeeId, name, email, phone, position, role_id: role };
      await updateEmployee(employeeId, payload);
      Alert.alert('Success', 'Employee updated successfully.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to update employee.');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Employee</Text>

      {employee ? (
        <>
          <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="Position" value={position} onChangeText={setPosition} />
          <TextInput style={styles.input} placeholder="Role (1=Admin, 2=Manager, 3=Employee)" value={role} onChangeText={setRole} keyboardType="numeric" />

          <Button title="Update Employee" onPress={handleUpdate} />
        </>
      ) : (
        <Text>Loading employee data...</Text>
      )}

      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, borderColor: '#ccc' },
});

export default UpdateEmployeeScreen;
