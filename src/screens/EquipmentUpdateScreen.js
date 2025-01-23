import React, { useState, useEffect } from 'react';
import { 
  Platform, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker'; // Mobile only
import DatePicker from 'react-datepicker'; // Web only
import 'react-datepicker/dist/react-datepicker.css'; // Web only
import { updateEquipment, fetchEmployees, fetchEmployeeById } from '../api/api';

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

    const payload = {
      equipment_id: equipmentId,
      name: equipmentName,
      status: equipmentStatus,
      description: equipmentDescription,
      location: equipmentLocation,
      assigned_to: assignedTo ? Number(assignedTo) : null,
      warranty_expiration: warrantyExpiration.toISOString().split('T')[0],
      purchase_date: purchaseDate.toISOString().split('T')[0],
    };

    console.log("🚀 Payload Sent to API:", JSON.stringify(payload, null, 2));


    console.log("🚀 Updating equipment with payload:", payload);

    try {
      await updateEquipment(payload);
      Alert.alert('Success', 'Equipment updated successfully.');
      navigation.goBack();
    } catch (err) {
      console.error("❌ API Error:", err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.message || 'Failed to update equipment.');
    }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Equipment</Text>

      <Text style={styles.text}>Equipment Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Equipment Name"
        value={equipmentName}
        onChangeText={setEquipmentName}
      />

      <Text style={styles.text}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={equipmentDescription}
        onChangeText={setEquipmentDescription}
      />

      <Text style={styles.text}>Status</Text>
      <TextInput
        style={styles.input}
        placeholder="Status"
        value={equipmentStatus}
        onChangeText={setEquipmentStatus}
      />

      <Text style={styles.text}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={equipmentLocation}
        onChangeText={setEquipmentLocation}
      />

      <Text style={styles.text}>Purchase Date</Text>
      {Platform.OS === 'web' ? (
        <DatePicker
          selected={purchaseDate}
          onChange={(date) => setPurchaseDate(date)}
          dateFormat="yyyy-MM-dd"
          className="web-datepicker"
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
            <Text style={styles.dateText}>{purchaseDate.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={purchaseDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setPurchaseDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      <Text style={styles.text}>Assigned To (Employee ID)</Text>
      <TextInput
        style={styles.input}
        placeholder="Assigned To (Employee ID)"
        value={assignedTo}
        onChangeText={setAssignedTo}
        keyboardType="numeric"
      />

      <Button title="Update Equipment" onPress={handleUpdate} disabled={!authorized} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginTop: 20, textAlign: 'center' },
  text: { fontSize: 16, marginBottom: 10 },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  datePicker: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    marginBottom: 15,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});

export default UpdateEquipmentScreen;
