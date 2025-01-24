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
  const [warrantyExpiration, setWarrantyExpiration] = useState(null);
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [employees, setEmployees] = useState([]);
  const [image, setImage] = useState(null); // Image preview
  const [imageFile, setImageFile] = useState(null); // Actual image file

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

  // ✅ Handle Image Selection for Web
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get selected file

    if (file) {
      const fileURL = URL.createObjectURL(file); // Create temporary URL for preview
      setImage(fileURL);
      setImageFile(file);
      console.log("📸 Selected Image:", file);
    }
  };

  // ✅ Function to Handle Equipment Creation
  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("status", status);
    formData.append("location", location);
    formData.append("assigned_to", assignedTo || null);
    formData.append("supplier_id", supplierId || null);

    if (warrantyExpiration) {
      formData.append("warranty_expiration", warrantyExpiration.toISOString().split("T")[0]);
    }
    if (purchaseDate) {
      formData.append("purchase_date", purchaseDate.toISOString().split("T")[0]);
    }

    // ✅ Append the image only if selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    console.log("🚀 Creating equipment with payload:", formData);

    try {
      const response = await createEquipment(formData);
      console.log("✅ API Response:", response.data);
      Alert.alert("Success", "Equipment created successfully.");
      navigation.goBack();
    } catch (err) {
      console.error("❌ Error creating equipment:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to create equipment.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
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

        {/* ✅ Image Upload Input (For Web) */}
        <View style={styles.imageUploadContainer}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </View>

        {/* ✅ Show Selected Image Preview */}
        {image && <Image source={{ uri: image }} style={styles.image} />}

        {/* ✅ Date Picker for Warranty Expiration */}
        <DatePicker
          selected={warrantyExpiration}
          onChange={(date) => setWarrantyExpiration(date)}
          dateFormat="yyyy-MM-dd"
          className="web-datepicker"
        />

        {/* ✅ Assigned To Input */}
        <TextInput
          style={styles.input}
          placeholder="Assigned To (Employee ID)"
          value={assignedTo}
          onChangeText={setAssignedTo}
          keyboardType="numeric"
        />

        {/* ✅ Supplier ID Input */}
        <TextInput
          style={styles.input}
          placeholder="Supplier ID"
          value={supplierId}
          onChangeText={setSupplierId}
          keyboardType="numeric"
        />

        <Button title="Create Equipment" onPress={handleCreate} />
      </ScrollView>
    </View>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: { height: 620, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
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
