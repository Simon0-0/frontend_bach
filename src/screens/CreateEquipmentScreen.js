import React, { useState, useEffect } from 'react';
import { Platform, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; // Mobile only
import DatePicker from 'react-datepicker'; // Web only
import 'react-datepicker/dist/react-datepicker.css'; // Web only
import { createEquipment, fetchEmployees } from '../api/api';

const CreateEquipmentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Available');
  const [location, setLocation] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [warrantyExpiration, setWarrantyExpiration] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Failed to load employees:", err);
      }
    };
    loadEmployees();
  }, []);

  const handleCreate = async () => {
    const payload = {
      name,
      description,
      status,
      location,
      assigned_to: assignedTo || null,
      supplier_id: supplierId || null,
      warranty_expiration: warrantyExpiration,
      purchase_date: purchaseDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
    };

    console.log("🚀 Creating equipment with payload:", payload);

    try {
      await createEquipment(payload);
      alert('Equipment created successfully.');
      navigation.goBack();
    } catch (err) {
      console.error("Error creating equipment:", err);
      alert('Failed to create equipment.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Equipment</Text>

      <TextInput
        style={styles.input}
        placeholder="Equipment Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Status (e.g., Available)"
        value={status}
        onChangeText={setStatus}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      {/* Date Picker for Purchase Date */}
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

      {/* Date Picker for Warranty Expiration */}
      {Platform.OS === 'web' ? (
        <DatePicker
          selected={warrantyExpiration}
          onChange={(date) => setWarrantyExpiration(date)}
          dateFormat="yyyy-MM-dd"
          className="web-datepicker"
        />
      ) : (
        <>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
            <Text style={styles.dateText}>{warrantyExpiration ? warrantyExpiration.toISOString().split('T')[0] : 'Select Warranty Expiration'}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={warrantyExpiration || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setWarrantyExpiration(selectedDate);
              }}
            />
          )}
        </>
      )}

      {/* Assigned To Picker */}
      <TextInput
        style={styles.input}
        placeholder="Assigned To (Employee ID)"
        value={assignedTo}
        onChangeText={setAssignedTo}
        keyboardType="numeric"
      />

      {/* Supplier ID Input */}
      <TextInput
        style={styles.input}
        placeholder="Supplier ID"
        value={supplierId}
        onChangeText={setSupplierId}
        keyboardType="numeric"
      />

      <Button title="Create Equipment" onPress={handleCreate} />
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

export default CreateEquipmentScreen;
