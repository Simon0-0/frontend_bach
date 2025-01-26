import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import { createSupplier } from '../api/api';

const CreateSupplierScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // ✅ Manually entered image URL
  
  
  const handleCreate = async () => {
    if (!name.trim() || !contactName.trim() || !email.trim() || !phoneNumber.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
  
    try {
      const payload = {
        name: name.trim(),
        contact_name: contactName.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim(),
        address: address.trim() || null,
        city: city.trim() || null,
        country: country.trim() || null,
        image_url: imageUrl.trim() || null, // ✅ Ensure image_url is included
      };
  
      console.log("📡 Sending create request:", JSON.stringify(payload));
  
      const response = await fetch("http://localhost/bch_final_project/api/suppliers/create.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // ✅ Ensure JSON format
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("✅ API Response:", data);
  
      if (response.ok) {
        Alert.alert('Success', 'Supplier created successfully.');
        navigation.goBack();
      } else {
        throw new Error(data.message || "Failed to create supplier.");
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      Alert.alert('Error', err.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Create New Supplier</Text>

        <TextInput style={styles.input} placeholder="Supplier Name*" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Contact Name*" value={contactName} onChangeText={setContactName} />
        <TextInput style={styles.input} placeholder="Email*" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Phone Number*" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
        <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
        <TextInput style={styles.input} placeholder="Country" value={country} onChangeText={setCountry} />

        {/* ✅ Image URL Input */}
        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Image URL"
          value={imageUrl}
          onChangeText={setImageUrl}
        />

        {/* ✅ Show Image Preview */}
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : <Text style={styles.noImage}>No Image Available</Text>}

        <Button title="Create Supplier" onPress={handleCreate} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { height: 620, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5, fontWeight: 'bold' },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5, borderColor: '#ccc' },
  image: { width: 200, height: 200, marginTop: 20, alignSelf: 'center' },
  noImage: { fontSize: 16, color: "gray", textAlign: 'center', marginTop: 20 },
});

export default CreateSupplierScreen;
