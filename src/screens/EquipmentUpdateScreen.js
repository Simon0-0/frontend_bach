import React, { useState, useEffect } from 'react';
import { 
  Platform, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Image, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker'; // Mobile only
import DatePicker from 'react-datepicker'; // Web only
import 'react-datepicker/dist/react-datepicker.css'; // Web only
import { updateEquipment, fetchEmployees, fetchEmployeeById } from '../api/api';

// ✅ Set Correct BASE_URL for Images
const BASE_URL = "http://localhost/bch_final_project/";

const UpdateEquipmentScreen = ({ route, navigation }) => {
  const { equipment } = route.params;

  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  const [equipmentId, setEquipmentId] = useState(equipment.equipment_id || '');
  const [equipmentName, setEquipmentName] = useState(equipment.name || '');
  const [equipmentStatus, setEquipmentStatus] = useState(equipment.status || '');
  const [equipmentDescription, setEquipmentDescription] = useState(equipment.description || '');
  const [equipmentLocation, setEquipmentLocation] = useState(equipment.location || '');
  const [assignedTo, setAssignedTo] = useState(equipment.assigned_to ? String(equipment.assigned_to) : '');
  const [warrantyExpiration, setWarrantyExpiration] = useState(
    equipment.warranty_expiration ? new Date(equipment.warranty_expiration) : new Date()
  );
  const [purchaseDate, setPurchaseDate] = useState(
    equipment.purchase_date ? new Date(equipment.purchase_date) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [employees, setEmployees] = useState([]);

  const [image, setImage] = useState(
    equipment.image_path ? `${BASE_URL}${equipment.image_path}`
    : equipment.image_data ? `data:image/png;base64,${equipment.image_data}`
    : require('../../assets/no-image.png') // Fallback image
  );
  const [imageFile, setImageFile] = useState(null); // Stores new uploaded image

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

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get selected file
  
    if (file) {
      const fileURL = URL.createObjectURL(file); // Create temporary URL for preview
      setImage(fileURL);
      setImageFile(file);
      console.log("📸 Selected Image:", file);
    } else {
      console.error("❌ No file selected.");
    }
  };
  
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
    formData.append("location", equipmentLocation);
    formData.append("assigned_to", assignedTo ? Number(assignedTo) : null);
    formData.append("warranty_expiration", warrantyExpiration.toISOString().split("T")[0]);
    formData.append("purchase_date", purchaseDate.toISOString().split("T")[0]);
  
    if (imageFile) {
      formData.append("image", imageFile, imageFile.name);
    }
  
    console.log("🚀 Updating equipment with payload:", Object.fromEntries(formData.entries()));
  
    try {
      const response = await fetch("http://localhost/bch_final_project/api/equipment/update.php", {
        method: "POST",
        body: formData,
      });
  
      const textResponse = await response.text(); // ✅ Log raw response
      console.log("📡 Raw API Response:", textResponse);
  
      try {
        const data = JSON.parse(textResponse); // ✅ Parse JSON safely
        console.log("✅ API Response:", data);
  
        if (data.image_path) {
          setImage(`${BASE_URL}${data.image_path}`);
        }
  
        Alert.alert("Success", "Equipment updated successfully.");
        navigation.goBack();
      } catch (jsonError) {
        console.error("❌ JSON Parse Error:", jsonError);
        console.error("🔴 Raw Response:", textResponse);
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

      {/* ✅ Display Existing Image with Preview */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>

      {/* ✅ Image Upload Input (For Web) */}
      <View style={styles.imageUploadContainer}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </View>

      <Text style={styles.text}>Equipment Name</Text>
      <TextInput style={styles.input} placeholder="Equipment Name" value={equipmentName} onChangeText={setEquipmentName} />

      <Text style={styles.text}>Description</Text>
      <TextInput style={styles.input} placeholder="Description" value={equipmentDescription} onChangeText={setEquipmentDescription} />

      <Text style={styles.text}>Status</Text>
      <TextInput style={styles.input} placeholder="Status" value={equipmentStatus} onChangeText={setEquipmentStatus} />

      <Text style={styles.text}>Location</Text>
      <TextInput style={styles.input} placeholder="Location" value={equipmentLocation} onChangeText={setEquipmentLocation} />

      <Text style={styles.text}>Assigned To (Employee ID)</Text>
      <TextInput style={styles.input} placeholder="Assigned To" value={assignedTo} onChangeText={setAssignedTo} keyboardType="numeric" />

      <Button title="Update Equipment" onPress={handleUpdate} disabled={!authorized} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 620, padding: 20 },
  title: { fontSize: 24, marginTop: 20, textAlign: 'center' },
  text: { fontSize: 16, marginBottom: 10 },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5, borderColor: '#ccc' },
  imageContainer: { justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  image: { width: 250, height: 250, borderRadius: 10 },
  imageUploadContainer: { marginVertical: 15, alignItems: 'center' },
});

export default UpdateEquipmentScreen;
