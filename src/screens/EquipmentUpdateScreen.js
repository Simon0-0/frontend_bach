import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateEquipment } from '../api/api'; // Import the API function

const UpdateEquipmentScreen = ({ route, navigation }) => {
  const { equipment } = route.params; 

  // States for equipment fields
  const [name, setName] = useState(equipment.name);
  const [description, setDescription] = useState(equipment.description);
  const [status, setStatus] = useState(equipment.status);
  const [location, setLocation] = useState(equipment.location || '');
  const [assignedTo, setAssignedTo] = useState(equipment.assigned_to || '');

  const handleUpdate = async () => {
    if (!name || !description || !status) {
      Alert.alert('Error', 'Name, description, and status are required fields.');
      return;
    }

    try {
      const payload = {
        name,
        description,
        status,
        location,
        assigned_to: assignedTo ? parseInt(assignedTo, 10) : null,
      };

      await updateEquipment(equipment.equipment_id, payload); // Call the API function
      Alert.alert('Success', 'Equipment updated successfully.');
      navigation.goBack(); // Navigate back to the details screen
    } catch (err) {
      Alert.alert('Error', 'Failed to update equipment.');
      console.error(err.message || err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Equipment</Text>
      <TextInput
        style={styles.input}
        placeholder="Equipment Name*"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description*"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Status* (e.g., Available, In Use, In Repair)"
        value={status}
        onChangeText={setStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Assigned To (Employee ID)"
        value={assignedTo}
        onChangeText={setAssignedTo}
        keyboardType="numeric"
      />
      <Button title="Update Equipment" onPress={handleUpdate} />
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

export default UpdateEquipmentScreen;
