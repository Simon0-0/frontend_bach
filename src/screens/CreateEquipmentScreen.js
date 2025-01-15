import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { createEquipment, fetchEmployees } from '../api/api'; // API functions

const CreateEquipmentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Available');
  const [location, setLocation] = useState('');
  const [assignedTo, setAssignedTo] = useState(null); // Store selected employee ID
  const [employees, setEmployees] = useState([]); // Store list of employees
  const [supplierId, setSupplierId] = useState('');

  // Fetch employees when the component mounts
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees(); // Fetch employees from backend
        setEmployees(data); // Assume data is an array of employee objects
      } catch (err) {
        alert('Failed to load employees.');
      }
    };

    loadEmployees();
  }, []);

  const handleCreate = async () => {
    try {
      const payload = {
        name,
        description,
        status,
        location,
        assigned_to: assignedTo, // Send the selected employee ID
        supplier_id: supplierId ? parseInt(supplierId, 10) : null,
      };
      await createEquipment(payload);
      alert('Equipment created successfully.');
      navigation.goBack();
    } catch (err) {
      alert('Failed to create equipment. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Equipment</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Equipment Name"
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />
      
      <Text style={styles.label}>Status</Text>
      <Picker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Available" value="Available" />
        <Picker.Item label="In Use" value="In Use" />
        <Picker.Item label="In Repair" value="In Repair" />
      </Picker>

      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
      />

      <Text style={styles.label}>Assigned To</Text>
      <Picker
        selectedValue={assignedTo}
        onValueChange={(itemValue) => setAssignedTo(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Employee" value={null} />
        {employees.map((employee) => (
          <Picker.Item key={employee.id} label={employee.name} value={employee.id} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        value={supplierId}
        onChangeText={setSupplierId}
        placeholder="Supplier ID"
        keyboardType="numeric"
      />
      <Button title="Create Equipment" onPress={handleCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
  picker: { borderWidth: 1, marginBottom: 15, padding: 10 },
  label: { fontSize: 16, marginBottom: 5 },
});

export default CreateEquipmentScreen;
