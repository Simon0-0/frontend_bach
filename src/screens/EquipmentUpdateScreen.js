import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateEquipment } from '../api/api';

const EquipmentUpdateScreen = ({ route, navigation }) => {
  const { equipment } = route.params;

  const [equipmentId, setEquipmentId] = useState(equipment.equipment_id || '');
  const [equipmentName, setEquipmentName] = useState(equipment.name || '');
  const [equipmentStatus, setEquipmentStatus] = useState(equipment.status || '');
  const [equipmentDescription, setEquipmentDescription] = useState(equipment.description || '');
  const [equipmentLocation, setEquipmentLocation] = useState(equipment.location || '');
  const [assignedTo, setAssignedTo] = useState(equipment.assigned_to || '');

  const handleUpdate = async () => {
    if (!equipmentName.trim() || !equipmentStatus.trim()) {
      Alert.alert("Error", "Equipment name and status are required.");
      return;
    }

    const payload = {
      name: equipmentName,
      status: equipmentStatus,
      description: equipmentDescription,
      location: equipmentLocation,
      assigned_to: assignedTo,
    };

    console.log("🚀 Sending update request:", JSON.stringify(payload, null, 2));

    try {
      await updateEquipment(equipmentId, payload);
      Alert.alert("Success", "Equipment updated successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      Alert.alert("Error", `Failed to update equipment: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Equipment</Text>
      <TextInput style={styles.input} value={equipmentName} onChangeText={setEquipmentName} placeholder="Equipment Name" />
      <TextInput style={styles.input} value={equipmentStatus} onChangeText={setEquipmentStatus} placeholder="Status" />
      <TextInput style={styles.input} value={equipmentDescription} onChangeText={setEquipmentDescription} placeholder="Description" multiline />
      <TextInput style={styles.input} value={equipmentLocation} onChangeText={setEquipmentLocation} placeholder="Location" />
      <TextInput style={styles.input} value={assignedTo} onChangeText={setAssignedTo} placeholder="Assigned To" />
      <Button title="Update Equipment" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5, borderColor: '#ccc' },
});

export default EquipmentUpdateScreen;
