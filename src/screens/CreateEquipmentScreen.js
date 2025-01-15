import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { createEquipment } from '../api/api'; // API function

const CreateEquipmentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const [location, setLocation] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [supplierId, setSupplierId] = useState('');

  const handleCreate = async () => {
    try {
      const payload = {
        name,
        description,
        status,
        location,
        assigned_to: assignedTo ? parseInt(assignedTo, 10) : null,
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
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={setStatus}
        placeholder="Status"
      />
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
      />
      <TextInput
        style={styles.input}
        value={assignedTo}
        onChangeText={setAssignedTo}
        placeholder="Assigned To (Employee ID)"
        keyboardType="numeric"
      />
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
});

export default CreateEquipmentScreen;
