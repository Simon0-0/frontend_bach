import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createEmployee } from '../api/api';

const CreateEmployeeScreen = ({ navigation }) => {
  // ✅ Define state for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState(''); // ✅ Add password state

  const handleCreate = async () => {
    if (!name || !email || !phone || !position || !role || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const newEmployee = { name, email, phone, position, role_id: role, password };
      await createEmployee(newEmployee);
      Alert.alert('Success', 'Employee created successfully.');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to create employee.');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Employee</Text>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Position" value={position} onChangeText={setPosition} />
      <TextInput style={styles.input} placeholder="Role ID (1=Admin, 2=Manager, 3=Employee)" value={role} onChangeText={setRole} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} /> {/* ✅ Add password field */}

      <Button title="Create Employee" onPress={handleCreate} />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
});

export default CreateEmployeeScreen;
