import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image } from 'react-native';
import { archiveSupplier } from '../api/api'; // Import the archive API function
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../api/api';


const SupplierDetailsScreen = ({ route, navigation }) => {
  const { supplier } = route.params; // Extract supplier details from route parameters
  const [userInfo, setUserInfo] = useState(null);

  // ✅ Load user info from AsyncStorage
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1])); // ✅ Decode JWT token
        setUserInfo(payload.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    getUserInfo();
  }, []);
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
      {/* Display image from URL if available */}
      {supplier.image_url ? (
        <Image source={{ uri: supplier.image_url }} style={styles.image} />
      ) : (
        <Text style={styles.noImage}>No Image Available</Text>
      )}

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

         {(userInfo &&
                        (userInfo.role_id === 1 || userInfo.role_id === 2 || userInfo.employee_id === supplier.assigned_to )) && (
                          <Button title="Edit Supplier" onPress={navigateToUpdate} />
                           )}
        {(userInfo &&
                        (userInfo.role_id === 1 || userInfo.role_id === 2 )) && (
                          <Button title="Archive Supplier" onPress={handleArchive} color="red" />
                           )}
       
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  image: { width: 200, height: 200, marginBottom: 20, alignSelf: 'center', resizeMode: 'cover' },
  noImage: { fontSize: 16, color: "gray", textAlign: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  detail: { fontSize: 16, marginBottom: 10 },
  buttonContainer: { marginTop: 20, justifyContent: 'space-between', height: 120 },
});

export default SupplierDetailsScreen;
