import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { archiveSupplier } from '../api/api'; // Import the archive API function

const SupplierDetailsScreen = ({ route, navigation }) => {
  const { supplier } = route.params; // Extract supplier details from route parameters

  const navigateToUpdate = () => {
    navigation.navigate('UpdateSupplier', { supplier }); // Pass supplier details to the update screen
  };

  const handleArchive = async () => {
    try {
      await archiveSupplier(supplier.supplier_id); // Call the archive API
      Alert.alert('Success', 'Supplier archived successfully.');
      navigation.goBack(); // Go back after archiving
    } catch (error) {
      Alert.alert('Error', 'Failed to archive supplier.');
      console.error(error.message || error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{supplier.name}</Text>
      <Text style={styles.detail}>Contact Name: {supplier.contact_name}</Text>
      <Text style={styles.detail}>Email: {supplier.email}</Text>
      <Text style={styles.detail}>Phone Number: {supplier.phone_number}</Text>
      <Text style={styles.detail}>Address: {supplier.address || 'N/A'}</Text>
      <Text style={styles.detail}>City: {supplier.city || 'N/A'}</Text>
      <Text style={styles.detail}>Country: {supplier.country || 'N/A'}</Text>
      <Text style={styles.detail}>Created At: {supplier.created_at}</Text>
      <Text style={styles.detail}>Updated At: {supplier.updated_at}</Text>

      <View style={styles.buttonContainer}>
        <Button title="Edit Supplier" onPress={navigateToUpdate} />
        <Button title="Archive Supplier" onPress={handleArchive} color="red" />
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

export default SupplierDetailsScreen;
