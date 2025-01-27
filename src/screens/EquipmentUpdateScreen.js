import React, { useState, useEffect } from 'react';
import {
  Platform, View, Text, TextInput, Button, StyleSheet, Alert, Image, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Import Picker
import { updateEquipment, fetchEmployees } from '../api/api';

// ✅ Set Correct BASE_URL for Images
const BASE_URL = "http://localhost/bch_final_project/";

const UpdateEquipmentScreen = ({ route, navigation }) => {
  const { equipment } = route.params;

  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  
  const [equipmentId, setEquipmentId] = useState(equipment.equipment_id || '');
  const [equipmentName, setEquipmentName] = useState(equipment.name || '');
  const [equipmentStatus, setEquipmentStatus] = useState(equipment.status || 'Available'); // Default status
  const [equipmentDescription, setEquipmentDescription] = useState(equipment.description || '');
  const [assignedTo, setAssignedTo] = useState(equipment.assigned_to ? String(equipment.assigned_to) : '');
  const [employees, setEmployees] = useState([]);

  const [image, setImage] = useState(
    equipment.image_path ? `${BASE_URL}${equipment.image_path}`
    : require('../../assets/no-image.png')
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        // Decode JWT Token
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.data.role_id);
        setUserId(payload.data.employee_id);

        // Authorization Check
        if (payload.data.role_id === 1 || payload.data.role_id === 2) {
          setAuthorized(true);
        } else if (payload.data.role_id === 3 && equipment.assigned_to === payload.data.employee_id) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          Alert.alert("Access Denied", "You are not authorized to edit this equipment.");
          navigation.goBack();
        }

        // Fetch Employees
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Failed to load employees:", err);
      }
    };

    initialize();
  }, [equipment.assigned_to, navigation]);

  const handleUpdate = async () => {
    if (!authorized) {
      Alert.alert("Access Denied", "You do not have permission to update this equipment.");
      return;
    }

    const formData = new FormData();
    formData.append("equipment_id", equipmentId);
    formData.append("name", equipmentName);
    formData.append("status", equipmentStatus);
    formData.append("description", equipmentDescription);
    formData.append("assigned_to", assignedTo ? Number(assignedTo) : null);

    console.log("🚀 Updating equipment with payload:", Object.fromEntries(formData.entries()));

    try {
      const response = await fetch("http://localhost/bch_final_project/api/equipment/update.php", {
        method: "POST",
        body: formData,
      });

      const textResponse = await response.text(); // ✅ Log raw response
      console.log("📡 Raw API Response:", textResponse);

      try {
        const data = JSON.parse(textResponse);
        console.log("✅ API Response:", data);

        Alert.alert("Success", "Equipment updated successfully.");
        navigation.goBack();
      } catch (jsonError) {
        console.error("❌ JSON Parse Error:", jsonError);
        Alert.alert("Error", "Unexpected server response.");
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      Alert.alert("Error", "Failed to update equipment.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Update Equipment</Text>

        {/* ✅ Display Existing Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>

        <Text style={styles.text}>Equipment Name</Text>
        <TextInput style={styles.input} value={equipmentName} onChangeText={setEquipmentName} />

        <Text style={styles.text}>Description</Text>
        <TextInput style={styles.input} value={equipmentDescription} onChangeText={setEquipmentDescription} />

        {/* ✅ Status Picker */}
        <Text style={styles.text}>Status</Text>
        <Picker
          selectedValue={equipmentStatus}
          onValueChange={(itemValue) => setEquipmentStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Available" value="Available" />
          <Picker.Item label="In Use" value="In Use" />
          <Picker.Item label="In Repair" value="In Repair" />
        </Picker>

        {/* ✅ Assigned To Picker */}
        <Text style={styles.text}>Assigned To</Text>
        <Picker
          selectedValue={assignedTo}
          onValueChange={(itemValue) => setAssignedTo(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Unassigned" value="" />
          {employees.map((emp) => (
            <Picker.Item key={emp.employee_id} label={emp.name} value={String(emp.employee_id)} />
          ))}
        </Picker>

        <Button title="Update Equipment" onPress={handleUpdate} disabled={!authorized} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  text: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5, borderColor: '#ccc' },
  picker: { borderWidth: 1, marginBottom: 15, borderColor: '#ccc' },
  imageContainer: { justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  image: { width: 250, height: 250, borderRadius: 10 },
});

export default UpdateEquipmentScreen;
