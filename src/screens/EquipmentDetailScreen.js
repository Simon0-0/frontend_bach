import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { archiveEquipment, fetchEmployeeById } from '../api/api';

const EquipmentDetailsScreen = ({ route, navigation }) => {
  const { equipment } = route.params;
  const [employeeName, setEmployeeName] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserInfo(payload.data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    const fetchEmployee = async () => {
      if (equipment.assigned_to) {
        try {
          const response = await fetchEmployeeById(equipment.assigned_to);
          setEmployeeName(response.name);
        } catch (err) {
          console.error("Error fetching employee:", err);
          setEmployeeName("Unassigned");
        }
      } else {
        setEmployeeName("Unassigned");
      }
    };

    fetchUserInfo();
    fetchEmployee();
  }, [equipment.assigned_to]);

  const navigateToUpdate = () => {
    navigation.navigate('UpdateEquipment', { equipment });
  };

  const handleArchive = async () => {
    try {
      await archiveEquipment(equipment.equipment_id);
      Alert.alert('Success', 'Equipment archived successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Archive Error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to archive equipment.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{equipment.name}</Text>

      {/* ✅ Display Image from Base64 */}
      {equipment.image_data && (
        <Image
          source={{ uri: `data:image/png;base64,${equipment.image_data}` }}
          style={styles.image}
        />
      )}

      <Text style={styles.detail}>Description: {equipment.description}</Text>
      <Text style={styles.detail}>Status: {equipment.status}</Text>
      <Text style={styles.detail}>Location: {equipment.location || 'N/A'}</Text>
      <Text style={styles.detail}>Assigned To: {employeeName}</Text>
      <Text style={styles.detail}>Created At: {equipment.created_at}</Text>
      <Text style={styles.detail}>Updated At: {equipment.updated_at}</Text>

      <View style={styles.buttonContainer}>
        {(userInfo && (userInfo.role_id === 1 || userInfo.role_id === 2 || userInfo.employee_id === equipment.assigned_to)) && (
          <Button title="Edit Equipment" onPress={navigateToUpdate} />
        )}

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
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 10,
  },
  buttonContainer: { marginTop: 20, justifyContent: 'space-between', height: 120 },
});

export default EquipmentDetailsScreen;
