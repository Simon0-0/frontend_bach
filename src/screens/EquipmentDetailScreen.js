import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { updateEquipment, archiveEquipment } from '../api/api'; // API functions

const EquipmentDetailsScreen = ({ route, navigation }) => {
  const { equipment } = route.params;
  const [name, setName] = useState(equipment.name);
  const [description, setDescription] = useState(equipment.description);
  const [status, setStatus] = useState(equipment.status);

  const handleUpdate = async () => {
    try {
      await updateEquipment(equipment.equipment_id, { name, description, status });
      alert('Equipment updated successfully.');
      navigation.goBack();
    } catch (err) {
      alert('Failed to update equipment.');
    }
  };

  const handleArchive = async () => {
    try {
      await archiveEquipment(equipment.equipment_id);
      alert('Equipment archived successfully.');
      navigation.goBack();
    } catch (err) {
      alert('Failed to archive equipment.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Equipment</Text>
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
      <Button title="Update Equipment" onPress={handleUpdate} />
      <Button title="Archive Equipment" onPress={handleArchive} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5 },
});

export default EquipmentDetailsScreen;
