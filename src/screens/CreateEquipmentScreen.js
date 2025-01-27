import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  Alert,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createEquipment, fetchEmployees } from '../api/api';

const CreateEquipmentScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Available');
  const [location, setLocation] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [warrantyExpiration, setWarrantyExpiration] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const employeeData = await fetchEmployees();
        setEmployees(employeeData);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };
    loadData();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImage(fileURL);
      setImageFile(file);
    }
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("location", location);
    formData.append("assigned_to", assignedTo || null);
    
    if (warrantyExpiration) {
      formData.append("warranty_expiration", warrantyExpiration.toISOString().split("T")[0]);
    }
    if (purchaseDate) {
      formData.append("purchase_date", purchaseDate.toISOString().split("T")[0]);
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await createEquipment(formData);
      Alert.alert("Success", "Equipment created successfully.");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Failed to create equipment.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Create New Equipment</Text>

        <Text style={styles.label}>Equipment Name</Text>
        <TextInput style={styles.input} placeholder="Enter Equipment Name" value={name} onChangeText={setName} />

        <Text style={styles.label}>Description</Text>
        <TextInput style={styles.input} placeholder="Enter Description" value={description} onChangeText={setDescription} />

        <Text style={styles.label}>Status</Text>
        <Picker selectedValue={status} onValueChange={setStatus} style={styles.picker}>
          <Picker.Item label="Available" value="Available" />
          <Picker.Item label="In Use" value="In Use" />
          <Picker.Item label="In Repair" value="In Repair" />
        </Picker>

        <Text style={styles.label}>Location</Text>
        <TextInput style={styles.input} placeholder="Enter Location" value={location} onChangeText={setLocation} />

        <Text style={styles.label}>Assigned To</Text>
        <Picker selectedValue={assignedTo} onValueChange={setAssignedTo} style={styles.picker}>
          <Picker.Item label="Unassigned" value="" />
          {employees.map((emp) => (
            <Picker.Item key={emp.employee_id} label={emp.name} value={String(emp.employee_id)} />
          ))}
        </Picker>

        <Text style={styles.label}>Warranty Expiration</Text>
        <DatePicker selected={warrantyExpiration} onChange={setWarrantyExpiration} dateFormat="yyyy-MM-dd" className="web-datepicker" />

        <Text style={styles.label}>Upload Equipment Image</Text>
        <View style={styles.imageUploadContainer}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </View>

        {image && <Image source={{ uri: image }} style={styles.image} />}

        <Button title="Create Equipment" onPress={handleCreate} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  picker: { borderWidth: 1, marginBottom: 15, borderColor: '#ccc', backgroundColor: '#fff' },
  imageUploadContainer: {
    marginVertical: 15,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default CreateEquipmentScreen;
