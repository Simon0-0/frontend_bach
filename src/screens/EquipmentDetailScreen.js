import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { archiveEquipment } from '../api/api'; // Import the archive API function

const EquipmentDetailsScreen = ({ route, navigation }) => {
  const { equipment } = route.params; // Extract equipment details from route parameters

  const navigateToUpdate = () => {
    navigation.navigate('UpdateEquipment', { equipment }); // Pass equipment details to the update screen
  };

  const handleArchive = async () => {
    try {
      // Ensure the equipment_id is sent as an integer
      await archiveEquipment(equipment.equipment_id);
      Alert.alert('Success', 'Equipment archived successfully.');
      navigation.goBack(); // Navigate back after archiving
    } catch (error) {
      console.error('Archive Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to archive equipment.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{equipment.name}</Text>
      <Text style={styles.detail}>Description: {equipment.description}</Text>
      <Text style={styles.detail}>Status: {equipment.status}</Text>
      <Text style={styles.detail}>Location: {equipment.location || 'N/A'}</Text>
      <Text style={styles.detail}>Assigned To: {equipment.assigned_to || 'Unassigned'}</Text>
      <Text style={styles.detail}>Created At: {equipment.created_at}</Text>
      <Text style={styles.detail}>Updated At: {equipment.updated_at}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Edit Equipment" onPress={navigateToUpdate} />
        <Button title="Archive Equipment" onPress={handleArchive} color="red" />
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  detail: { fontSize: 16, marginBottom: 10 },
  buttonContainer: { marginTop: 20, justifyContent: 'space-between', height: 120 },
});

export default EquipmentDetailsScreen;
